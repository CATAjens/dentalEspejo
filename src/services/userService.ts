import { supabase } from '../config/supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'doctor' | 'receptionist';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Obtener todos los usuarios
export const getUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUsers:', error);
    throw error;
  }
};

// Crear un nuevo usuario
export const createUser = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createUser:', error);
    throw error;
  }
};

// Actualizar un usuario
export const updateUser = async (id: string, userData: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ ...userData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateUser:', error);
    throw error;
  }
};

// Eliminar un usuario
export const deleteUser = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteUser:', error);
    throw error;
  }
};

// Autenticar usuario
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error authenticating user:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in authenticateUser:', error);
    return null;
  }
};
