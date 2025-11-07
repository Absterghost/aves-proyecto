import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import * as LucideIcons from 'lucide-react'; // Importar todos los iconos de Lucide

// Data and Components
import { aves } from '../data/avesHome';
import { homeContent as initialHomeContent } from '../data/homeContent';
import AnimatedSectionCard from '../components/AnimatedSectionCard';

// Styles
import 'swiper/css';
import 'swiper/css/effect-fade';

// --- Hero Section Component ---
const HeroSection = ({ heroData }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section ref={ref} className="relative h-[70vh] min-h-[500px] text-white flex flex-col justify-center items-center text-center p-8 overflow-hidden">
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

// --- Main Home Component ---
export function Home({ openLightbox }) {
  const [homeContentData, setHomeContentData] = useState(initialHomeContent);

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
  }, []);

  return (
    <div className="-m-4 bg-gray-900">
      {/* Asegurarse de que homeContentData.heroSection exista antes de pasarlo */}
      {homeContentData.heroSection && <HeroSection heroData={homeContentData.heroSection} />}
      <div className="relative z-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSectionCard section={homeContentData.welcomeSection} openLightbox={openLightbox} />
        </div>
      </div>
      <div className="relative z-10">
        <SectionsExplorer explorerSections={homeContentData.explorerSections} adminSection={homeContentData.adminSection} />
        <FeaturedGallery openLightbox={openLightbox} />
      </div>
    </div>
  );
}