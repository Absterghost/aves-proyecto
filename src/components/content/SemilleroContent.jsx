import React, { useState, useEffect } from 'react';
import { semilleroData as initialSemilleroData } from '../../data/semilleroContent';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function SemilleroContent() {
  const [semilleroItems, setSemilleroItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null); // Item being edited, or null if creating new
  const [form, setForm] = useState({
    title: '',
    description: '',
    subsections: [], // Array of { title: '', description: '' }
    images: [], // This will hold paths (for initial data) or Data URLs (for new files) for display
    filesToUpload: [], // This will hold actual File objects from the input (transient)
    isArchived: false, // Nuevo campo para archivar
  });

  // Cargar datos iniciales
  useEffect(() => {
    setSemilleroItems(initialSemilleroData.map((item, index) => ({
      ...item,
      id: index + 1,
      images: item.images || [],
      subsections: item.subsections || [],
      isArchived: false,
    })));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubsectionChange = (index, e) => {
    const { name, value } = e.target;
    const newSubsections = [...form.subsections];
    newSubsections[index] = { ...newSubsections[index], [name]: value };
    setForm({ ...form, subsections: newSubsections });
  };

  const addSubsection = () => {
    setForm({ ...form, subsections: [...form.subsections, { title: '', description: '' }] });
  };

  const removeSubsection = (index) => {
    const newSubsections = form.subsections.filter((_, i) => i !== index);
    setForm({ ...form, subsections: newSubsections });
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newPreviews = [];

    if (selectedFiles.length === 0) {
      setForm(prevForm => ({ ...prevForm, filesToUpload: [], images: [] }));
      return;
    }

    let filesRead = 0;
    selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        filesRead++;
        if (filesRead === selectedFiles.length) {
          setForm(prevForm => ({
            ...prevForm,
            filesToUpload: selectedFiles, // Store File objects (transient)
            images: newPreviews // Store Data URLs for display and persistence
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = { ...form };

    // Eliminar la propiedad filesToUpload antes de guardar en semilleroItems
    // ya que contiene objetos File que no son serializables para localStorage.
    delete newItem.filesToUpload;

    if (editingItem) {
      setSemilleroItems(semilleroItems.map(item =>
        item.id === editingItem.id ? { ...newItem, id: editingItem.id } : item
      ));
    } else {
      setSemilleroItems([...semilleroItems, { ...newItem, id: semilleroItems.length ? Math.max(...semilleroItems.map(item => item.id)) + 1 : 1 }]);
    }
    setEditingItem(null);
    setForm({ title: '', description: '', subsections: [], images: [], filesToUpload: [], isArchived: false });
    e.target.reset(); // Reset form fields, including file input
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setForm({
      ...item,
      filesToUpload: [], // No files to upload initially when editing
      images: item.images || [], // Use existing image paths/Data URLs for display
    });
  };

  const handleArchiveToggle = (id) => {
    setSemilleroItems(semilleroItems.map(item =>
      item.id === id ? { ...item, isArchived: !item.isArchived } : item
    ));
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setForm({ title: '', description: '', subsections: [], images: [], filesToUpload: [], isArchived: false });
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-emerald-300 mb-6">Gestión de Contenido de Semillero</h3>

      {/* Formulario de Creación/Edición */}
      <div className="mb-8 p-6 bg-gray-700 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-4">
          {editingItem ? 'Editar Elemento' : 'Agregar Nuevo Elemento'}
        </h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">Título</label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
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
              rows="4"
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
              required
            ></textarea>
          </div>

          {/* Subsecciones */}
          <div className="border border-gray-600 p-4 rounded-md">
            <h5 className="text-md font-semibold text-gray-200 mb-3">Subsecciones</h5>
            {form.subsections.map((sub, index) => (
              <div key={index} className="flex space-x-2 mb-3">
                <input
                  type="text"
                  name="title"
                  placeholder="Título de subsección"
                  value={sub.title}
                  onChange={(e) => handleSubsectionChange(index, e)}
                  className="flex-1 p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <textarea
                  name="description"
                  placeholder="Descripción de subsección"
                  value={sub.description}
                  onChange={(e) => handleSubsectionChange(index, e)}
                  rows="1"
                  className="flex-1 p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
                ></textarea>
                <button
                  type="button"
                  onClick={() => removeSubsection(index)}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSubsection}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Añadir Subsección
            </button>
          </div>

          {/* Imágenes */}
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-300">Seleccionar Imágenes</label>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-emerald-50 file:text-emerald-700
                hover:file:bg-emerald-100"
            />
            {form.filesToUpload.length > 0 && (
              <p className="text-sm text-gray-400 mt-2">Archivos seleccionados: {form.filesToUpload.map(f => f.name).join(', ')}</p>
            )}
          </div>

          {/* Carrusel de Previsualización de Imágenes */}
          {form.images.length > 0 && (
            <div className="mt-4">
              <h5 className="text-md font-semibold text-gray-200 mb-2">Previsualización de Imágenes</h5>
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
                className="w-full h-48"
              >
                {form.images.map((imageSrc, index) => (
                  <SwiperSlide key={index} className="flex items-center justify-center bg-gray-900 rounded-md overflow-hidden">
                    <img src={imageSrc} alt={`Preview ${index}`} className="object-cover w-full h-full" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              {editingItem ? 'Guardar Cambios' : 'Agregar Elemento'}
            </button>
            {editingItem && (
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

      {/* Listado de Elementos */}
      <div className="mt-8">
        <h4 className="text-lg font-semibold text-white mb-4">Elementos Existentes</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Título</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Descripción</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Imágenes</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {semilleroItems.map((item) => (
                <tr key={item.id} className={item.isArchived ? 'opacity-50 bg-gray-900' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{item.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.description.substring(0, 50)}...</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {item.images && item.images.length > 0
                      ? `${item.images.length} archivo(s)`
                      : 'Ninguno'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {item.isArchived ? 'Archivado' : 'Activo'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-indigo-400 hover:text-indigo-600 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleArchiveToggle(item.id)}
                      className={item.isArchived ? 'text-green-400 hover:text-green-600' : 'text-red-400 hover:text-red-600'}
                    >
                      {item.isArchived ? 'Desarchivar' : 'Archivar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}