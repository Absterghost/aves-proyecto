import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Home, BookOpen, Map, Users, Image, Bird, Leaf, ChevronLeft, ChevronRight, Shield, LogIn, UserPlus, LogOut, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // Importar useAuth

export default function Sidebar({ isCollapsed, toggleSidebar, darkMode, toggleDarkMode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // Estado para el menú móvil
  const { isAuthenticated, currentUser, logout } = useAuth(); // Obtener estado de autenticación

  const links = [
    { path: "/", label: "Inicio", icon: <Home size={20} /> },
    { path: "/ecoalas", label: "EcoAlas", icon: <BookOpen size={20} /> },
    { path: "/georutas", label: "Georutas", icon: <Map size={20} /> },
    { path: "/semillero", label: "Semillero", icon: <Users size={20} /> },
    { path: "/planetavivo", label: "Planeta Vivo", icon: <Image size={20} /> },
    { path: "/zonotrichia", label: "Zonotrichia", icon: <Bird size={20} /> },
    { path: "/verdesaber", label: "Verde Saber", icon: <Leaf size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    setOpen(false); // Close sidebar on mobile after logout
    navigate('/'); // Redirect to home page
  };

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

        {/* Links principales */}
        <nav className="flex-1 space-y-2 px-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded transition-colors ${isCollapsed ? 'justify-center' : ''} ${ 
                location.pathname === link.path
                  ? "bg-emerald-500 text-white font-semibold"
                  : darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              {link.icon}
              {!isCollapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Sección de autenticación y admin */}
        <div className="mt-auto border-t border-gray-700/50 py-4 px-2">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded transition-colors ${isCollapsed ? 'justify-center' : ''} ${ 
                  location.pathname === '/login'
                    ? "bg-emerald-500 text-white font-semibold"
                    : darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <LogIn size={20} />
                {!isCollapsed && <span>Iniciar Sesión</span>}
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded transition-colors ${isCollapsed ? 'justify-center' : ''} ${ 
                  location.pathname === '/register'
                    ? "bg-emerald-500 text-white font-semibold"
                    : darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <UserPlus size={20} />
                {!isCollapsed && <span>Registrarse</span>}
              </Link>
            </>
          ) : (
            <>
              {currentUser.isAdmin && (
                <Link
                  to="/admin/semillero"
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 rounded transition-colors ${isCollapsed ? 'justify-center' : ''} ${ 
                    location.pathname.startsWith('/admin')
                      ? "bg-emerald-500 text-white font-semibold"
                      : darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <Shield size={20} />
                  {!isCollapsed && <span>Admin Dashboard</span>}
                </Link>
              )}
              <button
                onClick={handleLogout}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded transition-colors ${isCollapsed ? 'justify-center' : ''} ${ 
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <LogOut size={20} />
                {!isCollapsed && <span>Cerrar Sesión</span>}
              </button>
            </>
          )}

          {/* Dark Mode Toggle - Movido al Sidebar */}
          <button
            onClick={toggleDarkMode}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded transition-colors mt-4 ${isCollapsed ? 'justify-center' : ''} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            {!isCollapsed && (
              <span className="font-semibold">
                {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
              </span>
            )}
          </button>
        </div>

        {/* Footer fijo */}
        <div className="border-t mt-auto py-3 px-4 flex items-center gap-2 border-gray-700/50">
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