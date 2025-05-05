// import { useState, useEffect, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';


// const BookingForm = () => {
//   const [rooms, setRooms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [formData, setFormData] = useState({
//     roomId: '',
//     checkInDate: '',
//     checkOutDate: ''
//   });
//   const [submitStatus, setSubmitStatus] = useState({
//     loading: false,
//     error: null,
//     success: false
//   });

//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   // Redirect if not logged in
//   useEffect(() => {
//     if (!user) {
//       navigate('/login');
//     }
//   }, [user, navigate]);

//   // Fetch available rooms
//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch('https://room-booking-server-j6su.onrender.com/api/rooms', {
//           headers: {
//             Authorization: `Bearer ${user?.token}`
//           }
//         });
        
//         if (!res.ok) {
//           throw new Error('Failed to fetch rooms');
//         }
        
//         const data = await res.json();
//         setRooms(data);
        
//         // Set default roomId if rooms are available
//         if (data.length > 0) {
//           setFormData(prev => ({ ...prev, roomId: data[0]._id }));
//         }
        
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching rooms:', err);
//         setError('Failed to load available rooms');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user?.token) {
//       fetchRooms();
//     }
//   }, [user]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitStatus({ loading: true, error: null, success: false });

//     try {
//       const res = await fetch('https://room-booking-server-j6su.onrender.com/api/bookings', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${user.token}`
//         },
//         body: JSON.stringify(formData)
//       });

//       const data = await res.json();
      
//       if (!res.ok) {
//         throw new Error(data.message || 'Failed to create booking');
//       }

//       setSubmitStatus({
//         loading: false,
//         error: null,
//         success: true
//       });
      
//       // Reset form
//       setFormData({
//         roomId: rooms[0]?._id || '',
//         checkInDate: '',
//         checkOutDate: ''
//       });
      
//       // Redirect to my bookings page after a short delay
//       setTimeout(() => {
//         navigate('/my-bookings');
//       }, 1500);
      
//     } catch (err) {
//       console.error('Booking submission error:', err);
//       setSubmitStatus({
//         loading: false,
//         error: err.message,
//         success: false
//       });
//     }
//   };

//   // Set minimum dates
//   const today = new Date().toISOString().split('T')[0];
//   const minCheckOut = formData.checkInDate 
//     ? new Date(new Date(formData.checkInDate).getTime() + 86400000).toISOString().split('T')[0] 
//     : today;

//   if (loading) {
//     return (
//       <div className="p-6 flex justify-center">
//         <p>Loading available rooms...</p>
//       </div>
//     );
//   }

//   return (
//     <>
//     <div className="p-6 max-w-lg mx-auto">
//       <h2 className="text-2xl font-semibold mb-4">Book a Room</h2>
      
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}
      
//       {submitStatus.success && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//           Booking request submitted successfully! Redirecting to My Bookings...
//         </div>
//       )}
      
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-gray-700 mb-1">Select Room</label>
//           <select
//             name="roomId"
//             value={formData.roomId}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border rounded"
//           >
//             {rooms.length > 0 ? (
//               rooms.map(room => (
//                 <option key={room._id} value={room._id}>
//                   {room.name} - ${room.price}/night (Capacity: {room.capacity})
//                 </option>
//               ))
//             ) : (
//               <option value="">No rooms available</option>
//             )}
//           </select>
//         </div>
        
//         <div>
//           <label className="block text-gray-700 mb-1">Check-in Date</label>
//           <input
//             type="date"
//             name="checkInDate"
//             value={formData.checkInDate}
//             onChange={handleChange}
//             min={today}
//             required
//             className="w-full p-2 border rounded"
//           />
//         </div>
        
//         <div>
//           <label className="block text-gray-700 mb-1">Check-out Date</label>
//           <input
//             type="date"
//             name="checkOutDate"
//             value={formData.checkOutDate}
//             onChange={handleChange}
//             min={minCheckOut}
//             required
//             disabled={!formData.checkInDate}
//             className="w-full p-2 border rounded"
//           />
//         </div>
        
//         <button
//           type="submit"
//           disabled={submitStatus.loading || !formData.roomId || !formData.checkInDate || !formData.checkOutDate}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
//         >
//           {submitStatus.loading ? 'Processing...' : 'Request Booking'}
//         </button>
        
//         {submitStatus.error && (
//           <div className="text-red-600 mt-2">
//             {submitStatus.error}
//           </div>
//         )}
//       </form>
//     </div>
//     </>
//   );
// };

// export default BookingForm;