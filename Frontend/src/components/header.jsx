import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <span className="text">Blogs</span>
        </Link>
        <nav>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/my-blog" className="nav-link">My Blog</Link>
          <Link to="/posts" className="nav-link">Posts</Link>
          <Link to="/create" className="nav-link">Create Post</Link>
          {isAuthenticated ? (
            <div className="auth-section">
              <span className="user-name">Welcome: {user?.name}</span>
              <button 
                onClick={handleLogout} 
                className="btn btn-secondary"
                disabled={loggingOut}
              >
                {loggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          ) : (
            <div className="auth-section">
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;