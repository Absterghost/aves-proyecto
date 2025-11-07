import { useInView } from 'react-intersection-observer';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function AnimatedSectionCard({ section, openLightbox }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const baseTransition = 'transition-all duration-700 ease-in-out';

  return (
    <div 
      ref={ref}
      className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden mb-16 ${baseTransition} ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className={`p-6 md:p-8 ${baseTransition} ${inView ? 'delay-200 opacity-100' : 'opacity-0'}`}>
        {/* Main Title */}
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-400">{section.title}</h2>
        </div>

        {/* Description */}
        <div className="max-w-4xl mx-auto mb-8">
          <p className="text-lg whitespace-pre-wrap text-gray-300">{section.description}</p>
        </div>

        {/* Subsections */}
        {section.subsections && section.subsections.map((subsection, subIndex) => (
          <div key={subIndex} className="max-w-4xl mx-auto mb-8 bg-slate-900/50 rounded-lg p-4">
            <h3 className="text-xl md:text-2xl font-semibold mb-3 text-emerald-300">{subsection.title}</h3>
            <p className="text-base md:text-lg whitespace-pre-wrap text-gray-300">{subsection.description}</p>
          </div>
        ))}
      </div>

      {/* Image Carousel */}
      {section.images && section.images.length > 0 && (
        <div className={`${baseTransition} ${inView ? 'delay-300 opacity-100' : 'opacity-0'} pb-6 md:pb-8 bg-slate-900/50 px-6 md:px-8`}>
          <h3 className="text-2xl font-semibold text-center mb-6 text-emerald-400">Galería de Imágenes</h3>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            loop={true}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
            className="w-full pb-10" // Added padding for arrows and pagination
          >
            {section.images.map((image, imgIndex) => (
              <SwiperSlide 
                key={imgIndex} 
                className="overflow-hidden rounded-lg shadow-lg cursor-pointer aspect-video bg-slate-900"
                onClick={() => openLightbox(image)}
              >
                <img 
                  src={image} 
                  alt={`${section.title} - Imagen ${imgIndex + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}
