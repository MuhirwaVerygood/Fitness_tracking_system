
import { useState, useEffect } from 'react';
import { Calendar, Clock, Dumbbell, Flame, Activity, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { calculateCaloriesBurned } from '@/utils/fitnessCalculations';
import { WorkoutSession } from '@/utils/mockData';

interface WorkoutFormProps {
  onSubmit: (workout: WorkoutSession) => void;
  userId: string;
}

const WorkoutForm = ({ onSubmit, userId }: WorkoutFormProps) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState(30);
  const [type, setType] = useState<WorkoutSession['type']>('cardio');
  const [intensity, setIntensity] = useState<WorkoutSession['intensity']>('medium');
  const [notes, setNotes] = useState('');
  const [estimatedCalories, setEstimatedCalories] = useState(0);
  const [userWeight, setUserWeight] = useState(75); // Default weight in kg
  
  // Fetch user weight from localStorage
  useEffect(() => {
    const userString = localStorage.getItem('fitnessUser');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user.weight) {
          setUserWeight(user.weight);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);
  
  // Calculate estimated calories whenever relevant inputs change
  useEffect(() => {
    const calories = calculateCaloriesBurned(userWeight, duration, type, intensity);
    setEstimatedCalories(calories);
  }, [userWeight, duration, type, intensity]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!date || duration <= 0) {
      toast.error('Please fill all required fields');
      return;
    }
    
    // Create workout object
    const workout: WorkoutSession = {
      id: `workout-${Date.now()}`,
      userId,
      date: new Date(date).toISOString(),
      duration,
      type,
      calories: estimatedCalories,
      intensity,
      notes: notes || undefined
    };
    
    // Submit workout
    onSubmit(workout);
    
    // Reset form
    setDuration(30);
    setType('cardio');
    setIntensity('medium');
    setNotes('');
    
    // Show success message
    toast.success('Workout logged successfully');
  };
  
  return (
    <div className="glass-card rounded-xl p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <Dumbbell className="mr-2 text-fitness-primary" />
        Log Workout
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date */}
          <div className="space-y-2">
            <label htmlFor="workout-date" className="block text-sm font-medium text-gray-700">
              Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="workout-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10"
                required
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          {/* Duration */}
          <div className="space-y-2">
            <label htmlFor="workout-duration" className="block text-sm font-medium text-gray-700">
              Duration (minutes) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="workout-duration"
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                className="pl-10"
                required
              />
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          {/* Workout Type */}
          <div className="space-y-2">
            <label htmlFor="workout-type" className="block text-sm font-medium text-gray-700">
              Workout Type <span className="text-red-500">*</span>
            </label>
            <Select value={type} onValueChange={(value) => setType(value as WorkoutSession['type'])}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select workout type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Workout Types</SelectLabel>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="flexibility">Flexibility</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          {/* Intensity */}
          <div className="space-y-2">
            <label htmlFor="workout-intensity" className="block text-sm font-medium text-gray-700">
              Intensity <span className="text-red-500">*</span>
            </label>
            <Select value={intensity} onValueChange={(value) => setIntensity(value as WorkoutSession['intensity'])}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select intensity" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Intensity Levels</SelectLabel>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Notes */}
        <div className="space-y-2">
          <label htmlFor="workout-notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <div className="relative">
            <Textarea
              id="workout-notes"
              placeholder="How did your workout feel? Any achievements or challenges?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none min-h-[100px] pl-10 pt-2"
            />
            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        {/* Estimated Calories */}
        <div className="bg-fitness-accent p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <Flame className="mr-2 text-fitness-primary h-5 w-5" />
            <span className="text-sm text-gray-700">Estimated Calories:</span>
          </div>
          <span className="text-lg font-semibold text-fitness-primary">{estimatedCalories}</span>
        </div>
        
        {/* Submit Button */}
        <Button type="submit" className="w-full">
          <Activity className="mr-2 h-4 w-4" />
          Log Workout
        </Button>
      </form>
    </div>
  );
};

export default WorkoutForm;
