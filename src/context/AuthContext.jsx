import { createContext, useContext, useState, useEffect } from "react";

// Crear contexto
const AuthContext = createContext();

// Hook para usar el contexto fácilmente
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Cargar sesión si ya estaba guardada
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Registrar usuario
  async function register(username, password) {
    try {
      const response = await fetch("http://localhost:4000/usuarios/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.mensaje || "Error al registrar" };
      }

      return { success: true, message: data.mensaje };
    } catch (error) {
      console.error("Error en el registro:", error);
      return { success: false, message: "Error de conexión con el servidor" };
    }
  }

  // Iniciar sesión
  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const validUser = users.find(
      (u) => u.username === username && u.password === password
    );
    if (validUser) {
      setUser(validUser);
      localStorage.setItem("user", JSON.stringify(validUser));
      return { success: true };
    }
    return { success: false, message: "Credenciales incorrectas" };
  };

  // Cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

