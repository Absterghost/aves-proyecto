import React, { createContext, useState, useContext, useEffect } from 'react';
import { semilleroData } from '../data/semilleroContent';

// Función para generar un ID simple (para el frontend)
const generateId = () => Math.random().toString(36).substr(2, 9);

// Transformar los datos iniciales para que coincidan con la estructura esperada
const transformInitialSemilleroContent = () => {
  const eventos_investigacion = [];
  const salidas_de_campo = [];

  semilleroData.forEach(section => {
    const newItem = {
      id: generateId(),
      title: section.title,
      description: section.description,
      images: section.images, // Mantener el array de imágenes
    };

    if (section.title === "Salidas de campo") {
      salidas_de_campo.push(newItem);
    } else if (
      section.title === "Participación en eventos" ||
      section.title === "COP 16 – Conferencia de las Partes del Convenio sobre la Diversidad Biológica"
    ) {
      eventos_investigacion.push(newItem);
    }
  });

  return {
    eventos_investigacion,
    salidas_de_campo,
  };
};

const initialSemilleroContent = transformInitialSemilleroContent();
const LOCAL_STORAGE_KEY = 'semilleroContent';

// 1. Crear el contexto
const AdminContext = createContext();

// Hook personalizado para usar el contexto
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin debe ser usado dentro de un AdminProvider');
  }
  return context;
};

// 2. Crear el proveedor del contexto
export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [semilleroContent, setSemilleroContent] = useState(() => {
    try {
      const storedContent = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedContent ? JSON.parse(storedContent) : initialSemilleroContent;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return initialSemilleroContent;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(semilleroContent));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [semilleroContent]);

  // Simulación de login
  const login = (username, password) => {
    // En un futuro, esto llamaría a una API.
    // Por ahora, usamos credenciales quemadas.
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  // Simulación de logout
  const logout = () => {
    setIsAuthenticated(false);
  };

  // Funciones CRUD para semilleroContent
  const addSemilleroItem = (item, type) => {
    setSemilleroContent(prevContent => ({
      ...prevContent,
      [type]: [...prevContent[type], { id: generateId(), ...item }]
    }));
  };

  const updateSemilleroItem = (id, updatedItem, type) => {
    setSemilleroContent(prevContent => ({
      ...prevContent,
      [type]: prevContent[type].map(item => 
        item.id === id ? { ...item, ...updatedItem } : item
      )
    }));
  };

  const deleteSemilleroItem = (id, type) => {
    setSemilleroContent(prevContent => ({
      ...prevContent,
      [type]: prevContent[type].filter(item => item.id !== id)
    }));
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    semilleroContent,
    addSemilleroItem,
    updateSemilleroItem,
    deleteSemilleroItem,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
