import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Import the Footer component
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Home from './pages/homepage/HomePage';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/admin/AdminDashboard';

// Protected route component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useContext(AuthContext);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="container mx-auto py-4 flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route 
                path="/my-bookings" 
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer /> {/* Add the Footer component here */}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;