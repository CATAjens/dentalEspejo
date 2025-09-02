import React, { useState, useEffect } from 'react';
import { initializeSampleData } from '../utils/sampleData';
import AdminSidebar from './AdminSidebar';
import AdminDashboardMain from './AdminDashboardMain';
import AppointmentsCRUD from './AppointmentsCRUD';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Inicializar datos de ejemplo
  useEffect(() => {
    initializeSampleData();
  }, []);

  // Renderizar contenido según la pestaña activa
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboardMain />;
      case 'appointments':
        return <AppointmentsCRUD />;
      case 'users':
        return (
          <div className="tab-content">
            <h2><i className="fas fa-users"></i> Gestión de Usuarios</h2>
            <p>Esta sección estará disponible próximamente.</p>
          </div>
        );
      default:
        return <AdminDashboardMain />;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="container">
          <div className="admin-header-content">
            <div className="admin-header-info">
              <h1><i className="fas fa-tachometer-alt"></i> Panel de Administración</h1>
              <p>Gestiona tu clínica dental de forma profesional</p>
            </div>
            <div className="admin-header-actions">
              <a href="/" className="btn btn-outline">
                <i className="fas fa-home"></i> Volver al Sitio
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-layout">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="admin-main-content">
          <div className="container">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
