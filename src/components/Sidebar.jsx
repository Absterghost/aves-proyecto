import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Home, BookOpen, Map, Users, Image, Bird, Leaf, LogIn, UserPlus, ChevronLeft, ChevronRight } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(false); // móvil
  const [collapsed, setCollapsed] = useState(false); // pc

  const links = [
    { path: "/", label: "Inicio", icon: <Home size={20} /> },
    { path: "/ecoalas", label: "EcoAlas", icon: <BookOpen size={20} /> },
    { path: "/georutas", label: "Georutas", icon: <Map size={20} /> },
    { path: "/semillero", label: "Semillero", icon: <Users size={20} /> },
    { path: "/planetavivo", label: "Planeta Vivo", icon: <Image size={20} /> },
    { path: "/zonotrichia", label: "Zonotrichia", icon: <Bird size={20} /> },
    { path: "/verdesaber", label: "Verde Saber", icon: <Leaf size={20} /> },
    { path: "/login", label: "Login", icon: <LogIn size={20} /> },
    { path: "/register", label: "Registro", icon: <UserPlus size={20} /> },
  ];

  return (
    <>
      {/* Botón hamburguesa (solo móvil) */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 bg-emerald-700 text-white p-2 rounded"
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
          fixed top-0 left-0 h-screen bg-emerald-700 text-white flex flex-col z-40
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${collapsed ? "w-20" : "w-64"} transition-all duration-300
        `}
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-8 px-4">
          {!collapsed && <h1 className="text-2xl font-bold">🌿 Aves</h1>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex bg-emerald-800 p-1 rounded"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 space-y-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded transition ${
                location.pathname === link.path
                  ? "bg-emerald-900 font-semibold"
                  : "hover:bg-emerald-600"
              }`}
            >
              {link.icon}
              {!collapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <footer className="text-sm text-emerald-200 px-4 pb-4">
          {!collapsed && "© 2025 Proyecto Aves"}
        </footer>
      </aside>
    </>
  );
}
