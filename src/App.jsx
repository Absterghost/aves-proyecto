import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Home } from "./pages/Home";
import EcoAlas from "./pages/EcoAlas";
import Georutas from "./pages/Georutas";
import { Semillero } from "./pages/Semillero"; // Importar Semillero como named export
import PlanetaVivo from "./pages/PlanetaVivo";
import Zonotrichia from "./pages/Zonotrichia";
import VerdeSaber from "./pages/VerdeSaber";
import Lightbox from "./components/Lightbox";
import Login from "./pages/Login"; // Importar Login
import AdminDashboard from "./pages/AdminDashboard"; // Importar AdminDashboard
import { useAdmin } from "./context/AdminContext"; // Importar el hook

// Componente para rutas protegidas
const ProtectedRoute = () => {
  const { isAuthenticated } = useAdmin();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const AppContent = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  const [lightboxData, setLightboxData] = useState(null);
  const location = useLocation();
  const { isAuthenticated } = useAdmin();

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

  // Ocultar header/sidebar/footer en la página de login y en el dashboard
  const isAuthPage = location.pathname.startsWith('/login') || location.pathname.startsWith('/admin');

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/semillero" element={<AdminDashboard />} />
        </Route>
      </Routes>
    );
  }

  const showHeader = !['/', '/ecoalas', '/semillero'].includes(location.pathname);

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
          {showHeader && <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
          <main className="flex-1 p-4">
            <div className="pt-4">
              <Routes>
                <Route path="/" element={<Home darkMode={darkMode} openLightbox={openLightbox} />} />
                <Route path="/ecoalas" element={<EcoAlas openLightbox={openLightbox} />} />
                <Route path="/georutas" element={<Georutas />} />
                <Route path="/semillero" element={<Semillero openLightbox={openLightbox} />} />
                <Route path="/planetavivo" element={<PlanetaVivo />} />
                <Route path="/zonotrichia" element={<Zonotrichia />} />
                <Route path="/verdesaber" element={<VerdeSaber />} />
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
        <AppContent />
      </Router>
  );
}

export { App };
