import React from 'react';

// Importar las imágenes locales
import colombiaLiderImg from '../assets/planeta-vivo/colombia_lider.png';
import aviturismoSostenibleImg from '../assets/planeta-vivo/Aviturismo_como_motor_económico_sostenible.png';
import observacionImg from '../assets/planeta-vivo/observacion.png';

// Datos estructurados para las secciones de la página
const sectionsData = [
  {
    title: 'Colombia: líder mundial en diversidad de aves',
    image: colombiaLiderImg,
    alt: 'Ave representativa de Colombia volando sobre un paisaje montañoso.',
    content: [
      'Colombia cuenta con más de 1.960 especies de aves, lo que equivale a cerca del 20% de las especies del planeta.',
      'En eventos como el Global Big Day, Colombia ha registrado entre 1.532 y 1.560 especies avistadas, ocupando consistentemente el primer lugar.',
    ],
  },
  {
    title: 'Funciones ecosistémicas esenciales',
    image: null, // Sin imagen para esta sección, será solo texto
    content: [
      'Polinización y dispersión de semillas, vitales para la regeneración forestal y la agricultura.',
      'Las aves controlan plagas y ayudan a mantener el equilibrio de los ecosistemas.',
    ],
  },
  {
    title: 'Aviturismo como motor económico sostenible',
    image: aviturismoSostenibleImg,
    alt: 'Turistas observando aves con binoculares en un entorno natural.',
    content: [
      'En 2019, más de 15.000 turistas extranjeros visitaron Colombia para el avistamiento de aves, generando aproximadamente USD 22 millones.',
      'Se estima que 150.000 observadores estadounidenses podrían visitar Colombia, lo que generaría cerca de USD 47 millones adicionales y 7.500 empleos.',
      'El ecoturismo beneficia directamente a comunidades rurales, promoviendo alternativas económicas y contribuyendo a la conservación.',
    ],
  },
  {
    title: 'Conservación activa y políticas nacionales',
    image: observacionImg,
    alt: 'Persona tomando notas sobre aves en un cuaderno de campo.',
    content: [
      'La Estrategia Nacional para la Conservación de las Aves (ENCA 2021-2030) busca integrar conservación con desarrollo sostenible.',
      'El “Libro Rojo de Aves de Colombia” identifica a 72 especies amenazadas, incluidas 27 endémicas.',
      'Organizaciones como la Fundación ProAves protegen hábitats de especies en riesgo a través de 27 reservas naturales.',
    ],
  },
];

// Componente para renderizar una sección individual
const ContentSection = ({ section, index }) => {
  const isImageLeft = index % 2 === 0;

  if (!section.image) {
    return (
      <section className="my-12 md:my-20 py-10 px-8 bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-emerald-300 leading-tight text-center">
          {section.title}
        </h2>
        <ul className="list-disc list-inside ml-6 space-y-3 text-lg text-gray-200 text-justify">
          {section.content.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </section>
    );
  }

  return (
    <section className="my-12 md:my-20">
      <div className={`flex flex-col md:flex-row items-center gap-10 ${!isImageLeft ? 'md:flex-row-reverse' : ''}`}>
        {/* Columna de la imagen */}
        <div className="w-full md:w-1/2">
          <img 
            src={section.image} 
            alt={section.alt}
            className="rounded-lg shadow-2xl object-contain w-full h-80 transform hover:scale-105 transition-transform duration-300"
          />
        </div>
        {/* Columna de texto */}
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold mb-6 text-emerald-300 leading-tight">
            {section.title}
          </h2>
          <ul className="list-none space-y-4 text-lg text-gray-300">
            {section.content.map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-1">✔</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default function PlanetaVivo() {
  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-900 text-gray-100 max-w-5xl">
      <h1 className="text-5xl font-extrabold text-center text-emerald-400 mb-12 md:mb-20 pb-4 border-b-4 border-emerald-600 tracking-tight">
          Planeta Vivo
      </h1>
      
      {sectionsData.map((section, index) => (
        <ContentSection key={index} section={section} index={index} />
      ))}
    </div>
  );
}


