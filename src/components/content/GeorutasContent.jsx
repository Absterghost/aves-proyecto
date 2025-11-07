import React, { useState, useEffect } from 'react';
import { rutas as initialRutasData, computeLengthKm } from '../../data/rutas';

export default function GeorutasContent() {
  const [rutas, setRutas] = useState([]);
  const [editingRuta, setEditingRuta] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    terreno: '',
    aves: '',
    horario: '',
    coords: '', // String representation: "lat1,lng1;lat2,lng2"
    isArchived: false, // Nuevo campo para archivar
  });

  // Cargar rutas desde localStorage o datos iniciales
  useEffect(() => {
    const storedRutas = localStorage.getItem('georutasData');
    if (storedRutas) {
      try {
        const parsedRutas = JSON.parse(storedRutas);
        setRutas(parsedRutas.map((ruta, index) => ({
          ...ruta,
          id: ruta.id || index + 1,
          coords: Array.isArray(ruta.coords) ? ruta.coords : [],
          isArchived: ruta.isArchived || false,
        })));
      } catch (e) {
        console.error("Error parsing georutasData from localStorage", e);
        setRutas(initialRutasData.map((ruta, index) => ({
          ...ruta,
          id: index + 1,
          coords: ruta.coords || [],
          isArchived: false,
        })));
      }
    } else {
      setRutas(initialRutasData.map((ruta, index) => ({
        ...ruta,
        id: index + 1,
        coords: ruta.coords || [],
        isArchived: false,
      })));
    }
  }, []);

  // Guardar rutas en localStorage cada vez que rutas cambie
  useEffect(() => {
    if (rutas.length > 0) {
      try {
        localStorage.setItem('georutasData', JSON.stringify(rutas));
        console.log("Rutas guardadas en localStorage.");
      } catch (e) {
        console.error("Error guardando georutasData en localStorage. Podría estar lleno.", e);
        alert("Advertencia: No se pudieron guardar las rutas. El almacenamiento local del navegador podría estar lleno.");
      }
    } else if (localStorage.getItem('georutasData')) {
      localStorage.removeItem('georutasData');
      console.log("localStorage de georutasData limpiado.");
    }
  }, [rutas]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let parsedCoords = [];
    try {
      parsedCoords = form.coords.split(';').map(pair => {
        const [lat, lng] = pair.split(',').map(Number);
        if (isNaN(lat) || isNaN(lng)) throw new Error("Coordenadas inválidas");
        return [lat, lng];
      }).filter(pair => pair.length === 2);
    } catch (error) {
      alert("Formato de coordenadas inválido. Usa 'lat1,lng1;lat2,lng2'.");
      return;
    }

    if (parsedCoords.length < 2) {
      alert("Se requieren al menos dos puntos de coordenadas para una ruta.");
      return;
    }

    const km = computeLengthKm(parsedCoords);
    const newRuta = {
      ...form,
      coords: parsedCoords,
      km: km,
      kmText: `${km} km`,
    };

    if (editingRuta) {
      setRutas(rutas.map(ruta =>
        ruta.id === editingRuta.id ? { ...newRuta, id: editingRuta.id } : ruta
      ));
    } else {
      setRutas([...rutas, { ...newRuta, id: rutas.length ? Math.max(...rutas.map(ruta => ruta.id)) + 1 : 1 }]);
    }
    setEditingRuta(null);
    setForm({ nombre: '', terreno: '', aves: '', horario: '', coords: '', isArchived: false });
  };

  const handleEdit = (ruta) => {
    setEditingRuta(ruta);
    setForm({
      ...ruta,
      // Convertir el array de coordenadas a string para el textarea
      coords: ruta.coords.map(pair => pair.join(',')).join(';'),
    });
  };

  const handleArchiveToggle = (id) => {
    setRutas(rutas.map(ruta =>
      ruta.id === id ? { ...ruta, isArchived: !ruta.isArchived } : ruta
    ));
  };

  const handleCancelEdit = () => {
    setEditingRuta(null);
    setForm({ nombre: '', terreno: '', aves: '', horario: '', coords: '', isArchived: false });
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-emerald-300 mb-6">Gestión de Contenido de Georutas</h3>

      {/* Formulario de Creación/Edición */}
      <div className="mb-8 p-6 bg-gray-700 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-4">
          {editingRuta ? 'Editar Ruta' : 'Agregar Nueva Ruta'}
        </h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-300">Nombre de la Ruta</label>
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
            <label htmlFor="terreno" className="block text-sm font-medium text-gray-300">Terreno</label>
            <input
              type="text"
              id="terreno"
              name="terreno"
              value={form.terreno}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <label htmlFor="aves" className="block text-sm font-medium text-gray-300">Aves (separadas por comas)</label>
            <input
              type="text"
              id="aves"
              name="aves"
              value={form.aves}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label htmlFor="horario" className="block text-sm font-medium text-gray-300">Horario</label>
            <input
              type="text"
              id="horario"
              name="horario"
              value={form.horario}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label htmlFor="coords" className="block text-sm font-medium text-gray-300">Coordenadas (lat1,lng1;lat2,lng2;...)</label>
            <textarea
              id="coords"
              name="coords"
              value={form.coords}
              onChange={handleInputChange}
              rows="4"
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
              required
            ></textarea>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              {editingRuta ? 'Guardar Cambios' : 'Agregar Ruta'}
            </button>
            {editingRuta && (
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Terreno</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Distancia (km)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {rutas.map((ruta) => (
                <tr key={ruta.id} className={ruta.isArchived ? 'opacity-50 bg-gray-900' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{ruta.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{ruta.terreno}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{ruta.kmText}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {ruta.isArchived ? 'Archivado' : 'Activo'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(ruta)}
                      className="text-indigo-400 hover:text-indigo-600 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleArchiveToggle(ruta.id)}
                      className={ruta.isArchived ? 'text-green-400 hover:text-green-600' : 'text-red-400 hover:text-red-600'}
                    >
                      {ruta.isArchived ? 'Desarchivar' : 'Archivar'}
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