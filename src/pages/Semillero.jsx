import React, { useState, useEffect } from 'react';
import AnimatedSectionCard from '../components/AnimatedSectionCard';
import { useAdmin } from '../context/AdminContext'; // Importar useAdmin
import { Link } from 'react-router-dom'; // Importar Link
import { semilleroData as initialSemilleroData } from '../data/semilleroContent';

export function Semillero({ openLightbox }) {
  const { isAuthenticated } = useAdmin(); // Obtener estado de autenticación
  const [semilleroItems, setSemilleroItems] = useState([]);

  // Cargar datos desde localStorage o datos iniciales
  useEffect(() => {
    const storedItems = localStorage.getItem('semilleroItems');
    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems);
        setSemilleroItems(parsedItems.map((item, index) => ({
          ...item,
          id: item.id || index + 1,
          images: item.images || [],
          subsections: item.subsections || [],
          isArchived: item.isArchived || false,
        })));
      } catch (e) {
        console.error("Error parsing semilleroItems from localStorage", e);
        setSemilleroItems(initialSemilleroData.map((item, index) => ({
          ...item,
          id: index + 1,
          images: item.images || [],
          subsections: item.subsections || [],
          isArchived: false,
        })));
      }
    } else {
      setSemilleroItems(initialSemilleroData.map((item, index) => ({
        ...item,
        id: index + 1,
        images: item.images || [],
        subsections: item.subsections || [],
        isArchived: false,
      })));
    }
  }, []);

  // Filtrar solo los elementos que NO están archivados para mostrar en la página pública
  const activeSemilleroItems = semilleroItems.filter(item => !item.isArchived);

  // Encontrar la imagen de fondo para el Hero (si existe y no está archivada)
  const heroBgImage = activeSemilleroItems.find(s => s.title.includes('Salidas de campo'))?.images[10];

  return (
    <>
      <div className="-m-4 bg-gray-900">
        {/* Hero Section - Kept from original for visual consistency */}
        <div className="relative h-[55vh] text-white flex flex-col justify-center items-center text-center p-8 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          {heroBgImage && <img src={heroBgImage} alt="Fondo Semillero" className="absolute inset-0 w-full h-full object-cover opacity-30"/>}
          <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
              Semillero de Investigación
            </h1>
            <p className="mt-4 max-w-3xl text-lg md:text-xl text-gray-200">
              Explorando la biodiversidad a través de la tecnología, la ciencia y la pasión por la naturaleza.
            </p>
          </div>
        </div>

        {/* Admin Dashboard Button - visible only if not authenticated */}
        {!isAuthenticated && (
          <div className="flex justify-center py-8 bg-gray-900">
            <Link 
              to="/login"
              className="px-6 py-3 font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg"
            >
              Dashboard del admin
            </Link>
          </div>
        )}

        {/* Content Sections - Now using the reusable component */}
        <div className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-screen-lg mx-auto space-y-20">
            {activeSemilleroItems.map((section, index) => (
              <AnimatedSectionCard 
                key={section.id || index}
                section={section}
                openLightbox={openLightbox}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}