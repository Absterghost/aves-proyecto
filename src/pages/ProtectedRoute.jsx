import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h2>🔒 Acceso Restringido</h2>
        <p>Necesitas iniciar sesión para acceder a esta página.</p>
        <a 
          href="/login"
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#16a34a',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            marginTop: '10px'
          }}
        >
          Iniciar Sesión
        </a>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;