import React, { useState, useEffect } from 'react';

export default function EducationalMaterial() {
  const [materials, setMaterials] = useState([]);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    file: null, // Stores the File object
    fileUrl: '', // Stores Data URL for preview or actual URL from backend
    fileName: '', // Stores the name of the file for display
  });

  // Cargar materiales desde localStorage
  useEffect(() => {
    const storedMaterials = localStorage.getItem('educationalMaterials');
    if (storedMaterials) {
      try {
        const parsedMaterials = JSON.parse(storedMaterials);
        setMaterials(parsedMaterials.map(mat => ({ ...mat, id: mat.id || Math.random().toString(36).substr(2, 9) })));
      } catch (e) {
        console.error("Error parsing educationalMaterials from localStorage", e);
        setMaterials([]);
      }
    }
  }, []);

  // Guardar materiales en localStorage
  useEffect(() => {
    if (materials.length > 0) {
      try {
        localStorage.setItem('educationalMaterials', JSON.stringify(materials));
        console.log("Materiales educativos guardados en localStorage.");
      } catch (e) {
        console.error("Error guardando educationalMaterials en localStorage. Podría estar lleno.", e);
        alert("Advertencia: No se pudieron guardar los materiales. El almacenamiento local del navegador podría estar lleno.");
      }
    } else if (localStorage.getItem('educationalMaterials')) {
      localStorage.removeItem('educationalMaterials');
      console.log("localStorage de educationalMaterials limpiado.");
    }
  }, [materials]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, file: file, fileUrl: reader.result, fileName: file.name });
      };
      reader.readAsDataURL(file);
    } else {
      setForm({ ...form, file: null, fileUrl: '', fileName: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fileUrl && !editingMaterial?.fileUrl) {
      alert("Por favor, selecciona un archivo para el material educativo.");
      return;
    }

    const newMaterial = { ...form };
    delete newMaterial.file; // Don't store File object in state/localStorage

    if (editingMaterial) {
      setMaterials(materials.map(mat =>
        mat.id === editingMaterial.id ? { ...newMaterial, id: editingMaterial.id } : mat
      ));
    } else {
      setMaterials([...materials, { ...newMaterial, id: Math.random().toString(36).substr(2, 9) }]);
    }
    setEditingMaterial(null);
    setForm({ title: '', description: '', file: null, fileUrl: '', fileName: '' });
    e.target.reset();
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setForm({ title: material.title, description: material.description, file: null, fileUrl: material.fileUrl, fileName: material.fileName });
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este material?')) {
      setMaterials(materials.filter(mat => mat.id !== id));
    }
  };

  const handleCancelEdit = () => {
    setEditingMaterial(null);
    setForm({ title: '', description: '', file: null, fileUrl: '', fileName: '' });
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-emerald-300 mb-6">Gestión de Material Educativo</h3>

      {/* Formulario de Creación/Edición */}
      <div className="mb-8 p-6 bg-gray-700 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-4">
          {editingMaterial ? 'Editar Material' : 'Agregar Nuevo Material'}
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
              rows="3"
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
            ></textarea>
          </div>
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-300">Archivo de Material</label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-emerald-50 file:text-emerald-700
                hover:file:bg-emerald-100"
              required={!editingMaterial || !editingMaterial.fileUrl} // Required if adding new or no existing file
            />
            {form.fileName && (
              <p className="text-sm text-gray-400 mt-2">Archivo seleccionado: {form.fileName}</p>
            )}
            {editingMaterial && editingMaterial.fileName && !form.fileName && (
              <p className="text-sm text-gray-400 mt-2">Archivo actual: {editingMaterial.fileName}</p>
            )}
            {form.fileUrl && form.file && form.file.type.startsWith('image/') && (
              <div className="mt-4 w-32 h-32 rounded-lg overflow-hidden border border-gray-600">
                <img src={form.fileUrl} alt="Previsualización" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              {editingMaterial ? 'Guardar Cambios' : 'Agregar Material'}
            </button>
            {editingMaterial && (
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

      {/* Listado de Materiales */}
      <div className="mt-8">
        <h4 className="text-lg font-semibold text-white mb-4">Materiales Existentes</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Título</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Descripción</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Archivo</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {materials.map((material) => (
                <tr key={material.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{material.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{material.description.substring(0, 50)}...</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {material.fileName ? (
                      <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        {material.fileName}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(material)}
                      className="text-indigo-400 hover:text-indigo-600 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(material.id)}
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