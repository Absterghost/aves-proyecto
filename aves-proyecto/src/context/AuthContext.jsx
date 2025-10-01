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
  const register = (username, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const exists = users.find((u) => u.username === username);
    if (exists) {
      return { success: false, message: "El usuario ya existe" };
    }
    const newUser = { username, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    return { success: true, message: "Usuario registrado correctamente" };
  };

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
