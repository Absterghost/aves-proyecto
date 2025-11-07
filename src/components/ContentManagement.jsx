import React, { useState } from 'react';
import { SemilleroContent } from './content/SemilleroContent';
import EcoAlasContent from './content/EcoAlasContent';
import HomeContent from './content/HomeContent';
import GeorutasContent from './content/GeorutasContent';
import VerdeSaberContent from './content/VerdeSaberContent';
import PlanetaVivoContent from './content/PlanetaVivoContent';
import ZonotrichiaContent from './content/ZonotrichiaContent';

export default function ContentManagement() {
  const [activeContentTab, setActiveContentTab] = useState('home'); // Default to Home content

  const contentTabs = [
    { id: 'home', name: 'Inicio' },
    { id: 'semillero', name: 'Semillero' },
    { id: 'ecoalas', name: 'EcoAlas' },
    { id: 'georutas', name: 'Georutas' },
    { id: 'verdesaber', name: 'Verde Saber' },
    { id: 'planetavivo', name: 'Planeta Vivo' },
    { id: 'zonotrichia', name: 'Zonotrichia' },
  ];

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-emerald-400 mb-6">Gestión de Contenido del Sitio</h2>

      <div className="mb-6 border-b border-gray-700">
        <nav className="-mb-px flex flex-wrap space-x-4 md:space-x-8" aria-label="Content Tabs">
          {contentTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveContentTab(tab.id)}
              className={`
                ${activeContentTab === tab.id
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-300'}
                whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm outline-none focus:outline-none
              `}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeContentTab === 'home' && <HomeContent />}
        {activeContentTab === 'semillero' && <SemilleroContent />}
        {activeContentTab === 'ecoalas' && <EcoAlasContent />}
        {activeContentTab === 'georutas' && <GeorutasContent />}
        {activeContentTab === 'verdesaber' && <VerdeSaberContent />}
        {activeContentTab === 'planetavivo' && <PlanetaVivoContent />}
        {activeContentTab === 'zonotrichia' && <ZonotrichiaContent />}
      </div>
    </div>
  );
}