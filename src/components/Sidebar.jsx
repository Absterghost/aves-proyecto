import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Home, BookOpen, Map, Users, Image, Bird, Leaf, ChevronLeft, ChevronRight, Shield } from "lucide-react";
import { useAdmin } from "../context/AdminContext"; // Importar useAdmin

export default function Sidebar({ isCollapsed, toggleSidebar, darkMode }) {
  const location = useLocation();
  const [open, setOpen] = useState(false); // Estado para el menú móvil
  const { isAuthenticated } = useAdmin(); // Obtener estado de autenticación

  const links = [
    { path: "/", label: "Inicio", icon: <Home size={20} /> },
    { path: "/ecoalas", label: "EcoAlas", icon: <BookOpen size={20} /> },
    { path: "/georutas", label: "Georutas", icon: <Map size={20} /> },
    { path: "/semillero", label: "Semillero", icon: <Users size={20} /> },
    { path: "/planetavivo", label: "Planeta Vivo", icon: <Image size={20} /> },
    { path: "/zonotrichia", label: "Zonotrichia", icon: <Bird size={20} /> },
    { path: "/verdesaber", label: "Verde Saber", icon: <Leaf size={20} /> },
  ];

  return (
    <>
      {/* Botón hamburguesa (solo móvil) */}
      <button
        onClick={() => setOpen(!open)}
        className={`md:hidden fixed top-4 left-4 z-50 p-2 rounded shadow-lg transition-colors ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay (móvil) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        ></div>
      )}
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 flex flex-col h-screen z-40 shadow-xl rounded-tr-lg rounded-br-lg
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${isCollapsed ? "w-20" : "w-64"} transition-all duration-300
          ${darkMode 
            ? 'bg-gray-800 text-gray-100' 
            : 'bg-white text-gray-700 border-r border-gray-200'
          }
        `}
      >
        {/* Encabezado */}
        <div className={`flex items-center mb-8 px-4 pt-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && <h1 className="text-2xl font-bold">🌿 Aves</h1>}
          <button
            onClick={toggleSidebar}
            className={`hidden md:flex p-1 rounded transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 space-y-2 px-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded transition-colors ${isCollapsed ? 'justify-center' : ''} ${ 
                location.pathname === link.path
                  ? "bg-cyan-500 text-white font-semibold"
                  : darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              {link.icon}
              {!isCollapsed && <span>{link.label}</span>}
            </Link>
          ))}
          
          <Link
            to={isAuthenticated ? "/admin/semillero" : "/login"}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-4 py-2 rounded transition-colors ${isCollapsed ? 'justify-center' : ''} ${ 
              location.pathname.startsWith('/admin') || location.pathname.startsWith('/login')
                ? "bg-cyan-500 text-white font-semibold"
                : darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <Shield size={20} />
            {!isCollapsed && <span>Dashboard</span>}
          </Link>
        </nav>

        {/* Footer fijo */}
        <div className="border-t mt-6 py-3 px-4 flex items-center gap-2">
          <Leaf className="text-emerald-400" size={16} />
          {!isCollapsed && (
            <div className="text-sm">
              <p className="font-semibold">Tecnoacademia</p>
              <p className="text-gray-500 text-xs">Manizales, Caldas</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}