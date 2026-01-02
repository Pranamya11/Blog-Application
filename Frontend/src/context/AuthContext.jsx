import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkAuth, logout } from '../api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const authData = await checkAuth();
      if (authData.isAuthenticated) {
        setUser(authData.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear user state immediately for better UX
      setUser(null);
      
      // Call logout API
      await logout();
      
      // Force a complete logout by clearing any cached auth state
      setLoading(true);
      await checkAuthentication();
      setLoading(false);
      
      // Navigate to login page using React Router
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear user and redirect even if logout API fails
      setUser(null);
      setLoading(false);
      navigate('/login', { replace: true });
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    logout: handleLogout,
    checkAuth: checkAuthentication
  };



  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 