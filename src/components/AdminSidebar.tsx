import React from 'react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange }) => {
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

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h3><i className="fas fa-tooth"></i> DentalEspejo</h3>
        <p>Panel de Administración</p>
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
      </nav>
      
      <div className="sidebar-footer">
        <a href="/" className="btn btn-outline btn-sm">
          <i className="fas fa-home"></i> Volver al Sitio
        </a>
      </div>
    </div>
  );
};

export default AdminSidebar;
