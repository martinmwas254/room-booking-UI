import { useEffect, useState } from 'react';
import { format } from 'date-fns';

const HomePage = () => {
  // Existing state variables
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({
    roomType: '',
    bedType: '',
    floorLevel: '',
    minPrice: '',
    maxPrice: '',
  });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkInDate: format(new Date().setDate(new Date().getDate() + 1), 'yyyy-MM-dd'),
    checkInTime: '14:00',
    checkOutDate: format(new Date().setDate(new Date().getDate() + 2), 'yyyy-MM-dd'),
    checkOutTime: '11:00',
  });
  const [bookingCost, setBookingCost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  // Add state for filter visibility
  const [showFilters, setShowFilters] = useState(false);
  // Add state for active filters count
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Calculate active filter count
  useEffect(() => {
    let count = 0;
    Object.values(filters).forEach(value => {
      if (value !== '') count++;
    });
    setActiveFilterCount(count);
  }, [filters]);

  useEffect(() => {
    fetch('https://room-booking-server-f5ev.onrender.com/api/rooms')
      .then(res => res.json())
      .then(data => setRooms(data))
      .catch(err => console.error(err));
  }, []);

  // Existing functions...
  const handleBookingOpen = (room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
    setBookingCost(null);
    setError(null);
    setBookingSuccess(false);
  };

  const handleBookingClose = () => {
    setShowBookingModal(false);
    setSelectedRoom(null);
    setBookingCost(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateCost = async () => {
    if (!selectedRoom) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the user object from localStorage
      const userStr = localStorage.getItem('user');
      const userObj = userStr ? JSON.parse(userStr) : null;
      const token = userObj?.token;
      
      if (!token) {
        throw new Error('You must be logged in to calculate booking cost');
      }
      
      const response = await fetch('https://room-booking-server-f5ev.onrender.com/api/bookings/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          roomId: selectedRoom._id,
          ...bookingData
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to calculate booking cost');
      }
      
      setBookingCost(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    
    if (!selectedRoom) return;
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the token from the user object in localStorage
      const userStr = localStorage.getItem('user');
      const userObj = userStr ? JSON.parse(userStr) : null;
      const token = userObj?.token;
      
      if (!token) {
        throw new Error('You must be logged in to make a booking');
      }
      
      const response = await fetch('https://room-booking-server-f5ev.onrender.com/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          roomId: selectedRoom._id,
          ...bookingData
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create booking');
      }
      
      setBookingSuccess(true);
      setTimeout(() => {
        handleBookingClose();
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Calculate cost whenever booking data changes and we have a selected room
    if (selectedRoom && showBookingModal) {
      const timer = setTimeout(() => {
        calculateCost();
      }, 500); // Add a small delay to avoid too many requests when typing
      
      return () => clearTimeout(timer);
    }
  }, [bookingData, selectedRoom, showBookingModal]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Clear all filters function
  const clearAllFilters = () => {
    setFilters({
      roomType: '',
      bedType: '',
      floorLevel: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  const filteredRooms = rooms.filter(room => {
    let matches = true;
    
    if (filters.roomType && room.roomType !== filters.roomType) {
      matches = false;
    }
    
    if (filters.bedType && room.bedType !== filters.bedType) {
      matches = false;
    }
    
    if (filters.floorLevel && room.floorLevel !== filters.floorLevel) {
      matches = false;
    }
    
    if (filters.minPrice && room.price < Number(filters.minPrice)) {
      matches = false;
    }
    
    if (filters.maxPrice && room.price > Number(filters.maxPrice)) {
      matches = false;
    }
    
    return matches;
  });

  const RoomCard = ({ room, onBook }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Handle cases where room images array is empty
    const hasImages = room.images && room.images.length > 0;
    
    // Next image in carousel
    const nextImage = (e) => {
      e.stopPropagation();
      if (hasImages) {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === room.images.length - 1 ? 0 : prevIndex + 1
        );
      }
    };
    
    // Previous image in carousel
    const prevImage = (e) => {
      e.stopPropagation();
      if (hasImages) {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === 0 ? room.images.length - 1 : prevIndex - 1
        );
      }
    };
  
    return (
      <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Image carousel */}
        <div className="relative h-48 bg-gray-200">
          {hasImages ? (
            <>
              <img 
                src={room.images[currentImageIndex]} 
                alt={`${room.name} - View ${currentImageIndex + 1}`} 
                className="w-full h-full object-cover"
              />
              
              {/* Only show navigation if there are multiple images */}
              {room.images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white w-8 h-8 rounded-full flex items-center justify-center"
                  >
                    &lt;
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white w-8 h-8 rounded-full flex items-center justify-center"
                  >
                    &gt;
                  </button>
                  {/* Image counter */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded-full">
                    {currentImageIndex + 1}/{room.images.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400">No images available</span>
            </div>
          )}
        </div>
        
        {/* Room details */}
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-800">{room.name}</h3>
            <span className="text-lg font-bold text-green-600">${room.price}<span className="text-sm text-gray-500">/night</span></span>
          </div>
          
          <p className="text-gray-600 mt-2 line-clamp-2">{room.description}</p>
          
          {/* Room specifications */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {room.roomType}
            </span>
            <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
              {room.bedType} Bed
            </span>
            <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded">
              {room.floorLevel}
            </span>
          </div>
          
          {/* Room capacity */}
          <div className="mt-3 flex items-center text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Up to {room.capacity} guests</span>
          </div>
          
          {/* Amenities */}
          {room.amenities && room.amenities.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-700">Amenities</h4>
              <div className="mt-1 flex flex-wrap gap-2">
                {room.amenities.slice(0, 3).map((amenity, index) => (
                  <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {amenity}
                  </span>
                ))}
                {room.amenities.length > 3 && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    +{room.amenities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Available status indicator */}
          <div className="mt-4 flex items-center">
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${room.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm">{room.available ? 'Available' : 'Currently unavailable'}</span>
          </div>
          
          {/* Book now button */}
          <button 
            className={`mt-4 w-full py-2 rounded-md text-white font-medium ${
              room.available 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            onClick={() => room.available && onBook(room)}
            disabled={!room.available}
          >
            {room.available ? 'Book Now' : 'Unavailable'}
          </button>
        </div>
      </div>
    );
  };

  // Booking Modal Component
  const BookingModal = ({ show, onClose, room, bookingData, onInputChange, onSubmit, cost, isLoading, error, success }) => {
    if (!show) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-screen overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">Book Room</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {success ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <p className="font-medium">Booking Successful!</p>
                <p className="text-sm">Your booking request has been submitted. It will be confirmed shortly.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <div className="mb-4">
                  <h3 className="font-medium text-gray-800 mb-2">{room.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <span className="font-medium mr-2">Type:</span> {room.roomType}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">Bed:</span> {room.bedType}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                    <input 
                      type="date" 
                      name="checkInDate"
                      value={bookingData.checkInDate}
                      onChange={onInputChange}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className="w-full border border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Time</label>
                    <input 
                      type="time" 
                      name="checkInTime"
                      value={bookingData.checkInTime}
                      onChange={onInputChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                    <input 
                      type="date" 
                      name="checkOutDate"
                      value={bookingData.checkOutDate}
                      onChange={onInputChange}
                      min={bookingData.checkInDate}
                      className="w-full border border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Time</label>
                    <input 
                      type="time" 
                      name="checkOutTime"
                      value={bookingData.checkOutTime}
                      onChange={onInputChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>
                </div>
                
                {/* Cost summary */}
                {cost && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-gray-800 mb-2">Booking Summary</h4>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Room Rate:</span>
                      <span>${room.price}/night</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Duration:</span>
                      <span>{cost.durationInDays.toFixed(2)} days</span>
                    </div>
                    <div className="flex justify-between font-medium mt-2 pt-2 border-t border-gray-200">
                      <span>Total Cost:</span>
                      <span>${cost.totalCost.toFixed(2)}</span>
                    </div>
                  </div>
                )}
                
                {/* Error message */}
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>{error}</p>
                  </div>
                )}
                
                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Confirm Booking'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Get unique values for filter dropdowns
  const uniqueRoomTypes = [...new Set(rooms.map(room => room.roomType))];
  const uniqueBedTypes = [...new Set(rooms.map(room => room.bedType))];
  const uniqueFloorLevels = [...new Set(rooms.map(room => room.floorLevel))];

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">Available Rooms</h1>
      
      {/* Filter toggle button with active filter count */}
      <div className="mb-4">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-between w-full md:w-auto px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="font-medium">Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {/* Filters section */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Filter Rooms</h2>
            {/* Clear all filters button */}
            {activeFilterCount > 0 && (
              <button 
                onClick={clearAllFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all
              </button>
            )}
          </div>
          
          {/* Mobile-friendly stacked layout */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
              <select 
                name="roomType" 
                value={filters.roomType} 
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Any Type</option>
                {uniqueRoomTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bed Type</label>
              <select 
                name="bedType" 
                value={filters.bedType} 
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Any Bed</option>
                {uniqueBedTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Floor Level</label>
              <select 
                name="floorLevel" 
                value={filters.floorLevel} 
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Any Floor</option>
                {uniqueFloorLevels.map(floor => (
                  <option key={floor} value={floor}>{floor}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <input 
                  type="number" 
                  name="minPrice" 
                  value={filters.minPrice} 
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Min $"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <input 
                  type="number" 
                  name="maxPrice" 
                  value={filters.maxPrice} 
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Max $"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Active filters display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.roomType && (
            <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
              <span>Room: {filters.roomType}</span>
              <button 
                onClick={() => setFilters(prev => ({ ...prev, roomType: '' }))}
                className="ml-1 text-blue-800 hover:text-blue-600"
              >
                ×
              </button>
            </div>
          )}
          {filters.bedType && (
            <div className="flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
              <span>Bed: {filters.bedType}</span>
              <button 
                onClick={() => setFilters(prev => ({ ...prev, bedType: '' }))}
                className="ml-1 text-purple-800 hover:text-purple-600"
              >
                ×
              </button>
            </div>
          )}
          {filters.floorLevel && (
            <div className="flex items-center bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm">
              <span>Floor: {filters.floorLevel}</span>
              <button 
                onClick={() => setFilters(prev => ({ ...prev, floorLevel: '' }))}
                className="ml-1 text-amber-800 hover:text-amber-600"
              >
                ×
              </button>
            </div>
          )}
          {filters.minPrice && (
            <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
              <span>Min: ${filters.minPrice}</span>
              <button 
                onClick={() => setFilters(prev => ({ ...prev, minPrice: '' }))}
                className="ml-1 text-green-800 hover:text-green-600"
              >
                ×
              </button>
            </div>
          )}
          {filters.maxPrice && (
            <div className="flex items-center bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
              <span>Max: ${filters.maxPrice}</span>
              <button 
                onClick={() => setFilters(prev => ({ ...prev, maxPrice: '' }))}
                className="ml-1 text-red-800 hover:text-red-600"
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Results counter */}
      <div className="mb-4 text-sm text-gray-500">
        Showing {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'}
      </div>
      
      {/* Room cards with mobile-friendly grid */}
      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredRooms.map(room => 
            <RoomCard key={room._id} room={room} onBook={handleBookingOpen} />
          )}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No rooms match your current filters.</p>
          <button 
            onClick={clearAllFilters}
            className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
      
      {/* Booking Modal */}
      <BookingModal 
        show={showBookingModal}
        onClose={handleBookingClose}
        room={selectedRoom || {}}
        bookingData={bookingData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmitBooking}
        cost={bookingCost}
        isLoading={isLoading}
        error={error}
        success={bookingSuccess}
      />
    </div>
  );
};

export default HomePage;