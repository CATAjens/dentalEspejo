import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

interface EmailConfirmationProps {
  appointmentData: {
    patient_name: string;
    patient_email: string;
    appointment_date: string;
    appointment_time: string;
    service: string;
    patient_phone: string;
    notes?: string;
    appointment_id?: string;
    numero_cita?: string;
  };
  onClose: () => void;
}

const EmailConfirmation: React.FC<EmailConfirmationProps> = ({ appointmentData, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendConfirmationEmail = async () => {
    setLoading(true);
    setError(null);

    try {
      // Configurar EmailJS
      emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

      const templateParams = {
        to_name: appointmentData.patient_name,
        to_email: appointmentData.patient_email,
        patient_name: appointmentData.patient_name,
        patient_email: appointmentData.patient_email,
        appointment_date: appointmentData.appointment_date,
        fecha: appointmentData.appointment_date,
        appointment_time: appointmentData.appointment_time,
        hora: appointmentData.appointment_time,
        service: appointmentData.service,
        motivo: appointmentData.service,
        patient_phone: appointmentData.patient_phone,
        notes: appointmentData.notes || 'Sin observaciones',
        clinica_direccion: 'Calle Nueva N°:438 Cusco',
        clinica_telefono: '+51 962236953',
        numero_cita: appointmentData.numero_cita || `CIT-${Date.now()}`
      };

      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setError('Error al enviar el correo de confirmación. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="email-confirmation-modal">
        <div className="email-confirmation-content">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h3>¡Correo Enviado!</h3>
          <p>Se ha enviado la confirmación de cita a {appointmentData.patient_email}</p>
          <p className="closing-message">Cerrando automáticamente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="email-confirmation-modal">
      <div className="email-confirmation-content">
        <div className="modal-header">
          <h3>Confirmar Cita por Correo</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="appointment-summary">
          <h4>Resumen de la Cita</h4>
          <div className="summary-item">
            <strong>Paciente:</strong> {appointmentData.patient_name}
          </div>
          <div className="summary-item">
            <strong>Correo:</strong> {appointmentData.patient_email}
          </div>
          <div className="summary-item">
            <strong>Fecha:</strong> {appointmentData.appointment_date}
          </div>
          <div className="summary-item">
            <strong>Hora:</strong> {appointmentData.appointment_time}
          </div>
          <div className="summary-item">
            <strong>Servicio:</strong> {appointmentData.service}
          </div>
          <div className="summary-item">
            <strong>Teléfono:</strong> {appointmentData.patient_phone}
          </div>
          {appointmentData.notes && (
            <div className="summary-item">
              <strong>Observaciones:</strong> {appointmentData.notes}
            </div>
          )}
        </div>

        <div className="confirmation-actions">
          <button 
            className="btn btn-static" 
            onClick={sendConfirmationEmail}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Enviando...
              </>
            ) : (
              <>
                <i className="fas fa-envelope"></i>
                Enviar Confirmación
              </>
            )}
          </button>
          <button className="btn btn-outline" onClick={onClose}>
            Cancelar
          </button>
        </div>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailConfirmation;
