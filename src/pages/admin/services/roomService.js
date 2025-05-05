const API_URL = 'https://room-booking-server-j6su.onrender.com/api';

// Fetch all rooms
export const fetchRooms = async (token) => {
  try {
    const response = await fetch(`${API_URL}/rooms`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch rooms');
    }
    
    return await response.json();
  } catch (err) {
    throw new Error(err.message || 'Failed to load rooms');
  }
};

// Create a new room
export const createRoom = async (roomData, token) => {
  try {
    const response = await fetch(`${API_URL}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(roomData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create room');
    }
    
    return await response.json();
  } catch (err) {
    throw new Error(err.message);
  }
};

// Update an existing room
export const updateRoom = async (roomId, roomData, token) => {
  try {
    const response = await fetch(`${API_URL}/rooms/${roomId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(roomData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update room');
    }
    
    return await response.json();
  } catch (err) {
    throw new Error(err.message);
  }
};

// Delete a room
export const deleteRoom = async (roomId, token) => {
  try {
    const response = await fetch(`${API_URL}/rooms/${roomId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete room');
    }
    
    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};