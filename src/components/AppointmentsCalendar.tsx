import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

interface AppointmentsCalendarProps {
  onDateSelect?: (date: Date) => void;
}

const AppointmentsCalendar: React.FC<AppointmentsCalendarProps> = ({ onDateSelect }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDateAppointments, setSelectedDateAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  // Obtener citas para una fecha específica
  const getAppointmentsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(appointment => appointment.date === dateString);
  };

  // Obtener todas las fechas que tienen citas
  const getDatesWithAppointments = () => {
    const dates = new Set<string>();
    appointments.forEach(appointment => {
      dates.add(appointment.date);
    });
    return Array.from(dates);
  };

  // Manejar selección de fecha
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    const dayAppointments = getAppointmentsForDate(date);
    setSelectedDateAppointments(dayAppointments);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Obtener color del estado
  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'pending': return '#F39C12';
      case 'confirmed': return '#2ECC71';
      case 'completed': return '#3498DB';
      case 'cancelled': return '#E74C3C';
      default: return '#95A5A6';
    }
  };

  // Obtener texto del estado
  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmada';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return 'Desconocido';
    }
  };

  // Función para personalizar el contenido de cada día
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      const dayAppointments = appointments.filter(appointment => appointment.date === dateString);
      
      if (dayAppointments.length > 0) {
        return (
          <div className="calendar-dots">
            {dayAppointments.map((appointment, index) => (
              <div
                key={index}
                className="appointment-dot"
                style={{ backgroundColor: getStatusColor(appointment.status) }}
                title={`${appointment.name} - ${appointment.service}`}
              />
            ))}
          </div>
        );
      }
    }
    return null;
  };

  // Función para personalizar las clases CSS de cada día
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      const dayAppointments = appointments.filter(appointment => appointment.date === dateString);
      
      if (dayAppointments.length > 0) {
        return 'has-appointments';
      }
    }
    return null;
  };

  return (
    <div className="appointments-calendar">
      <div className="calendar-header">
        <h3>Calendario de Citas</h3>
      </div>
      
      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileContent={tileContent}
          tileClassName={tileClassName}
          locale="es-ES"
          formatShortWeekday={(locale, date) => {
            const weekdays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
            return weekdays[date.getDay()];
          }}
          formatMonthYear={(locale, date) => {
            const months = [
              'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
              'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ];
            return `${months[date.getMonth()]} ${date.getFullYear()}`;
          }}
        />
        
        {/* Leyenda de colores */}
        <div className="calendar-legend">
          <h4>Leyenda de Estados:</h4>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-dot" style={{ backgroundColor: '#F39C12' }}></div>
              <span>Pendiente</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ backgroundColor: '#2ECC71' }}></div>
              <span>Confirmada</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ backgroundColor: '#3498DB' }}></div>
              <span>Completada</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ backgroundColor: '#E74C3C' }}></div>
              <span>Cancelada</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Citas del día seleccionado */}
      {selectedDateAppointments.length > 0 && (
        <div className="selected-date-appointments">
          <h4>
            <i className="fas fa-list"></i> 
            Citas para {formatDate(selectedDate.toISOString().split('T')[0])}
          </h4>
          <div className="appointments-list">
            {selectedDateAppointments.map((appointment) => (
              <div key={appointment.id} className="appointment-item">
                <div className="appointment-time">
                  <i className="fas fa-clock"></i>
                  {appointment.time}
                </div>
                <div className="appointment-details">
                  <h5>{appointment.name}</h5>
                  <p>{appointment.service}</p>
                </div>
                <div className="appointment-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(appointment.status) }}
                  >
                    {getStatusText(appointment.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {selectedDateAppointments.length === 0 && (
        <div className="no-appointments-day">
          <i className="fas fa-calendar-times"></i>
          <p>No hay citas programadas para esta fecha</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentsCalendar;
