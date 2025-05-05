import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import BookingsTab from './tabs/BookingsTab';
import RoomsTab from './tabs/RoomsTab';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'rooms'
  
  // Redirect if not admin
  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'bookings' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('bookings')}
        >
          Manage Bookings
        </button>
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'rooms' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('rooms')}
        >
          Manage Rooms
        </button>
      </div>
      
      {/* Render active tab */}
      {activeTab === 'bookings' ? (
        <BookingsTab user={user} />
      ) : (
        <RoomsTab user={user} />
      )}
    </div>
  );
};

export default AdminDashboard;