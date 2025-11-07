import React, { useState, useEffect } from 'react';

export default function RouteManagement() {
  const [routes, setRoutes] = useState([]);
  const [editingRoute, setEditingRoute] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    pointsOfInterest: '', // Simple text field for comma-separated points
    difficulty: 'Fácil', // Dropdown
  });

  // Cargar rutas desde localStorage
  useEffect(() => {
    const storedRoutes = localStorage.getItem('ecologicalRoutes');
    if (storedRoutes) {
      try {
        const parsedRoutes = JSON.parse(storedRoutes);
        setRoutes(parsedRoutes.map(route => ({ ...route, id: route.id || Math.random().toString(36).substr(2, 9) })));
      } catch (e) {
        console.error("Error parsing ecologicalRoutes from localStorage", e);
        setRoutes([]);
      }
    }
  }, []);

  // Guardar rutas en localStorage
  useEffect(() => {
    if (routes.length > 0) {
      try {
        localStorage.setItem('ecologicalRoutes', JSON.stringify(routes));
        console.log("Rutas ecológicas guardadas en localStorage.");
      } catch (e) {
        console.error("Error guardando ecologicalRoutes en localStorage. Podría estar lleno.", e);
        alert("Advertencia: No se pudieron guardar las rutas. El almacenamiento local del navegador podría estar lleno.");
      }
    } else if (localStorage.getItem('ecologicalRoutes')) {
      localStorage.removeItem('ecologicalRoutes');
      console.log("localStorage de ecologicalRoutes limpiado.");
    }
  }, [routes]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRoute) {
      setRoutes(routes.map(route =>
        route.id === editingRoute.id ? { ...form, id: editingRoute.id } : route
      ));
    } else {
      setRoutes([...routes, { ...form, id: Math.random().toString(36).substr(2, 9) }]);
    }
    setEditingRoute(null);
    setForm({ name: '', description: '', pointsOfInterest: '', difficulty: 'Fácil' });
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setForm({ name: route.name, description: route.description, pointsOfInterest: route.pointsOfInterest, difficulty: route.difficulty });
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta ruta?')) {
      setRoutes(routes.filter(route => route.id !== id));
    }
  };

  const handleCancelEdit = () => {
    setEditingRoute(null);
    setForm({ name: '', description: '', pointsOfInterest: '', difficulty: 'Fácil' });
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-emerald-300 mb-6">Gestión de Rutas Ecológicas</h3>

      {/* Formulario de Creación/Edición */}
      <div className="mb-8 p-6 bg-gray-700 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-4">
          {editingRoute ? 'Editar Ruta' : 'Agregar Nueva Ruta'}
        </h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nombre de la Ruta</label>
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
              rows="3"
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="pointsOfInterest" className="block text-sm font-medium text-gray-300">Puntos de Interés (separados por comas)</label>
            <input
              type="text"
              id="pointsOfInterest"
              name="pointsOfInterest"
              value={form.pointsOfInterest}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300">Dificultad</label>
            <select
              id="difficulty"
              name="difficulty"
              value={form.difficulty}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="Fácil">Fácil</option>
              <option value="Moderado">Moderado</option>
              <option value="Difícil">Difícil</option>
            </select>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              {editingRoute ? 'Guardar Cambios' : 'Agregar Ruta'}
            </button>
            {editingRoute && (
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

      {/* Listado de Rutas */}
      <div className="mt-8">
        <h4 className="text-lg font-semibold text-white mb-4">Rutas Existentes</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Descripción</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Dificultad</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {routes.map((route) => (
                <tr key={route.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{route.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{route.description.substring(0, 50)}...</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{route.difficulty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(route)}
                      className="text-indigo-400 hover:text-indigo-600 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(route.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      Eliminar
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