import { useState, useEffect } from 'react';
import RoomModal from '../components/RoomModal';
import RoomTable from '../components/RoomTable';
import { fetchRooms, deleteRoom } from '../services/roomService';

const RoomsTab = ({ user }) => {
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomsError, setRoomsError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  
  useEffect(() => {
    if (user?.token) {
      loadRooms();
    }
  }, [user]);
  
  const loadRooms = async () => {
    setRoomsLoading(true);
    try {
      const data = await fetchRooms(user.token);
      setRooms(data);
      setRoomsError(null);
    } catch (err) {
      setRoomsError(err.message);
    } finally {
      setRoomsLoading(false);
    }
  };
  
  const openAddModal = () => {
    setIsEditing(false);
    setCurrentRoom(null);
    setShowModal(true);
  };
  
  const openEditModal = (room) => {
    setIsEditing(true);
    setCurrentRoom(room);
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setCurrentRoom(null);
  };
  
  const handleRoomSaved = () => {
    loadRooms();
    closeModal();
  };
  
  const handleDelete = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }
    
    try {
      await deleteRoom(roomId, user.token);
      loadRooms();
    } catch (err) {
      setRoomsError(err.message);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Room Management</h2>
        <button 
          onClick={openAddModal}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Add New Room
        </button>
      </div>
      
      {roomsLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading rooms...</div>
        </div>
      ) : roomsError ? (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          Error: {roomsError}
        </div>
      ) : (
        <RoomTable 
          rooms={rooms} 
          onEdit={openEditModal} 
          onDelete={handleDelete} 
        />
      )}
      
      {showModal && (
        <RoomModal
          isOpen={showModal}
          onClose={closeModal}
          onSave={handleRoomSaved}
          isEditing={isEditing}
          room={currentRoom}
          userToken={user.token}
        />
      )}
    </div>
  );
};

export default RoomsTab;