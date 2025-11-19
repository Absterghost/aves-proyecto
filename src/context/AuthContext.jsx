import React, { createContext, useState, useContext, useEffect } from 'react';

// NOTE: This is a mock auth system for frontend-only demonstration.
// In a real application, this logic would be handled by a secure backend server.
// Storing users and passwords in localStorage is NOT secure.

// 1. Create the context
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// 2. Crear el proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // On initial load, check if a user is already logged in via localStorage
  useEffect(() => {
    try {
      const storedUser = window.localStorage.getItem('aves_currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error reading currentUser from localStorage", error);
      setCurrentUser(null);
    }
  }, []);

  // Function to get all users from localStorage
  const getUsers = () => {
    try {
      const users = window.localStorage.getItem('aves_users');
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error("Error reading users from localStorage", error);
      return [];
    }
  };

  // Function to save all users to localStorage
  const saveUsers = (users) => {
    try {
      window.localStorage.setItem('aves_users', JSON.stringify(users));
    } catch (error) {
      console.error("Error writing users to localStorage", error);
    }
  };

  // Register a new user
  const register = (username, password) => {
    return new Promise((resolve, reject) => {
      const users = getUsers();
      const userExists = users.some(user => user.username.toLowerCase() === username.toLowerCase());

      if (userExists) {
        reject(new Error('El nombre de usuario ya existe.'));
        return;
      }
      
      const newUser = {
        id: Date.now(),
        username,
        password, // In a real app, this should be hashed!
      };

      saveUsers([...users, newUser]);
      resolve(newUser);
    });
  };

  // Login user
  const login = (username, password) => {
     // Also check for the hardcoded admin
    if (username === 'admin' && password === 'admin') {
      const adminUser = { id: 'admin', username: 'admin', isAdmin: true };
      setCurrentUser(adminUser);
      window.localStorage.setItem('aves_currentUser', JSON.stringify(adminUser));
      return true;
    }

    const users = getUsers();
    const user = users.find(
      user => user.username.toLowerCase() === username.toLowerCase() && user.password === password
    );

    if (user) {
      const loggedInUser = { id: user.id, username: user.username };
      setCurrentUser(loggedInUser);
      window.localStorage.setItem('aves_currentUser', JSON.stringify(loggedInUser));
      return true;
    }
    
    return false;
  };

  // Logout user
  const logout = () => {
    setCurrentUser(null);
    window.localStorage.removeItem('aves_currentUser');
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser, // Is true if currentUser is not null
    isAdmin: currentUser?.isAdmin || false,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};