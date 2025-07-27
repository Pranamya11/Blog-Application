import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutTest = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleManualLogout = async () => {
    try {
      console.log('Starting manual logout...');
      
      // Clear user state
      await logout();
      
      console.log('Logout completed, redirecting...');
      
      // Force redirect to login
      window.location.href = '/login';
    } catch (error) {
      console.error('Manual logout error:', error);
      // Force redirect anyway
      window.location.href = '/login';
    }
  };

  const handleForceLogout = () => {
    console.log('Force logout - clearing everything...');
    
    // Clear all cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    // Force redirect
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Logout Test Panel</h3>
      <p><strong>Current User:</strong> {user?.name || 'None'}</p>
      <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
      
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={handleManualLogout}
          style={{ 
            padding: '10px 20px', 
            margin: '5px', 
            backgroundColor: '#3498db', 
            color: 'white', 
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Manual Logout
        </button>
        
        <button 
          onClick={handleForceLogout}
          style={{ 
            padding: '10px 20px', 
            margin: '5px', 
            backgroundColor: '#e74c3c', 
            color: 'white', 
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Force Logout (Clear All)
        </button>
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p><strong>Debug Info:</strong></p>
        <p>Cookies: {document.cookie || 'None'}</p>
        <p>Current URL: {window.location.href}</p>
      </div>
    </div>
  );
};

export default LogoutTest; 