
// API utilities for interacting with the FastAPI backend

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Function to get fitness predictions from the backend
export const getFitnessPrediction = async (userData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to get prediction');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting fitness prediction:', error);
    throw error;
  }
};

// Function to map frontend data to the format expected by the API
export const mapUserDataForApi = (user: any, workouts: any[], metrics: any[]) => {
  // Map user data
  const mappedUser = {
    name: user.name,
    age: user.age,
    gender: user.gender,
    weight: user.weight,
    height: user.height,
    activity_level: user.activityLevel,
    goals: user.goals
  };

  // Map workout history
  const mappedWorkouts = workouts.map(workout => ({
    date: workout.date,
    duration: workout.duration,
    type: workout.type,
    calories: workout.calories,
    intensity: workout.intensity,
    notes: workout.notes
  }));

  // Map fitness metrics
  const mappedMetrics = metrics.map(metric => ({
    date: metric.date,
    weight: metric.weight,
    body_fat: metric.bodyFat,
    resting_heart_rate: metric.restingHeartRate,
    vo2_max: metric.vo2Max,
    sleep_hours: metric.sleepHours,
    stress_level: metric.stressLevel
  }));

  return {
    user: mappedUser,
    workout_history: mappedWorkouts,
    fitness_metrics: mappedMetrics
  };
};
