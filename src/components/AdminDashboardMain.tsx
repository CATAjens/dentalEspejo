import React from 'react';
import AppointmentsCalendar from './AppointmentsCalendar';

const AdminDashboardMain: React.FC = () => {

  return (
    <div className="dashboard-main">
      {/* Solo el calendario */}
      <div className="dashboard-content">
        <AppointmentsCalendar />
      </div>
    </div>
  );
};

export default AdminDashboardMain;
