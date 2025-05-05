import { useState, useEffect } from 'react';
import { Calendar, Search, Filter, RefreshCw, ArrowUpDown } from 'lucide-react';
import BookingCard from '../components/BookingCard';
import BookingFilters from '../components/BookingFilters.jsx';
import { fetchAllBookings, updateBookingStatus } from '../services/bookingService.js';

const BookingsTab = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    if (user?.token) {
      loadBookings();
    }
  }, [user]);
  
  const loadBookings = async () => {
    setBookingsLoading(true);
    try {
      const data = await fetchAllBookings(user.token);
      setBookings(data);
      setBookingsError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setBookingsError('Failed to load bookings. Please try again later.');
    } finally {
      setBookingsLoading(false);
    }
  };
  
  const refreshBookings = async () => {
    setIsRefreshing(true);
    await loadBookings();
    setTimeout(() => setIsRefreshing(false), 500);
  };
  
  const handleApproveBooking = async (bookingId) => {
    await handleStatusChange(bookingId, 'confirmed');
  };
  
  const handleRejectBooking = async (bookingId) => {
    await handleStatusChange(bookingId, 'rejected');
  };
  
  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      await handleStatusChange(bookingId, 'cancelled');
    }
  };
  
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus, user.token);
      await loadBookings();
    } catch (err) {
      setBookingsError(err.message);
    }
  };
  
  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };
  
  const handleDateRangeChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };
  
  const clearFilters = () => {
    setFilter('all');
    setSearchTerm('');
    setDateRange({ from: '', to: '' });
  };
  
  // Filter and sort bookings
  let processedBookings = [...bookings];
  
  // Status filter
  if (filter !== 'all') {
    processedBookings = processedBookings.filter(booking => booking.status === filter);
  }
  
  // Search term filter
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    processedBookings = processedBookings.filter(booking => 
      (booking.room?.name && booking.room.name.toLowerCase().includes(term)) ||
      (booking.user?.name && booking.user.name.toLowerCase().includes(term)) ||
      (booking.user?.email && booking.user.email.toLowerCase().includes(term)) ||
      (booking.guestEmail && booking.guestEmail.toLowerCase().includes(term)) ||
      (booking.specialRequests && booking.specialRequests.toLowerCase().includes(term))
    );
  }
  
  // Date range filter
  if (dateRange.from) {
    const fromDate = new Date(dateRange.from);
    processedBookings = processedBookings.filter(booking => 
      new Date(booking.checkInDate) >= fromDate
    );
  }
  
  if (dateRange.to) {
    const toDate = new Date(dateRange.to);
    toDate.setHours(23, 59, 59, 999);
    processedBookings = processedBookings.filter(booking => 
      new Date(booking.checkOutDate) <= toDate
    );
  }
  
  // Sort
  processedBookings.sort((a, b) => {
    let comparison = 0;
    
    if (sortConfig.key === 'createdAt') {
      comparison = new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortConfig.key === 'checkInDate') {
      comparison = new Date(a.checkInDate) - new Date(b.checkInDate);
    } else if (sortConfig.key === 'totalPrice') {
      comparison = a.totalPrice - b.totalPrice;
    } else if (sortConfig.key === 'roomName') {
      const nameA = a.room?.name || '';
      const nameB = b.room?.name || '';
      comparison = nameA.localeCompare(nameB);
    }
    
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });
  
  // Count bookings by status
  const statusCounts = bookings.reduce((acc, booking) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1;
    return acc;
  }, {});
  
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Bookings Management</h2>
        
        <div className="flex items-center">
          <button 
            onClick={refreshBookings}
            className="flex items-center gap-1 bg-blue-100 text-blue-600 px-3 py-2 rounded hover:bg-blue-200 transition-colors"
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Total</p>
          <p className="text-2xl font-bold">{bookings.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow-sm border border-yellow-100">
          <p className="text-yellow-600 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{statusCounts.pending || 0}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-100">
          <p className="text-green-600 text-sm">Confirmed</p>
          <p className="text-2xl font-bold text-green-700">{statusCounts.confirmed || 0}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-100">
          <p className="text-red-600 text-sm">Rejected</p>
          <p className="text-2xl font-bold text-red-700">{statusCounts.rejected || 0}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm">Cancelled</p>
          <p className="text-2xl font-bold text-gray-700">{statusCounts.cancelled || 0}</p>
        </div>
      </div>
      
      {bookingsLoading ? (
        <div className="p-6 flex justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-3"></div>
            <p>Loading bookings...</p>
          </div>
        </div>
      ) : bookingsError ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {bookingsError}
          </div>
          <button 
            onClick={loadBookings}
            className="mt-2 bg-red-200 hover:bg-red-300 text-red-800 px-3 py-1 rounded text-sm"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Advanced Filtering Section */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
              {/* Search */}
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by room, guest name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Date Range */}
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="from"
                    value={dateRange.from}
                    onChange={handleDateRangeChange}
                    className="pl-9 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <span className="flex items-center text-gray-500">to</span>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="to"
                    value={dateRange.to}
                    onChange={handleDateRangeChange}
                    className="pl-9 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Status Filter */}
              <BookingFilters filter={filter} setFilter={setFilter} />
              
              {/* Sorting & Clear Filters */}
              <div className="flex gap-3">
                <div className="relative">
                  <select
                    value={`${sortConfig.key}-${sortConfig.direction}`}
                    onChange={(e) => {
                      const [key, direction] = e.target.value.split('-');
                      setSortConfig({ key, direction });
                    }}
                    className="appearance-none bg-gray-100 border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="createdAt-desc">Latest Bookings</option>
                    <option value="createdAt-asc">Oldest Bookings</option>
                    <option value="checkInDate-asc">Check-in Date (Ascending)</option>
                    <option value="checkInDate-desc">Check-in Date (Descending)</option>
                    <option value="totalPrice-desc">Price (Highest First)</option>
                    <option value="totalPrice-asc">Price (Lowest First)</option>
                    <option value="roomName-asc">Room Name (A-Z)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ArrowUpDown className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
                
                <button
                  onClick={clearFilters}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded text-sm flex items-center gap-1"
                >
                  <Filter className="w-4 h-4" />
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Results Info */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{processedBookings.length}</span> 
              {filter !== 'all' ? ` ${filter}` : ''} bookings
              {searchTerm ? ` matching "${searchTerm}"` : ''}
            </p>
            
            {(filter !== 'all' || searchTerm || dateRange.from || dateRange.to) && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all filters
              </button>
            )}
          </div>
          
          {/* Bookings Grid */}
          <div className="grid gap-4">
            {processedBookings.length > 0 ? (
              processedBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onApprove={handleApproveBooking}
                  onReject={handleRejectBooking}
                  onCancel={handleCancelBooking}
                />
              ))
            ) : (
              <div className="bg-white border rounded-lg shadow-sm p-8 text-center">
                <div className="text-gray-400 mb-3">
                  <Filter className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-700 text-lg mb-2">No bookings found</p>
                <p className="text-gray-500 mb-4">
                  {filter !== 'all' || searchTerm || dateRange.from || dateRange.to ? 
                    'Try adjusting your search filters to see more results.' : 
                    'There are no bookings in the system yet.'}
                </p>
                {(filter !== 'all' || searchTerm || dateRange.from || dateRange.to) && (
                  <button
                    onClick={clearFilters}
                    className="bg-blue-100 text-blue-600 px-4 py-2 rounded hover:bg-blue-200"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BookingsTab;