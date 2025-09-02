import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Verificar si hay un usuario autenticado
  const currentUser = localStorage.getItem('currentUser');
  
  if (!currentUser) {
    // Si no hay usuario autenticado, redirigir al login
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario autenticado, mostrar el contenido protegido
  return <>{children}</>;
};

export default ProtectedRoute;
