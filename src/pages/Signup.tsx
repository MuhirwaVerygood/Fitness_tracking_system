
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem('fitnessUser');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validate first step
      if (!name || !email || !password || !confirmPassword) {
        toast.error('Please fill in all fields');
        return;
      }
      
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      
      if (password.length < 8) {
        toast.error('Password must be at least 8 characters long');
        return;
      }
      
      // Move to second step
      setStep(2);
      return;
    }
    
    // Handle final submission
    setLoading(true);
    
    // Validate second step
    if (!age || !gender || !weight || !height || !activityLevel || !goal) {
      toast.error('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    // Mock signup (in a real app, this would be an API call)
    setTimeout(() => {
      // Store user in localStorage
      localStorage.setItem('fitnessUser', JSON.stringify({
        name,
        email,
        id: 'user-1',
        age: parseInt(age),
        gender,
        weight: parseFloat(weight),
        height: parseInt(height),
        activityLevel,
        goals: goal,
        joined: new Date().toISOString()
      }));
      
      // Show success message
      toast.success('Account created successfully!');
      
      // Redirect to dashboard
      navigate('/dashboard');
      
      setLoading(false);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-fitness-accent/30">
      <Navbar />
      
      <div className="min-h-screen flex items-center justify-center px-4 py-24">
        <div className="glass-card rounded-xl shadow-sm w-full max-w-md p-8 animate-fade-in">
          {/* Signup Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Create Your Account</h1>
            <p className="text-gray-600 mt-2">
              {step === 1 
                ? 'Start your fitness journey with us' 
                : 'Tell us about yourself to personalize your experience'}
            </p>
            
            {/* Progress indicator */}
            <div className="flex items-center justify-center mt-6 gap-2">
              <div className={`h-2 w-12 rounded-full ${step === 1 ? 'bg-fitness-primary' : 'bg-gray-200'} transition-colors`}></div>
              <div className={`h-2 w-12 rounded-full ${step === 2 ? 'bg-fitness-primary' : 'bg-gray-200'} transition-colors`}></div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              /* Step 1: Account Information */
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">Continue</Button>
              </>
            ) : (
              /* Step 2: Personal Information */
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      min="10"
                      max="100"
                      placeholder="30"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      min="30"
                      step="0.1"
                      placeholder="70"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      min="100"
                      max="250"
                      placeholder="175"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="activityLevel">Activity Level</Label>
                  <Select value={activityLevel} onValueChange={setActivityLevel}>
                    <SelectTrigger id="activityLevel">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                      <SelectItem value="light">Light (exercise 1-3 days/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (exercise 3-5 days/week)</SelectItem>
                      <SelectItem value="active">Active (exercise 6-7 days/week)</SelectItem>
                      <SelectItem value="very_active">Very Active (physical job or 2x training)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goal">Fitness Goal</Label>
                  <Select value={goal} onValueChange={setGoal}>
                    <SelectTrigger id="goal">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lose_weight">Lose Weight</SelectItem>
                      <SelectItem value="maintain">Maintain Weight</SelectItem>
                      <SelectItem value="gain_muscle">Gain Muscle</SelectItem>
                      <SelectItem value="improve_endurance">Improve Endurance</SelectItem>
                      <SelectItem value="general_fitness">General Fitness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : 'Create Account'}
                  </Button>
                </div>
              </>
            )}
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-fitness-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
