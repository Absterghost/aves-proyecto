import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Home } from "./pages/Home";
import EcoAlas from "./pages/EcoAlas";
import Georutas from "./pages/Georutas";
import { Semillero } from "./pages/Semillero"; // Importar Semillero como named export
import { PlanetaVivo } from "./pages/PlanetaVivo";
import Zonotrichia from "./pages/Zonotrichia";
import VerdeSaber from "./pages/VerdeSaber";
import Lightbox from "./components/Lightbox";
import Login from "./pages/Login"; // Importar Login
import Register from "./pages/Register"; // Importar Register
import AdminDashboard from "./pages/AdminDashboard"; // Importar AdminDashboard
import { useAuth } from "./context/AuthContext"; // Importar el hook
import ScrollToTop from "./components/ScrollToTop"; // Importar ScrollToTop
import * as LucideIcons from 'lucide-react'; // Importar todos los iconos de Lucide para el AuthCallToAction en Home

// Componente para rutas protegidas de administrador
const ProtectedRoute = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  // Only allow access if the user is authenticated AND is an admin
  return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

const AppContent = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  const [lightboxData, setLightboxData] = useState(null);
  const location = useLocation();
  const { isAuthenticated, currentUser, logout } = useAuth(); // Obtener currentUser y logout

  const openLightbox = (data) => setLightboxData(data);
  const closeLightbox = () => setLightboxData(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Ocultar sidebar/header/footer solo en las páginas de login/register/admin si NO está autenticado
  const isAuthPage = location.pathname.startsWith('/login') || location.pathname.startsWith('/register') || location.pathname.startsWith('/admin');
  const hideAppShell = isAuthPage && !isAuthenticated; // Hide full shell if on auth page and not logged in

  if (hideAppShell) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Redirect any other auth-like route to login if not authenticated */}
        <Route path="/admin/*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen overflow-x-hidden ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
      {lightboxData && <Lightbox data={lightboxData} onClose={closeLightbox} />}
      {/* Custom Swiper Styles */}
      <style>{`
        .swiper-button-next, .swiper-button-prev {
          color: #34d399 !important; /* emerald-400 */
          z-index: 10 !important;
        }
        .swiper-button-next {
          right: 32px !important;
        }
        .swiper-pagination-bullet-active {
          background: #34d399 !important; /* emerald-400 */
        }
      `}</style>

      <div className="flex flex-1">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)}
          darkMode={darkMode}
        />
        <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
          {/* Header always renders now, with user info conditional inside */}
          <Header 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode} 
            isAuthenticated={isAuthenticated} 
            currentUser={currentUser} 
            logout={logout} 
          />
          <main className="flex-1 p-4">
            <div className="pt-4">
              <Routes>
                <Route path="/" element={<Home darkMode={darkMode} openLightbox={openLightbox} />} />
                <Route path="/ecoalas" element={<EcoAlas openLightbox={openLightbox} />} />
                <Route path="/georutas" element={<Georutas />} />
                <Route path="/semillero" element={<Semillero openLightbox={openLightbox} />} />
                <Route path="/planetavivo" element={<PlanetaVivo openLightbox={openLightbox} />} />
                <Route path="/zonotrichia" element={<Zonotrichia />} />
                <Route path="/verdesaber" element={<VerdeSaber />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* Rutas de Admin Protegidas */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/admin/semillero" element={<AdminDashboard />} />
                </Route>
              </Routes>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  return (
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
  );
}

export { App };
