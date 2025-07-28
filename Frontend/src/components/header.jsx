import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TextType from './TextType';
import SplitText from './SplitText';
import ShinyText from './ShinyText';
import BlurText from './BlurText';



const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  const handleSplitTextComplete = () => {
    console.log('SplitText animation completed!');
  };

  const handleBlurTextComplete = () => {
    console.log('BlurText animation completed!');
  };

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
    <div className="centered-header">
      <div className="container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        padding: '3rem 0'
      }}>
        {/* Main Title */}
        <div className="logo-center">
          <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
            <div className="welcome-text">
              <div style={{
                background: 'linear-gradient(90deg, #4A90E2 0%, #9B59B6 50%, #E74C3C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '3rem',
                fontWeight: 'bold',
                margin: '0 0 0.5rem 0',
                textAlign: 'center'
              }}>
                <div style={{
                  background: 'linear-gradient(90deg, #4A90E2 0%, #9B59B6 50%, #E74C3C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  margin: '0',
                  textAlign: 'center'
                }}>
                  <h1 
                   

                  style={{
                    
                    background: 'linear-gradient(90deg, #4A90E2 0%, #9B59B6 50%, #E74C3C 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontSize: '5rem',
                    fontWeight: 'bold',
                    margin: '0',
                    textAlign: 'center'

                  }}>
                  Here You Can Write or Read Blogs
                </h1>
              </div>
            </div>
        </div>
      </Link>
    </div>

        {/* Navigation Links */ }
  <nav className="nav-links" style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '2rem',
    marginBottom: '2rem'
  }}>
    <Link to="/" className="nav-link" style={{
      color: '#ffffff',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '1.1rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }}>
      HOME
    </Link>
    <Link to="/my-blog" className="nav-link" style={{
      color: '#ffffff',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '1.1rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }}>
      MY BLOG
    </Link>
    <Link to="/create" className="nav-link" style={{
      color: '#ffffff',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '1.1rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }}>
      CREATE POST
    </Link>
  </nav>

  {/* Auth Buttons */ }
  <div className="auth-section" style={{
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    justifyContent: 'center'
  }}>
    {isAuthenticated ? (
      <>
        <button
          onClick={handleLogout}
          className="btn btn-secondary"
          disabled={loggingOut}
          style={{
            background: 'transparent',
            color: '#ffffff',
            border: '2px solid #ffffff',
            padding: '0.75rem 2rem',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {loggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </>
    ) : (
      <>
        <Link to="/login" className="btn btn-outline" style={{
          background: 'transparent',
          color: '#ffffff',
          border: '2px solid #ffffff',
          padding: '0.75rem 2rem',
          borderRadius: '8px',
          fontWeight: '600',
          textDecoration: 'none',
          transition: 'all 0.3s ease'
        }}>
          Login
        </Link>
        <Link to="/signup" className="btn btn-primary" style={{
          background: '#ffffff',
          color: '#000000',
          border: '2px solid #ffffff',
          padding: '0.75rem 2rem',
          borderRadius: '8px',
          fontWeight: '600',
          textDecoration: 'none',
          transition: 'all 0.3s ease'
        }}>
          SIGN UP
        </Link>
      </>
    )}
  </div>

  {/* Subtitle */ }
  <div style={{
    fontSize: '2.4rem',
    margin: '2rem 0 0 0',
    color: '#cccccc',
    textAlign: 'center',
    fontWeight: '400',
    minHeight: '2rem'
  }}>
    <TextType
      text={["A place to share thoughts, ideas, and stories with the world"]}
      typingSpeed={75}
      pauseDuration={3000}
      showCursor={true}
      cursorCharacter="|"
    />
  </div>
      </div >
    </div >
  );
};

export default Header;