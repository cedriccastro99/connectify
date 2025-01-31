import { Navigate } from 'react-router-dom';
import { AuthContext } from '@/context/Auth/AuthContext'
import { useContext } from 'react';

const ProtectedRoute = ({ children }: any) => {
  const authContext = useContext(AuthContext)

  const { state } = authContext ?? {}
  const { isAuthenticated } = state ?? {}

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;