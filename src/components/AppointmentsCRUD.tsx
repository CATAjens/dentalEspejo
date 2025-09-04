import React, { useState, useEffect } from 'react';
import { 
  getAppointments, 
  updateAppointmentStatus, 
  deleteAppointment,
  type Appointment 
} from '../services/appointmentService';

// Usar la interfaz del servicio

const AppointmentsCRUD: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'PENDIENTE' | 'CONFIRMADA' | 'COMPLETADA' | 'CANCELADA'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar citas desde Supabase
  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  // Filtrar citas
  const filteredAppointments = appointments.filter(appointment => {
    const matchesFilter = filter === 'all' || appointment.status === filter;
    const matchesSearch = appointment.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.patient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Actualizar estado de cita
  const handleUpdateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    try {
      await updateAppointmentStatus(id, status);
      // Recargar citas después de la actualización
      await loadAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  // Eliminar cita
  const handleDeleteAppointment = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
      try {
        await deleteAppointment(id);
        // Recargar citas después de la eliminación
        await loadAppointments();
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    // Crear fecha sin problemas de zona horaria
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Obtener color del estado
  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'PENDIENTE': return '#F39C12';
      case 'CONFIRMADA': return '#2ECC71';
      case 'COMPLETADA': return '#3498DB';
      case 'CANCELADA': return '#E74C3C';
      default: return '#95A5A6';
    }
  };

  // Obtener texto del estado
  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'PENDIENTE': return 'Pendiente';
      case 'CONFIRMADA': return 'Confirmada';
      case 'COMPLETADA': return 'Completada';
      case 'CANCELADA': return 'Cancelada';
      default: return 'Desconocido';
    }
  };

  // Obtener nombre del servicio
  const getServiceName = (service: string) => {
    switch (service) {
      case 'BRACKETS': return 'Brackets';
      case 'PROTESIS': return 'Prótesis';
      case 'ENDODONCIAS': return 'Endodoncias';
      case 'IMPLANTES': return 'Implantes';
      default: return service;
    }
  };

  return (
    <div className="appointments-crud">
      <div className="crud-header">
        <h2>Gestión de Citas</h2>
      </div>

      {/* Filtros y búsqueda */}
      <div className="crud-controls">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Buscar por nombre, email o servicio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todas
          </button>
          <button 
            className={`filter-btn ${filter === 'PENDIENTE' ? 'active' : ''}`}
            onClick={() => setFilter('PENDIENTE')}
          >
            Pendientes
          </button>
          <button 
            className={`filter-btn ${filter === 'CONFIRMADA' ? 'active' : ''}`}
            onClick={() => setFilter('CONFIRMADA')}
          >
            Confirmadas
          </button>
          <button 
            className={`filter-btn ${filter === 'COMPLETADA' ? 'active' : ''}`}
            onClick={() => setFilter('COMPLETADA')}
          >
            Completadas
          </button>
          <button 
            className={`filter-btn ${filter === 'CANCELADA' ? 'active' : ''}`}
            onClick={() => setFilter('CANCELADA')}
          >
            Canceladas
          </button>
        </div>
      </div>

      {/* Tabla de citas */}
      <div className="appointments-table">
        <table>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Contacto</th>
              <th>Servicio</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>
                  <div className="patient-info">
                    <strong>{appointment.patient_name}</strong>
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <div><i className="fas fa-envelope"></i> {appointment.patient_email}</div>
                    <div><i className="fas fa-phone"></i> {appointment.patient_phone}</div>
                  </div>
                </td>
                <td>{getServiceName(appointment.service)}</td>
                <td>{formatDate(appointment.appointment_date)}</td>
                <td>{appointment.appointment_time}</td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(appointment.status) }}
                  >
                    {getStatusText(appointment.status)}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-action btn-view"
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setShowModal(true);
                      }}
                      title="Ver detalles"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <select
                      className="status-select"
                      value={appointment.status}
                      onChange={(e) => handleUpdateAppointmentStatus(appointment.id, e.target.value as Appointment['status'])}
                    >
                      <option value="PENDIENTE">Pendiente</option>
                      <option value="CONFIRMADA">Confirmada</option>
                      <option value="COMPLETADA">Completada</option>
                      <option value="CANCELADA">Cancelada</option>
                    </select>
                    <button 
                      className="btn-action btn-delete"
                      onClick={() => handleDeleteAppointment(appointment.id)}
                      title="Eliminar"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAppointments.length === 0 && (
        <div className="no-appointments">
          <i className="fas fa-calendar-times"></i>
          <h3>No hay citas que coincidan con los filtros</h3>
          <p>Intenta cambiar los filtros o la búsqueda</p>
        </div>
      )}

      {/* Modal de detalles */}
      {showModal && selectedAppointment && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles de la Cita</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-group">
                <label>Paciente:</label>
                <p>{selectedAppointment.patient_name}</p>
              </div>
              <div className="detail-group">
                <label>Email:</label>
                <p>{selectedAppointment.patient_email}</p>
              </div>
              <div className="detail-group">
                <label>Teléfono:</label>
                <p>{selectedAppointment.patient_phone}</p>
              </div>
              <div className="detail-group">
                <label>Servicio:</label>
                <p>{getServiceName(selectedAppointment.service)}</p>
              </div>
              <div className="detail-group">
                <label>Fecha:</label>
                <p>{formatDate(selectedAppointment.appointment_date)}</p>
              </div>
              <div className="detail-group">
                <label>Hora:</label>
                <p>{selectedAppointment.appointment_time}</p>
              </div>
              <div className="detail-group">
                <label>Estado:</label>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(selectedAppointment.status) }}
                >
                  {getStatusText(selectedAppointment.status)}
                </span>
              </div>
              {selectedAppointment.notes && (
                <div className="detail-group">
                  <label>Notas:</label>
                  <p>{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsCRUD;
