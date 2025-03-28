
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Dumbbell, BarChart4 } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mount
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timeout);
  }, []);
  
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-fitness-accent to-transparent z-0"></div>
      
      {/* Abstract shapes */}
      <div className="absolute top-1/4 right-0 w-64 h-64 rounded-full bg-gradient-to-r from-fitness-primary/10 to-fitness-secondary/20 blur-3xl transform translate-x-1/3 animate-pulse-subtle"></div>
      <div className="absolute bottom-1/3 left-0 w-80 h-80 rounded-full bg-gradient-to-r from-fitness-secondary/10 to-fitness-primary/20 blur-3xl transform -translate-x-1/3 animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text content */}
          <div className={`lg:w-1/2 text-center lg:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-block px-3 py-1 mb-4 rounded-full bg-fitness-accent text-fitness-primary text-sm font-medium">
              Smart Fitness Tracking
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight text-fitness-dark">
              Your AI-Powered <span className="text-fitness-primary">Fitness</span> Journey
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0">
              Get personalized workout recommendations, track your progress, and achieve your fitness goals with our advanced AI-powered platform.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link to="/signup">
                <Button className="bg-fitness-primary hover:bg-fitness-primary/90 text-white px-8 py-6 h-auto text-lg shadow-sm hover:shadow transition-all">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="border-fitness-primary text-fitness-primary hover:bg-fitness-accent px-8 py-6 h-auto text-lg">
                  Login
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Feature cards */}
          <div className={`lg:w-1/2 grid gap-6 sm:grid-cols-2 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="glass-card rounded-xl p-6 transform hover:translate-y-[-5px] transition-all">
              <div className="w-12 h-12 bg-fitness-accent rounded-lg flex items-center justify-center mb-4">
                <Activity className="text-fitness-primary w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
              <p className="text-slate-600 dark:text-slate-400">Monitor your fitness journey with detailed metrics and visualizations.</p>
            </div>
            
            <div className="glass-card rounded-xl p-6 transform hover:translate-y-[-5px] transition-all sm:mt-8">
              <div className="w-12 h-12 bg-fitness-accent rounded-lg flex items-center justify-center mb-4">
                <BarChart4 className="text-fitness-primary w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Predictions</h3>
              <p className="text-slate-600 dark:text-slate-400">Get personalized predictions based on your fitness data and goals.</p>
            </div>
            
            <div className="glass-card rounded-xl p-6 transform hover:translate-y-[-5px] transition-all">
              <div className="w-12 h-12 bg-fitness-accent rounded-lg flex items-center justify-center mb-4">
                <Dumbbell className="text-fitness-primary w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Workout Plans</h3>
              <p className="text-slate-600 dark:text-slate-400">Receive tailored workout recommendations to reach your goals faster.</p>
            </div>
            
            <div className="glass-card rounded-xl p-6 transform hover:translate-y-[-5px] transition-all sm:mt-8">
              <div className="w-12 h-12 bg-fitness-accent rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-fitness-primary w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 2.32 3.43H21"></path>
                  <path d="M21 10.43a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1-4.96.46 2.5 2.5 0 0 1-1.98-3 2.5 2.5 0 0 1 2.32-3.43"></path>
                  <path d="M12 19.5a2.5 2.5 0 0 1-4.96.46 2.5 2.5 0 0 1-1.98-3 2.5 2.5 0 0 1 2.32-3.43H21"></path>
                  <path d="M3 7.43a2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0 4.96.46 2.5 2.5 0 0 0 1.98-3 2.5 2.5 0 0 0-2.32-3.43"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Insights</h3>
              <p className="text-slate-600 dark:text-slate-400">Gain valuable insights about your fitness journey and potential improvements.</p>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
          <span className="text-sm text-slate-500 mb-2">Scroll for more</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
