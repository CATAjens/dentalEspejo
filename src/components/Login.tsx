import React, { useState, useEffect } from 'react';

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

    // Simular delay de autenticación
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = validateCredentials(formData.email, formData.password);

    if (user) {
      console.log('Login successful, saving user session');
      // Guardar sesión
      localStorage.setItem('currentUser', JSON.stringify(user));
      onLogin(user);
    } else {
      console.log('Login failed');
      setError('Credenciales incorrectas o usuario inactivo');
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <i className="fas fa-tooth"></i>
            <h1>Dental<span style={{ color: '#FF9E00' }}>Espejo</span></h1>
          </div>
          <h2>Panel de Administración</h2>
          <p>Ingresa tus credenciales para acceder</p>
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
              <i className="fas fa-envelope"></i>
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="usuario@clinicadental.com"
              disabled={loading}
              autoComplete="email"
              style={{ pointerEvents: 'auto', userSelect: 'text' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i>
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Ingresa tu contraseña"
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
                <i className="fas fa-sign-in-alt"></i>
                Iniciar Sesión
              </>
            )}
          </button>

          {/* Botón de prueba para debug */}
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => {
              console.log('Test button clicked');
              setFormData({
                email: 'maria.gonzalez@clinicadental.com',
                password: 'password123'
              });
            }}
            style={{ marginTop: '10px', width: '100%' }}
          >
            <i className="fas fa-flask"></i>
            Llenar Datos de Prueba
          </button>

          {/* Botón de reinicio */}
          <button 
            type="button" 
            className="btn btn-outline"
            onClick={() => {
              localStorage.removeItem('users');
              localStorage.removeItem('currentUser');
              window.location.reload();
            }}
            style={{ marginTop: '10px', width: '100%', borderColor: '#dc3545', color: '#dc3545' }}
          >
            <i className="fas fa-redo"></i>
            Reiniciar Datos
          </button>
        </form>

        <div className="login-footer">
          <p>
            <i className="fas fa-info-circle"></i>
            Solo personal autorizado puede acceder
          </p>
          <a href="/" className="back-link">
            <i className="fas fa-arrow-left"></i>
            Volver al sitio
          </a>
          
          <div style={{ 
            marginTop: '15px', 
            padding: '10px', 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            borderRadius: '5px',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'left'
          }}>
            <strong>Credenciales de prueba:</strong><br/>
            Admin: maria.gonzalez@clinicadental.com / password123<br/>
            Doctor: carlos.ruiz@clinicadental.com / password123<br/>
            Recepcionista: ana.lopez@clinicadental.com / password123 (inactivo)
          </div>
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
