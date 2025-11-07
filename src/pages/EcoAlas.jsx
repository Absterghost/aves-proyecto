import React, { useState, useEffect, useMemo } from 'react';
import { useBirds } from '../context/BirdContext';
import { FamilyModal } from '../components/FamilyModal';
import { familias as initialFamiliasData } from '../data/familias'; // Importar datos iniciales

export default function EcoAlas({ openLightbox }) {
  const { aves, loading } = useBirds(); // Mantener aves y loading del contexto
  // Usar directamente los datos importados en el estado
  const [familias, setFamilias] = useState(() => initialFamiliasData.map((item, index) => ({
    ...item,
    id: index + 1,
    habitatGeneral: Array.isArray(item.habitatGeneral) ? item.habitatGeneral : (item.habitatGeneral ? item.habitatGeneral.split(',').map(h => h.trim()) : []),
    isArchived: false,
  })));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [featuredBird, setFeaturedBird] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHabitat, setSelectedHabitat] = useState('');
  const [selectedConservation, setSelectedConservation] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  // Efecto para cargar familias eliminado, ya que se inicializan directamente en el estado.

  useEffect(() => {
    // Solo seleccionar featuredBird de familias NO archivadas
    const activeFamilias = familias.filter(f => !f.isArchived);
    if (aves.length > 0 && activeFamilias.length > 0) {
      const randomBird = aves[Math.floor(Math.random() * aves.length)];
      const familyOfBird = activeFamilias.find(f => f.nombre === randomBird.familia);
      if (familyOfBird) {
        setFeaturedBird({
          ...randomBird,
          description: randomBird.nombre,
          familyFact: familyOfBird?.datosAdicionales || familyOfBird?.descripcion,
        });
      }
    }
  }, [aves, familias]);

  const openModal = (family) => {
    if (!family || !family.nombre) {
      console.error("openModal called with invalid family:", family);
      return;
    }
    // Filtrar las aves que pertenecen a la familia seleccionada
    const birdsInFamily = aves.filter(ave => ave.familia === family.nombre);
    
    // Crear un nuevo objeto de familia que incluye las imágenes de las aves
    const familyWithBirds = {
      ...family,
      imagenes: birdsInFamily, // Añadir las aves filtradas a la propiedad 'imagenes'
    };

    setSelectedFamily(familyWithBirds);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFamily(null);
  };

  const { uniqueHabitats, uniqueConservations, filteredFamilias } = useMemo(() => {
    const activeFamilias = familias.filter(f => !f.isArchived);

    // Usar los nuevos tags para generar listas de filtros únicas y limpias
    const allHabitats = activeFamilias.flatMap(f => f.tagsHabitat || []).filter(Boolean);
    const uniqueHabitats = [...new Set(allHabitats)].sort();

    const allConservations = activeFamilias.flatMap(f => f.tagsConservacion || []).filter(Boolean);
    const uniqueConservations = [...new Set(allConservations)].sort();

    const filteredFamilias = activeFamilias.filter(familia => {
      const matchesSearch = familia.nombre.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtrar por tags de hábitat
      const matchesHabitat = selectedHabitat 
        ? (familia.tagsHabitat || []).includes(selectedHabitat) 
        : true;

      // Filtrar por tags de conservación
      const matchesConservation = selectedConservation 
        ? (familia.tagsConservacion || []).includes(selectedConservation) 
        : true;

      return matchesSearch && matchesHabitat && matchesConservation;
    });

    return { uniqueHabitats, uniqueConservations, filteredFamilias };
  }, [familias, searchTerm, selectedHabitat, selectedConservation]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <div className="text-2xl">Cargando...</div>
      </div>
    );
  }

  return (
    <section 
      className="relative min-h-screen bg-cover bg-center -m-4"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1448375240586-882707db888b')",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 p-4 md:p-8">

        {/* Featured Bird Section */}
        {featuredBird && (
          <div className="mb-12 rounded-lg bg-gray-900/80 backdrop-blur-sm border border-emerald-500/50 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
            <div className="md:w-1/2 w-full h-72 bg-black/30 rounded-lg flex items-center justify-center p-2">
              <img src={featuredBird.src} alt={featuredBird.description} className="max-w-full max-h-full object-contain" />
            </div>
            <div className="md:w-1/2 w-full text-white">
              <h3 className="text-base uppercase text-emerald-400 font-bold tracking-wider">Especie Destacada</h3>
              <h1 className="text-4xl lg:text-5xl font-bold text-white my-2">{featuredBird.description}</h1>
              <p className="text-lg text-gray-300 leading-relaxed">
                {featuredBird.familyFact}
              </p>
            </div>
          </div>
        )}

        {/* Search and Filter Section - Rediseñado */} 
        <div className="mb-12 max-w-5xl mx-auto p-6 rounded-xl bg-gray-900/70 backdrop-blur-md border border-emerald-600/50 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            {/* Search Bar */}
            <div className="relative w-full md:w-2/3">
              <input
                type="text"
                placeholder="Buscar familias de aves..."
                className="w-full py-3 pl-12 pr-4 rounded-full bg-gray-800 border border-emerald-700 text-white text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
            </div>

            {/* Help Icon */}
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-3 rounded-full bg-emerald-700/50 text-white hover:bg-emerald-600/70 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex-shrink-0" 
              aria-label="Mostrar ayuda de búsqueda"
              title="Ayuda con los filtros"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V5.75A.75.75 0 0110 5zm0 2.5a.75.75 0 00-.75.75v3.5a.75.75 0 001.5 0v-3.5a.75.75 0 00-.75-.75zM10 16a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {showHelp && (
            <div className="mb-6 p-4 rounded-lg bg-gray-800/80 text-white text-sm border border-emerald-500/50 shadow-md">
              <p className="font-bold mb-2 text-emerald-300">Cómo usar los filtros:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-200">
                <li>**Búsqueda por nombre:** Escribe el nombre de la familia de aves en el campo de búsqueda. La búsqueda es en tiempo real.</li>
                <li>**Filtro por Hábitat:** Selecciona un hábitat del menú desplegable para ver solo las familias que se encuentran en ese tipo de hábitat.</li>
                <li>**Filtro por Conservación:** Selecciona un estado de conservación del menú desplegable para ver las familias con ese estado.</li>
                <li>Puedes combinar la búsqueda por nombre con los filtros de hábitat y conservación.</li>
              </ul>
            </div>
          )}

          {/* Filter Dropdowns */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {uniqueHabitats.length > 0 && (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <label htmlFor="habitat-select" className="text-white font-semibold text-lg">Hábitat:</label>
                <select
                  id="habitat-select"
                  value={selectedHabitat}
                  onChange={(e) => setSelectedHabitat(e.target.value)}
                  className="block w-full py-2 px-4 rounded-full bg-gray-800 border border-emerald-700 text-white text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2334D399' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
                >
                  <option value="">Todos</option>
                  {uniqueHabitats.map(habitat => (
                    <option key={habitat} value={habitat}>{habitat}</option>
                  ))}
                </select>
              </div>
            )}

            {uniqueConservations.length > 0 && (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <label htmlFor="conservation-select" className="text-white font-semibold text-lg">Conservación:</label>
                <select
                  id="conservation-select"
                  value={selectedConservation}
                  onChange={(e) => setSelectedConservation(e.target.value)}
                  className="block w-full py-2 px-4 rounded-full bg-gray-800 border border-emerald-700 text-white text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2334D399' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
                >
                  <option value="">Todos</option>
                  {uniqueConservations.map(conservation => (
                    <option key={conservation} value={conservation}>{conservation}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFamilias.map((familia) => (
            <div 
              key={familia.nombre} 
              className="bg-gray-800/60 rounded-xl overflow-hidden border border-gray-800 flex flex-col cursor-pointer transition-all duration-300 ease-in-out hover:border-emerald-500/80 hover:bg-gray-800/90 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/20"
              onClick={() => openModal(familia)}
            >
              {familia.logo && (
                <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-900 border-2 border-emerald-500 shadow-lg flex items-center justify-center mx-auto mb-3 mt-5"> 
                  <img 
                    src={familia.logo} 
                    alt={`Logo de la familia ${familia.nombre}`}
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
              <div className="p-4 flex-grow flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold text-emerald-400 mb-2 text-center">{familia.nombre}</h2>
              </div>
            </div>
          ))}
        </div>

        <FamilyModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          family={selectedFamily} 
          openLightbox={openLightbox}
        />
      </div>
    </section>
  );
}