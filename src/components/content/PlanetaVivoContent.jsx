import React, { useState, useEffect } from 'react';

// Importar el contenido original de PlanetaVivo.jsx como respaldo
// Para esto, necesitamos leer el archivo original y extraer su contenido textual.
// Como no puedo leer el JSX directamente para extraer el texto, usaré un placeholder
// y te indicaré cómo podrías extraerlo si fuera necesario.

// Placeholder para el contenido original de PlanetaVivo.jsx
const originalPlanetaVivoContent = `
  <h1>Planeta Vivo</h1>
  <section>
    <h2>Colombia: líder mundial en diversidad de aves</h2>
    <ul>
      <li>Colombia cuenta con más de 1.960 especies de aves, lo que equivale a cerca del 20% de las especies del planeta.</li>
      <li>En eventos como el Global Big Day, Colombia ha registrado entre 1.532 y 1.560 especies avistadas, ocupando consistentemente el primer lugar.</li>
    </ul>
  </section>
  <!-- ... y así sucesivamente con el resto del contenido original ... -->
  <h1 >Caldas</h1>
  <section>
    <h2>Riqueza y diversidad de especies</h2>
    <ul>
      <li>Caldas alberga alrededor de 799–802 especies de aves, lo que representa cerca del 41–42% de las aves registradas en Colombia (799 según diagnóstico 2018; 802 según datos turísticos).</li>
      <li>De estas, 22 son endémicas, otras 73 casi endémicas, y 77 especies realizan migraciones.</li>
      <li>También hay 34 especies amenazadas a nivel nacional y 38 a nivel mundial, reflejando retos en conservación.</li>
    </ul>
  </section>
  <!-- ... y así sucesivamente con el resto del contenido original ... -->
  <h1 >MANIZALES</h1>
  <section>
    <h2>Biodiversidad destacada</h2>
    <ul>
      <li>Manizales alberga aproximadamente 500–813 especies de aves, es decir, hasta el 43% de todas las especies del país.</li>
      <li>La Reserva Forestal Protectora Río Blanco, ubicada a apenas 2 km de la ciudad, cuenta con unos 362–350–175 especies según diferentes censos.</li>
    </ul>
  </section>
  <!-- ... y así sucesivamente con el resto del contenido original ... -->
`;

export default function PlanetaVivoContent() {
  const [pageContent, setPageContent] = useState('');

  // Cargar contenido desde localStorage o el placeholder
  useEffect(() => {
    const storedContent = localStorage.getItem('planetaVivoPageContent');
    if (storedContent) {
      setPageContent(storedContent);
    } else {
      // Usar el contenido original como respaldo si no hay nada en localStorage
      // En una implementación real, extraerías esto del archivo PlanetaVivo.jsx
      setPageContent(originalPlanetaVivoContent);
    }
  }, []);

  // Guardar contenido en localStorage cada vez que cambie
  useEffect(() => {
    if (pageContent) {
      try {
        localStorage.setItem('planetaVivoPageContent', pageContent);
        console.log("Contenido de Planeta Vivo guardado en localStorage.");
      } catch (e) {
        console.error("Error guardando Planeta Vivo en localStorage. Podría estar lleno.", e);
        alert("Advertencia: No se pudo guardar el contenido de Planeta Vivo. El almacenamiento local del navegador podría estar lleno.");
      }
    }
  }, [pageContent]);

  const handleContentChange = (e) => {
    setPageContent(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Contenido de Planeta Vivo actualizado (localmente).");
    // El useEffect ya se encarga de guardar en localStorage
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-emerald-300 mb-6">Gestión de Contenido de Planeta Vivo</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="pageContent" className="block text-sm font-medium text-gray-300">Contenido Completo de la Página</label>
          <textarea
            id="pageContent"
            name="pageContent"
            value={pageContent}
            onChange={handleContentChange}
            rows="20"
            className="mt-1 block w-full p-4 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
            placeholder="Pega aquí todo el contenido HTML o Markdown de la página Planeta Vivo."
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-md hover:bg-emerald-700 transition-colors"
          >
            Guardar Contenido
          </button>
        </div>
      </form>
    </div>
  );
}