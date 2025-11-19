import React, { useState, useEffect } from 'react';
import { Loader2, MessageSquare, Camera, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CommunitySighting = ({ onSightingSubmit, onSightingUpdate, editingSighting, setEditingSighting }) => {
  const { currentUser } = useAuth();
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState(null); // This will hold the Base64 string
  const [photoName, setPhotoName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect to populate form when editingSighting changes
  useEffect(() => {
    if (editingSighting) {
      // We can only edit our own sightings, so we can trust the username.
      setComment(editingSighting.comment);
      setPhoto(editingSighting.photo);
      setPhotoName(editingSighting.photo ? 'current_photo.jpg' : '');
    } else {
      // Clear form if not editing
      setComment('');
      setPhoto(null);
      setPhotoName('');
    }
  }, [editingSighting]);

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result); // Set photo state to the Base64 string
      };
      reader.readAsDataURL(file);
      setPhotoName(file.name);
    } else {
        setPhoto(null); // Clear photo if no file selected
        setPhotoName('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment && !isSubmitting) {
      setIsSubmitting(true);
      
      const sightingData = { 
        comment, 
        photo, 
        createdAt: editingSighting ? editingSighting.createdAt : new Date().toISOString() 
      };

      setTimeout(() => {
        if (editingSighting) {
          onSightingUpdate({ ...sightingData, id: editingSighting.id });
        } else {
          onSightingSubmit({ ...sightingData, id: Date.now() });
        }
        
        setComment('');
        setPhoto(null);
        setPhotoName('');
        e.target.reset();
        setIsSubmitting(false);
        setEditingSighting(null); 
      }, 1500);
    }
  };

  const handleCancelEdit = () => {
    setEditingSighting(null);
  };

  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700/50">
      <h3 className="text-3xl font-bold text-white mb-2">
        {editingSighting ? 'Editar Avistamiento' : 'Comparte tu Avistamiento'}
      </h3>
      <p className="text-md text-gray-400 mb-6">Hola, <span className="font-bold text-emerald-400">{currentUser.username}</span>. ¿Qué has visto hoy?</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-400 mb-2">Comentario o Descripción</label>
          <MessageSquare className="absolute left-4 top-10 h-5 w-5 text-gray-500" />
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            rows="4"
            placeholder="Describe qué viste, dónde, o comparte una ruta interesante."
            required
            disabled={isSubmitting}
          ></textarea>
        </div>
        <div>
          <label htmlFor="photo-upload" className="block text-sm font-medium text-gray-400 mb-2">Sube una Foto (Opcional)</label>
          <div className="flex items-center justify-center w-full">
            <label htmlFor="photo-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-700/50 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Camera className="w-8 h-8 mb-3 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click para subir</span> o arrastra y suelta</p>
                <p className="text-xs text-gray-600">SVG, PNG, JPG or GIF</p>
                {photoName && <p className="text-xs text-emerald-500 mt-2">{photoName}</p>}
              </div>
              <input id="photo-upload" type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" disabled={isSubmitting} />
            </label>
          </div> 
        </div>
        
        {photo && (
          <div className="mt-4 relative">
            <p className="text-sm font-medium text-gray-400 mb-2">Vista previa:</p>
            <img src={photo} alt="Vista previa del avistamiento" className="w-full max-h-48 rounded-lg object-cover border border-gray-700" />
            <button
                type="button"
                onClick={() => { setPhoto(null); setPhotoName(''); }}
                className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 rounded-full p-1 text-white hover:bg-red-700 transition-colors"
                aria-label="Quitar foto"
            >
                <XCircle size={20} />
            </button>
          </div>
        )}
        
        <div className="flex space-x-4">
            <button
            type="submit"
            className="flex-1 bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-emerald-500 transition-transform duration-300 ease-in-out hover:scale-[1.02] shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
            disabled={isSubmitting || !comment}
            >
            {isSubmitting ? (
                <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {editingSighting ? 'Actualizando...' : 'Enviando...'}
                </>
            ) : (
                editingSighting ? 'Actualizar Avistamiento' : 'Enviar Avistamiento'
            )}
            </button>
            {editingSighting && (
                <button
                type="button"
                onClick={handleCancelEdit}
                className="flex-none px-4 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 transition-colors shadow-lg"
                disabled={isSubmitting}
                >
                Cancelar
                </button>
            )}
        </div>
      </form>
    </div>
  );
};

export default CommunitySighting;
