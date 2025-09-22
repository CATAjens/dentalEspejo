import React, { useState, useEffect } from 'react';
import { createAppointment, getAppointmentsByDate } from '../services/appointmentService';
import emailjs from '@emailjs/browser';

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
  const [occupiedTimes, setOccupiedTimes] = useState<string[]>([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailFieldError, setEmailFieldError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Limpiar errores al hacer clic en cualquier lugar
  useEffect(() => {
    const handleClickOutside = () => {
      setEmailError('');
      setEmailFieldError('');
      setPhoneError('');
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Función para validar email en tiempo real
  const validateEmail = (email: string) => {
    if (!email || email.trim() === '') {
      setEmailError('');
      setEmailFieldError('');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setEmailError('Ingrese un correo válido');
      setEmailFieldError('');
    } else {
      setEmailError('');
      setEmailFieldError('');
    }
  };

  // Función para validar teléfono en tiempo real
  const validatePhone = (phone: string) => {
    // Remover espacios y caracteres especiales, solo números
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length === 0) {
      setPhoneError('');
      return;
    }

    if (cleanPhone.length !== 9) {
      setPhoneError('El teléfono debe tener exactamente 9 dígitos');
    } else {
      setPhoneError('');
    }
  };

  // Función para cargar horarios ocupados
  const loadOccupiedTimes = async (date: string) => {
    if (!date) return;
    
    setLoadingTimes(true);
    try {
      const appointments = await getAppointmentsByDate(date);
      const times = appointments.map(apt => apt.appointment_time);
      
      // Normalizar horarios: convertir de "HH:MM:SS" a "HH:MM"
      const normalizedTimes = times.map(time => {
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
      });
      
      setOccupiedTimes(normalizedTimes);
    } catch (error) {
      // Error silencioso al cargar horarios ocupados
    } finally {
      setLoadingTimes(false);
    }
  };

  // Cargar horarios ocupados cuando cambie la fecha
  useEffect(() => {
    if (formData.date) {
      loadOccupiedTimes(formData.date);
    }
  }, [formData.date]);

  // Función para enviar email de confirmación automáticamente
  const sendConfirmationEmail = async (appointmentData: any) => {
    try {
      // Obtener configuración de EmailJS
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      // Verificar que todas las variables estén configuradas
      if (!serviceId || !templateId || !publicKey) {
        return;
      }

      // Verificar que el email del paciente esté presente
      if (!appointmentData.patient_email) {
        return;
      }

      // Inicializar EmailJS
      emailjs.init(publicKey);

      // Preparar parámetros del template (incluyendo la dirección de email)
      const templateParams = {
        patient_email: appointmentData.patient_email, // Dirección del destinatario
        numero_cita: appointmentData.numero_cita,
        appointment_date: appointmentData.appointment_date,
        appointment_time: appointmentData.appointment_time,
        service: appointmentData.service
      };

      await emailjs.send(serviceId, templateId, templateParams);
    } catch (error) {
      // Error silencioso - el email no es crítico para el funcionamiento
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar errores cuando el usuario empiece a escribir
    if (name === 'email') {
      if (emailFieldError) {
        setEmailFieldError('');
      }
      if (emailError) {
        setEmailError('');
      }
      validateEmail(value);
    }

    if (name === 'phone') {
      if (phoneError) {
        setPhoneError('');
      }
      validatePhone(value);
    }
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
      

      // Validar que el email no esté vacío
      if (!formData.email || formData.email.trim() === '') {
        setEmailFieldError('Completa este campo');
        setEmailError('');
        setLoading(false);
        return;
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setEmailError('Ingrese un correo válido');
        setEmailFieldError('');
        setLoading(false);
        return;
      }

      // Limpiar errores si todo está bien
      setEmailError('');
      setEmailFieldError('');

      // Validar teléfono
      const cleanPhone = formData.phone.replace(/\D/g, '');
      if (!formData.phone || formData.phone.trim() === '') {
        setPhoneError('El teléfono es obligatorio');
        setLoading(false);
        return;
      }

      if (cleanPhone.length !== 9) {
        setPhoneError('El teléfono debe tener exactamente 9 dígitos');
        setLoading(false);
        return;
      }

      setPhoneError('');

      // Crear objeto de cita para Supabase
      const appointmentData = {
        patient_name: formData.name,
        patient_email: formData.email.trim(), // Email limpio y obligatorio
        patient_phone: formData.phone,
        service: formData.service as 'BRACKETS' | 'PROTESIS' | 'ENDODONCIAS' | 'IMPLANTES',
        appointment_date: formattedDate, // Usar fecha formateada
        appointment_time: formData.time,
        status: 'PENDIENTE' as const,
        notes: formData.message || 'Sin observaciones' // Valor por defecto
      };

      // Crear cita en Supabase
      const newAppointment = await createAppointment(appointmentData);
      
      // Enviar email de confirmación automáticamente
      await sendConfirmationEmail({
        patient_name: formData.name,
        patient_email: formData.email,
        appointment_date: formattedDate,
        appointment_time: formData.time,
        service: formData.service,
        patient_phone: formData.phone,
        notes: formData.message,
        appointment_id: newAppointment.id,
        numero_cita: `CIT-${newAppointment.numero_cita}`
      });
      
      // Mostrar mensaje de éxito
      setError('');
      alert('¡Cita agendada exitosamente! Se ha enviado un mensaje de confirmación a tu correo.');
      
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
      
      // Cerrar el modal principal
      onClose();
    } catch (error) {
      
      // Mostrar mensaje de error específico
      if (error instanceof Error) {
        if (error.message.includes('Ingrese un correo válido')) {
          setError('Ingrese un correo válido');
        } else if (error.message.includes('email')) {
          setError('Por favor, ingresa un correo electrónico válido.');
        } else if (error.message.includes('obligatorio')) {
          setError('Por favor, completa todos los campos obligatorios.');
        } else if (error.message.includes('Ya existe una cita en este horario')) {
          // Solo recargar horarios ocupados para actualizar la vista, sin mostrar error
          if (formData.date) {
            loadOccupiedTimes(formData.date);
          }
        } else {
          setError('Por favor, completa todos los campos correctamente.');
        }
      } else {
        setError('Por favor, completa todos los campos obligatorios correctamente.');
      }
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
            <div className="form-group" style={{ position: 'relative' }}>
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="tu@gmail.com"
              />
              {(emailError || emailFieldError) && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '0',
                  marginTop: '5px',
                  zIndex: 1000
                }}>
                  <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    padding: '6px 10px',
                    fontSize: '12px',
                    color: '#333',
                    position: 'relative',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    width: '240px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-6px',
                      left: '20px',
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderBottom: '6px solid white'
                    }}></div>
                    <div style={{
                      position: 'absolute',
                      top: '-7px',
                      left: '20px',
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderBottom: '6px solid #ddd'
                    }}></div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        backgroundColor: '#ff9800',
                        color: 'white',
                        width: '16px',
                        height: '16px',
                        borderRadius: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '8px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        flexShrink: 0
                      }}>
                        !
                      </div>
                      <span>{emailError || emailFieldError}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ position: 'relative' }}>
              <label htmlFor="phone">Teléfono *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="+51 964 689 186"
              />
              {phoneError && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '0',
                  marginTop: '5px',
                  zIndex: 1000
                }}>
                  <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    padding: '6px 10px',
                    fontSize: '12px',
                    color: '#333',
                    position: 'relative',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    width: '240px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-6px',
                      left: '20px',
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderBottom: '6px solid white'
                    }}></div>
                    <div style={{
                      position: 'absolute',
                      top: '-7px',
                      left: '20px',
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderBottom: '6px solid #ddd'
                    }}></div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        backgroundColor: '#ff9800',
                        color: 'white',
                        width: '16px',
                        height: '16px',
                        borderRadius: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '8px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        flexShrink: 0
                      }}>
                        !
                      </div>
                      <span>{phoneError}</span>
                    </div>
                  </div>
                </div>
              )}
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
                disabled={loadingTimes}
              >
                <option value="">
                  {loadingTimes ? 'Cargando horarios...' : 'Selecciona una hora'}
                </option>
                {[
                  { value: '09:00', label: '09:00 AM' },
                  { value: '10:00', label: '10:00 AM' },
                  { value: '11:00', label: '11:00 AM' },
                  { value: '12:00', label: '12:00 PM' },
                  { value: '14:00', label: '02:00 PM' },
                  { value: '15:00', label: '03:00 PM' },
                  { value: '16:00', label: '04:00 PM' },
                  { value: '17:00', label: '05:00 PM' },
                  { value: '18:00', label: '06:00 PM' }
                ].map(timeSlot => {
                  const isOccupied = occupiedTimes.includes(timeSlot.value);
                  return (
                    <option 
                      key={timeSlot.value} 
                      value={timeSlot.value}
                      disabled={isOccupied}
                      style={isOccupied ? { 
                        backgroundColor: '',
                        color: 'Black',
                        fontWeight: 'normal',
                        padding: '8px 12px',
                        borderRadius: '4px'
                      } : {}}
                    >
                      {isOccupied ? `${timeSlot.label} - (Ocupado)` : timeSlot.label}
                    </option>
                  );
                })}
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
              placeholder="Cuéntanos sobre tu caso..."
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-static" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-static" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Agendando...
                </>
              ) : (
                <>Agendar Cita</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
