import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      description: 'Resumen general'
    },
    {
      id: 'appointments',
      label: 'Citas',
      icon: 'fas fa-calendar-check',
      description: 'Gestionar citas'
    },
    {
      id: 'users',
      label: 'Usuarios',
      icon: 'fas fa-users',
      description: 'Base de datos de usuarios'
    }
  ];

  const handleLogoutClick = () => {
    handleLogout();
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'doctor':
        return 'Doctor';
      case 'receptionist':
        return 'Recepcionista';
      default:
        return 'Usuario';
    }
  };

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        {currentUser ? (
          <>
            <h3>{currentUser.name}</h3>
            <p>{getRoleDisplayName(currentUser.role)}</p>
          </>
        ) : (
          <>
            <h3><i className="fas fa-tooth"></i> DentalEspejo</h3>
            <p>Panel de Administración</p>
          </>
        )}
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            <div className="nav-item-content">
              <i className={item.icon}></i>
              <div className="nav-item-text">
                <span className="nav-label">{item.label}</span>
                <span className="nav-description">{item.description}</span>
              </div>
            </div>
          </button>
        ))}
        
        {/* Botón de cerrar sesión para responsive */}
        <button
          className="nav-item nav-item-logout"
          onClick={handleLogoutClick}
        >
          <div className="nav-item-content">
            <i className="fas fa-sign-out-alt"></i>
            <div className="nav-item-text">
              <span className="nav-label">Cerrar Sesión</span>
              <span className="nav-description">Salir del sistema</span>
            </div>
          </div>
        </button>
      </nav>
      
      <div className="sidebar-footer">
        <button className="btn btn-outline btn-sm" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
