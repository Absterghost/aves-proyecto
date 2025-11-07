import React, { useState, useEffect } from 'react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'editor', // Default role
  });

  // Cargar usuarios desde localStorage o datos iniciales
  useEffect(() => {
    const storedUsers = localStorage.getItem('adminUsers');
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        setUsers(parsedUsers.map(user => ({ ...user, id: user.id || Math.random().toString(36).substr(2, 9) })));
      } catch (e) {
        console.error("Error parsing adminUsers from localStorage", e);
        setUsers([]); // Fallback to empty if parsing fails
      }
    } else {
      // Datos iniciales de ejemplo si no hay nada en localStorage
      setUsers([
        { id: 'admin1', username: 'admin', password: 'admin', role: 'admin' },
        { id: 'editor1', username: 'editor', password: 'password', role: 'editor' },
      ]);
    }
  }, []);

  // Guardar usuarios en localStorage cada vez que la lista de usuarios cambie
  useEffect(() => {
    if (users.length > 0) {
      try {
        localStorage.setItem('adminUsers', JSON.stringify(users));
        console.log("Usuarios guardados en localStorage.");
      } catch (e) {
        console.error("Error guardando adminUsers en localStorage. Podría estar lleno.", e);
        alert("Advertencia: No se pudieron guardar los usuarios. El almacenamiento local del navegador podría estar lleno.");
      }
    } else if (localStorage.getItem('adminUsers')) {
      localStorage.removeItem('adminUsers');
      console.log("localStorage de adminUsers limpiado.");
    }
  }, [users]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(user =>
        user.id === editingUser.id ? { ...form, id: editingUser.id } : user
      ));
    } else {
      setUsers([...users, { ...form, id: Math.random().toString(36).substr(2, 9) }]);
    }
    setEditingUser(null);
    setForm({ username: '', password: '', role: 'editor' });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({ username: user.username, password: user.password, role: user.role });
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setForm({ username: '', password: '', role: 'editor' });
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-emerald-300 mb-6">Gestión de Usuarios</h3>

      {/* Formulario de Creación/Edición */}
      <div className="mb-8 p-6 bg-gray-700 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-4">
          {editingUser ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
        </h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">Nombre de Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={form.username}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-300">Rol</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="admin">Administrador</option>
              <option value="editor">Editor</option>
            </select>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              {editingUser ? 'Guardar Cambios' : 'Agregar Usuario'}
            </button>
            {editingUser && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Listado de Usuarios */}
      <div className="mt-8">
        <h4 className="text-lg font-semibold text-white mb-4">Usuarios Existentes</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre de Usuario</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rol</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.role === 'admin' ? 'Administrador' : 'Editor'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-indigo-400 hover:text-indigo-600 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}