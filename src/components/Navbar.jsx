import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, LogOut, User, Calendar, BookOpen, Settings, Home } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Check if current route matches the given path
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${
      isScrolled ? 'bg-white text-gray-800 shadow-md' : 'bg-blue-600 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🏨</span>
              <span className="font-bold text-xl hidden sm:block">HotelRoomBooking</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link to="/" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive('/') 
                ? (isScrolled ? 'bg-blue-100 text-blue-700' : 'bg-blue-700 text-white') 
                : (isScrolled ? 'hover:bg-gray-100' : 'hover:bg-blue-700')
            }`}>
              <Home size={18} className="mr-1" />
              <span>Home</span>
            </Link>
            
            {!user ? (
              <>
                <Link to="/login" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/login') 
                    ? (isScrolled ? 'bg-blue-100 text-blue-700' : 'bg-blue-700 text-white') 
                    : (isScrolled ? 'hover:bg-gray-100' : 'hover:bg-blue-700')
                }`}>
                  <User size={18} className="mr-1" />
                  <span>Login</span>
                </Link>
                <Link to="/register" className={`flex items-center px-4 py-2 rounded-md text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-sm`}>
                  <span>Register</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/my-bookings" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/my-bookings') 
                    ? (isScrolled ? 'bg-blue-100 text-blue-700' : 'bg-blue-700 text-white') 
                    : (isScrolled ? 'hover:bg-gray-100' : 'hover:bg-blue-700')
                }`}>
                  <Calendar size={18} className="mr-1" />
                  <span>My Bookings</span>
                </Link>
                {user.isAdmin && (
                  <Link to="/admin/dashboard" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/admin/dashboard') 
                      ? (isScrolled ? 'bg-blue-100 text-blue-700' : 'bg-blue-700 text-white') 
                      : (isScrolled ? 'hover:bg-gray-100' : 'hover:bg-blue-700')
                  }`}>
                    <Settings size={18} className="mr-1" />
                    <span>Admin</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-colors shadow-sm"
                >
                  <LogOut size={18} className="mr-1" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${
            isScrolled ? 'bg-white' : 'bg-blue-600'
          }`}>
            <Link to="/" className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
              isActive('/') 
                ? (isScrolled ? 'bg-blue-100 text-blue-700' : 'bg-blue-700 text-white') 
                : (isScrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-blue-700')
            }`}>
              <Home size={18} className="mr-2" />
              <span>Home</span>
            </Link>
            
            {!user ? (
              <>
                <Link to="/login" className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/login') 
                    ? (isScrolled ? 'bg-blue-100 text-blue-700' : 'bg-blue-700 text-white') 
                    : (isScrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-blue-700')
                }`}>
                  <User size={18} className="mr-2" />
                  <span>Login</span>
                </Link>
                <Link to="/register" className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/register') 
                    ? (isScrolled ? 'bg-blue-100 text-blue-700' : 'bg-blue-700 text-white') 
                    : (isScrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-blue-700')
                }`}>
                  <User size={18} className="mr-2" />
                  <span>Register</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/my-bookings" className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/my-bookings') 
                    ? (isScrolled ? 'bg-blue-100 text-blue-700' : 'bg-blue-700 text-white') 
                    : (isScrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-blue-700')
                }`}>
                  <Calendar size={18} className="mr-2" />
                  <span>My Bookings</span>
                </Link>
                {user.isAdmin && (
                  <Link to="/admin/dashboard" className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/admin/dashboard') 
                      ? (isScrolled ? 'bg-blue-100 text-blue-700' : 'bg-blue-700 text-white') 
                      : (isScrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-blue-700')
                  }`}>
                    <Settings size={18} className="mr-2" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-white bg-red-500 hover:bg-red-600"
                >
                  <LogOut size={18} className="mr-2" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;