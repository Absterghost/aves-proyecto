import { UserCircle2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header({ isAuthenticated, currentUser, logout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home after logout
  };

  return (
    <header
      className={`sticky top-0 z-20 w-full p-3 transition-colors duration-300 bg-gray-800 shadow-md`}
    >
      {/* Top bar */}
      <div className="flex justify-end items-center">
        {isAuthenticated && currentUser ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 flex items-center gap-2">
              <UserCircle2 className="h-5 w-5 text-emerald-400" />
              <span className="font-semibold">{currentUser.username}</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-600 text-white font-semibold text-sm rounded-md hover:bg-red-700 transition-colors flex items-center gap-1"
            >
              <LogOut size={16} />
              Cerrar Sesión
            </button>
          </div>
        ) : (
          null
        )}
      </div>
    </header>
  );
}