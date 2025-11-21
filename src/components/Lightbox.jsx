import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Lightbox({ data, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Match duration of fade-out
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isObject = typeof data === 'object' && data !== null;
  const imageUrl = isObject ? data.src : data;

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      onClick={handleClose}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-50"
      >
        <X size={40} />
      </button>

      <div
        className={`relative flex flex-col items-center gap-4 transition-transform duration-300 ease-in-out ${isClosing ? 'scale-90' : 'scale-100'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt="Vista ampliada"
          className="rounded-lg shadow-2xl object-contain max-w-[95vw] max-h-[80vh]"
        />
        {isObject && (
          <div className="p-4 bg-gray-900/80 rounded-lg max-w-2xl w-full text-center text-white">
            <h3 className="text-2xl font-bold text-emerald-400">{data.nombre}</h3>
            {data.habitat && <p className="mt-2 text-gray-300"><span className="font-bold text-gray-100">Hábitat:</span> {data.habitat}</p>}
            {data.dieta && <p className="mt-1 text-gray-300"><span className="font-bold text-gray-100">Dieta:</span> {data.dieta}</p>}
            {data.conservacion && <p className="mt-1 text-gray-300"><span className="font-bold text-gray-100">Conservación:</span> {data.conservacion}</p>}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
