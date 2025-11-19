import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bird, User, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        return;
    }
    
    setIsSubmitting(true);
    try {
      await register(username, password);
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Ocurrió un error durante el registro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md m-4">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <Bird className="mx-auto h-12 w-12 text-emerald-400" />
            <h1 className="text-3xl font-bold mt-4">Crear una Cuenta</h1>
            <p className="text-gray-400 mt-2">Únete a la comunidad de observadores de aves.</p>
          </div>
          
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="relative">
                <label htmlFor="username" className="sr-only">Usuario</label>
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    placeholder="Nombre de usuario"
                    required
                    disabled={isSubmitting}
                />
            </div>
            
            <div className="relative">
                <label htmlFor="password"className="sr-only">Contraseña</label>
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    placeholder="Contraseña"
                    required
                    disabled={isSubmitting}
                />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-emerald-500 transition-transform duration-300 ease-in-out hover:scale-[1.02] shadow-lg disabled:bg-gray-500"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Registrarse
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-medium text-emerald-400 hover:text-emerald-500">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
