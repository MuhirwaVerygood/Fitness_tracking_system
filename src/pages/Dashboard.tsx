
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import FitnessMetrics from '@/components/FitnessMetrics';
import FitnessChart from '@/components/FitnessChart';
import WorkoutForm from '@/components/WorkoutForm';
import PredictionCard from '@/components/PredictionCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Calendar, Flame, Activity, Zap, Heart, Award } from 'lucide-react';
import { 
  User, 
  WorkoutSession, 
  FitnessMetric, 
  FitnessPrediction,
  currentUser,
  generateWorkoutHistory,
  generateFitnessMetrics,
  generateFitnessPrediction,
  generateWorkoutChartData
} from '@/utils/mockData';
import { getFitnessPrediction, mapUserDataForApi } from '@/utils/api';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [metrics, setMetrics] = useState<FitnessMetric[]>([]);
  const [prediction, setPrediction] = useState<FitnessPrediction | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [useBackend, setUseBackend] = useState(false);
  const { toast } = useToast();
  
  // Function to fetch prediction from API
  const fetchPredictionFromApi = async (userData: User, workoutData: WorkoutSession[], metricsData: FitnessMetric[]) => {
    try {
      // Map the data to the format expected by the API
      const apiData = mapUserDataForApi(userData, workoutData, metricsData);
      
      // Get prediction from API
      const predictionData = await getFitnessPrediction(apiData);
      
      // Map API response to FitnessPrediction type
      const mappedPrediction: FitnessPrediction = {
        userId: userData.id,
        predictedWeight: predictionData.predicted_weight,
        recommendedCalories: predictionData.recommended_calories,
        fitnessScore: predictionData.fitness_score,
        recommendations: predictionData.recommendations,
        nextGoal: predictionData.next_goal
      };
      
      setPrediction(mappedPrediction);
      
      toast({
        title: "AI Model Prediction",
        description: "Received prediction from the machine learning model",
        variant: "default",
      });
      
    } catch (error) {
      console.error("Error fetching prediction:", error);
      // Fallback to mock data if API fails
      const mockPrediction = generateFitnessPrediction(userData.id);
      setPrediction(mockPrediction);
      
      toast({
        title: "Using mock data",
        description: "Could not connect to the AI model. Using simulated predictions instead.",
        variant: "destructive",
      });
    }
  };
  
  useEffect(() => {
    // Simulate data loading
    setLoading(true);
    
    setTimeout(() => {
      // Get user from localStorage
      const userString = localStorage.getItem('fitnessUser');
      const userData = userString ? JSON.parse(userString) : currentUser;
      setUser(userData);
      
      // Generate mock data
      const userId = userData.id;
      const workoutHistory = generateWorkoutHistory(userId);
      const fitnessMetrics = generateFitnessMetrics(userId);
      
      // Prepare weight data for charts
      const weightData = fitnessMetrics.map(metric => ({
        date: metric.date,
        value: metric.weight || 0
      }));
      
      // Generate chart data
      const workoutChartData = generateWorkoutChartData(userId, workoutHistory);
      
      setWorkouts(workoutHistory);
      setMetrics(fitnessMetrics);
      setChartData({
        weightData,
        caloriesByWeek: workoutChartData.caloriesByWeek,
        durationByType: workoutChartData.durationByType,
        workoutsByDay: workoutChartData.workoutsByDay
      });
      
      // Try to use the backend API for predictions, fallback to mock data
      if (useBackend) {
        fetchPredictionFromApi(userData, workoutHistory, fitnessMetrics);
      } else {
        // Use mock data for prediction
        const fitnessPrediction = generateFitnessPrediction(userId);
        setPrediction(fitnessPrediction);
      }
      
      setLoading(false);
    }, 1000);
  }, [useBackend]);
  
  // Toggle between mock data and backend API
  const togglePredictionSource = () => {
    setUseBackend(!useBackend);
  };
  
  // Handle new workout submission
  const handleWorkoutSubmit = (workout: WorkoutSession) => {
    const updatedWorkouts = [workout, ...workouts];
    setWorkouts(updatedWorkouts);
    
    // Update prediction if using backend
    if (useBackend && user) {
      fetchPredictionFromApi(user, updatedWorkouts, metrics);
    }
  };
  
  if (loading || !user || !prediction || !chartData) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-fitness-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading your fitness dashboard...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Get recent workouts (last 3)
  const recentWorkouts = workouts.slice(0, 3);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-12">
        {/* Dashboard header */}
        <div className="bg-gradient-to-r from-fitness-primary to-fitness-secondary py-8 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Welcome, {user.name}
                </h1>
                <p className="text-white/90 mt-1">
                  Here's an overview of your fitness journey
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="secondary" 
                  className="bg-white text-fitness-primary hover:bg-white/90 transition-colors"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Track Measurements
                </Button>
                
                <Button
                  variant={useBackend ? "default" : "outline"}
                  className={useBackend ? "bg-fitness-accent text-fitness-primary border border-fitness-primary" : "bg-white text-gray-700"}
                  onClick={togglePredictionSource}
                >
                  {useBackend ? "Using AI Model" : "Using Mock Data"}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dashboard content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content - Left column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Metrics cards */}
              <FitnessMetrics user={user} metrics={metrics} prediction={prediction} />
              
              {/* Chart section */}
              <FitnessChart 
                weightData={chartData.weightData}
                caloriesByWeek={chartData.caloriesByWeek}
                durationByType={chartData.durationByType}
                workoutsByDay={chartData.workoutsByDay}
              />
              
              {/* Recent Workouts */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-fitness-primary" />
                    Recent Workouts
                  </CardTitle>
                  <CardDescription>
                    Your latest workout sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentWorkouts.length > 0 ? (
                    <div className="space-y-4">
                      {recentWorkouts.map((workout, index) => (
                        <div key={workout.id} className={`flex items-start p-4 rounded-lg ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                          <div className={`p-3 rounded-lg mr-4 ${
                            workout.type === 'cardio' ? 'bg-red-50 text-red-500' :
                            workout.type === 'strength' ? 'bg-blue-50 text-blue-500' :
                            workout.type === 'flexibility' ? 'bg-green-50 text-green-500' :
                            'bg-purple-50 text-purple-500'
                          }`}>
                            {workout.type === 'cardio' ? <Heart className="h-5 w-5" /> :
                             workout.type === 'strength' ? <Dumbbell className="h-5 w-5" /> :
                             workout.type === 'flexibility' ? <Activity className="h-5 w-5" /> :
                             <Zap className="h-5 w-5" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium capitalize">
                                  {workout.type} Workout
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {new Date(workout.date).toLocaleDateString()} • {workout.duration} min • {workout.intensity} intensity
                                </p>
                              </div>
                              <div className="flex items-center text-sm font-medium text-fitness-primary">
                                <Flame className="h-4 w-4 mr-1" />
                                {workout.calories} cal
                              </div>
                            </div>
                            {workout.notes && (
                              <p className="mt-2 text-sm text-gray-600 bg-gray-100 p-2 rounded">
                                {workout.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Dumbbell className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">No workouts logged yet</p>
                      <p className="text-sm text-gray-500 mt-1">Start tracking your workouts to see them here</p>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Award className="h-4 w-4 mr-1 text-fitness-primary" />
                      {workouts.length} total workouts
                    </div>
                    <Button variant="link" className="text-fitness-primary p-0">
                      View All Workouts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar - Right column */}
            <div className="space-y-6">
              {/* Log Workout Form */}
              <WorkoutForm onSubmit={handleWorkoutSubmit} userId={user.id} />
              
              {/* AI Prediction Card */}
              <PredictionCard prediction={prediction} />
              
              {/* API Status Card */}
              {useBackend && (
                <Card className="shadow-sm bg-fitness-accent/20 border border-fitness-accent">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center text-fitness-primary">
                      <Activity className="w-4 h-4 mr-2" />
                      AI Model Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-gray-600">
                    <p>Predictions are being generated using the machine learning model from the FastAPI backend.</p>
                    <p className="mt-2">Each new workout will trigger a new prediction with the updated data.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
