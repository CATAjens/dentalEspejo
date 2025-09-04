import React, { useState } from 'react';
import { createAppointment } from '../services/appointmentService';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentCreated?: () => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose, onAppointmentCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validar que el servicio sea válido
      if (!['BRACKETS', 'PROTESIS', 'ENDODONCIAS', 'IMPLANTES'].includes(formData.service)) {
        throw new Error('Servicio no válido');
      }

      // Validar y formatear la fecha
      const selectedDate = new Date(formData.date);
      const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      
      console.log('Fecha seleccionada:', formData.date);
      console.log('Fecha formateada:', formattedDate);
      console.log('Hora seleccionada:', formData.time);

      // Crear objeto de cita para Supabase
      const appointmentData = {
        patient_name: formData.name,
        patient_email: formData.email,
        patient_phone: formData.phone,
        service: formData.service as 'BRACKETS' | 'PROTESIS' | 'ENDODONCIAS' | 'IMPLANTES',
        appointment_date: formattedDate, // Usar fecha formateada
        appointment_time: formData.time,
        status: 'PENDIENTE' as const,
        notes: formData.message || undefined
      };

      // Crear cita en Supabase
      const newAppointment = await createAppointment(appointmentData);
      
      console.log('Cita agendada:', newAppointment);
      alert('¡Cita agendada exitosamente! Te contactaremos pronto para confirmar.');
      
      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        date: '',
        time: '',
        message: ''
      });
      
      // Notificar al componente padre que se creó una cita
      if (onAppointmentCreated) {
        onAppointmentCreated();
      }
      
      onClose();
    } catch (error) {
      console.error('Error al agendar cita:', error);
      setError('Error al agendar la cita. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Agendar Cita</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form className="appointment-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              {error}
            </div>
          )}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nombre Completo *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Tu nombre completo"
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
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Teléfono *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="+52 55 1234 5678"
              />
            </div>
            <div className="form-group">
              <label htmlFor="service">Servicio de Interés *</label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona un servicio</option>
                <option value="BRACKETS">Brackets</option>
                <option value="PROTESIS">Prótesis</option>
                <option value="ENDODONCIAS">Endodoncias</option>
                <option value="IMPLANTES">Implantes</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Fecha Preferida *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label htmlFor="time">Hora Preferida *</label>
              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona una hora</option>
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="16:00">04:00 PM</option>
                <option value="17:00">05:00 PM</option>
                <option value="18:00">06:00 PM</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="message">Mensaje Adicional</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Cuéntanos sobre tu caso o cualquier información adicional..."
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Agendando...
                </>
              ) : (
                <>
                  <i className="fas fa-calendar-check"></i> Agendar Cita
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
