const RoomTable = ({ rooms, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bed Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Floor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rooms.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                  No rooms found. Add a new room to get started.
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{room.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {room.images.length} {room.images.length === 1 ? 'image' : 'images'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{room.roomType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{room.bedType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{room.floorLevel}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${room.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${room.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {room.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(room)}
                        className="text-indigo-600 hover:text-indigo-900 px-2 py-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(room._id)}
                        className="text-red-600 hover:text-red-900 px-2 py-1"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Mobile-friendly card view that appears on small screens */}
      <div className="sm:hidden">
        {rooms.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No rooms found. Add a new room to get started.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {rooms.map((room) => (
              <div key={room._id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="text-sm font-medium text-gray-900">{room.name}</div>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${room.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {room.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {room.roomType}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {room.bedType}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {room.floorLevel}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-500 line-clamp-2">{room.description}</div>
                <div className="mt-2 text-sm text-gray-900 font-medium">${room.price}</div>
                <div className="mt-2 text-xs text-gray-500">
                  <div>{room.images.length} {room.images.length === 1 ? 'image' : 'images'}</div>
                  <div className="mt-1">
                    {room.amenities && room.amenities.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.map((amenity, index) => (
                          <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    ) : (
                      "No amenities listed"
                    )}
                  </div>
                </div>
                <div className="mt-3 flex space-x-3">
                  <button
                    onClick={() => onEdit(room)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(room._id)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomTable;