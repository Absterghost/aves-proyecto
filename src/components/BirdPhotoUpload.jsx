import React, { useState, useEffect } from 'react';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function BirdPhotoUpload() {
  const [photos, setPhotos] = useState([]);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    imageFile: null, // Stores the File object
    imageUrl: '', // Stores Data URL for preview or actual URL from backend
  });

  // Cargar fotos desde localStorage
  useEffect(() => {
    const storedPhotos = localStorage.getItem('birdPhotos');
    if (storedPhotos) {
      try {
        const parsedPhotos = JSON.parse(storedPhotos);
        setPhotos(parsedPhotos.map(photo => ({ ...photo, id: photo.id || Math.random().toString(36).substr(2, 9) })));
      } catch (e) {
        console.error("Error parsing birdPhotos from localStorage", e);
        setPhotos([]);
      }
    }
  }, []);

  // Guardar fotos en localStorage
  useEffect(() => {
    if (photos.length > 0) {
      try {
        localStorage.setItem('birdPhotos', JSON.stringify(photos));
        console.log("Fotos de aves guardadas en localStorage.");
      } catch (e) {
        console.error("Error guardando birdPhotos en localStorage. Podría estar lleno.", e);
        alert("Advertencia: No se pudieron guardar las fotos. El almacenamiento local del navegador podría estar lleno.");
      }
    } else if (localStorage.getItem('birdPhotos')) {
      localStorage.removeItem('birdPhotos');
      console.log("localStorage de birdPhotos limpiado.");
    }
  }, [photos]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, imageFile: file, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      setForm({ ...form, imageFile: null, imageUrl: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.imageUrl) {
      alert("Por favor, selecciona una imagen.");
      return;
    }

    const newPhoto = { ...form };
    delete newPhoto.imageFile; // Don't store File object in state/localStorage

    if (editingPhoto) {
      setPhotos(photos.map(photo =>
        photo.id === editingPhoto.id ? { ...newPhoto, id: editingPhoto.id } : photo
      ));
    } else {
      setPhotos([...photos, { ...newPhoto, id: Math.random().toString(36).substr(2, 9) }]);
    }
    setEditingPhoto(null);
    setForm({ name: '', description: '', imageFile: null, imageUrl: '' });
    e.target.reset();
  };

  const handleEdit = (photo) => {
    setEditingPhoto(photo);
    setForm({ name: photo.name, description: photo.description, imageFile: null, imageUrl: photo.imageUrl });
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta foto?')) {
      setPhotos(photos.filter(photo => photo.id !== id));
    }
  };

  const handleCancelEdit = () => {
    setEditingPhoto(null);
    setForm({ name: '', description: '', imageFile: null, imageUrl: '' });
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-emerald-300 mb-6">Subir y Gestionar Fotos de Aves</h3>

      {/* Formulario de Creación/Edición */}
      <div className="mb-8 p-6 bg-gray-700 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-4">
          {editingPhoto ? 'Editar Foto' : 'Agregar Nueva Foto'}
        </h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nombre de la Foto</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              rows="2"
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
            ></textarea>
          </div>
          <div>
            <label htmlFor="imageFile" className="block text-sm font-medium text-gray-300">Archivo de Imagen</label>
            <input
              type="file"
              id="imageFile"
              name="imageFile"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-emerald-50 file:text-emerald-700
                hover:file:bg-emerald-100"
              required={!editingPhoto} // Required only if adding new photo
            />
            {form.imageUrl && (
              <div className="mt-4 w-32 h-32 rounded-lg overflow-hidden border border-gray-600">
                <img src={form.imageUrl} alt="Previsualización" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              {editingPhoto ? 'Guardar Cambios' : 'Agregar Foto'}
            </button>
            {editingPhoto && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Galería de Fotos Existentes */}
      <div className="mt-8">
        <h4 className="text-lg font-semibold text-white mb-4">Galería de Fotos</h4>
        {photos.length === 0 ? (
          <p className="text-gray-400">No hay fotos subidas aún.</p>
        ) : (
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            loop={false}
            spaceBetween={10}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="w-full h-64"
          >
            {photos.map((photo) => (
              <SwiperSlide key={photo.id} className="flex flex-col items-center justify-center bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                <img src={photo.imageUrl} alt={photo.name} className="object-cover w-full h-48" />
                <div className="p-2 text-center w-full">
                  <p className="text-sm font-medium text-white truncate">{photo.name}</p>
                  <div className="flex justify-center mt-1">
                    <button
                      onClick={() => handleEdit(photo)}
                      className="text-indigo-400 hover:text-indigo-600 text-sm mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(photo.id)}
                      className="text-red-400 hover:text-red-600 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}