import emailjs from '@emailjs/browser';

// Configuración de EmailJS
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Inicializar EmailJS
export const initializeEmailJS = () => {
  if (!EMAILJS_PUBLIC_KEY) {
    console.error('EmailJS Public Key no encontrada en las variables de entorno');
    return false;
  }
  emailjs.init(EMAILJS_PUBLIC_KEY);
  return true;
};

// Enviar correo de confirmación
export const sendConfirmationEmail = async (appointmentData: {
  patient_name: string;
  patient_email: string;
  appointment_date: string;
  appointment_time: string;
  service: string;
  patient_phone: string;
  notes?: string;
  appointment_id?: string;
  numero_cita?: string;
}) => {
  try {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      throw new Error('Configuración de EmailJS incompleta');
    }

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
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Template de correo de confirmación (para referencia)
export const EMAIL_TEMPLATE = `
Estimado/a {{patient_name}},

Nos complace confirmar su cita en DentalEspejo:

📅 Fecha: {{appointment_date}}
🕒 Hora: {{appointment_time}}
🦷 Servicio: {{service}}
📞 Teléfono: {{patient_phone}}

Observaciones: {{notes}}

Por favor, llegue 10 minutos antes de su cita.

Ubicación: Calle Nueva N°:438 Cusco
Teléfono: +51 962236953

¡Esperamos verle pronto!

Saludos cordiales,
Dra. Lisseth Huallpa Espejo
DentalEspejo
`;
