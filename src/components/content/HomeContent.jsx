import React, { useState, useEffect } from 'react';
import { homeContent as initialHomeContent } from '../../data/homeContent';
import * as LucideIcons from 'lucide-react'; // Importar todos los iconos de Lucide

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Mapeo de nombres de iconos a componentes de Lucide
const iconOptions = Object.keys(LucideIcons).filter(name => name[0] === name[0].toUpperCase());

export default function HomeContent() {
  const [homeContentData, setHomeContentData] = useState(initialHomeContent);
  const [form, setForm] = useState({
    heroTitle: '',
    heroDescription: '',
    welcomeTitle: '',
    welcomeDescription: '',
    welcomeImages: [], // Data URLs or paths for display
    welcomeFilesToUpload: [], // File objects (transient)
    explorerSections: [], // Array of { id, path, label, description, iconName }
    adminSection: { path: '', label: '', description: '', iconName: '', isFeatured: false },
  });
  const [editingExplorerSection, setEditingExplorerSection] = useState(null);

  // Cargar datos desde localStorage o datos iniciales
  useEffect(() => {
    const storedHomeContent = localStorage.getItem('homeContentData');
    if (storedHomeContent) {
      try {
        const parsedContent = JSON.parse(storedHomeContent);
        setHomeContentData(parsedContent);
        setForm({
          heroTitle: parsedContent.heroSection?.title || '',
          heroDescription: parsedContent.heroSection?.description || '',
          welcomeTitle: parsedContent.welcomeSection?.title || '',
          welcomeDescription: parsedContent.welcomeSection?.description || '',
          welcomeImages: parsedContent.welcomeSection?.images || [],
          welcomeFilesToUpload: [],
          explorerSections: parsedContent.explorerSections || [],
          adminSection: parsedContent.adminSection || {},
        });
      } catch (e) {
        console.error("Error parsing homeContentData from localStorage", e);
        // Fallback a datos iniciales
        setHomeContentData(initialHomeContent);
        setForm({
          heroTitle: initialHomeContent.heroSection?.title || '',
          heroDescription: initialHomeContent.heroSection?.description || '',
          welcomeTitle: initialHomeContent.welcomeSection?.title || '',
          welcomeDescription: initialHomeContent.welcomeSection?.description || '',
          welcomeImages: initialHomeContent.welcomeSection?.images || [],
          welcomeFilesToUpload: [],
          explorerSections: initialHomeContent.explorerSections || [],
          adminSection: initialHomeContent.adminSection || {},
        });
      }
    } else {
      // Usar datos iniciales si no hay nada en localStorage
      setHomeContentData(initialHomeContent);
      setForm({
        heroTitle: initialHomeContent.heroSection?.title || '',
        heroDescription: initialHomeContent.heroSection?.description || '',
        welcomeTitle: initialHomeContent.welcomeSection?.title || '',
        welcomeDescription: initialHomeContent.welcomeSection?.description || '',
        welcomeImages: initialHomeContent.welcomeSection?.images || [],
        welcomeFilesToUpload: [],
        explorerSections: initialHomeContent.explorerSections || [],
        adminSection: initialHomeContent.adminSection || {},
      });
    }
  }, []);

  // Guardar datos en localStorage cada vez que homeContentData cambie
  useEffect(() => {
    if (homeContentData) {
      try {
        localStorage.setItem('homeContentData', JSON.stringify(homeContentData));
        console.log("Datos de Home guardados en localStorage.");
      } catch (e) {
        console.error("Error guardando homeContentData en localStorage. Podría estar lleno.", e);
        alert("Advertencia: No se pudieron guardar los datos de Inicio. El almacenamiento local del navegador podría estar lleno.");
      }
    }
  }, [homeContentData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleWelcomeImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newPreviews = [];

    if (selectedFiles.length === 0) {
      setForm(prevForm => ({ ...prevForm, welcomeFilesToUpload: [], welcomeImages: [] }));
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
            welcomeFilesToUpload: selectedFiles,
            welcomeImages: newPreviews
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleExplorerSectionChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      explorerSections: prevForm.explorerSections.map(sec =>
        sec.id === editingExplorerSection.id ? { ...sec, [name]: value } : sec
      )
    }));
  };

  const handleAdminSectionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      adminSection: {
        ...prevForm.adminSection,
        [name]: type === 'checkbox' ? checked : value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedHomeContent = {
      ...homeContentData,
      heroSection: {
        ...homeContentData.heroSection,
        title: form.heroTitle,
        description: form.heroDescription,
      },
      welcomeSection: {
        ...homeContentData.welcomeSection,
        title: form.welcomeTitle,
        description: form.welcomeDescription,
        images: form.welcomeImages, // Data URLs or paths
      },
      explorerSections: form.explorerSections.map(sec => ({
        ...sec,
        icon: sec.iconName ? LucideIcons[sec.iconName] : undefined // Convert iconName string back to component if needed for rendering in Home.jsx
      })),
      adminSection: {
        ...form.adminSection,
        icon: form.adminSection.iconName ? LucideIcons[form.adminSection.iconName] : undefined
      },
    };

    setHomeContentData(updatedHomeContent);
    alert("Contenido de Inicio guardado exitosamente (localmente).");
  };

  const addExplorerSection = () => {
    setForm(prevForm => ({
      ...prevForm,
      explorerSections: [
        ...prevForm.explorerSections,
        { id: Date.now(), path: '', label: '', description: '', iconName: '' }
      ]
    }));
  };

  const editExplorerSection = (section) => {
    setEditingExplorerSection(section);
    // Populate a temporary form for editing this specific section
    // For simplicity, we'll just edit directly in the main form state for now
  };

  const deleteExplorerSection = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta sección?')) {
      setForm(prevForm => ({
        ...prevForm,
        explorerSections: prevForm.explorerSections.filter(sec => sec.id !== id)
      }));
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-emerald-300 mb-6">Gestión de Contenido de Inicio</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sección Hero */}
        <div className="p-6 bg-gray-700 rounded-lg">
          <h4 className="text-lg font-semibold text-white mb-4">Sección Principal (Hero)</h4>
          <div className="space-y-4">
            <div>
              <label htmlFor="heroTitle" className="block text-sm font-medium text-gray-300">Título Principal</label>
              <input
                type="text"
                id="heroTitle"
                name="heroTitle"
                value={form.heroTitle}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label htmlFor="heroDescription" className="block text-sm font-medium text-gray-300">Descripción Principal</label>
              <textarea
                id="heroDescription"
                name="heroDescription"
                value={form.heroDescription}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
                required
              ></textarea>
            </div>
          </div>
        </div>

        {/* Sección de Bienvenida */}
        <div className="p-6 bg-gray-700 rounded-lg">
          <h4 className="text-lg font-semibold text-white mb-4">Sección de Bienvenida</h4>
          <div className="space-y-4">
            <div>
              <label htmlFor="welcomeTitle" className="block text-sm font-medium text-gray-300">Título de Bienvenida</label>
              <input
                type="text"
                id="welcomeTitle"
                name="welcomeTitle"
                value={form.welcomeTitle}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label htmlFor="welcomeDescription" className="block text-sm font-medium text-gray-300">Descripción de Bienvenida</label>
              <textarea
                id="welcomeDescription"
                name="welcomeDescription"
                value={form.welcomeDescription}
                onChange={handleInputChange}
                rows="4"
                className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="welcomeImages" className="block text-sm font-medium text-gray-300">Imágenes de Bienvenida</label>
              <input
                type="file"
                id="welcomeImages"
                name="welcomeImages"
                multiple
                onChange={handleWelcomeImageChange}
                className="mt-1 block w-full text-sm text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-emerald-50 file:text-emerald-700
                  hover:file:bg-emerald-100"
              />
              {form.welcomeFilesToUpload.length > 0 && (
                <p className="text-sm text-gray-400 mt-2">Archivos seleccionados: {form.welcomeFilesToUpload.map(f => f.name).join(', ')}</p>
              )}
            </div>
            {form.welcomeImages.length > 0 && (
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
                  {form.welcomeImages.map((imageSrc, index) => (
                    <SwiperSlide key={index} className="flex items-center justify-center bg-gray-900 rounded-md overflow-hidden">
                      <img src={imageSrc} alt={`Preview ${index}`} className="object-cover w-full h-full" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>
        </div>

        {/* Sección de Explorador */}
        <div className="p-6 bg-gray-700 rounded-lg">
          <h4 className="text-lg font-semibold text-white mb-4">Secciones del Explorador</h4>
          <div className="space-y-4">
            {form.explorerSections.map((section, index) => (
              <div key={section.id || index} className="border border-gray-600 p-4 rounded-md">
                <label className="block text-sm font-medium text-gray-300">Ruta</label>
                <input
                  type="text"
                  name="path"
                  value={section.path}
                  onChange={(e) => {
                    const newSections = [...form.explorerSections];
                    newSections[index].path = e.target.value;
                    setForm({ ...form, explorerSections: newSections });
                  }}
                  className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100"
                />
                <label className="block text-sm font-medium text-gray-300 mt-2">Etiqueta</label>
                <input
                  type="text"
                  name="label"
                  value={section.label}
                  onChange={(e) => {
                    const newSections = [...form.explorerSections];
                    newSections[index].label = e.target.value;
                    setForm({ ...form, explorerSections: newSections });
                  }}
                  className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100"
                />
                <label className="block text-sm font-medium text-gray-300 mt-2">Descripción</label>
                <textarea
                  name="description"
                  value={section.description}
                  onChange={(e) => {
                    const newSections = [...form.explorerSections];
                    newSections[index].description = e.target.value;
                    setForm({ ...form, explorerSections: newSections });
                  }}
                  rows="2"
                  className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100"
                ></textarea>
                <label className="block text-sm font-medium text-gray-300 mt-2">Icono</label>
                <select
                  name="iconName"
                  value={section.iconName || ''}
                  onChange={(e) => {
                    const newSections = [...form.explorerSections];
                    newSections[index].iconName = e.target.value;
                    setForm({ ...form, explorerSections: newSections });
                  }}
                  className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Seleccionar Icono</option>
                  {iconOptions.map(iconName => (
                    <option key={iconName} value={iconName}>{iconName}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => deleteExplorerSection(section.id || index)}
                  className="mt-4 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Eliminar Sección
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addExplorerSection}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Añadir Sección del Explorador
            </button>
          </div>
        </div>

        {/* Sección de Admin */}
        <div className="p-6 bg-gray-700 rounded-lg">
          <h4 className="text-lg font-semibold text-white mb-4">Sección de Admin</h4>
          <div className="space-y-4">
            <div>
              <label htmlFor="adminPath" className="block text-sm font-medium text-gray-300">Ruta Admin</label>
              <input
                type="text"
                id="adminPath"
                name="path"
                value={form.adminSection.path}
                onChange={handleAdminSectionChange}
                className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100"
              />
            </div>
            <div>
              <label htmlFor="adminLabel" className="block text-sm font-medium text-gray-300">Etiqueta Admin</label>
              <input
                type="text"
                id="adminLabel"
                name="label"
                value={form.adminSection.label}
                onChange={handleAdminSectionChange}
                className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100"
              />
            </div>
            <div>
              <label htmlFor="adminDescription" className="block text-sm font-medium text-gray-300">Descripción Admin</label>
              <textarea
                id="adminDescription"
                name="description"
                value={form.adminSection.description}
                onChange={handleAdminSectionChange}
                rows="2"
                className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100"
              ></textarea>
            </div>
            <div>
              <label htmlFor="adminIcon" className="block text-sm font-medium text-gray-300">Icono Admin</label>
              <select
                id="adminIcon"
                name="iconName"
                value={form.adminSection.iconName || ''}
                onChange={handleAdminSectionChange}
                className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Seleccionar Icono</option>
                {iconOptions.map(iconName => (
                  <option key={iconName} value={iconName}>{iconName}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="adminFeatured" className="inline-flex items-center">
                <input
                  type="checkbox"
                  id="adminFeatured"
                  name="isFeatured"
                  checked={form.adminSection.isFeatured}
                  onChange={handleAdminSectionChange}
                  className="form-checkbox h-5 w-5 text-emerald-600"
                />
                <span className="ml-2 text-gray-300">Destacado</span>
              </label>
            </div>
          </div>
        </div>

        {/* Botón de Guardar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-md hover:bg-emerald-700 transition-colors"
          >
            Guardar Contenido de Inicio
          </button>
        </div>
      </form>
    </div>
  );
}