import { useState } from 'react';
import Swal from 'sweetalert2';

const BookingCard = ({ booking, isAdmin, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate duration of stay
  const calculateDuration = () => {
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCancel = async () => {
    Swal.fire({
      title: 'Cancel Booking?',
      text: 'Are you sure you want to cancel this booking? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        setActiveAction('cancel');
        try {
          const user = JSON.parse(localStorage.getItem('user'));
          
          const res = await fetch(`https://room-booking-server-f5ev.onrender.com/api/bookings/cancel/${booking._id}`, {
            method: 'PUT', 
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          
          if (!res.ok) throw new Error('Failed to cancel booking');
          
          Swal.fire({
            title: 'Cancelled!',
            text: 'Your booking has been cancelled.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          onUpdate();
        } catch (error) {
          console.error('Error cancelling booking:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to cancel booking. Please try again.',
            icon: 'error'
          });
        } finally {
          setIsLoading(false);
          setActiveAction(null);
        }
      }
    });
  };
  
  const handleApprove = async () => {
    Swal.fire({
      title: 'Approve Booking?',
      text: 'Are you sure you want to approve this booking?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        setActiveAction('approve');
        try {
          const user = JSON.parse(localStorage.getItem('user'));
          const res = await fetch(`https://room-booking-server-f5ev.onrender.com/api/bookings/approve/${booking._id}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${user.token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (!res.ok) throw new Error('Failed to approve booking');
          
          Swal.fire({
            title: 'Approved!',
            text: 'The booking has been approved.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          onUpdate();
        } catch (error) {
          console.error('Error approving booking:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to approve booking. Please try again.',
            icon: 'error'
          });
        } finally {
          setIsLoading(false);
          setActiveAction(null);
        }
      }
    });
  };

  const handleReject = async () => {
    // Open a dialog box to ask for rejection reason
    const { value: rejectionReason } = await Swal.fire({
      title: 'Reject Booking',
      input: 'textarea',
      inputLabel: 'Reason for rejection (optional)',
      inputPlaceholder: 'Enter reason why you are rejecting this booking...',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Reject Booking',
      cancelButtonText: 'Cancel'
    });

    if (rejectionReason !== undefined) { // User clicked confirm (with or without entering a reason)
      setIsLoading(true);
      setActiveAction('reject');
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const res = await fetch(`https://room-booking-server-f5ev.onrender.com/api/bookings/reject/${booking._id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rejectionReason }),
        });
        
        if (!res.ok) throw new Error('Failed to reject booking');
        
        Swal.fire({
          title: 'Rejected!',
          text: 'The booking has been rejected.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        onUpdate();
      } catch (error) {
        console.error('Error rejecting booking:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to reject booking',
          icon: 'error'
        });
      } finally {
        setIsLoading(false);
        setActiveAction(null);
      }
    }
  };

  const handleDelete = async () => {
    Swal.fire({
      title: 'Delete Booking?',
      html: 'Are you sure you want to delete this booking?<br><span class="text-red-500 font-semibold">This action cannot be undone!</span>',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        setActiveAction('delete');
        try {
          const user = JSON.parse(localStorage.getItem('user'));
          const res = await fetch(`https://room-booking-server-f5ev.onrender.com/api/bookings/delete/${booking._id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          
          if (!res.ok) throw new Error('Failed to delete booking');
          
          Swal.fire({
            title: 'Deleted!',
            text: 'The booking has been deleted.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          onUpdate();
        } catch (error) {
          console.error('Error deleting booking:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to delete booking. Please try again.',
            icon: 'error'
          });
        } finally {
          setIsLoading(false);
          setActiveAction(null);
        }
      }
    });
  };

  // Helper to determine if the booking is for future dates
  const isFutureBooking = () => {
    const currentDate = new Date();
    const checkInDate = new Date(booking.checkInDate);
    return checkInDate > currentDate;
  };

  // Get status badge color and text
  const getStatusBadge = () => {
    switch(booking.status) {
      case 'confirmed':
        return { 
          bg: 'bg-green-100 border-green-500', 
          text: 'text-green-800', 
          label: 'Confirmed',
          icon: (
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          )
        };
      case 'cancelled':
        return { 
          bg: 'bg-gray-400 border-gray-500', 
          text: 'text-white', 
          label: 'Cancelled',
          icon: (
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          )
        };
      case 'rejected':
        return { 
          bg: 'bg-red-100 border-red-500', 
          text: 'text-red-800', 
          label: 'Rejected',
          icon: (
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          )
        };
      default:
        return { 
          bg: 'bg-yellow-100 border-yellow-500', 
          text: 'text-yellow-800', 
          label: 'Pending',
          icon: (
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          )
        };
    }
  };

  // Determine if booking can be deleted
  const canDeleteBooking = () => {
    // Admins can delete any booking
    if (isAdmin) return true;
    
    // Regular users can delete their future bookings that are not confirmed
    // or any of their cancelled/rejected bookings
    if (booking.status === 'pending' || booking.status === 'cancelled' || booking.status === 'rejected') {
      return true;
    }
    
    // Users can also delete confirmed bookings if they are in the future
    if (booking.status === 'confirmed' && isFutureBooking()) {
      return true;
    }
    
    return false;
  };

  const statusBadge = getStatusBadge();
  const duration = calculateDuration();
  const isUpcoming = isFutureBooking();

  return (
    <div className={`bg-white border rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${isUpcoming ? 'border-blue-200' : 'border-gray-200'}`}>
      {/* Status indicator top bar */}
      <div className={`h-1 w-full ${isUpcoming ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
      
      <div className="p-5">
        {/* Header with room name and status */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h3 className="text-xl font-bold text-gray-800">{booking.room?.name || 'Unknown Room'}</h3>
            {isUpcoming && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                Upcoming
              </span>
            )}
          </div>
          <div className="flex items-center">
            <span className={`flex items-center px-3 py-1 text-sm font-medium ${statusBadge.bg} ${statusBadge.text} border rounded-full`}>
              {statusBadge.icon}
              {statusBadge.label}
            </span>
          </div>
        </div>
        
        {/* Essential booking details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div className="flex items-center text-gray-700">
            <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <div>
              <span className="text-sm text-gray-500">Check-in</span>
              <p className="font-semibold">{formatDate(booking.checkInDate)}</p>
            </div>
          </div>
          
          <div className="flex items-center text-gray-700">
            <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <div>
              <span className="text-sm text-gray-500">Check-out</span>
              <p className="font-semibold">{formatDate(booking.checkOutDate)}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center text-gray-700">
            <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span className="font-medium">{duration} {duration === 1 ? 'night' : 'nights'}</span>
          </div>

          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center focus:outline-none transition-colors"
          >
            {isExpanded ? 'Show less' : 'Details'}
            <svg 
              className={`w-4 h-4 ml-1 transform transition-transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>
        
        {/* Expanded details */}
        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="border-t border-gray-200 pt-4 mb-4 space-y-3">
            <div className="flex items-center text-gray-700">
              <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>{booking.user?.email || 'Unknown User'}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-sm">Booked on: <span className="font-medium">{formatDate(booking.createdAt)}</span></span>
            </div>
            
            {booking.status === 'rejected' && booking.rejectionReason && (
              <div className="flex items-start text-gray-700 bg-red-50 p-3 rounded-md">
                <svg className="h-5 w-5 mr-2 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <span className="font-medium text-red-700">Rejection reason:</span>
                  <p className="text-red-600">{booking.rejectionReason}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          {booking.status === 'pending' && (
            <>
              {isAdmin ? (
                <div className="flex w-full gap-2">
                  <button 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-70 transition-colors flex items-center justify-center gap-1 shadow-sm"
                    onClick={handleApprove}
                    disabled={isLoading}
                  >
                    {isLoading && activeAction === 'approve' ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Approve
                      </>
                    )}
                  </button>
                  <button 
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-70 transition-colors flex items-center justify-center gap-1 shadow-sm"
                    onClick={handleReject}
                    disabled={isLoading}
                  >
                    {isLoading && activeAction === 'reject' ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        Reject
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-70 transition-colors flex items-center justify-center gap-1 shadow-sm"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  {isLoading && activeAction === 'cancel' ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      Cancel Booking
                    </>
                  )}
                </button>
              )}
            </>
          )}
          
          {/* Delete button - redesigned to be more appealing */}
          {canDeleteBooking() && (
            <div className={`${booking.status === 'pending' ? 'w-full' : 'flex-1'}`}>
<button 
  onClick={handleDelete}
  disabled={isLoading}
  title="Delete Booking"
  className="bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-2 transition-colors disabled:opacity-50 flex items-center justify-center shadow-sm"
>
  {isLoading ? (
    <svg className="animate-spin h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  )}
</button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;