import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('upcoming');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://room-booking-server-f5ev.onrender.com/api/bookings/user', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await res.json();
      setBookings(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchBookings();
    }
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      const res = await fetch(`https://room-booking-server-f5ev.onrender.com/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      
      if (!res.ok) {
        throw new Error('Failed to cancel booking');
      }
      
      // Refresh bookings after cancellation
      fetchBookings();
    } catch (err) {
      console.error('Error canceling booking:', err);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) return;
    
    setDeleteLoading(true);
    try {
      const res = await fetch(`https://room-booking-server-f5ev.onrender.com/api/bookings/delete/${bookingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete booking');
      }
      
      // Update local state to remove the deleted booking
      setBookings(prevBookings => prevBookings.filter(booking => booking._id !== bookingId));
      
    } catch (err) {
      console.error('Error deleting booking:', err);
      alert('Failed to delete booking. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter bookings based on the selected filter
  const filteredBookings = bookings.filter(booking => {
    // Filter by status
    if (filter !== 'all' && booking.status !== filter) {
      return false;
    }
    
    // Filter by search query (room name or room type)
    if (searchQuery) {
      const roomName = booking.room?.name?.toLowerCase() || '';
      const roomType = booking.room?.type?.toLowerCase() || '';
      const query = searchQuery.toLowerCase();
      
      if (!roomName.includes(query) && !roomType.includes(query)) {
        return false;
      }
    }
    
    return true;
  });

  // Sort bookings based on the selected sort order
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const dateA = new Date(a.checkInDate);
    const dateB = new Date(b.checkInDate);
    
    if (sortOrder === 'upcoming') {
      return dateA - dateB; // Ascending (upcoming first)
    } else if (sortOrder === 'recent') {
      return dateB - dateA; // Descending (recent first)
    } else if (sortOrder === 'price-high') {
      return b.totalCost - a.totalCost;
    } else if (sortOrder === 'price-low') {
      return a.totalCost - b.totalCost;
    }
    
    return 0;
  });

  // Group bookings by status for statistics
  const bookingStats = bookings.reduce((acc, booking) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1;
    return acc;
  }, {});

  const getStatusBadge = (status) => {
    const statusStyles = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-gray-100 text-gray-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">My Bookings</h2>
        <div className="flex space-x-2">
          <button 
            onClick={fetchBookings}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
            disabled={loading}
          >
            Refresh Bookings
          </button>
          {bookings.some(b => b.status === 'cancelled') && (
            <button 
              onClick={() => {
                if (window.confirm('Delete all cancelled bookings? This action cannot be undone.')) {
                  // Delete all cancelled bookings one by one
                  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');
                  Promise.all(
                    cancelledBookings.map(booking => 
                      fetch(`https://room-booking-server-f5ev.onrender.com/api/bookings/${booking._id}`, {
                        method: 'DELETE',
                        headers: {
                          Authorization: `Bearer ${user.token}`,
                        },
                      })
                    )
                  )
                  .then(() => {
                    // Update local state to remove all cancelled bookings
                    setBookings(prevBookings => prevBookings.filter(booking => booking.status !== 'cancelled'));
                  })
                  .catch(err => {
                    console.error('Error deleting cancelled bookings:', err);
                    alert('Failed to delete some bookings. Please try again.');
                  });
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-200"
              disabled={deleteLoading}
            >
              Delete All Cancelled
            </button>
          )}
        </div>
      </div>

      {/* Booking Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Total Bookings</p>
          <p className="text-2xl font-bold">{bookings.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Confirmed</p>
          <p className="text-2xl font-bold text-green-600">{bookingStats.confirmed || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{bookingStats.pending || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Cancelled/Rejected</p>
          <p className="text-2xl font-bold text-red-600">
            {(bookingStats.cancelled || 0) + (bookingStats.rejected || 0)}
          </p>
        </div>
      </div>

      {/* Filtering and Sorting Options */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Bookings</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="upcoming">Upcoming First</option>
              <option value="recent">Recent First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
            </select>
          </div>
          
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Room</label>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by room name or type..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {sortedBookings.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-in
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-out
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cost
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {booking.room?.image ? (
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={booking.room.image} 
                            alt={booking.room.name} 
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.room?.name || 'Room'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.room?.type || 'Standard Room'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(new Date(booking.checkInDate), 'MMM dd, yyyy')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(booking.checkInDate), 'h:mm a')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(booking.checkOutDate), 'h:mm a')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.durationInDays.toFixed(1)} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${booking.totalCost.toFixed(2)}
                    </div>
                    {booking.room?.price && (
                      <div className="text-xs text-gray-500">
                        ${booking.room.price}/night
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          // Here you could implement a modal view with more details
                          alert(`Booking ID: ${booking._id}\nRoom: ${booking.room?.name || 'Unknown'}\nStatus: ${booking.status}`);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Details
                      </button>
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      )}
                      {['cancelled', 'rejected'].includes(booking.status) && (
                        <button
                          onClick={() => handleDeleteBooking(booking._id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={deleteLoading}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500 mb-6">
            {filter !== 'all' ? 
              `You don't have any ${filter} bookings.` : 
              "You haven't made any bookings yet."}
          </p>
          <button
            onClick={() => {
              // Reset filters
              setFilter('all');
              setSearchQuery('');
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {filter !== 'all' ? 'Show All Bookings' : 'Browse Rooms'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MyBookings;