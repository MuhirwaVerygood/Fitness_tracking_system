
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
import joblib
from typing import List, Dict, Any, Optional
import random

# Function to create and train our fitness prediction model
def train_fitness_model():
    """
    Train a fitness prediction model and save it to disk.
    This is a simplified model for demonstration purposes.
    In reality, you would use real data and more advanced techniques.
    """
    # Generate synthetic training data
    n_samples = 1000
    
    # User features
    ages = np.random.randint(18, 70, n_samples)
    weights = np.random.normal(75, 15, n_samples)  # in kg
    heights = np.random.normal(170, 15, n_samples)  # in cm
    genders = np.random.choice(['male', 'female'], n_samples)
    activity_levels = np.random.choice(
        ['sedentary', 'light', 'moderate', 'active', 'very_active'], 
        n_samples
    )
    goals = np.random.choice(
        ['lose_weight', 'maintain', 'gain_muscle', 'improve_endurance', 'general_fitness'], 
        n_samples
    )
    
    # Workout features (aggregated)
    weekly_workouts = np.random.randint(0, 7, n_samples)
    avg_duration = np.random.normal(45, 15, n_samples)
    cardio_ratio = np.random.beta(2, 2, n_samples)
    strength_ratio = np.random.beta(2, 2, n_samples)
    
    # Health metrics
    bmis = weights / ((heights / 100) ** 2)
    resting_heart_rates = np.random.normal(70, 10, n_samples)
    sleep_hours = np.random.normal(7, 1, n_samples)
    stress_levels = np.random.randint(1, 11, n_samples)
    
    # Create feature matrix
    X = pd.DataFrame({
        'age': ages,
        'weight': weights,
        'height': heights,
        'gender': genders,
        'activity_level': activity_levels,
        'goal': goals,
        'weekly_workouts': weekly_workouts,
        'avg_duration': avg_duration,
        'cardio_ratio': cardio_ratio,
        'strength_ratio': strength_ratio,
        'bmi': bmis,
        'resting_heart_rate': resting_heart_rates,
        'sleep_hours': sleep_hours,
        'stress_level': stress_levels
    })
    
    # Create target variables
    # Weight change prediction (kg per week)
    weight_changes = np.zeros(n_samples)
    
    # Rules-based approach for synthetic data
    for i in range(n_samples):
        if X.loc[i, 'goal'] == 'lose_weight':
            base_change = -0.5  # baseline weight loss
        elif X.loc[i, 'goal'] == 'gain_muscle':
            base_change = 0.3   # baseline weight gain
        else:
            base_change = 0.0   # maintain weight
            
        # Adjust based on activity level
        activity_factor = {
            'sedentary': 0.5,
            'light': 0.8,
            'moderate': 1.0,
            'active': 1.2,
            'very_active': 1.5
        }[X.loc[i, 'activity_level']]
        
        # Adjust based on workout frequency and duration
        workout_factor = X.loc[i, 'weekly_workouts'] * X.loc[i, 'avg_duration'] / 200
        
        # Calculate final weight change with some random noise
        weight_changes[i] = base_change * activity_factor * (1 + workout_factor) + np.random.normal(0, 0.2)
    
    # Fitness score (0-100)
    fitness_scores = np.zeros(n_samples, dtype=int)
    for i in range(n_samples):
        # Base score from activity level
        if X.loc[i, 'activity_level'] == 'sedentary':
            base_score = 30
        elif X.loc[i, 'activity_level'] == 'light':
            base_score = 45
        elif X.loc[i, 'activity_level'] == 'moderate':
            base_score = 60
        elif X.loc[i, 'activity_level'] == 'active':
            base_score = 75
        else:  # very_active
            base_score = 85
        
        # Adjust for workouts
        workout_bonus = min(15, X.loc[i, 'weekly_workouts'] * 3)
        
        # Adjust for health metrics
        health_score = 0
        if 18.5 <= X.loc[i, 'bmi'] <= 24.9:  # Healthy BMI
            health_score += 5
        if X.loc[i, 'resting_heart_rate'] < 70:  # Good RHR
            health_score += 5
        if X.loc[i, 'sleep_hours'] >= 7:  # Good sleep
            health_score += 3
        if X.loc[i, 'stress_level'] <= 5:  # Low stress
            health_score += 2
        
        fitness_scores[i] = min(100, base_score + workout_bonus + health_score)
    
    # Train weight change prediction model
    X_numeric = X.select_dtypes(include=['int64', 'float64'])
    X_categorical = X.select_dtypes(include=['object'])
    
    numeric_transformer = Pipeline(steps=[
        ('scaler', StandardScaler())
    ])
    
    categorical_transformer = Pipeline(steps=[
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, X_numeric.columns),
            ('cat', categorical_transformer, X_categorical.columns)
        ])
    
    # Weight change prediction model
    weight_model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
    ])
    
    # Fitness score prediction model
    fitness_model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
    ])
    
    # Train the models
    weight_model.fit(X, weight_changes)
    fitness_model.fit(X, fitness_scores)
    
    # Save the models
    joblib.dump(weight_model, 'weight_model.pkl')
    joblib.dump(fitness_model, 'fitness_model.pkl')
    
    # Save the full pipeline as a single model
    model_dict = {
        'weight_model': weight_model,
        'fitness_model': fitness_model
    }
    joblib.dump(model_dict, 'fitness_model.pkl')
    
    return model_dict

def predict_fitness_metrics(user, workout_history, fitness_metrics):
    """
    Make fitness predictions for a user based on their data
    
    Parameters:
    - user: User data with demographics and goals
    - workout_history: List of workout sessions
    - fitness_metrics: List of tracked fitness/health metrics
    
    Returns:
    - Dictionary with predictions and recommendations
    """
    try:
        # Load the trained model
        model_dict = joblib.load('fitness_model.pkl')
        weight_model = model_dict['weight_model']
        fitness_model = model_dict['fitness_model']
    except:
        # Train the model if it doesn't exist
        model_dict = train_fitness_model()
        weight_model = model_dict['weight_model']
        fitness_model = model_dict['fitness_model']
    
    # Process workout history to extract features
    weekly_workouts = len(workout_history) / 4 if workout_history else 0  # Assuming 4 weeks of data
    
    if workout_history:
        durations = [w.duration for w in workout_history]
        avg_duration = sum(durations) / len(durations)
        
        cardio_count = sum(1 for w in workout_history if w.type == 'cardio')
        strength_count = sum(1 for w in workout_history if w.type == 'strength')
        total_count = len(workout_history)
        
        cardio_ratio = cardio_count / total_count if total_count > 0 else 0
        strength_ratio = strength_count / total_count if total_count > 0 else 0
    else:
        avg_duration = 0
        cardio_ratio = 0
        strength_ratio = 0
    
    # Extract latest metrics
    if fitness_metrics:
        latest_metric = fitness_metrics[0]  # Assuming the first one is the most recent
        current_weight = latest_metric.weight or user.weight
        resting_heart_rate = latest_metric.resting_heart_rate or 70  # Default value
        sleep_hours = latest_metric.sleep_hours or 7  # Default value
        stress_level = latest_metric.stress_level or 5  # Default value
    else:
        current_weight = user.weight
        resting_heart_rate = 70  # Default
        sleep_hours = 7  # Default
        stress_level = 5  # Default
    
    # Calculate BMI
    height_m = user.height / 100
    bmi = current_weight / (height_m ** 2)
    
    # Create feature vector for prediction
    X_pred = pd.DataFrame({
        'age': [user.age],
        'weight': [current_weight],
        'height': [user.height],
        'gender': [user.gender],
        'activity_level': [user.activity_level],
        'goal': [user.goals],
        'weekly_workouts': [weekly_workouts],
        'avg_duration': [avg_duration],
        'cardio_ratio': [cardio_ratio],
        'strength_ratio': [strength_ratio],
        'bmi': [bmi],
        'resting_heart_rate': [resting_heart_rate],
        'sleep_hours': [sleep_hours],
        'stress_level': [stress_level]
    })
    
    # Make predictions
    predicted_weight_change = weight_model.predict(X_pred)[0]
    predicted_fitness_score = int(fitness_model.predict(X_pred)[0])
    
    # Calculate predicted weight after 4 weeks
    predicted_weight = round(current_weight + (predicted_weight_change * 4), 1)
    
    # Calculate recommended calories
    # Mifflin-St Jeor Equation for BMR
    if user.gender == 'male':
        bmr = 10 * current_weight + 6.25 * user.height - 5 * user.age + 5
    else:
        bmr = 10 * current_weight + 6.25 * user.height - 5 * user.age - 161
    
    # Activity multiplier
    activity_multipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'very_active': 1.9
    }
    
    # Total Daily Energy Expenditure
    tdee = bmr * activity_multipliers.get(user.activity_level, 1.55)
    
    # Adjust calories based on goal
    if user.goals == 'lose_weight':
        recommended_calories = int(tdee - 500)  # Deficit
    elif user.goals == 'gain_muscle':
        recommended_calories = int(tdee + 300)  # Surplus
    else:
        recommended_calories = int(tdee)  # Maintenance
    
    # Generate recommendations based on user goals and data
    recommendations = generate_recommendations(user, workout_history, fitness_metrics, predicted_fitness_score)
    
    # Generate next goal
    next_goal = generate_next_goal(user, predicted_weight_change, predicted_fitness_score)
    
    return {
        "predicted_weight": predicted_weight,
        "recommended_calories": recommended_calories,
        "fitness_score": predicted_fitness_score,
        "recommendations": recommendations,
        "next_goal": next_goal
    }

def generate_recommendations(user, workout_history, fitness_metrics, fitness_score):
    """Generate personalized recommendations based on user data"""
    recommendations = []
    
    # Basic recommendations based on user goals
    if user.goals == 'lose_weight':
        recommendations.extend([
            'Try incorporating HIIT workouts 2-3 times per week',
            'Focus on a balanced diet with a slight calorie deficit',
            'Prioritize protein intake to preserve muscle mass',
            'Include strength training to boost metabolism'
        ])
    elif user.goals == 'gain_muscle':
        recommendations.extend([
            'Increase your protein intake to at least 1.6g per kg of bodyweight',
            'Focus on progressive overload in your strength training',
            'Ensure adequate recovery between intense workouts',
            'Consider adding creatine supplementation'
        ])
    elif user.goals == 'improve_endurance':
        recommendations.extend([
            'Gradually increase your cardio session durations',
            'Incorporate interval training to improve VO2 max',
            'Focus on proper hydration before, during, and after workouts',
            'Consider cross-training to prevent overuse injuries'
        ])
    else:
        recommendations.extend([
            'Focus on consistency in your workout routine',
            'Ensure you\'re getting adequate sleep (7-9 hours)',
            'Stay hydrated throughout the day',
            'Consider periodization to continue making progress'
        ])
    
    # Analyze workout patterns
    if workout_history:
        workout_types = [w.type for w in workout_history]
        unique_types = set(workout_types)
        
        if len(unique_types) <= 1 and len(workout_history) > 3:
            recommendations.append('Try diversifying your workout types for more balanced fitness gains')
        
        cardio_count = sum(1 for t in workout_types if t == 'cardio')
        strength_count = sum(1 for t in workout_types if t == 'strength')
        
        if cardio_count == 0 and user.goals != 'gain_muscle':
            recommendations.append('Consider adding some cardiovascular exercise to improve heart health')
        
        if strength_count == 0 and user.goals != 'improve_endurance':
            recommendations.append('Adding resistance training can benefit metabolism and bone health')
    else:
        recommendations.append('Start with 2-3 workouts per week to build consistency')
    
    # Check health metrics
    if fitness_metrics:
        latest = fitness_metrics[0]  # Assuming the first one is the most recent
        
        if latest.sleep_hours and latest.sleep_hours < 7:
            recommendations.append('Aim to increase your sleep to at least 7 hours for better recovery')
        
        if latest.stress_level and latest.stress_level > 7:
            recommendations.append('Consider adding stress-reduction techniques like meditation or yoga')
    
    # Randomize the recommendations a bit for variety
    if len(recommendations) > 4:
        return random.sample(recommendations, 4)
    
    return recommendations

def generate_next_goal(user, predicted_weight_change, fitness_score):
    """Generate a personalized next goal based on user data"""
    if user.goals == 'lose_weight':
        if predicted_weight_change < -0.5:
            return "Maintain your current weight loss progress and focus on body composition"
        else:
            return "Aim to lose 1-2% of body weight in the next 4 weeks through increased activity"
    
    elif user.goals == 'gain_muscle':
        return "Increase your strength in compound lifts by 5% in the next 6 weeks"
    
    elif user.goals == 'improve_endurance':
        return "Increase your sustained cardio duration by 10% in the next month"
    
    elif fitness_score < 50:
        return "Build a consistent routine of at least 3 workouts per week"
    
    else:
        return "Focus on improving sleep quality and stress management for better recovery"
