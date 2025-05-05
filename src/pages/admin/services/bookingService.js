const API_URL = 'https://room-booking-server-j6su.onrender.com/api';

// Fetch all bookings
export const fetchAllBookings = async (token) => {
  try {
    const res = await fetch(`${API_URL}/bookings/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch bookings');
    }
    
    return await res.json();
  } catch (err) {
    throw new Error(err.message || 'Failed to load bookings');
  }
};

// Update booking status
export const updateBookingStatus = async (bookingId, newStatus, token) => {
  let url = ''; 

  // Set the URL based on the newStatus
  if (newStatus === 'confirmed') {
    url = `${API_URL}/bookings/approve/${bookingId}`;
  } else if (newStatus === 'rejected') {
    url = `${API_URL}/bookings/reject/${bookingId}`;
  } else if (newStatus === 'cancelled') {
    url = `${API_URL}/bookings/cancel/${bookingId}`;
  }

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to ${newStatus} booking`);
    }
    
    return await response.json();
  } catch (err) {
    throw new Error(err.message);
  }
};