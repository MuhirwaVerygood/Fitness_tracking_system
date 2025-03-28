export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number; // in kg
  height: number; // in cm
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goals: 'lose_weight' | 'maintain' | 'gain_muscle' | 'improve_endurance' | 'general_fitness';
  joined: string; // ISO date
}

export interface WorkoutSession {
  id: string;
  userId: string;
  date: string; // ISO date
  duration: number; // in minutes
  type: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other';
  calories: number;
  intensity: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface FitnessMetric {
  id: string;
  userId: string;
  date: string; // ISO date
  weight?: number;
  bodyFat?: number;
  restingHeartRate?: number;
  vo2Max?: number;
  sleepHours?: number;
  stressLevel?: number; // 1-10
}

export interface FitnessPrediction {
  userId: string;
  predictedWeight: number;
  recommendedCalories: number;
  fitnessScore: number; // 0-100
  recommendations: string[];
  nextGoal: string;
}

// Mock current user data
export const currentUser: User = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  age: 32,
  gender: 'male',
  weight: 78, // kg
  height: 178, // cm
  activityLevel: 'moderate',
  goals: 'gain_muscle',
  joined: '2023-12-15T08:00:00Z'
};

// Generate workout history for the past 30 days
export const generateWorkoutHistory = (userId: string, days = 30): WorkoutSession[] => {
  const workouts: WorkoutSession[] = [];
  const workoutTypes: WorkoutSession['type'][] = ['cardio', 'strength', 'flexibility', 'sports', 'other'];
  const intensities: WorkoutSession['intensity'][] = ['low', 'medium', 'high'];
  
  for (let i = 0; i < days; i++) {
    // Skip some days to simulate rest days
    if (Math.random() > 0.7) continue;
    
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const type = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
    const intensity = intensities[Math.floor(Math.random() * intensities.length)];
    const duration = Math.floor(Math.random() * 60) + 30; // 30-90 minutes
    let calories = 0;
    
    // Calculate calories based on workout type, intensity and duration
    switch(type) {
      case 'cardio':
        calories = intensity === 'high' ? duration * 12 : 
                  intensity === 'medium' ? duration * 10 : 
                  duration * 7;
        break;
      case 'strength':
        calories = intensity === 'high' ? duration * 10 : 
                  intensity === 'medium' ? duration * 8 : 
                  duration * 6;
        break;
      default:
        calories = intensity === 'high' ? duration * 9 : 
                  intensity === 'medium' ? duration * 7 : 
                  duration * 5;
    }
    
    workouts.push({
      id: `workout-${i}`,
      userId,
      date: date.toISOString(),
      duration,
      type,
      calories,
      intensity,
      notes: Math.random() > 0.7 ? 'Felt great today!' : undefined
    });
  }
  
  return workouts;
};

// Generate fitness metrics for the past 30 days
export const generateFitnessMetrics = (userId: string, days = 30): FitnessMetric[] => {
  const metrics: FitnessMetric[] = [];
  
  // Start with baseline values
  let weight = currentUser.weight;
  let bodyFat = 22; // percentage
  let restingHeartRate = 68; // bpm
  let vo2Max = 35; // ml/kg/min
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add small random variations
    weight = Math.round((weight + (Math.random() * 0.4 - 0.2)) * 10) / 10;
    bodyFat = Math.round((bodyFat + (Math.random() * 0.3 - 0.2)) * 10) / 10;
    restingHeartRate = Math.round(restingHeartRate + (Math.random() * 2 - 1));
    vo2Max = Math.round((vo2Max + (Math.random() * 0.2 - 0.05)) * 10) / 10;
    
    // Simulate improvement trend
    if (i > 0 && i % 7 === 0) {
      weight -= 0.2;
      bodyFat -= 0.3;
      restingHeartRate -= 0.5;
      vo2Max += 0.3;
    }
    
    metrics.push({
      id: `metric-${i}`,
      userId,
      date: date.toISOString(),
      weight,
      bodyFat,
      restingHeartRate,
      vo2Max,
      sleepHours: Math.round((Math.random() * 2 + 6) * 10) / 10, // 6-8 hours
      stressLevel: Math.floor(Math.random() * 7) + 2 // 2-8
    });
  }
  
  return metrics.reverse(); // Most recent first
};

// Generate fitness prediction
export const generateFitnessPrediction = (userId: string): FitnessPrediction => {
  const user = currentUser;
  
  // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
  const bmr = user.gender === 'male'
    ? 10 * user.weight + 6.25 * user.height - 5 * user.age + 5
    : 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;
  
  // Activity multiplier
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  
  // Calculate TDEE (Total Daily Energy Expenditure)
  const tdee = bmr * activityMultipliers[user.activityLevel];
  
  // Calculate recommended calories based on goal
  let recommendedCalories = tdee;
  switch(user.goals) {
    case 'lose_weight':
      recommendedCalories = tdee - 500; // Deficit
      break;
    case 'gain_muscle':
      recommendedCalories = tdee + 300; // Surplus
      break;
    default:
      recommendedCalories = tdee; // Maintenance
  }
  
  // Predicted weight change over 4 weeks based on calorie deficit/surplus
  const caloriesDifference = recommendedCalories - tdee;
  const weightChangeKg = (caloriesDifference * 28) / 7700; // 7700 calories ≈ 1kg
  const predictedWeight = user.weight + weightChangeKg;
  
  // Generate a fitness score based on activity level, consistency, etc.
  const fitnessScore = Math.min(100, Math.floor(65 + Math.random() * 25));
  
  // Generate recommendations based on user goals
  let recommendations: string[] = [];
  switch(user.goals) {
    case 'lose_weight':
      recommendations = [
        'Try incorporating HIIT workouts 2-3 times per week',
        'Focus on a balanced diet with a slight calorie deficit',
        'Prioritize protein intake to preserve muscle mass',
        'Include strength training to boost metabolism'
      ];
      break;
    case 'gain_muscle':
      recommendations = [
        'Increase your protein intake to at least 1.6g per kg of bodyweight',
        'Focus on progressive overload in your strength training',
        'Ensure adequate recovery between intense workouts',
        'Consider adding creatine supplementation'
      ];
      break;
    case 'improve_endurance':
      recommendations = [
        'Gradually increase your cardio session durations',
        'Incorporate interval training to improve VO2 max',
        'Focus on proper hydration before, during, and after workouts',
        'Consider cross-training to prevent overuse injuries'
      ];
      break;
    default:
      recommendations = [
        'Focus on consistency in your workout routine',
        'Ensure you\'re getting adequate sleep (7-9 hours)',
        'Stay hydrated throughout the day',
        'Consider periodization to continue making progress'
      ];
  }
  
  // Generate next goal recommendation
  const nextGoal = user.goals === 'lose_weight'
    ? 'Reduce body fat by 2% in the next 4 weeks'
    : user.goals === 'gain_muscle'
    ? 'Increase strength in compound lifts by 5% in the next 6 weeks'
    : 'Improve cardiovascular fitness by increasing weekly active minutes';
  
  return {
    userId,
    predictedWeight: Math.round(predictedWeight * 10) / 10,
    recommendedCalories: Math.round(recommendedCalories),
    fitnessScore,
    recommendations,
    nextGoal
  };
};

// Generate workout data for charts
export const generateWorkoutChartData = (userId: string, workouts: WorkoutSession[]) => {
  // Group workouts by week for calories burned
  const currentDate = new Date();
  const weekLabels = Array.from({ length: 4 }, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - (i * 7));
    return `Week ${4-i}`;
  }).reverse();
  
  // Calculate calories by week
  const caloriesByWeek = weekLabels.map((_, weekIndex) => {
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - ((4 - weekIndex) * 7));
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    
    return workouts
      .filter(workout => {
        const workoutDate = new Date(workout.date);
        return workoutDate >= startDate && workoutDate <= endDate;
      })
      .reduce((total, workout) => total + workout.calories, 0);
  });
  
  // Get workout duration by type
  const totalDurationByType = workouts.reduce((acc, workout) => {
    acc[workout.type] = (acc[workout.type] || 0) + workout.duration;
    return acc;
  }, {} as Record<string, number>);
  
  const durationByType = Object.entries(totalDurationByType).map(([type, duration]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: duration
  }));
  
  // Calculate workout frequency by day of week
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const workoutsByDay = daysOfWeek.map(day => {
    const dayIndex = daysOfWeek.indexOf(day);
    const count = workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate.getDay() === dayIndex;
    }).length;
    
    return { name: day, value: count };
  });
  
  return {
    caloriesByWeek: {
      labels: weekLabels,
      data: caloriesByWeek
    },
    durationByType,
    workoutsByDay
  };
};
