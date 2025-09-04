import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getAppointments, type Appointment } from '../services/appointmentService';

// Mapear los estados de Supabase a los estados del calendario
type CalendarAppointment = {
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
};

interface AppointmentsCalendarProps {
  onDateSelect?: (date: Date) => void;
}

const AppointmentsCalendar: React.FC<AppointmentsCalendarProps> = ({ onDateSelect }) => {
  const [appointments, setAppointments] = useState<CalendarAppointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDateAppointments, setSelectedDateAppointments] = useState<CalendarAppointment[]>([]);

  // Función para mapear citas de Supabase al formato del calendario
  const mapSupabaseToCalendar = (supabaseAppointment: Appointment): CalendarAppointment => {
    // Mapear estados de Supabase a estados del calendario
    const statusMap: Record<string, 'pending' | 'confirmed' | 'completed' | 'cancelled'> = {
      'PENDIENTE': 'pending',
      'CONFIRMADA': 'confirmed',
      'COMPLETADA': 'completed',
      'CANCELADA': 'cancelled'
    };

    return {
      id: supabaseAppointment.id,
      name: supabaseAppointment.patient_name,
      email: supabaseAppointment.patient_email,
      phone: supabaseAppointment.patient_phone,
      service: supabaseAppointment.service,
      date: supabaseAppointment.appointment_date, // Usar appointment_date de Supabase
      time: supabaseAppointment.appointment_time,
      message: supabaseAppointment.notes || '',
      status: statusMap[supabaseAppointment.status] || 'pending',
      createdAt: supabaseAppointment.created_at
    };
  };

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const supabaseAppointments = await getAppointments();
        console.log('Citas cargadas desde Supabase:', supabaseAppointments);
        
        const calendarAppointments = supabaseAppointments.map(mapSupabaseToCalendar);
        console.log('Citas mapeadas para calendario:', calendarAppointments);
        
        setAppointments(calendarAppointments);
      } catch (error) {
        console.error('Error loading appointments:', error);
      }
    };

    loadAppointments();
  }, []);

  // Obtener citas para una fecha específica
  const getAppointmentsForDate = (date: Date) => {
    // Crear fecha en formato YYYY-MM-DD sin problemas de zona horaria
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    return appointments.filter(appointment => appointment.date === dateString);
  };


  // Manejar selección de fecha
  const handleDateChange = (value: any) => {
    if (value && value instanceof Date) {
      setSelectedDate(value);
      const dayAppointments = getAppointmentsForDate(value);
      setSelectedDateAppointments(dayAppointments);
      if (onDateSelect) {
        onDateSelect(value);
      }
    }
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString: string) => {
    // Crear fecha sin problemas de zona horaria
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  // Formatear fecha seleccionada para mostrar
  const formatSelectedDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    return formatDate(dateString);
  };


  // Obtener color del estado
  const getStatusColor = (status: CalendarAppointment['status']) => {
    switch (status) {
      case 'pending': return '#F39C12';
      case 'confirmed': return '#2ECC71';
      case 'completed': return '#3498DB';
      case 'cancelled': return '#E74C3C';
      default: return '#95A5A6';
    }
  };

  // Obtener texto del estado
  const getStatusText = (status: CalendarAppointment['status']) => {
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
      // Usar el mismo formato de fecha que getAppointmentsForDate
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      const dayAppointments = appointments.filter(appointment => appointment.date === dateString);
      
      if (dayAppointments.length > 0) {
        // Mostrar máximo 4 puntos para no saturar la celda
        const maxDots = 4;
        const appointmentsToShow = dayAppointments.slice(0, maxDots);
        const hasMore = dayAppointments.length > maxDots;
        
        return (
          <div className="calendar-dots">
            {appointmentsToShow.map((appointment, index) => (
              <div
                key={index}
                className="appointment-dot"
                style={{ backgroundColor: getStatusColor(appointment.status) }}
                title={`${appointment.name} - ${appointment.service} (${getStatusText(appointment.status)})`}
              />
            ))}
            {hasMore && (
              <div
                className="appointment-dot more-dots"
                style={{ backgroundColor: '#6c757d' }}
                title={`+${dayAppointments.length - maxDots} citas más`}
              />
            )}
          </div>
        );
      }
    }
    return null;
  };

  // Función para personalizar las clases CSS de cada día
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      // Usar el mismo formato de fecha que getAppointmentsForDate
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
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
          formatShortWeekday={(_locale, date) => {
            const weekdays = ['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SA'];
            return weekdays[date.getDay()];
          }}
          formatMonthYear={(_locale, date) => {
            const months = [
              'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
              'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ];
            return `${months[date.getMonth()]} ${date.getFullYear()}`;
          }}
          formatDay={(_locale, date) => {
            return date.getDate().toString();
          }}
          showNeighboringMonth={false}
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
            Citas para {formatSelectedDate(selectedDate)}
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
      
    </div>
  );
};

export default AppointmentsCalendar;
