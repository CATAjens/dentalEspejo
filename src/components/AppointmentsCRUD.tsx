import React, { useState, useEffect } from 'react';

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

const AppointmentsCRUD: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar citas desde localStorage
  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  // Filtrar citas
  const filteredAppointments = appointments.filter(appointment => {
    const matchesFilter = filter === 'all' || appointment.status === filter;
    const matchesSearch = appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Actualizar estado de cita
  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === id ? { ...appointment, status } : appointment
    );
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  };

  // Eliminar cita
  const deleteAppointment = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
      const updatedAppointments = appointments.filter(appointment => appointment.id !== id);
      setAppointments(updatedAppointments);
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    }
  };

  // Formatear fecha
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
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pendientes
          </button>
          <button 
            className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            Confirmadas
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completadas
          </button>
          <button 
            className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
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
                    <strong>{appointment.name}</strong>
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <div><i className="fas fa-envelope"></i> {appointment.email}</div>
                    <div><i className="fas fa-phone"></i> {appointment.phone}</div>
                  </div>
                </td>
                <td>{appointment.service}</td>
                <td>{formatDate(appointment.date)}</td>
                <td>{appointment.time}</td>
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
                      onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value as Appointment['status'])}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="confirmed">Confirmada</option>
                      <option value="completed">Completada</option>
                      <option value="cancelled">Cancelada</option>
                    </select>
                    <button 
                      className="btn-action btn-delete"
                      onClick={() => deleteAppointment(appointment.id)}
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
                <p>{selectedAppointment.name}</p>
              </div>
              <div className="detail-group">
                <label>Email:</label>
                <p>{selectedAppointment.email}</p>
              </div>
              <div className="detail-group">
                <label>Teléfono:</label>
                <p>{selectedAppointment.phone}</p>
              </div>
              <div className="detail-group">
                <label>Servicio:</label>
                <p>{selectedAppointment.service}</p>
              </div>
              <div className="detail-group">
                <label>Fecha:</label>
                <p>{formatDate(selectedAppointment.date)}</p>
              </div>
              <div className="detail-group">
                <label>Hora:</label>
                <p>{selectedAppointment.time}</p>
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
              {selectedAppointment.message && (
                <div className="detail-group">
                  <label>Mensaje:</label>
                  <p>{selectedAppointment.message}</p>
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
