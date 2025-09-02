import React from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (user: any) => {
    // Redirigir al dashboard de administración
    navigate('/admin');
  };

  return (
    <div className="login-page">
      <Login onLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;
