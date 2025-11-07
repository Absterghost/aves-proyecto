import React, { useState, useEffect } from 'react';

const SemilleroFormModal = ({ isOpen, onClose, onSave, initialData, itemType }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setImages(initialData.images || []);
      setCurrentImageIndex(0);
      setNewImages([]);
    } else {
      setTitle('');
      setDescription('');
      setImages([]);
      setCurrentImageIndex(0);
      setNewImages([]);
    }
  }, [initialData, isOpen]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(newlyLoadedImages => {
      setNewImages(prev => [...prev, ...newlyLoadedImages]);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const itemData = {
      title,
      description,
      images: [...images, ...newImages],
    };
    onSave(itemData, itemType);
    onClose();
  };

  const allImages = [...images, ...newImages];

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + allImages.length) % allImages.length);
  };

  if (!isOpen) return null;

  const currentImage = allImages.length > 0 ? allImages[currentImageIndex] : '';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md flex flex-col max-h-[90vh]">
        <h2 className="text-2xl font-bold text-white mb-4 flex-shrink-0">{initialData ? 'Editar' : 'Agregar'} {itemType === 'eventos_investigacion' ? 'Evento' : 'Salida de Campo'}</h2>
        <div className="overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">Título</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">Descripción</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="img" className="block text-sm font-medium text-gray-300">Imágenes</label>
              <input
                type="file"
                id="img"
                multiple
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                accept="image/*"
              />
              {allImages.length > 0 && (
                <div className="relative mt-4">
                  <img src={currentImage} alt={`Preview ${currentImageIndex + 1}`} className="w-full h-auto rounded-lg"/>
                  {allImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevImage}
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                      >
                        &#10094;
                      </button>
                      <button
                        type="button"
                        onClick={handleNextImage}
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                      >
                        &#10095;
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SemilleroFormModal;
