import React, { useState } from 'react';
import { familias } from '../data/familias';

export default function AddBird() {
  const [birdData, setBirdData] = useState({
    nombre: '',
    nombreCientifico: '',
    familia: '',
    descripcion: '',
    nombreArchivoImagen: '',
  });
  const [generatedCode, setGeneratedCode] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBirdData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nombre, nombreCientifico, familia, descripcion, nombreArchivoImagen } = birdData;

    if (!nombre || !familia || !nombreArchivoImagen) {
      alert('Por favor, completa al menos el nombre, la familia y el nombre del archivo de imagen.');
      return;
    }

    // Limpiar el nombre del archivo para usarlo como variable
    const varName = nombre.toLowerCase().replace(/\s+/g, '_');
    const imageName = `${varName}Img`;

    const code = `
// 1. Agrega esta línea al inicio de 'src/data/avesHome.js'
import ${imageName} from '../assets/imagenes/${nombreArchivoImagen}';

// 2. Agrega este objeto al array 'aves' en 'src/data/avesHome.js'
{
  nombre: "${nombre}",
  nombreCientifico: "${nombreCientifico}",
  imagen: ${imageName},
  descripcion: "${descripcion}",
  familia: "${familia}"
},
`;
    setGeneratedCode(code);
  };

  return (
    <div className="p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Generador de Código para Aves</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Completa este formulario para generar el código necesario para agregar una nueva ave.
          Recuerda subir manualmente el archivo de la imagen a la carpeta <strong>public/assets/imagenes</strong>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Nombre del Ave</label>
            <input type="text" name="nombre" id="nombre" value={birdData.nombre} onChange={handleChange} required className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" />
          </div>

          <div>
            <label htmlFor="nombreCientifico" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Nombre Científico</label>
            <input type="text" name="nombreCientifico" id="nombreCientifico" value={birdData.nombreCientifico} onChange={handleChange} className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" />
          </div>

          <div>
            <label htmlFor="familia" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Familia</label>
            <select name="familia" id="familia" value={birdData.familia} onChange={handleChange} required className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500">
              <option value="">Selecciona una familia</option>
              {familias.map(f => <option key={f.nombre} value={f.nombre}>{f.nombre}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Descripción</label>
            <textarea name="descripcion" id="descripcion" value={birdData.descripcion} onChange={handleChange} rows="4" className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"></textarea>
          </div>

          <div>
            <label htmlFor="nombreArchivoImagen" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Nombre del Archivo de Imagen (ej: nueva_ave.png)</label>
            <input type="text" name="nombreArchivoImagen" id="nombreArchivoImagen" value={birdData.nombreArchivoImagen} onChange={handleChange} required className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" />
          </div>

          <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors duration-300">
            Generar Código
          </button>
        </form>

        {generatedCode && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Código Generado</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Copia y pega estas líneas en los archivos correspondientes:</p>
            <pre className="bg-gray-900 text-white p-6 rounded-lg overflow-x-auto">
              <code>
                {generatedCode}
              </code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
