
import { useState, useEffect, useRef } from 'react';
import { Activity, BarChart2, Brain, Dumbbell, Heart, TrendingUp } from 'lucide-react';

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const features = [
    {
      title: "Track Your Progress",
      description: "Log workouts, measurements, and health metrics to visualize your fitness journey over time.",
      icon: <Activity className="w-12 h-12 text-fitness-primary" />,
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      title: "AI-Powered Insights",
      description: "Receive personalized recommendations based on your performance data and fitness goals.",
      icon: <Brain className="w-12 h-12 text-fitness-primary" />,
      image: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
    },
    {
      title: "Advanced Analytics",
      description: "Visualize your fitness data with beautiful charts and trend analysis to identify patterns.",
      icon: <BarChart2 className="w-12 h-12 text-fitness-primary" />,
      image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      title: "Workout Management",
      description: "Create, customize, and track your workout routines with our intuitive workout builder.",
      icon: <Dumbbell className="w-12 h-12 text-fitness-primary" />,
      image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      title: "Health Monitoring",
      description: "Track vital health metrics like heart rate, sleep quality, and stress levels to optimize your wellness.",
      icon: <Heart className="w-12 h-12 text-fitness-primary" />,
      image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1631&q=80"
    },
    {
      title: "Goal Setting",
      description: "Set achievable milestones and receive customized plans to help you reach your fitness goals.",
      icon: <TrendingUp className="w-12 h-12 text-fitness-primary" />,
      image: "https://images.unsplash.com/photo-1458853021199-d344b6043baa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    }
  ];
  
  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [features.length]);
  
  // Check if component is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }
    
    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
    };
  }, []);
  
  return (
    <section ref={featuresRef} className="py-24 bg-white" id="features">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-fitness-dark">
            Powered by <span className="text-fitness-primary">Advanced</span> Technology
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover our powerful features designed to elevate your fitness experience and help you achieve remarkable results.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Feature tabs */}
          <div className={`space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                  activeFeature === index
                    ? 'glass-card shadow-md transform scale-105'
                    : 'hover:bg-gray-50 hover:shadow-sm'
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-lg ${activeFeature === index ? 'bg-fitness-accent' : 'bg-gray-100'} mr-4`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Feature image */}
          <div className={`relative h-[500px] overflow-hidden rounded-2xl shadow-soft-lg transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {features.map((feature, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  activeFeature === index ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/90">{feature.description}</p>
                </div>
              </div>
            ))}
            
            {/* Navigation dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {features.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    activeFeature === index ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
                  }`}
                  onClick={() => setActiveFeature(index)}
                  aria-label={`Go to feature ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
