
# Fitness Prediction API

This is a FastAPI-based backend for the fitness tracking and prediction application.

## Backend Setup and Running

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the server:
   ```
   python main.py
   ```
   
   Or with uvicorn directly:
   ```
   uvicorn main:app --reload
   ```

3. The server will start at http://localhost:8000

## Frontend Setup and Running

1. Navigate to the frontend directory:
   ```
   cd ../
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. The frontend will start at http://localhost:8080

## API Documentation

Once the server is running, you can access the automatic API documentation at:
- http://localhost:8000/docs (Swagger UI)
- http://localhost:8000/redoc (ReDoc)

## Endpoints

- `GET /`: Welcome message
- `POST /api/predict`: Get fitness predictions based on user data

## Machine Learning Model

The application uses a Random Forest model to predict:
- Future weight changes
- Fitness scores
- Personalized recommendations

The model is trained on synthetic data for demonstration purposes. In a production environment, you would replace this with real training data.
