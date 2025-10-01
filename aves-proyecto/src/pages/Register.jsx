import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = register(username, password);
    setMessage(result.message);
    if (result.success) {
      setTimeout(() => navigate("/login"), 1500);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-emerald-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4">Registro</h2>
        {message && <p className="text-blue-500">{message}</p>}

        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        />

        <button
          type="submit"
          className="w-full bg-emerald-700 text-white py-2 rounded hover:bg-emerald-800"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}
