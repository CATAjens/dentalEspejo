import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  role: 'admin' | 'doctor' | 'receptionist';
  createdAt: string;
}

const UsersCRUD: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isActive: true,
    role: 'receptionist' as 'admin' | 'doctor' | 'receptionist'
  });

  // Cargar usuarios desde localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers);
        setUsers(parsedUsers);
      } catch (error) {
        console.error('Error parsing users from localStorage:', error);
        setUsers([]);
      }
    } else {
      // Si no hay usuarios, inicializar con datos de ejemplo
      const sampleUsers = [
        {
          id: '1',
          name: 'Dr. María González',
          email: 'maria.gonzalez@clinicadental.com',
          password: 'password123',
          isActive: true,
          role: 'admin' as const,
          createdAt: '2024-01-01T10:00:00Z'
        },
        {
          id: '2',
          name: 'Dr. Carlos Ruiz',
          email: 'carlos.ruiz@clinicadental.com',
          password: 'password123',
          isActive: true,
          role: 'doctor' as const,
          createdAt: '2024-01-02T10:00:00Z'
        },
        {
          id: '3',
          name: 'Ana López',
          email: 'ana.lopez@clinicadental.com',
          password: 'password123',
          isActive: false,
          role: 'receptionist' as const,
          createdAt: '2024-01-03T10:00:00Z'
        }
      ];
      localStorage.setItem('users', JSON.stringify(sampleUsers));
      setUsers(sampleUsers);
    }
  }, []);

  // Guardar usuarios en localStorage
  const saveUsers = (updatedUsers: User[]) => {
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  // Limpiar formulario
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      isActive: true,
      role: 'receptionist'
    });
    setEditingUser(null);
  };

  // Abrir modal para crear/editar
  const openModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: user.password,
        isActive: user.isActive,
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
  const createUser = () => {
    if (!validateForm()) return;

    const newUser: User = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      isActive: formData.isActive,
      role: formData.role,
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    closeModal();
  };

  // Actualizar usuario
  const updateUser = () => {
    if (!validateForm() || !editingUser) return;

    const updatedUsers = users.map(user =>
      user.id === editingUser.id
        ? {
            ...user,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            isActive: formData.isActive,
            role: formData.role
          }
        : user
    );

    saveUsers(updatedUsers);
    closeModal();
  };

  // Eliminar usuario
  const deleteUser = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      const updatedUsers = users.filter(user => user.id !== id);
      saveUsers(updatedUsers);
    }
  };

  // Toggle estado activo
  const toggleUserStatus = (id: string) => {
    const updatedUsers = users.map(user =>
      user.id === id ? { ...user, isActive: !user.isActive } : user
    );
    saveUsers(updatedUsers);
  };

  return (
    <div className="users-crud">
      <div className="crud-header">
        <h2>Gestión de Usuarios</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <i className="fas fa-plus"></i> Nuevo Usuario
        </button>
      </div>

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
                  <tr key={user.id} className={!user.isActive ? 'inactive' : ''}>
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
                        className={`status-toggle ${user.isActive ? 'active' : 'inactive'}`}
                        onClick={() => toggleUserStatus(user.id)}
                      >
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-edit"
                          onClick={() => openModal(user)}
                          title="Editar"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-delete"
                          onClick={() => deleteUser(user.id)}
                          title="Eliminar"
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
              <form onSubmit={e => { e.preventDefault(); editingUser ? updateUser() : createUser(); }}>
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
                       name="isActive"
                       checked={formData.isActive}
                       onChange={handleInputChange}
                       style={{ display: 'none' }}
                     />
                     <span className="checkmark"></span>
                     Usuario Activo
                   </label>
                 </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingUser ? 'Actualizar' : 'Crear'} Usuario
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
