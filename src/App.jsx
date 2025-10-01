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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-0 md:ml-64 p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ecoalas" element={<EcoAlas />} />
              <Route path="/georutas" element={<Georutas />} />
              <Route path="/semillero" element={<ProtectedRoute><Semillero /></ProtectedRoute>} />
              <Route path="/planetavivo" element={<PlanetaVivo />} />
              <Route path="/zonotrichia" element={<Zonotrichia />} />
              <Route path="/verdesaber" element={<VerdeSaber />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
