
import { useState } from 'react';
import { Activity, TrendingUp, TrendingDown, Heart, BarChart2, Weight, Brain, Flame } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { calculateBMI, getBMICategory } from '@/utils/fitnessCalculations';
import { User, FitnessPrediction, FitnessMetric } from '@/utils/mockData';

interface FitnessMetricsProps {
  user: User;
  metrics: FitnessMetric[];
  prediction: FitnessPrediction;
}

const FitnessMetrics = ({ user, metrics, prediction }: FitnessMetricsProps) => {
  const currentMetric = metrics.length > 0 ? metrics[0] : null;
  const previousMetric = metrics.length > 1 ? metrics[1] : null;
  
  // Calculate BMI
  const bmi = calculateBMI(user.weight, user.height);
  const bmiCategory = getBMICategory(bmi);
  
  // Calculate weight change
  const weightChange = currentMetric && previousMetric
    ? Number((currentMetric.weight! - previousMetric.weight!).toFixed(1))
    : 0;
  
  // Calculate body fat change
  const bodyFatChange = currentMetric && previousMetric && currentMetric.bodyFat && previousMetric.bodyFat
    ? Number((currentMetric.bodyFat - previousMetric.bodyFat).toFixed(1))
    : 0;
  
  // Calculate heart rate change
  const heartRateChange = currentMetric && previousMetric && currentMetric.restingHeartRate && previousMetric.restingHeartRate
    ? currentMetric.restingHeartRate - previousMetric.restingHeartRate
    : 0;
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Fitness Score */}
      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="bg-gradient-to-r from-fitness-primary to-fitness-secondary h-2"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-fitness-accent p-3 rounded-lg mr-3">
                <Activity className="h-5 w-5 text-fitness-primary" />
              </div>
              <h3 className="font-medium text-gray-700">Fitness Score</h3>
            </div>
            <span className="text-xs font-medium bg-fitness-accent text-fitness-primary px-2 py-1 rounded-full">
              AI Generated
            </span>
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-bold">{prediction.fitnessScore}</span>
            <span className="text-gray-500 ml-1">/100</span>
          </div>
          <div className="mt-1 text-sm text-gray-500">
            Based on your current fitness metrics
          </div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-fitness-primary to-fitness-secondary" 
              style={{ width: `${prediction.fitnessScore}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>
      
      {/* Current Weight */}
      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="bg-gradient-to-r from-fitness-secondary to-fitness-primary h-2"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-fitness-accent p-3 rounded-lg mr-3">
                <Weight className="h-5 w-5 text-fitness-primary" />
              </div>
              <h3 className="font-medium text-gray-700">Current Weight</h3>
            </div>
            {weightChange !== 0 && (
              <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center ${
                weightChange < 0 
                  ? 'bg-green-50 text-green-600' 
                  : 'bg-orange-50 text-orange-600'
              }`}>
                {weightChange < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1" />}
                {Math.abs(weightChange)} kg
              </span>
            )}
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-bold">{user.weight}</span>
            <span className="text-gray-500 ml-1">kg</span>
          </div>
          <div className="mt-1 text-sm text-gray-500">
            BMI: {bmi} ({bmiCategory})
          </div>
          <div className="mt-4 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Target: {prediction.predictedWeight} kg</span>
              {user.goals === 'lose_weight' 
                ? <span className="text-fitness-primary">{Math.abs(Number((user.weight - prediction.predictedWeight).toFixed(1)))} kg to go</span>
                : user.goals === 'gain_muscle'
                ? <span className="text-fitness-primary">{Math.abs(Number((prediction.predictedWeight - user.weight).toFixed(1)))} kg to go</span>
                : <span className="text-fitness-primary">On track</span>
              }
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Body Fat */}
      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="bg-gradient-to-r from-fitness-secondary to-fitness-primary h-2"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-fitness-accent p-3 rounded-lg mr-3">
                <BarChart2 className="h-5 w-5 text-fitness-primary" />
              </div>
              <h3 className="font-medium text-gray-700">Body Fat</h3>
            </div>
            {bodyFatChange !== 0 && currentMetric?.bodyFat && (
              <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center ${
                bodyFatChange < 0 
                  ? 'bg-green-50 text-green-600' 
                  : 'bg-orange-50 text-orange-600'
              }`}>
                {bodyFatChange < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1" />}
                {Math.abs(bodyFatChange)}%
              </span>
            )}
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-bold">{currentMetric?.bodyFat || "N/A"}</span>
            {currentMetric?.bodyFat && <span className="text-gray-500 ml-1">%</span>}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            {user.gender === 'male' 
              ? '10-20% is athletic range for males'
              : '18-28% is athletic range for females'
            }
          </div>
          {currentMetric?.bodyFat && (
            <div className="mt-4 h-2 bg-gray-100 rounded-full">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-fitness-primary to-fitness-secondary" 
                style={{ 
                  width: `${Math.min(100, (currentMetric.bodyFat / (user.gender === 'male' ? 30 : 40)) * 100)}%` 
                }}
              ></div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Resting Heart Rate */}
      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="bg-gradient-to-r from-fitness-primary to-fitness-secondary h-2"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-fitness-accent p-3 rounded-lg mr-3">
                <Heart className="h-5 w-5 text-fitness-primary" />
              </div>
              <h3 className="font-medium text-gray-700">Resting Heart Rate</h3>
            </div>
            {heartRateChange !== 0 && currentMetric?.restingHeartRate && (
              <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center ${
                heartRateChange < 0 
                  ? 'bg-green-50 text-green-600' 
                  : 'bg-orange-50 text-orange-600'
              }`}>
                {heartRateChange < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1" />}
                {Math.abs(heartRateChange)} bpm
              </span>
            )}
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-bold">{currentMetric?.restingHeartRate || "N/A"}</span>
            {currentMetric?.restingHeartRate && <span className="text-gray-500 ml-1">bpm</span>}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            60-100 bpm is the normal range
          </div>
          {currentMetric?.restingHeartRate && (
            <div className="mt-4 h-2 bg-gray-100 rounded-full">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-fitness-primary to-fitness-secondary" 
                style={{ 
                  width: `${Math.min(100, (currentMetric.restingHeartRate / 120) * 100)}%` 
                }}
              ></div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* VO2 Max */}
      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="bg-gradient-to-r from-fitness-secondary to-fitness-primary h-2"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-fitness-accent p-3 rounded-lg mr-3">
                <svg className="h-5 w-5 text-fitness-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-700">VO2 Max</h3>
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-bold">{currentMetric?.vo2Max || "N/A"}</span>
            {currentMetric?.vo2Max && <span className="text-gray-500 ml-1">ml/kg/min</span>}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            Measurement of aerobic fitness
          </div>
          {currentMetric?.vo2Max && (
            <div className="mt-4 h-2 bg-gray-100 rounded-full">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-fitness-primary to-fitness-secondary" 
                style={{ 
                  width: `${Math.min(100, (currentMetric.vo2Max / 60) * 100)}%` 
                }}
              ></div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Daily Calories */}
      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="bg-gradient-to-r from-fitness-primary to-fitness-secondary h-2"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-fitness-accent p-3 rounded-lg mr-3">
                <Flame className="h-5 w-5 text-fitness-primary" />
              </div>
              <h3 className="font-medium text-gray-700">Daily Calories</h3>
            </div>
            <span className="text-xs font-medium bg-fitness-accent text-fitness-primary px-2 py-1 rounded-full">
              AI Recommended
            </span>
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-bold">{prediction.recommendedCalories}</span>
            <span className="text-gray-500 ml-1">kcal</span>
          </div>
          <div className="mt-1 text-sm text-gray-500">
            {user.goals === 'lose_weight' 
              ? 'Calorie deficit for weight loss'
              : user.goals === 'gain_muscle'
              ? 'Calorie surplus for muscle gain'
              : 'Maintenance calories'
            }
          </div>
          <div className="mt-4 text-sm flex items-center">
            <span className="text-gray-500">Based on your BMR, activity level, and goals</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FitnessMetrics;
