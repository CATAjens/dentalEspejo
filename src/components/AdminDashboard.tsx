import React, { useState, useEffect } from 'react';
import { initializeSampleData } from '../utils/sampleData';
import AdminSidebar from './AdminSidebar';
import AdminDashboardMain from './AdminDashboardMain';
import AppointmentsCRUD from './AppointmentsCRUD';
import UsersCRUD from './UsersCRUD';

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
        return <UsersCRUD />;
      default:
        return <AdminDashboardMain />;
    }
  };

  return (
    <div className="admin-dashboard">
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
