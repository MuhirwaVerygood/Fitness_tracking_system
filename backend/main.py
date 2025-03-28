
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import joblib
import numpy as np
from datetime import datetime, timedelta
import os

# Import our ML model utilities
from model import train_fitness_model, predict_fitness_metrics

# Create FastAPI app
app = FastAPI(title="Fitness Prediction API")

# Configure CORS for frontend integration
origins = [
    "http://localhost:5173",  # Vite development server
    "http://localhost:3000",  # Alternative React development server
    # "https://your-production-domain.com"  # Replace with your production domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the model when the server starts
@app.on_event("startup")
async def startup_event():
    # Train the model if it doesn't exist
    if not os.path.exists("fitness_model.pkl"):
        print("Training fitness model...")
        train_fitness_model()
        print("Model training complete!")
    else:
        print("Using existing fitness model")

# Pydantic models for request/response data validation
class UserBase(BaseModel):
    name: str
    age: int
    gender: str
    weight: float  # in kg
    height: float  # in cm
    activity_level: str
    goals: str

class WorkoutSession(BaseModel):
    date: str
    duration: int  # in minutes
    type: str
    calories: int
    intensity: str
    notes: Optional[str] = None

class FitnessMetric(BaseModel):
    date: str
    weight: Optional[float] = None
    body_fat: Optional[float] = None
    resting_heart_rate: Optional[int] = None
    vo2_max: Optional[float] = None
    sleep_hours: Optional[float] = None
    stress_level: Optional[int] = None

class PredictionRequest(BaseModel):
    user: UserBase
    workout_history: List[WorkoutSession]
    fitness_metrics: List[FitnessMetric]

class PredictionResponse(BaseModel):
    predicted_weight: float
    recommended_calories: int
    fitness_score: int
    recommendations: List[str]
    next_goal: str

@app.get("/")
def read_root():
    return {"message": "Welcome to Fitness Prediction API"}

@app.post("/api/predict", response_model=PredictionResponse)
def predict_fitness(request: PredictionRequest):
    try:
        # Call our prediction function from model.py
        prediction = predict_fitness_metrics(
            request.user,
            request.workout_history,
            request.fitness_metrics
        )
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# User registration and authentication endpoints could be added here

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
