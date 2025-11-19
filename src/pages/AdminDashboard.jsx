import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Eliminamos las importaciones de otros componentes de gestión
import ContentManagement from '../components/ContentManagement';

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  // La pestaña activa por defecto será directamente la de contenido
  const [activeTab, setActiveTab] = useState('content'); 

  // Solo dejamos la pestaña de Gestión de Contenido
  const tabs = [
    { id: 'content', name: 'Gestión de Contenido' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-emerald-400">Panel de Administración</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
      
      {currentUser && (
        <p className="text-lg mb-6">Bienvenido, <span className="font-semibold text-emerald-300">{currentUser.username}</span>.</p>
      )}

      <div className="mb-8 border-b border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                ${activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-300'}
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm outline-none focus:outline-none
              `}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-8">
        {/* Solo renderizamos el componente de Gestión de Contenido */}
        {activeTab === 'content' && <ContentManagement />}
      </div>
    </div>
  );
}