
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem('fitnessUser');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // For demo purposes, we'll just check if email and password are not empty
    if (!email || !password) {
      toast.error('Please enter both email and password');
      setLoading(false);
      return;
    }
    
    // Mock login (in a real app, this would be an API call)
    setTimeout(() => {
      // Store user in localStorage
      localStorage.setItem('fitnessUser', JSON.stringify({
        email,
        name: email.split('@')[0],
        id: 'user-1',
        weight: 78,
        height: 178,
        age: 32,
        gender: 'male',
        activityLevel: 'moderate',
        goals: 'gain_muscle'
      }));
      
      // Show success message
      toast.success('Login successful');
      
      // Redirect to dashboard or the page they were trying to access
      const from = location.state?.from || '/dashboard';
      navigate(from);
      
      setLoading(false);
    }, 1000);
  };
  
  // Preset email for demo purposes
  const fillDemoCredentials = () => {
    setEmail('demo@example.com');
    setPassword('password');
    toast.info('Demo credentials filled in. Click Login to continue.', {
      duration: 3000
    });
  };
  
  return (
    <div className="min-h-screen bg-fitness-accent/30">
      <Navbar />
      
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card rounded-xl shadow-sm w-full max-w-md p-8 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to continue your fitness journey</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="#" className="text-sm text-fitness-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(!!checked)} />
              <Label htmlFor="remember" className="text-sm cursor-pointer">Remember me</Label>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : 'Login'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={fillDemoCredentials}
            >
              Use Demo Account
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-fitness-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
