import React, { useState, useEffect } from 'react';
import { authenticateUser } from '../services/userService';

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Inicializar datos de usuarios si no existen
  useEffect(() => {
    const users = localStorage.getItem('users');
    if (!users) {
      console.log('Initializing sample users for login');
      const sampleUsers = [
        {
          id: '1',
          name: 'catajens',
          email: 'catajens69@gmail.com',
          password: 'jens123',
          isActive: true,
          role: 'admin',
          createdAt: '2024-01-01T10:00:00Z'
        }
        
      ];
      localStorage.setItem('users', JSON.stringify(sampleUsers));
      console.log('Sample users initialized');
    } else {
      console.log('Users already exist in localStorage');
    }
  }, []);

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  // Validar credenciales
  const validateCredentials = (email: string, password: string) => {
    console.log('Validating credentials for:', email, password);
    const users = localStorage.getItem('users');
    console.log('Users from localStorage:', users);
    
    if (!users) {
      console.log('No users found in localStorage');
      return null;
    }

    try {
      const userList = JSON.parse(users);
      console.log('Parsed user list:', userList);
      
      const user = userList.find((u: any) => {
        console.log('Checking user:', u.email, 'vs', email, 'password:', u.password, 'vs', password, 'active:', u.isActive);
        return u.email === email && u.password === password && u.isActive;
      });
      
      console.log('Found user:', user);
      return user || null;
    } catch (error) {
      console.error('Error parsing users:', error);
      return null;
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    setLoading(true);
    setError('');

    try {
      // Intentar autenticación con Supabase primero
      const user = await authenticateUser(formData.email, formData.password);
      
      if (user) {
        console.log('Login successful with Supabase, saving user session');
        // Convertir formato de Supabase a formato local
        const localUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          isActive: user.is_active,
          role: user.role,
          createdAt: user.created_at
        };
        localStorage.setItem('currentUser', JSON.stringify(localUser));
        onLogin(localUser);
      } else {
        // Fallback a localStorage si Supabase falla
        console.log('Supabase authentication failed, trying localStorage');
        const localUser = validateCredentials(formData.email, formData.password);
        
        if (localUser) {
          console.log('Login successful with localStorage');
          localStorage.setItem('currentUser', JSON.stringify(localUser));
          onLogin(localUser);
        } else {
          console.log('Login failed');
          setError('Credenciales incorrectas o usuario inactivo');
        }
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setError('Error de conexión. Intenta nuevamente.');
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <i className="fas fa-tooth"></i>
            <h1>DentalEspejo</h1>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={loading}
              autoComplete="email"
              style={{ pointerEvents: 'auto', userSelect: 'text' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={loading}
              autoComplete="current-password"
              style={{ pointerEvents: 'auto', userSelect: 'text' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Iniciando sesión...
              </>
            ) : (
              <>
                Iniciar Sesión
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <a href="/" className="back-link">
            <i className="fas fa-arrow-left"></i>
            Volver al sitio
          </a>
        </div>
      </div>

      <div className="login-background">
        <div className="background-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
