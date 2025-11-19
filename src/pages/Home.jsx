import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import * as LucideIcons from 'lucide-react'; // Importar todos los iconos de Lucide
import fondoHome from '../assets/fondo-home/home.jpg';

// Data and Components
import { aves } from '../data/avesHome';
import { homeContent as initialHomeContent } from '../data/homeContent';
import AnimatedSectionCard from '../components/AnimatedSectionCard';
import { useAuth } from '../context/AuthContext'; // Importar useAuth

// Styles
import 'swiper/css';
import 'swiper/css/effect-fade';

import CommunitySighting from '../components/CommunitySighting';



// --- Hero Section Component ---

const HeroSection = ({ heroData }) => {

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });



  return (

    <section ref={ref} className="relative h-[70vh] min-h-[500px] text-white flex flex-col justify-center items-center text-center p-8 overflow-hidden">

      {/* Background Image */}

      <div

        className="absolute inset-0 bg-cover bg-center"

        style={{ backgroundImage: `url(${fondoHome})` }}

      >

        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay for text readability */}

      </div>

      <div className={`relative z-10 transition-all duration-1000 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>

          {heroData?.title}

        </h1>

        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-200 mb-8">

          {heroData?.description}

        </p>

        <a

          href="#explorar"

          className="bg-emerald-500 text-white font-bold text-lg py-3 px-8 rounded-full hover:bg-emerald-600 transition-transform duration-300 ease-in-out hover:scale-105 shadow-lg"

        >

          Explorar Ahora

        </a>

      </div>

    </section>

  );

};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// --- Community Sightings Display Component ---
const SightingsDisplay = ({ sightings, onEditClick, onDeleteClick, currentUser }) => {
  if (sightings.length === 0) {
    return (
      <div className="text-center py-8 px-4 col-span-1 lg:col-span-2">
        <LucideIcons.CameraOff size={48} className="mx-auto text-gray-500 mb-4" />
        <h4 className="text-xl font-bold text-white">Aún no hay avistamientos</h4>
        <p className="text-gray-500">¡Sé el primero en compartir tu descubrimiento!</p>
      </div>
    );
  }

  return (
    <>
      {sightings.map((sighting) => (
        <div 
          key={sighting.id} 
          className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 animate-fade-in"
        >
          <div>
            {sighting.photo && (
              <img src={sighting.photo} alt={`Avistamiento de ${sighting.userName}`} className="w-full h-48 object-cover" />
            )}
            <div className="p-6">
              <div className="flex items-center mb-3">
                <LucideIcons.UserCircle2 className="h-6 w-6 text-emerald-400 mr-3 flex-shrink-0" />
                <h4 className="text-lg font-bold text-white truncate">{sighting.userName}</h4>
              </div>
              <p className="text-gray-300 text-sm mb-4 h-20 overflow-y-auto pr-2">{sighting.comment}</p>
            </div>
          </div>
          <div className="p-4 bg-gray-800/50 border-t border-gray-700/50 flex justify-between items-center">
             <span className="text-xs text-gray-500">{formatDate(sighting.createdAt)}</span>
             {/* Show buttons only if the user is the owner of the sighting */}
             {currentUser && currentUser.id === sighting.userId && (
                <div className="flex items-center space-x-2">
                    <button 
                    onClick={() => onEditClick(sighting)} 
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    aria-label="Editar"
                    >
                    <LucideIcons.Pencil size={16} />
                    </button>
                    <button 
                    onClick={() => onDeleteClick(sighting.id)} 
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Eliminar"
                    >
                    <LucideIcons.Trash2 size={16} />
                    </button>
                </div>
             )}
          </div>
        </div>
      ))}
    </>
  );
};



// --- Sections Explorer Component ---

const SectionsExplorer = ({ explorerSections, adminSection }) => {

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const allSections = [...explorerSections, adminSection];



  return (

    <section id="explorar" ref={ref} className={`py-16 px-4 md:px-8 bg-gray-900/50 backdrop-blur-sm transition-all duration-700 ease-in-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

      <div className="max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold text-center mb-12 text-white">Explora Nuestras Secciones</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {allSections.map((section) => {

            const IconComponent = LucideIcons[section.iconName]; // Obtener el componente del icono por su nombre

            return (

              <Link to={section.path} key={section.label} className={`group block transition-all duration-300 ${section.isFeatured ? 'lg:col-span-3' : 'hover:-translate-y-2'}`}>

                <div className={`h-full p-8 rounded-xl border transition-all duration-300 ${section.isFeatured ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-gray-800/60 border-gray-700 group-hover:border-emerald-500/80 group-hover:bg-gray-800/90'}`}>

                  <div className="text-center">

                    {IconComponent && <IconComponent size={32} className="mx-auto mb-3 text-emerald-400" />} {/* Renderizar el icono */}

                    <h3 className="text-2xl font-bold text-emerald-400 mb-2">{section.label}</h3>

                    <p className="text-gray-400">{section.description}</p>

                  </div>

                </div>

              </Link>

            );

          })}

        </div>

      </div>

    </section>

  );

};



// --- Featured Gallery Component ---

const FeaturedGallery = ({ openLightbox }) => {

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });



  return (

    <section ref={ref} id="galeria-destacada" className={`py-16 px-4 md:px-8 transition-all duration-700 ease-in-out ${inView ? 'opacity-100' : 'opacity-0'}`}>

      <div className="max-w-7xl mx-auto">

        <h2 className="text-4xl font-bold text-center mb-12 text-white">Galería Destacada</h2>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {aves.map((ave) => (

            <AveCard key={ave.nombre} ave={ave} openLightbox={openLightbox} />

          ))}

        </div>

      </div>

    </section>

  );

};



// --- AveCard Component ---

const AveCard = ({ ave, openLightbox }) => (

  <div 
    className="group h-80 w-full [perspective:1000px] cursor-pointer"
    onClick={() => openLightbox({

      images: [ave.imagen],

      title: ave.nombre,

      description: ave.descripcion,

    })}

  >

    <div className="relative h-full w-full rounded-xl shadow-lg transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

      {/* Front Face */}

      <div className="absolute inset-0 [backface-visibility:hidden]">

        <img className="h-full w-full rounded-xl object-cover shadow-xl shadow-black/40" src={ave.imagen} alt={ave.nombre} />

        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/80 via-transparent to-black/20 flex items-end p-6">

          <h2 className="text-white text-2xl font-bold tracking-wide">{ave.nombre}</h2>

        </div>

      </div>

      {/* Back Face */}

      <div className="absolute inset-0 h-full w-full rounded-xl bg-gray-800/95 backdrop-blur-sm p-6 text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">

        <div className="flex min-h-full flex-col items-center justify-center">

          <h2 className="text-2xl font-bold text-white">{ave.nombre}</h2>

          <p className="text-base italic text-cyan-400 mt-1">{ave.nombreCientifico}</p>

          <p className="mt-4 text-base text-gray-300">{ave.descripcion}</p>

        </div>

      </div>

    </div>

  </div>

);

const AuthCallToAction = () => (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700/50 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Únete a la Conversación</h3>
        <p className="text-gray-400 mb-6">Inicia sesión o regístrate para compartir tus propios avistamientos con la comunidad.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="w-full sm:w-auto flex-1 bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors">
                Iniciar Sesión
            </Link>
            <Link to="/register" className="w-full sm:w-auto flex-1 bg-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors">
                Registrarse
            </Link>
        </div>
    </div>
);


// --- Main Home Component ---

export function Home({ openLightbox }) {

  const { isAuthenticated, currentUser } = useAuth();
  const [homeContentData, setHomeContentData] = useState(initialHomeContent);
  const [sightings, setSightings] = useState([]);
  const [editingSighting, setEditingSighting] = useState(null); // State to track editing

  // Handlers for CRUD operations
  const handleNewSighting = (sighting) => {
    const newSighting = {
        ...sighting,
        userId: currentUser.id,
        userName: currentUser.username,
    };
    const updatedSightings = [newSighting, ...sightings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setSightings(updatedSightings);
  };

  const handleDeleteSighting = (sightingId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este avistamiento?')) {
      const updatedSightings = sightings.filter(s => s.id !== sightingId);
      setSightings(updatedSightings);
    }
  };

  const handleUpdateSighting = (updatedSighting) => {
    const updatedSightings = sightings.map(s => s.id === updatedSighting.id ? { ...s, ...updatedSighting, userName: currentUser.username, userId: currentUser.id } : s);
    setSightings(updatedSightings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    setEditingSighting(null); // Exit editing mode
  };

  const handleEditClick = (sighting) => {
    setEditingSighting(sighting);
    // Scroll to the form for a better user experience
    document.getElementById('community-sightings').scrollIntoView({ behavior: 'smooth' });
  };


  // Cargar datos desde localStorage o datos iniciales

  useEffect(() => {

    const storedHomeContent = localStorage.getItem('homeContentData');

    if (storedHomeContent) {

      try {

        const parsedContent = JSON.parse(storedHomeContent);

        // Reconstruir los componentes de icono a partir de los nombres de string

        const processedContent = {

          ...parsedContent,

          explorerSections: parsedContent.explorerSections.map(sec => ({

            ...sec,

            icon: LucideIcons[sec.iconName] // Convertir nombre de icono a componente

          })),

          adminSection: {

            ...parsedContent.adminSection,

            icon: LucideIcons[parsedContent.adminSection.iconName] // Convertir nombre de icono a componente

          }

        };

        setHomeContentData(processedContent);

      } catch (e) {

        console.error("Error parsing homeContentData from localStorage", e);

        setHomeContentData(initialHomeContent);

      }

    } else {

      setHomeContentData(initialHomeContent);

    }



    // Cargar avistamientos desde localStorage y ordenar
    const storedSightings = localStorage.getItem('communitySightings');
    if (storedSightings) {
      try {
        const parsed = JSON.parse(storedSightings);
        const sorted = parsed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setSightings(sorted);
      } catch (e) {
        console.error("Error parsing communitySightings from localStorage", e);
      }
    }
  }, []);



  // Guardar avistamientos en localStorage

  useEffect(() => {
    if (sightings.length > 0) {
      localStorage.setItem('communitySightings', JSON.stringify(sightings));
    } else if (localStorage.getItem('communitySightings')) {
      if (sightings.length === 0) {
         localStorage.removeItem('communitySightings');
      }
    }
  }, [sightings]);



  return (

    <div className="-m-4 bg-gray-900">

      {homeContentData.heroSection && <HeroSection heroData={homeContentData.heroSection} />}

      <div className="relative z-10 px-4 md:px-8">

        <div className="max-w-7xl mx-auto">

          <AnimatedSectionCard section={homeContentData.welcomeSection} openLightbox={openLightbox} />

        </div>

      </div>

      <div className="relative z-10">

        <SectionsExplorer explorerSections={homeContentData.explorerSections} adminSection={homeContentData.adminSection} />

        

        {/* --- Sección de Avistamientos Comunitarios --- */}
        <section id="community-sightings" className="py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">Rincón del Observador</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              <div className="lg:col-span-1">
                {isAuthenticated ? (
                  <CommunitySighting 
                    onSightingSubmit={handleNewSighting} 
                    onSightingUpdate={handleUpdateSighting}
                    editingSighting={editingSighting}
                    setEditingSighting={setEditingSighting}
                  />
                ) : (
                  <AuthCallToAction />
                )}
              </div>
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[80vh] overflow-y-auto pr-4">
                <SightingsDisplay 
                  sightings={sightings} 
                  onEditClick={handleEditClick}
                  onDeleteClick={handleDeleteSighting}
                  currentUser={currentUser}
                />
              </div>
            </div>
          </div>
        </section>


        <FeaturedGallery openLightbox={openLightbox} />

      </div>

    </div>

  );

}