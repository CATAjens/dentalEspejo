// Datos de ejemplo para el dashboard de administración
export const sampleUsers = [
  {
    id: '1',
    name: 'Dr. María González',
    email: 'maria.gonzalez@clinicadental.com',
    password: 'password123',
    isActive: true,
    role: 'admin',
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Dr. Carlos Ruiz',
    email: 'carlos.ruiz@clinicadental.com',
    password: 'password123',
    isActive: true,
    role: 'doctor',
    createdAt: '2024-01-02T10:00:00Z'
  },
  {
    id: '3',
    name: 'Ana López',
    email: 'ana.lopez@clinicadental.com',
    password: 'password123',
    isActive: false,
    role: 'receptionist',
    createdAt: '2024-01-03T10:00:00Z'
  },
  {
    id: '4',
    name: 'Roberto Méndez',
    email: 'roberto.mendez@clinicadental.com',
    password: 'password123',
    isActive: true,
    role: 'doctor',
    createdAt: '2024-01-04T10:00:00Z'
  }
];

export const sampleAppointments = [
  {
    id: '1',
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    phone: '+52 55 1234 5678',
    service: 'Ortodoncia Digital',
    date: '2024-01-15',
    time: '10:00 AM',
    message: 'Primera consulta para evaluación de ortodoncia',
    status: 'confirmed' as const,
    createdAt: '2024-01-10T10:30:00Z'
  },
  {
    id: '2',
    name: 'Carlos Ruiz',
    email: 'carlos.ruiz@email.com',
    phone: '+52 55 2345 6789',
    service: 'Implantes Dentales',
    date: '2024-01-16',
    time: '2:00 PM',
    message: 'Consulta para implante en molar superior',
    status: 'pending' as const,
    createdAt: '2024-01-11T14:20:00Z'
  },
  {
    id: '3',
    name: 'Laura Sánchez',
    email: 'laura.sanchez@email.com',
    phone: '+52 55 3456 7890',
    service: 'Blanqueamiento LED',
    date: '2024-01-12',
    time: '11:00 AM',
    message: 'Sesión de blanqueamiento programada',
    status: 'completed' as const,
    createdAt: '2024-01-08T09:15:00Z'
  },
  {
    id: '4',
    name: 'Roberto Méndez',
    email: 'roberto.mendez@email.com',
    phone: '+52 55 4567 8901',
    service: 'Diseño de Sonrisa',
    date: '2024-01-18',
    time: '3:00 PM',
    message: 'Consulta para diseño de sonrisa con carillas',
    status: 'pending' as const,
    createdAt: '2024-01-12T16:45:00Z'
  },
  {
    id: '5',
    name: 'Ana López',
    email: 'ana.lopez@email.com',
    phone: '+52 55 5678 9012',
    service: 'Odontopediatría',
    date: '2024-01-14',
    time: '9:00 AM',
    message: 'Control dental para niño de 8 años',
    status: 'confirmed' as const,
    createdAt: '2024-01-09T11:30:00Z'
  },
  {
    id: '6',
    name: 'Miguel Torres',
    email: 'miguel.torres@email.com',
    phone: '+52 55 6789 0123',
    service: 'Emergencia Dental',
    date: '2024-01-13',
    time: '4:00 PM',
    message: 'Dolor intenso en muela, necesita atención urgente',
    status: 'cancelled' as const,
    createdAt: '2024-01-13T15:20:00Z'
  }
];

// Función para inicializar datos de ejemplo
export const initializeSampleData = () => {
  const existingData = localStorage.getItem('appointments');
  if (!existingData || JSON.parse(existingData).length === 0) {
    localStorage.setItem('appointments', JSON.stringify(sampleAppointments));
    console.log('Datos de ejemplo inicializados');
  }
};
