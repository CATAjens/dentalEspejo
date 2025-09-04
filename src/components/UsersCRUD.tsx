import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser, type User } from '../services/userService';

const UsersCRUD: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    is_active: true,
    role: 'receptionist' as 'admin' | 'doctor' | 'receptionist'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar usuarios desde Supabase
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };


  // Limpiar formulario
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      is_active: true,
      role: 'receptionist'
    });
    setEditingUser(null);
    setError(null);
  };

  // Abrir modal para crear/editar
  const openModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: user.password,
        is_active: user.is_active,
        role: user.role
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Validar formulario
  const validateForm = () => {
    if (!formData.name.trim()) {
      alert('El nombre es requerido');
      return false;
    }
    if (!formData.email.trim()) {
      alert('El correo electrónico es requerido');
      return false;
    }
    if (!formData.password.trim()) {
      alert('La contraseña es requerida');
      return false;
    }
    if (!formData.email.includes('@')) {
      alert('El correo electrónico no es válido');
      return false;
    }
    return true;
  };

  // Crear usuario
  const handleCreateUser = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);
      
      const newUserData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        is_active: formData.is_active,
        role: formData.role
      };

      await createUser(newUserData);
      await loadUsers(); // Recargar la lista
      closeModal();
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Error al crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  // Actualizar usuario
  const handleUpdateUser = async () => {
    if (!validateForm() || !editingUser) return;

    try {
      setLoading(true);
      setError(null);
      
      const updateData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        is_active: formData.is_active,
        role: formData.role
      };

      await updateUser(editingUser.id, updateData);
      await loadUsers(); // Recargar la lista
      closeModal();
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Error al actualizar el usuario');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        setLoading(true);
        setError(null);
        
        await deleteUser(id);
        await loadUsers(); // Recargar la lista
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Error al eliminar el usuario');
      } finally {
        setLoading(false);
      }
    }
  };

  // Toggle estado activo
  const toggleUserStatus = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const user = users.find(u => u.id === id);
      if (user) {
        await updateUser(id, { is_active: !user.is_active });
        await loadUsers(); // Recargar la lista
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      setError('Error al cambiar el estado del usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="users-crud">
      <div className="crud-header">
        <h2>Gestión de Usuarios</h2>
        <button className="btn btn-primary" onClick={() => openModal()} disabled={loading}>
          <i className="fas fa-plus"></i> Nuevo Usuario
        </button>
      </div>

      {error && (
        <div className="error-message" style={{ color: 'red', margin: '10px 0', padding: '10px', backgroundColor: '#ffe6e6', border: '1px solid #ff9999', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      {loading && (
        <div className="loading-message" style={{ textAlign: 'center', margin: '20px 0' }}>
          <i className="fas fa-spinner fa-spin"></i> Cargando...
        </div>
      )}

      <div className="crud-content">
        <div className="table-container">
          <table className="crud-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Fecha Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className={!user.is_active ? 'inactive' : ''}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {user.role === 'admin' && 'Administrador'}
                        {user.role === 'doctor' && 'Doctor'}
                        {user.role === 'receptionist' && 'Recepcionista'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`status-toggle ${user.is_active ? 'active' : 'inactive'}`}
                        onClick={() => toggleUserStatus(user.id)}
                        disabled={loading}
                      >
                        {user.is_active ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-edit"
                          onClick={() => openModal(user)}
                          title="Editar"
                          disabled={loading}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-delete"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Eliminar"
                          disabled={loading}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear/editar usuario */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
              <button className="modal-close" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={e => { e.preventDefault(); editingUser ? handleUpdateUser() : handleCreateUser(); }}>
                <div className="form-group">
                  <label htmlFor="name">Nombre Completo *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Ingresa el nombre completo"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Correo Electrónico *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="usuario@clinicadental.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Contraseña *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role">Rol *</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="receptionist">Recepcionista</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                                 <div className="form-group checkbox-group">
                   <label className="checkbox-label">
                     <input
                       type="checkbox"
                       name="is_active"
                       checked={formData.is_active}
                       onChange={handleInputChange}
                       style={{ display: 'none' }}
                     />
                     <span className="checkmark"></span>
                     Usuario Activo
                   </label>
                 </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={loading}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Procesando...
                      </>
                    ) : (
                      <>
                        {editingUser ? 'Actualizar' : 'Crear'} Usuario
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersCRUD;
