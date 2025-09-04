import { supabase } from '../config/supabase';

export interface Appointment {
  id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  service: 'BRACKETS' | 'PROTESIS' | 'ENDODONCIAS' | 'IMPLANTES';
  appointment_date: string;
  appointment_time: string;
  status: 'PENDIENTE' | 'CONFIRMADA' | 'COMPLETADA' | 'CANCELADA';
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// Obtener todas las citas
export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true });

    if (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAppointments:', error);
    throw error;
  }
};

// Obtener citas por estado
export const getAppointmentsByStatus = async (status: Appointment['status']): Promise<Appointment[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('status', status)
      .order('appointment_date', { ascending: true });

    if (error) {
      console.error('Error fetching appointments by status:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAppointmentsByStatus:', error);
    throw error;
  }
};

// Crear una nueva cita
export const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select()
      .single();

    if (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createAppointment:', error);
    throw error;
  }
};

// Actualizar una cita
export const updateAppointment = async (id: string, appointmentData: Partial<Omit<Appointment, 'id' | 'created_at' | 'updated_at'>>): Promise<Appointment> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .update({ ...appointmentData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateAppointment:', error);
    throw error;
  }
};

// Actualizar solo el estado de una cita
export const updateAppointmentStatus = async (id: string, status: Appointment['status']): Promise<Appointment> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateAppointmentStatus:', error);
    throw error;
  }
};

// Eliminar una cita
export const deleteAppointment = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteAppointment:', error);
    throw error;
  }
};

// Obtener una cita por ID
export const getAppointmentById = async (id: string): Promise<Appointment | null> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching appointment by id:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getAppointmentById:', error);
    return null;
  }
};

// Buscar citas por término
export const searchAppointments = async (searchTerm: string): Promise<Appointment[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .or(`patient_name.ilike.%${searchTerm}%,patient_email.ilike.%${searchTerm}%,patient_phone.ilike.%${searchTerm}%`)
      .order('appointment_date', { ascending: true });

    if (error) {
      console.error('Error searching appointments:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in searchAppointments:', error);
    throw error;
  }
};
