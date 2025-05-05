import { useState } from 'react'; 
import { Calendar, User, Users, MessageSquare, Clock, CreditCard, ChevronDown, ChevronUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const BookingCard = ({ booking, onApprove, onReject, onCancel }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Calculate duration of stay in days
  const checkIn = new Date(booking.checkInDate);
  const checkOut = new Date(booking.checkOutDate);
  const durationInDays = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  
  // Format dates with day of week
  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };
  
  // Calculate time remaining for pending bookings
  const getTimeAgo = (date) => {
    const now = new Date();
    const createdDate = new Date(date);
    const diffInHours = Math.floor((now - createdDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  };
  
  // Get appropriate status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };
  
  // Get appropriate status action display
  const getStatusAction = () => {
    switch(booking.status) {
      case 'pending':
        return (
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => onApprove(booking._id)}
              className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </button>
            <button
              onClick={() => onReject(booking._id)}
              className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </button>
          </div>
        );
      case 'confirmed':
        return (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onCancel(booking._id)}
              className="flex items-center bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Cancel Booking
            </button>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Check if pending and needs attention (older than 24 hours)
  const needsAttention = booking.status === 'pending' && 
    ((new Date() - new Date(booking.createdAt)) / (1000 * 60 * 60)) > 24;
  
  return (
    <div className={`border rounded-lg shadow-sm bg-white overflow-hidden transition-all duration-200 ${
      needsAttention ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
    } ${booking.status === 'confirmed' ? 'border-l-4 border-l-green-500' : 
        booking.status === 'rejected' ? 'border-l-4 border-l-red-500' :
        booking.status === 'cancelled' ? 'border-l-4 border-l-gray-500' :
        booking.status === 'pending' ? 'border-l-4 border-l-yellow-500' : ''
    }`}>
      {/* Card Header */}
      <div className="flex justify-between items-start p-4 border-b border-gray-100">
        <div className="flex items-start">
          <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{booking.room?.name || 'Unknown Room'}</h3>
            <div className="flex items-center mt-1 text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-sm">
                Booked {getTimeAgo(booking.createdAt)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center">
            <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {getStatusIcon(booking.status)}
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
          
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            {expanded ? 
              <ChevronUp className="w-5 h-5 text-gray-500" /> : 
              <ChevronDown className="w-5 h-5 text-gray-500" />
            }
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="p-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column */}
          <div className="flex-1">
            {/* Date Range Box */}
            <div className="flex items-center mb-3 bg-blue-50 p-3 rounded-lg">
              <div className="flex-1">
                <div className="text-xs text-blue-600 uppercase font-semibold mb-1">Check-in</div>
                <div className="font-medium">{formatDate(booking.checkInDate)}</div>
                <div className="text-xs text-gray-500">From 2:00 PM</div>
              </div>
              
              <div className="text-gray-400 mx-2 flex flex-col items-center">
                <div className="text-xs text-gray-500 mb-1">{durationInDays} night{durationInDays !== 1 ? 's' : ''}</div>
                <div className="w-10 h-px bg-gray-300"></div>
              </div>
              
              <div className="flex-1">
                <div className="text-xs text-blue-600 uppercase font-semibold mb-1">Check-out</div>
                <div className="font-medium">{formatDate(booking.checkOutDate)}</div>
                <div className="text-xs text-gray-500">By 11:00 AM</div>
              </div>
            </div>
            
            {/* Guest Info */}
            <div className="flex items-start mb-3">
              <User className="w-4 h-4 text-gray-500 mt-1 mr-2" />
              <div>
                <div className="text-sm font-medium">{booking.user?.name || booking.guestEmail}</div>
                <div className="text-sm text-gray-500">{booking.user?.email || booking.guestEmail}</div>
              </div>
            </div>
            
            {/* Guests Count */}
            <div className="flex items-start mb-3">
              <Users className="w-4 h-4 text-gray-500 mt-1 mr-2" />
              <div>
                <div className="text-sm">{booking.guests} Guest{booking.guests !== 1 ? 's' : ''}</div>
              </div>
            </div>
            
            {/* Price */}
            <div className="flex items-start">
              <CreditCard className="w-4 h-4 text-gray-500 mt-1 mr-2" />
              <div>
                <div className="text-sm font-medium">${booking.totalPrice || booking.totalCost}</div>
                <div className="text-xs text-gray-500">Total price</div>
              </div>
            </div>
          </div>
          
          {/* Right Column - always visible */}
          <div className="md:w-1/3">
            {needsAttention && (
              <div className="bg-yellow-100 border border-yellow-200 text-yellow-800 p-3 rounded-lg mb-3 text-sm">
                <div className="font-medium">Needs attention</div>
                <div className="text-xs">This booking has been pending for over 24 hours</div>
              </div>
            )}
            
            {/* Special Requests - Collapsed by default */}
            {(booking.specialRequests && booking.specialRequests !== 'None') && (
              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <div className="flex items-start">
                  <MessageSquare className="w-4 h-4 text-gray-500 mt-1 mr-2" />
                  <div>
                    <div className="text-sm font-medium mb-1">Special Requests</div>
                    <div className="text-sm text-gray-600">
                      {expanded || booking.specialRequests.length < 60 
                        ? booking.specialRequests 
                        : `${booking.specialRequests.substring(0, 60)}...`}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Status Actions */}
            {getStatusAction()}
          </div>
        </div>
      </div>
      
      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Booking Details</h4>
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="text-gray-500 pr-4 py-1">Booking ID:</td>
                    <td className="font-mono text-xs">{booking._id.substring(booking._id.length - 8)}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-500 pr-4 py-1">Created:</td>
                    <td>{new Date(booking.createdAt).toLocaleString()}</td>
                  </tr>
                  {booking.updatedAt && booking.updatedAt !== booking.createdAt && (
                    <tr>
                      <td className="text-gray-500 pr-4 py-1">Last Update:</td>
                      <td>{new Date(booking.updatedAt).toLocaleString()}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-2">Payment Information</h4>
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="text-gray-500 pr-4 py-1">Price:</td>
                    <td>${booking.totalPrice || booking.totalCost}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-500 pr-4 py-1">Payment Status:</td>
                    <td>
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                        Paid
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard;