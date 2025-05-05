const BookingFilters = ({ filter, setFilter }) => {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Filter Bookings:</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter('confirmed')}
            className={`px-3 py-1 rounded ${filter === 'confirmed' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            Confirmed
          </button>
          <button 
            onClick={() => setFilter('rejected')}
            className={`px-3 py-1 rounded ${filter === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          >
            Rejected
          </button>
          <button 
            onClick={() => setFilter('cancelled')}
            className={`px-3 py-1 rounded ${filter === 'cancelled' ? 'bg-gray-600 text-white' : 'bg-gray-200'}`}
          >
            Cancelled
          </button>
        </div>
      </div>
    );
  };
  
  export default BookingFilters;




