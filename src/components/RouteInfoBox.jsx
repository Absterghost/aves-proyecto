import React, { useState } from 'react';
import Lightbox from './Lightbox';

// Componente para mostrar la información de la ruta seleccionada
export default function RouteInfoBox({ route, onBack, onCenter }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!route) {
    return null;
  }

  const { properties, coords } = route;

  // Generar el enlace de Google Maps usando la primera coordenada de la ruta
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords[0][0]},${coords[0][1]}`;

  // Construir la URL de la imagen de forma compatible con Vite
  let imageUrl = null;
  if (properties.imagen) {
    try {
      imageUrl = new URL(properties.imagen, import.meta.url).href;
    } catch (error) {
      console.error("Error al construir la URL de la imagen:", error);
    }
  }

  return (
    <>
      <div className="bg-gray-800/50 backdrop-blur-sm border border-emerald-500/20 rounded-lg p-6 flex flex-col h-full animate-fade-in">
        <div className="flex-grow">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Volver al listado
          </button>

          {imageUrl && (
            <div 
              className="my-4 rounded-lg overflow-hidden h-48 cursor-pointer group"
              onClick={() => setIsLightboxOpen(true)}
            >
              <img 
                src={imageUrl} 
                alt={`Imagen de ${properties.name}`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
            </div>
          )}

          <h3 className="text-3xl font-bold text-white mb-3">{properties.name}</h3>
          
          <p className="text-gray-300 mb-5">{properties.descripcion}</p>

          <div className="space-y-4 text-sm">
            <div>
              <strong className="text-emerald-500 block">Dificultad:</strong>
              <span className="text-gray-200">{properties.dificultad || 'No especificada'}</span>
            </div>
            <div>
              <strong className="text-emerald-500 block">Horario Ideal:</strong>
              <span className="text-gray-200">{properties.horario_ideal || 'No especificado'}</span>
            </div>
            <div>
              <strong className="text-emerald-500 block">Aves Comunes:</strong>
              {properties.aves && properties.aves.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {properties.aves.map((ave, index) => (
                    <span key={index} className="bg-gray-700 text-gray-200 text-xs font-medium px-2.5 py-1 rounded-full">
                      {ave}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-200">No especificadas</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex-shrink-0 space-y-3">
          <button
            onClick={onCenter}
            className="w-full text-center inline-block bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-all duration-300"
          >
            Centrar en el mapa
          </button>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center inline-block bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-700 transition-all duration-300"
          >
            Abrir en Google Maps
          </a>
        </div>
      </div>

      {isLightboxOpen && (
        <Lightbox 
          data={imageUrl}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </>
  );
}
