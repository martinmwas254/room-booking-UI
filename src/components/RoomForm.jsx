// src/components/RoomForm.jsx
import { useState } from 'react';

const RoomForm = ({ onSubmit, initialData = {} }) => {
  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [price, setPrice] = useState(initialData.price || '');
  const [images, setImages] = useState(initialData.images?.join(',') || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const imageArray = images.split(',').map(img => img.trim());
    onSubmit({ name, description, price, images: imageArray });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input type="text" placeholder="Room Name" value={name} onChange={(e) => setName(e.target.value)} className="p-2 border" />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="p-2 border" />
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="p-2 border" />
      <input type="text" placeholder="Image URLs (comma-separated)" value={images} onChange={(e) => setImages(e.target.value)} className="p-2 border" />
      <button type="submit" className="bg-green-600 text-white py-2">Submit</button>
    </form>
  );
};

export default RoomForm;