import React from 'react';
import { getConservationIcon } from '../utils/iconUtils';
import HabitatIcon from '../assets/iconos-familias/Habitat.png';
import TiposDeDietasIcon from '../assets/iconos-familias/Tipos_de_Dietas.png';

export default function BirdDetailModal({ isOpen, onClose, bird }) {
  if (!isOpen || !bird) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-[101] p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative border border-emerald-500" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-3xl font-bold"
          aria-label="Cerrar"
        >
          &times;
        </button>

        <div className="p-8">
          <h2 className="text-3xl font-bold text-emerald-400 mb-4 text-center">{bird.nombre}</h2>
          
          <div className="flex justify-center mb-6">
            <img src={bird.imagen} alt={bird.nombre} className="max-w-full max-h-[70vh] object-contain rounded-lg border-2 border-emerald-500 mx-auto" />
          </div>

          <div className="text-white mb-6">
            <h4 className="font-bold text-xl mb-2">Detalles:</h4>
            <p className="text-gray-300 mb-2"><span className="font-semibold">Familia:</span> {bird.familia}</p>
            <p className="text-gray-300 mb-2"><span className="font-semibold">Hábitat:</span> {bird.habitat}</p>
            <p className="text-gray-300 mb-2"><span className="font-semibold">Dieta:</span> {bird.dieta}</p>
            <p className="text-gray-300 mb-2"><span className="font-semibold">Conservación:</span> {bird.conservacion}</p>
          </div>

          {/* Iconos de información adicional */}
          <div className="flex justify-evenly text-white mt-6">
            {/* Estado de Conservación */}
            <div className="flex flex-col items-center w-32">
              <img src={getConservationIcon(bird.conservacion)} alt="Estado de conservación" className="w-16 h-16 mb-2" />
              <span className="font-bold text-sm">Conservación</span>
            </div>

            {/* Hábitat */}
            <div className="flex flex-col items-center w-32">
              <img src={HabitatIcon} alt="Hábitat" className="w-16 h-16 mb-2" />
              <span className="font-bold text-sm">Hábitat</span>
            </div>

            {/* Dieta */}
            <div className="flex flex-col items-center w-32">
              <img src={TiposDeDietasIcon} alt="Tipo de Dieta" className="w-16 h-16 mb-2" />
              <span className="font-bold text-sm">Dieta</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}