
// Fitness calculation utility functions

/**
 * Calculates BMI (Body Mass Index)
 * @param weightKg Weight in kilograms
 * @param heightCm Height in centimeters
 * @returns BMI value
 */
export const calculateBMI = (weightKg: number, heightCm: number): number => {
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
};

/**
 * Gets BMI category based on BMI value
 * @param bmi BMI value
 * @returns BMI category
 */
export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Healthy';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

/**
 * Calculates BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
 * @param weightKg Weight in kilograms
 * @param heightCm Height in centimeters
 * @param age Age in years
 * @param gender Gender ('male' or 'female')
 * @returns BMR value in calories
 */
export const calculateBMR = (
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female' | 'other'
): number => {
  if (gender === 'male') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
  } else {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
  }
};

/**
 * Calculates TDEE (Total Daily Energy Expenditure)
 * @param bmr BMR value
 * @param activityLevel Activity level
 * @returns TDEE value in calories
 */
export const calculateTDEE = (
  bmr: number, 
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
): number => {
  const activityMultipliers = {
    sedentary: 1.2,    // Little or no exercise
    light: 1.375,      // Light exercise 1-3 days/week
    moderate: 1.55,    // Moderate exercise 3-5 days/week
    active: 1.725,     // Hard exercise 6-7 days/week
    very_active: 1.9   // Very hard exercise & physical job or 2x training
  };
  
  return Math.round(bmr * activityMultipliers[activityLevel]);
};

/**
 * Calculates daily calorie target based on goals
 * @param tdee TDEE value
 * @param goal Fitness goal
 * @returns Daily calorie target
 */
export const calculateCalorieTarget = (
  tdee: number,
  goal: 'lose_weight' | 'maintain' | 'gain_muscle' | 'improve_endurance' | 'general_fitness'
): number => {
  switch (goal) {
    case 'lose_weight':
      return Math.round(tdee - 500); // 500 calorie deficit
    case 'gain_muscle':
      return Math.round(tdee + 300); // 300 calorie surplus
    case 'improve_endurance':
    case 'general_fitness':
    case 'maintain':
    default:
      return tdee; // Maintenance calories
  }
};

/**
 * Calculates body fat percentage using U.S. Navy Method
 * This is an approximation and not as accurate as direct measurements
 * @param waistCm Waist circumference in cm
 * @param neckCm Neck circumference in cm
 * @param heightCm Height in cm
 * @param gender Gender ('male' or 'female')
 * @param hipCm Hip circumference in cm (only needed for female)
 * @returns Estimated body fat percentage
 */
export const calculateBodyFatPercentage = (
  waistCm: number,
  neckCm: number,
  heightCm: number,
  gender: 'male' | 'female' | 'other',
  hipCm?: number
): number => {
  if (gender === 'male') {
    return Number(
      (495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450).toFixed(1)
    );
  } else if (gender === 'female' && hipCm) {
    return Number(
      (495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450).toFixed(1)
    );
  }
  return 0;
};

/**
 * Calculates ideal weight range based on BMI range of 18.5-25
 * @param heightCm Height in cm
 * @returns Object with min and max ideal weight
 */
export const calculateIdealWeightRange = (heightCm: number): { min: number; max: number } => {
  const heightM = heightCm / 100;
  const minWeight = Math.round(18.5 * heightM * heightM);
  const maxWeight = Math.round(25 * heightM * heightM);
  
  return { min: minWeight, max: maxWeight };
};

/**
 * Calculates calories burned during exercise (very approximate)
 * @param weightKg Weight in kg
 * @param durationMin Duration in minutes
 * @param activityType Type of activity
 * @param intensity Exercise intensity
 * @returns Calories burned
 */
export const calculateCaloriesBurned = (
  weightKg: number,
  durationMin: number,
  activityType: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other',
  intensity: 'low' | 'medium' | 'high'
): number => {
  // MET values (Metabolic Equivalent of Task)
  // These are approximations and can vary based on specific exercises
  const metValues: Record<string, Record<string, number>> = {
    cardio: { low: 5, medium: 7.5, high: 10 },
    strength: { low: 3, medium: 5, high: 6 },
    flexibility: { low: 2.5, medium: 3, high: 4 },
    sports: { low: 4, medium: 6, high: 8 },
    other: { low: 3, medium: 5, high: 7 }
  };
  
  const met = metValues[activityType][intensity];
  
  // Calories burned = MET * weight in kg * duration in hours
  return Math.round((met * weightKg * (durationMin / 60)));
};

/**
 * Calculate fitness score based on various metrics (0-100)
 * This is a simplified score for demonstration purposes
 * @param metrics Object containing various fitness metrics
 * @returns Fitness score (0-100)
 */
export const calculateFitnessScore = (metrics: {
  bmi: number;
  workoutsPerWeek: number;
  restingHeartRate?: number;
  vo2Max?: number;
  sleepHours?: number;
  stressLevel?: number;
}): number => {
  let score = 0;
  let factors = 0;
  
  // BMI component (optimal BMI is around 22)
  if (metrics.bmi) {
    const bmiScore = 100 - Math.min(100, Math.abs(metrics.bmi - 22) * 5);
    score += bmiScore;
    factors++;
  }
  
  // Workout frequency component
  if (metrics.workoutsPerWeek) {
    // Optimal is 3-5 workouts per week
    const workoutScore = metrics.workoutsPerWeek <= 5 
      ? metrics.workoutsPerWeek * 20
      : 100 - ((metrics.workoutsPerWeek - 5) * 10);
    score += Math.max(0, Math.min(100, workoutScore));
    factors++;
  }
  
  // Resting heart rate component (lower is better, optimal range 60-70)
  if (metrics.restingHeartRate) {
    let rhrScore = 0;
    if (metrics.restingHeartRate < 60) {
      rhrScore = 100 - Math.max(0, (60 - metrics.restingHeartRate));
    } else if (metrics.restingHeartRate <= 70) {
      rhrScore = 100;
    } else {
      rhrScore = 100 - Math.min(100, (metrics.restingHeartRate - 70) * 3);
    }
    score += rhrScore;
    factors++;
  }
  
  // VO2 Max component (higher is better)
  if (metrics.vo2Max) {
    // Scoring based on general fitness standards
    // Excellent: 40+, Good: 35-39, Average: 30-34, Below Average: <30
    let vo2Score = 0;
    if (metrics.vo2Max >= 40) {
      vo2Score = 100;
    } else if (metrics.vo2Max >= 35) {
      vo2Score = 80;
    } else if (metrics.vo2Max >= 30) {
      vo2Score = 60;
    } else {
      vo2Score = Math.max(0, metrics.vo2Max * 2);
    }
    score += vo2Score;
    factors++;
  }
  
  // Sleep component (optimal range 7-9 hours)
  if (metrics.sleepHours) {
    let sleepScore = 0;
    if (metrics.sleepHours >= 7 && metrics.sleepHours <= 9) {
      sleepScore = 100;
    } else if (metrics.sleepHours < 7) {
      sleepScore = Math.max(0, metrics.sleepHours * 14.3); // 100/7 ≈ 14.3
    } else {
      sleepScore = Math.max(0, 100 - ((metrics.sleepHours - 9) * 20));
    }
    score += sleepScore;
    factors++;
  }
  
  // Stress level component (lower is better, 1-10 scale)
  if (metrics.stressLevel) {
    const stressScore = Math.max(0, 100 - (metrics.stressLevel * 10));
    score += stressScore;
    factors++;
  }
  
  // Calculate average score
  return Math.round(factors > 0 ? score / factors : 50);
};

/**
 * Generate fitness recommendations based on user profile and goals
 * @param userProfile User profile data
 * @returns Array of recommendation strings
 */
export const generateFitnessRecommendations = (userProfile: {
  bmi: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose_weight' | 'maintain' | 'gain_muscle' | 'improve_endurance' | 'general_fitness';
  age: number;
  restingHeartRate?: number;
}): string[] => {
  const recommendations: string[] = [];
  
  // BMI-based recommendations
  if (userProfile.bmi < 18.5) {
    recommendations.push('Focus on increasing your caloric intake with nutrient-dense foods.');
    if (userProfile.goal === 'gain_muscle') {
      recommendations.push('Prioritize strength training with progressive overload to build muscle mass.');
    }
  } else if (userProfile.bmi >= 25) {
    recommendations.push('Consider incorporating more cardio sessions to help with weight management.');
    if (userProfile.goal === 'lose_weight') {
      recommendations.push('Create a modest calorie deficit through diet and increased physical activity.');
    }
  }
  
  // Activity level recommendations
  if (userProfile.activityLevel === 'sedentary' || userProfile.activityLevel === 'light') {
    recommendations.push('Try to gradually increase your daily activity by incorporating short walks or stretching breaks.');
    recommendations.push('Aim to reach the recommended 150 minutes of moderate activity per week.');
  }
  
  // Age-based recommendations
  if (userProfile.age > 40) {
    recommendations.push('Include mobility exercises and joint-friendly activities like swimming or cycling.');
    if (userProfile.age > 50) {
      recommendations.push('Incorporate balance training to prevent falls and maintain independence.');
    }
  }
  
  // Heart rate recommendations
  if (userProfile.restingHeartRate && userProfile.restingHeartRate > 75) {
    recommendations.push('Consider more regular cardiovascular exercise to improve heart health.');
  }
  
  // Goal-specific recommendations
  switch (userProfile.goal) {
    case 'lose_weight':
      recommendations.push('Combine strength training and cardio for optimal fat loss results.');
      recommendations.push('Focus on protein intake to preserve muscle mass while in a calorie deficit.');
      break;
    case 'gain_muscle':
      recommendations.push('Ensure adequate protein intake of 1.6-2.2g per kg of bodyweight daily.');
      recommendations.push('Focus on progressive overload by gradually increasing weights or repetitions.');
      break;
    case 'improve_endurance':
      recommendations.push('Gradually increase the duration and intensity of your cardiovascular workouts.');
      recommendations.push('Consider incorporating interval training to improve VO2 max.');
      break;
    case 'general_fitness':
      recommendations.push('Create a balanced routine that includes strength, cardio, and flexibility work.');
      recommendations.push('Focus on consistency rather than intensity for long-term health benefits.');
      break;
    case 'maintain':
      recommendations.push('Maintain your current activity levels while focusing on variety to prevent plateaus.');
      recommendations.push('Consider periodically reassessing your routine to ensure it remains challenging.');
      break;
  }
  
  // General health recommendations
  recommendations.push('Ensure adequate hydration before, during, and after workouts.');
  recommendations.push('Prioritize quality sleep of 7-9 hours per night for optimal recovery.');
  
  // Return a subset of recommendations (5 maximum)
  return recommendations.slice(0, 5);
};
