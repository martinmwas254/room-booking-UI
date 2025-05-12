import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Camera, Trash2, LogOut } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const fileInputRef = React.useRef(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('https://room-booking-server-f5ev.onrender.com/api/users/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const userData = await response.json();
        setUser(userData);
        setProfileImage(userData.profilePicture || null);
      } catch (err) {
        setError(err.message);
        // Redirect to login if fetch fails
        navigate('/login');
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('https://room-booking-server-f5ev.onrender.com/api/users/profile-picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setProfileImage(data.profilePictureUrl);
        setSuccessMessage('Profile picture updated successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(data.message || 'Failed to upload profile picture');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProfilePicture = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('https://room-booking-server-f5ev.onrender.com/api/users/profile-picture', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setProfileImage(null);
        setSuccessMessage('Profile picture deleted successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(data.message || 'Failed to delete profile picture');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('https://room-booking-server-f5ev.onrender.com/api/users/account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        // Remove token and redirect to home
        localStorage.removeItem('token');
        navigate('/');
      } else {
        setError(data.message || 'Failed to delete account');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Show loading state while fetching user data
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8 space-y-6">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-16 h-16 text-gray-500" />
              </div>
            )}
            
            {/* Profile Picture Actions */}
            <div className="absolute bottom-0 right-0 flex space-x-2">
              <button 
                onClick={() => fileInputRef.current.click()}
                className="bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Change Profile Picture"
              >
                <Camera className="w-5 h-5" />
              </button>
              
              {profileImage && (
                <button 
                  onClick={handleDeleteProfilePicture}
                  disabled={isLoading}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                  title="Delete Profile Picture"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* Hidden file input */}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* User Details */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        {/* Account Management Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Management</h3>
          <div className="space-y-4">
            <button
              onClick={handleDeleteAccount}
              disabled={isLoading}
              className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              <Trash2 className="mr-2 w-5 h-5" />
              Delete Account
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <LogOut className="mr-2 w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;