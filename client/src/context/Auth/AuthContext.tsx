import { createContext, useEffect, useMemo, useState } from 'react';
import { userSession } from '@/services/api/handlers/users';
import { TNewUser } from '@/services/api/handlers/users/types';

interface AuthContextType {
  state: {
    user: Record<string, string>;
    isAuthenticated: boolean;
    loading: boolean;
    error: Record<string, string>;
    token: string | undefined;
  }
  actions: {
    login: () => void;
    logout: () => void;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    handleUserSessions: () => void;
    handleUserInfo: (data: TNewUser) => void;
    handleLogout: () => void;
  }
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = (props: any) => {
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});
  const [token, setToken] = useState(undefined);

  const state = useMemo(() => ({ user, isAuthenticated, loading, error, token }), [user, isAuthenticated, loading, error, token])

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  const handleUserSessions = async () => {
    try {
      setLoading(true)
      const { token, user } = await userSession();
      setUser(user)
      setToken(token)
    } catch (err) {
      //@ts-ignore
      setError(err.response?.data);
      handleLogout();
    } finally {
      setLoading(false);
    }
  }

  const handleUserInfo = async (data: TNewUser) => {
    setUser(data)
  }

  const handleLogout = async () => {
    logout();
    setUser({});
    setToken(undefined);
    localStorage.removeItem('token');
  }

  useEffect(() => {
    handleUserSessions();
  },[])

  const actions = { login, logout, setLoading, setError, handleUserSessions, handleUserInfo, handleLogout };

  return (
    <AuthContext.Provider value={{ state, actions }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;