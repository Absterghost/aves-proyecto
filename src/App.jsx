import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import ChatBox from "./components/ChatBox"; // El colibrí flotante

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Sonido ambiental global */}
        <SonidoGlobal />

        {/* Fondo animado detrás de todo */}
        <FondoAnimado />

        {/* Contenedor principal */}
        <div className="flex relative z-10">
          <Sidebar />

          {/* Área de contenido principal */}
          <main className="flex-1 ml-0 md:ml-64 p-4 relative z-20">
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
            </Routes>
          </main>
        </div>

        {/* Chat flotante (colibrí) */}
        <ChatBox />
      </Router>
    </AuthProvider>
  );
}

export default App;
