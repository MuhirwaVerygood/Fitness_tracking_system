
# Fitness Tracker with AI Predictions

A full-stack fitness tracking application with AI-powered predictions and recommendations.

## Project Structure

- `frontend/`: React-based frontend with TypeScript and Tailwind CSS
- `backend/`: FastAPI-based backend with machine learning model

## Features

- User authentication and profile management
- Workout tracking and logging
- Fitness metrics visualization
- Data-driven insights and charts
- AI-powered fitness predictions and recommendations

## Technologies Used

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- Lucide React for icons
- React Router for navigation
- Shadcn UI components

### Backend
- FastAPI for API development
- Scikit-learn for machine learning model
- Pandas and NumPy for data processing
- Pydantic for data validation

## Setup Instructions

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Start the FastAPI server:
   ```
   python main.py
   ```
   
   The server will be available at http://localhost:8000

### Frontend

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file (copy from `.env.example`) and set the backend URL:
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   
   The frontend will be available at http://localhost:8080

## Usage

1. Register or log in to your account
2. Track your workouts and fitness metrics
3. View your progress through interactive charts
4. Get AI-generated fitness predictions and recommendations
5. Set and track your fitness goals

## Machine Learning Model

The backend includes a machine learning model that:
- Predicts future weight changes
- Calculates fitness scores
- Generates personalized workout and nutrition recommendations
- Suggests next fitness goals

For demonstration purposes, the model is trained on synthetic data. In a production environment, you would replace this with real training data.
