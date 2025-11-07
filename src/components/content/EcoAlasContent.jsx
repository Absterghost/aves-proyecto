import React, { useState, useEffect } from 'react';
import { familias as initialFamiliasData } from '../../data/familias';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function EcoAlasContent() {
  const [familias, setFamilias] = useState([]);
  const [editingFamilia, setEditingFamilia] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    ubicacion: '',
    datosAdicionales: '',
    habitatGeneral: '',
    estadoConservacionGeneral: '',
    dietaGeneral: '',
    logo: '', // Data URL or path for display
    logoFile: null, // File object (transient)
    isArchived: false, // Nuevo campo para archivar
  });

  // Cargar datos desde localStorage o datos iniciales
  useEffect(() => {
    const storedFamilias = localStorage.getItem('ecoAlasFamilias');
    if (storedFamilias) {
      try {
        const parsedFamilias = JSON.parse(storedFamilias);
        setFamilias(parsedFamilias.map((item, index) => ({
          ...item,
          id: item.id || index + 1,
          habitatGeneral: Array.isArray(item.habitatGeneral) ? item.habitatGeneral : (item.habitatGeneral ? item.habitatGeneral.split(',').map(h => h.trim()) : ''),
          isArchived: item.isArchived || false,
        })));
      } catch (e) {
        console.error("Error parsing ecoAlasFamilias from localStorage", e);
        setFamilias(initialFamiliasData.map((item, index) => ({
          ...item,
          id: index + 1,
          habitatGeneral: Array.isArray(item.habitatGeneral) ? item.habitatGeneral.join(', ') : item.habitatGeneral || '',
          isArchived: false,
        })));
      }
    } else {
      setFamilias(initialFamiliasData.map((item, index) => ({
        ...item,
        id: index + 1,
        habitatGeneral: Array.isArray(item.habitatGeneral) ? item.habitatGeneral.join(', ') : item.habitatGeneral || '',
        isArchived: false,
      })));
    }
  }, []);

  // Guardar datos en localStorage cada vez que familias cambie
  useEffect(() => {
    if (familias.length > 0) {
      try {
        localStorage.setItem('ecoAlasFamilias', JSON.stringify(familias));
        console.log("Familias de EcoAlas guardadas en localStorage.");
      } catch (e) {
        console.error("Error guardando ecoAlasFamilias en localStorage. Podría estar lleno.", e);
        alert("Advertencia: No se pudieron guardar las familias. El almacenamiento local del navegador podría estar lleno.");
      }
    } else if (localStorage.getItem('ecoAlasFamilias')) {
      localStorage.removeItem('ecoAlasFamilias');
      console.log("localStorage de ecoAlasFamilias limpiado.");
    }
  }, [familias]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, logoFile: file, logo: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      setForm({ ...form, logoFile: null, logo: '', });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newFamilia = { ...form };

    // Convert habitatGeneral string back to array for consistency if needed later
    newFamilia.habitatGeneral = newFamilia.habitatGeneral.split(',').map(h => h.trim()).filter(h => h);

    delete newFamilia.logoFile; // Don't store File object

    if (editingFamilia) {
      setFamilias(familias.map(item =>
        item.id === editingFamilia.id ? { ...newFamilia, id: editingFamilia.id } : item
      ));
    } else {
      setFamilias([...familias, { ...newFamilia, id: familias.length ? Math.max(...familias.map(item => item.id)) + 1 : 1 }]);
    }
    setEditingFamilia(null);
    setForm({ nombre: '', descripcion: '', ubicacion: '', datosAdicionales: '', habitatGeneral: '', estadoConservacionGeneral: '', dietaGeneral: '', logo: '', logoFile: null, isArchived: false });
    e.target.reset();
  };

  const handleEdit = (familia) => {
    setEditingFamilia(familia);
    setForm({
      ...familia,
      habitatGeneral: Array.isArray(familia.habitatGeneral) ? familia.habitatGeneral.join(', ') : familia.habitatGeneral || '',
      logoFile: null, // No file object when editing
    });
  };

  const handleArchiveToggle = (id) => {
    setFamilias(familias.map(item =>
      item.id === id ? { ...item, isArchived: !item.isArchived } : item
    ));
  };

  const handleCancelEdit = () => {
    setEditingFamilia(null);
    setForm({ nombre: '', descripcion: '', ubicacion: '', datosAdicionales: '', habitatGeneral: '', estadoConservacionGeneral: '', dietaGeneral: '', logo: '', logoFile: null, isArchived: false });
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-emerald-300 mb-6">Gestión de Contenido de EcoAlas</h3>

      {/* Formulario de Creación/Edición */}
      <div className="mb-8 p-6 bg-gray-700 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-4">
          {editingFamilia ? 'Editar Familia' : 'Agregar Nueva Familia'}
        </h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-300">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-300">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={form.descripcion}
              onChange={handleInputChange}
              rows="3"
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-300">Ubicación</label>
            <textarea
              id="ubicacion"
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleInputChange}
              rows="2"
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
            ></textarea>
          </div>
          <div>
            <label htmlFor="datosAdicionales" className="block text-sm font-medium text-gray-300">Datos Adicionales</label>
            <textarea
              id="datosAdicionales"
              name="datosAdicionales"
              value={form.datosAdicionales}
              onChange={handleInputChange}
              rows="2"
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
            ></textarea>
          </div>
          <div>
            <label htmlFor="habitatGeneral" className="block text-sm font-medium text-gray-300">Hábitat General (separado por comas)</label>
            <input
              type="text"
              id="habitatGeneral"
              name="habitatGeneral"
              value={form.habitatGeneral}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label htmlFor="estadoConservacionGeneral" className="block text-sm font-medium text-gray-300">Estado de Conservación</label>
            <input
              type="text"
              id="estadoConservacionGeneral"
              name="estadoConservacionGeneral"
              value={form.estadoConservacionGeneral}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label htmlFor="dietaGeneral" className="block text-sm font-medium text-gray-300">Dieta General</label>
            <input
              type="text"
              id="dietaGeneral"
              name="dietaGeneral"
              value={form.dietaGeneral}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-300">Logo de la Familia</label>
            <input
              type="file"
              id="logo"
              name="logo"
              accept="image/*"
              onChange={handleLogoChange}
              className="mt-1 block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-emerald-50 file:text-emerald-700
                hover:file:bg-emerald-100"
            />
            {form.logo && (
              <div className="mt-4 w-32 h-32 rounded-lg overflow-hidden border border-gray-600">
                <img src={form.logo} alt="Previsualización del Logo" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              {editingFamilia ? 'Guardar Cambios' : 'Agregar Familia'}
            </button>
            {editingFamilia && (
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

      {/* Listado de Familias */}
      <div className="mt-8">
        <h4 className="text-lg font-semibold text-white mb-4">Familias Existentes</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Descripción</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Hábitat</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {familias.map((familia) => (
                <tr key={familia.id} className={familia.isArchived ? 'opacity-50 bg-gray-900' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{familia.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{familia.descripcion.substring(0, 50)}...</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {Array.isArray(familia.habitatGeneral) ? familia.habitatGeneral.join(', ') : familia.habitatGeneral}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {familia.isArchived ? 'Archivado' : 'Activo'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(familia)}
                      className="text-indigo-400 hover:text-indigo-600 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleArchiveToggle(familia.id)}
                      className={familia.isArchived ? 'text-green-400 hover:text-green-600' : 'text-red-400 hover:text-red-600'}
                    >
                      {familia.isArchived ? 'Desarchivar' : 'Archivar'}
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