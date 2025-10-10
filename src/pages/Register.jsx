import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim().length < 3) {
      setMessage("🟡 El nombre de usuario debe tener al menos 3 caracteres");
      return;
    }
    if (password.length < 6) {
      setMessage("🟡 La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("🟡 Las contraseñas no coinciden");
      return;
    }
    const result = register(username, password);
    setMessage(result.message);
    if (result.success) {
      setTimeout(() => navigate("/login"), 1500);
    }
  };

  return (
    <div className="h-screen bg-[url('src/assets/FondoRegistro.jpg')] bg-cover bg-center flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-90 p-8 rounded-xl shadow-xl w-80 border border-emerald-300 backdrop-blur-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-emerald-700 flex items-center justify-center gap-2">
          🐦 Únete a la comunidad de observadores
        </h2>

        {message && (
          <p className="text-sm mb-3 text-center text-sky-700">
            🕊️ {message}
          </p>
        )}

        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border border-emerald-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition mb-3"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-emerald-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition mb-4"
          required
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border border-emerald-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}


