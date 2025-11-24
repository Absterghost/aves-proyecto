import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import EcoAlas from "./pages/EcoAlas";
import Georutas from "./pages/Georutas";
import Semillero from "./pages/Semillero";
import PlanetaVivo from "./pages/PlanetaVivo";
import Zonotrichia from "./pages/Zonotrichia";
import VerdeSaber from "./pages/VerdeSaber";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

import SonidoGlobal from "./components/SonidoGlobal";
import FondoAnimado from "./components/FondoAnimado";
import ChatBox from "./components/ChatBox";

// 🆕 Componente de carga inicial
const LoadingScreen = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0fdf4',
    flexDirection: 'column',
    gap: '20px'
  }}>
    <div style={{
      width: '60px',
      height: '60px',
      border: '4px solid #dcfce7',
      borderTop: '4px solid #16a34a',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <h2 style={{ color: '#166534', margin: 0 }}>🌿 Cargando EcoAlas...</h2>
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

// 🆕 Componente de error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error en la aplicación:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h1>⚠️ Algo salió mal</h1>
          <p>La aplicación encontró un error. Por favor, recarga la página.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Recargar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 🆕 Mostrar pantalla de carga inicial
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          {/* Sonido ambiental global */}
          <SonidoGlobal />

          {/* Fondo animado detrás de todo */}
          <FondoAnimado />

          {/* Contenedor principal */}
          <div className="flex relative z-10" style={{ minHeight: '100vh' }}>
            <Sidebar />

            {/* Área de contenido principal */}
            <main className="flex-1 ml-0 md:ml-64 p-4 relative z-20" style={{ minHeight: '100vh' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ecoalas" element={<EcoAlas />} />
                <Route path="/georutas" element={<Georutas />} />
                <Route
                  path="/semillero"
                  element={
                    <ProtectedRoute>
                      <Semillero />
                    </ProtectedRoute>
                  }
                />
                <Route path="/planetavivo" element={<PlanetaVivo />} />
                <Route path="/zonotrichia" element={<Zonotrichia />} />
                <Route path="/verdesaber" element={<VerdeSaber />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                
                {/* 🆕 Ruta 404 para manejar URLs incorrectas */}
                <Route path="*" element={
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '50px 20px',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    margin: '20px'
                  }}>
                    <h1 style={{ color: '#dc2626', fontSize: '4rem', margin: 0 }}>404</h1>
                    <h2 style={{ color: '#374151' }}>Página no encontrada</h2>
                    <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                      La página que buscas no existe.
                    </p>
                    <a 
                      href="/"
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#16a34a',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        display: 'inline-block'
                      }}
                    >
                      Volver al Inicio
                    </a>
                  </div>
                } />
              </Routes>
            </main>
          </div>

          {/* Chat flotante (colibrí) */}
          <ChatBox />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;