import React from 'react';
import { getConservationIcon } from '../utils/iconUtils';
import HabitatIcon from '../assets/iconos-familias/Habitat.png';
import TiposDeDietasIcon from '../assets/iconos-familias/Tipos_de_Dietas.png';

export function FamilyModal({ isOpen, onClose, family, openLightbox }) {
  if (!isOpen || !family) return null;

  // Asumiendo que 'family.imagenes' ya contiene las aves con sus .src
  const birdsInFamily = family.imagenes || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-[100] p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative border border-emerald-500" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-3xl font-bold z-10"
          aria-label="Cerrar"
        >
          &times;
        </button>

        <div className="p-8">
          <h2 className="text-4xl font-bold text-emerald-400 mb-4 text-center">{family.nombre}</h2>
          
          <div className="text-center mb-6">
            <img src={family.logo} alt={`Logo de ${family.nombre}`} className="w-32 h-32 object-cover rounded-full border-4 border-emerald-500 mx-auto mb-6" />
            <div className="text-white">
                <h4 className="font-bold text-lg">Descripción</h4>
                <p className="text-gray-300">{family.descripcion}</p>
            </div>
          </div>

          {/* Sección de Información Clave con Iconos (para la familia) */}
          <div className="my-6">
            <h3 className="text-2xl font-semibold text-white mb-4 text-center">Información Clave de la Familia</h3>
            <div className="flex justify-evenly text-white">
              
              {/* Estado de Conservación General */}
              <div className="flex flex-col items-center w-32">
                <img src={getConservationIcon(family.estadoConservacionGeneral)} alt="Estado de conservación" className="w-16 h-16 mb-2" />
                <span className="font-bold">Conservación</span>
                <span className="text-sm text-gray-300 text-center">{family.estadoConservacionGeneral || 'No especificado'}</span>
              </div>

              {/* Hábitat General */}
              <div className="flex flex-col items-center w-32">
                <img src={HabitatIcon} alt="Hábitat" className="w-16 h-16 mb-2" />
                <span className="font-bold">Hábitat</span>
                <span className="text-sm text-gray-300 text-center">{family.habitatGeneral ? (Array.isArray(family.habitatGeneral) ? family.habitatGeneral.join(', ') : family.habitatGeneral) : 'No especificado'}</span>
              </div>

              {/* Tipos de Dietas General */}
              <div className="flex flex-col items-center w-32">
                <img src={TiposDeDietasIcon} alt="Tipos de Dietas" className="w-16 h-16 mb-2" />
                <span className="font-bold">Tipo de dieta</span>
                <span className="text-sm text-gray-300 text-center">{family.dietaGeneral ? (Array.isArray(family.dietaGeneral) ? family.dietaGeneral.join(', ') : family.dietaGeneral) : 'No especificado'}</span>
              </div>

            </div>
          </div>

          <hr className="border-gray-600 my-6" />

          {/* Galería de Aves Individuales */}
          {birdsInFamily.length > 0 && (
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-white mb-4 text-center">Aves de esta familia:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {birdsInFamily.map((bird, index) => (
                  <div 
                    key={index} 
                    className="rounded-lg overflow-hidden border border-gray-700 shadow-md flex flex-col items-center justify-center min-h-[10rem] cursor-pointer p-2 bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
                    onClick={() => openLightbox(bird)} // <-- CAMBIO CLAVE
                  >
                    <img 
                      src={bird.src} // Usar bird.src que ya está cargado
                      alt={bird.nombre} 
                      className="w-full max-h-32 object-contain rounded-md mb-2" 
                    />
                    <p className="text-white text-center font-semibold text-sm">{bird.nombre}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}