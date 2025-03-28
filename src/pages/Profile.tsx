import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { User, currentUser } from '@/utils/mockData';
import { calculateBMI, getBMICategory, calculateCalorieTarget, calculateBMR, calculateTDEE } from '@/utils/fitnessCalculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User as UserIcon, Settings, Shield, Bell, LogOut, Lock, Heart, Activity, Scale, ChevronRight, Flame } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [goal, setGoal] = useState('');

  useEffect(() => {
    // Get user from localStorage or use default
    const userString = localStorage.getItem('fitnessUser');
    const userData = userString ? JSON.parse(userString) : currentUser;
    setUser(userData);

    // Set form values
    setName(userData.name);
    setEmail(userData.email);
    setAge(userData.age.toString());
    setGender(userData.gender);
    setWeight(userData.weight.toString());
    setHeight(userData.height.toString());
    setActivityLevel(userData.activityLevel);
    setGoal(userData.goals);

    setIsLoading(false);
  }, []);

  // Handle profile update
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Validate form
    if (!name || !email || !age || !gender || !weight || !height || !activityLevel || !goal) {
      toast.error('Please fill in all fields');
      setIsSaving(false);
      return;
    }

    // Update user object
    const updatedUser = {
      ...user,
      name,
      email,
      age: parseInt(age),
      gender: gender as 'male' | 'female' | 'other',
      weight: parseFloat(weight),
      height: parseInt(height),
      activityLevel: activityLevel as User['activityLevel'],
      goals: goal as User['goals'],
    };

    // Mock update (in a real app, this would be an API call)
    setTimeout(() => {
      // Update localStorage
      localStorage.setItem('fitnessUser', JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Show success message
      toast.success('Profile updated successfully');
      setIsSaving(false);
    }, 1000);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('fitnessUser');
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Calculate fitness metrics
  const calculateMetrics = () => {
    if (!user) return null;

    const bmi = calculateBMI(user.weight, user.height);
    const bmr = calculateBMR(user.weight, user.height, user.age, user.gender);
    const tdee = calculateTDEE(bmr, user.activityLevel);
    const calorieTarget = calculateCalorieTarget(tdee, user.goals);

    return { bmi, bmr, tdee, calorieTarget };
  };

  const metrics = user ? calculateMetrics() : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-fitness-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <p className="text-gray-600">User not found. Please login.</p>
            <Button className="mt-4" onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20 pb-12">
        {/* Profile header */}
        <div className="bg-gradient-to-r from-fitness-primary to-fitness-secondary py-8 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center md:flex-row md:items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-fitness-primary shadow-md">
                <UserIcon className="w-10 h-10" />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{user.name}</h1>
                <p className="text-white/90 mt-1">{user.email}</p>
                <p className="text-white/80 text-sm mt-1">
                  Member since {new Date(user.joined || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-6">
              <TabsTrigger value="profile" className="flex items-center justify-center gap-1">
                <UserIcon className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="metrics" className="flex items-center justify-center gap-1">
                <Activity className="h-4 w-4" />
                <span>Metrics</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center justify-center gap-1">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold">Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
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
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input
                              id="age"
                              type="number"
                              min="10"
                              max="100"
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

                          <div className="space-y-2">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input
                              id="weight"
                              type="number"
                              min="30"
                              step="0.1"
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
                              value={height}
                              onChange={(e) => setHeight(e.target.value)}
                              required
                            />
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
                        </div>

                        <div className="flex justify-end">
                          <Button type="submit" disabled={isSaving}>
                            {isSaving ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                              </>
                            ) : 'Save Changes'}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold">Account Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button 
                        variant="outline" 
                        className="w-full justify-between" 
                        onClick={() => toast.info('Password change functionality would be here.')}
                      >
                        <div className="flex items-center">
                          <Lock className="h-4 w-4 mr-2" />
                          <span>Change Password</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-between" 
                        onClick={() => toast.info('Account settings would be here.')}
                      >
                        <div className="flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          <span>Account Settings</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-between" 
                        onClick={() => toast.info('Privacy settings would be here.')}
                      >
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 mr-2" />
                          <span>Privacy Settings</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      
                      <Separator className="my-4" />
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-between text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={handleLogout}
                      >
                        <div className="flex items-center">
                          <LogOut className="h-4 w-4 mr-2" />
                          <span>Logout</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Metrics Tab */}
            <TabsContent value="metrics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold flex items-center">
                      <Scale className="w-5 h-5 mr-2 text-fitness-primary" />
                      Body Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-gray-600">Height</span>
                      <span className="font-medium">{user.height} cm</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-gray-600">Weight</span>
                      <span className="font-medium">{user.weight} kg</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-gray-600">BMI</span>
                      <div className="text-right">
                        <span className="font-medium">{metrics?.bmi}</span>
                        <span className="block text-sm text-gray-500">({getBMICategory(metrics?.bmi || 0)})</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Age</span>
                      <span className="font-medium">{user.age} years</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold flex items-center">
                      <Flame className="w-5 h-5 mr-2 text-fitness-primary" />
                      Energy Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-gray-600">Basal Metabolic Rate</span>
                      <span className="font-medium">{metrics?.bmr} kcal/day</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-gray-600">Total Daily Energy Expenditure</span>
                      <span className="font-medium">{metrics?.tdee} kcal/day</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-gray-600">Daily Calorie Target</span>
                      <div className="text-right">
                        <span className="font-medium">{metrics?.calorieTarget} kcal/day</span>
                        <span className="block text-sm text-gray-500">
                          ({user.goals === 'lose_weight' 
                            ? 'Deficit for weight loss' 
                            : user.goals === 'gain_muscle' 
                            ? 'Surplus for muscle gain' 
                            : 'Maintenance'})
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Activity Level</span>
                      <span className="font-medium capitalize">{user.activityLevel.replace('_', ' ')}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-fitness-primary" />
                      Health Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium mb-2">Goal</h3>
                        <p className="text-gray-600 capitalize mb-4">{user.goals.replace('_', ' ')}</p>
                        
                        <h3 className="font-medium mb-2">Recommendation</h3>
                        <p className="text-gray-600 mb-4">
                          {user.goals === 'lose_weight' 
                            ? 'Focus on creating a sustainable calorie deficit through a combination of diet and exercise.'
                            : user.goals === 'gain_muscle'
                            ? 'Prioritize strength training and ensure adequate protein intake and caloric surplus.'
                            : user.goals === 'improve_endurance'
                            ? 'Gradually increase your cardio duration and intensity over time to build stamina.'
                            : 'Maintain a balanced fitness routine with a mix of cardio, strength, and flexibility work.'}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">BMI Category</h3>
                        <div className="h-8 bg-gray-200 rounded-full overflow-hidden mb-2">
                          <div 
                            className={`h-full ${
                              metrics?.bmi && metrics.bmi < 18.5 ? 'bg-blue-400' :
                              metrics?.bmi && metrics.bmi < 25 ? 'bg-green-400' :
                              metrics?.bmi && metrics.bmi < 30 ? 'bg-yellow-400' :
                              'bg-red-400'
                            }`}
                            style={{ width: `${Math.min(100, ((metrics?.bmi || 0) / 40) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Underweight</span>
                          <span>Normal</span>
                          <span>Overweight</span>
                          <span>Obese</span>
                        </div>
                        
                        <h3 className="font-medium mt-6 mb-2">Ideal Weight Range</h3>
                        <p className="text-gray-600">
                          {Math.round(18.5 * (user.height/100) * (user.height/100))} - {Math.round(24.9 * (user.height/100) * (user.height/100))} kg
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold">Notification Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="flex items-center">
                              <Bell className="w-4 h-4 mr-2 text-fitness-primary" />
                              <span className="font-medium">Workout Reminders</span>
                            </div>
                            <p className="text-sm text-gray-500">Receive reminders for scheduled workouts</p>
                          </div>
                          <div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toast.info('This would toggle workout reminders.')}
                            >
                              Enable
                            </Button>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="flex items-center">
                              <Activity className="w-4 h-4 mr-2 text-fitness-primary" />
                              <span className="font-medium">Progress Updates</span>
                            </div>
                            <p className="text-sm text-gray-500">Get weekly updates on your fitness progress</p>
                          </div>
                          <div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toast.info('This would toggle progress updates.')}
                            >
                              Enable
                            </Button>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="flex items-center">
                              <Heart className="w-4 h-4 mr-2 text-fitness-primary" />
                              <span className="font-medium">Health Tips</span>
                            </div>
                            <p className="text-sm text-gray-500">Receive personalized health and fitness tips</p>
                          </div>
                          <div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toast.info('This would toggle health tips notifications.')}
                            >
                              Enable
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm mt-6">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold">Privacy Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="flex items-center">
                              <Shield className="w-4 h-4 mr-2 text-fitness-primary" />
                              <span className="font-medium">Profile Visibility</span>
                            </div>
                            <p className="text-sm text-gray-500">Control who can see your profile and activities</p>
                          </div>
                          <div>
                            <Select defaultValue="private">
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="public">Public</SelectItem>
                                <SelectItem value="friends">Friends</SelectItem>
                                <SelectItem value="private">Private</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="flex items-center">
                              <Lock className="w-4 h-4 mr-2 text-fitness-primary" />
                              <span className="font-medium">Data Sharing</span>
                            </div>
                            <p className="text-sm text-gray-500">Control how your fitness data is used</p>
                          </div>
                          <div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toast.info('This would open data sharing settings.')}
                            >
                              Configure
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold">App Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="units">Unit System</Label>
                        <Select defaultValue="metric">
                          <SelectTrigger id="units">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                            <SelectItem value="imperial">Imperial (lb, in)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="startDay">Week Starts On</Label>
                        <Select defaultValue="monday">
                          <SelectTrigger id="startDay">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monday">Monday</SelectItem>
                            <SelectItem value="sunday">Sunday</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button 
                        className="w-full mt-4"
                        onClick={() => toast.success('Settings saved!')}
                      >
                        Save Settings
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm mt-6">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-red-500">Danger Zone</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button 
                        variant="outline"
                        className="w-full text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200"
                        onClick={() => {
                          toast.error('This would delete your account in a real application.');
                        }}
                      >
                        Delete Account
                      </Button>
                      
                      <p className="text-xs text-gray-500">
                        This will permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;

