
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  // Check if logged in
  useEffect(() => {
    const user = localStorage.getItem('fitnessUser');
    setIsLoggedIn(!!user);
  }, [location]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('fitnessUser');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-fitness-primary">Fit<span className="text-fitness-secondary">Track</span></span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-fitness-primary' : 'text-gray-700 hover:text-fitness-primary dark:text-gray-300 dark:hover:text-white'}`}>
                Home
              </Link>
              
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-fitness-primary' : 'text-gray-700 hover:text-fitness-primary dark:text-gray-300 dark:hover:text-white'}`}>
                    Dashboard
                  </Link>
                  <Link to="/profile" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/profile' ? 'text-fitness-primary' : 'text-gray-700 hover:text-fitness-primary dark:text-gray-300 dark:hover:text-white'}`}>
                    Profile
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-1 text-gray-700 hover:text-fitness-primary dark:text-gray-300 dark:hover:text-white"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/login' ? 'text-fitness-primary' : 'text-gray-700 hover:text-fitness-primary dark:text-gray-300 dark:hover:text-white'}`}>
                    Login
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-fitness-primary hover:bg-fitness-primary/90">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-fitness-primary hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white dark:bg-slate-900 shadow-lg transition-all duration-300 ease-in-out`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/' ? 'text-fitness-primary bg-gray-50 dark:bg-gray-800' : 'text-gray-700 hover:text-fitness-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'}`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/dashboard' ? 'text-fitness-primary bg-gray-50 dark:bg-gray-800' : 'text-gray-700 hover:text-fitness-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'}`}
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/profile' ? 'text-fitness-primary bg-gray-50 dark:bg-gray-800' : 'text-gray-700 hover:text-fitness-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'}`}
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <button
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-fitness-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <LogOut size={16} />
                  <span>Logout</span>
                </div>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/login' ? 'text-fitness-primary bg-gray-50 dark:bg-gray-800' : 'text-gray-700 hover:text-fitness-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'}`}
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/signup' ? 'text-fitness-primary bg-gray-50 dark:bg-gray-800' : 'text-gray-700 hover:text-fitness-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'}`}
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
