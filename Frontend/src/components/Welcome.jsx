import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="welcome-page" style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div className="welcome-container" style={{textAlign: 'center', color: 'white'}}>
        
        {/* Top Icons */}
        <div className="welcome-icons" style={{display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem'}}>
          <div className="icon-circle" style={{width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'}}>
            <i className="fas fa-code"></i>
            <span className="icon-fallback">💻</span>
          </div>
          <div className="icon-circle" style={{width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'}}>
            <i className="fas fa-user"></i>
            <span className="icon-fallback">👤</span>
          </div>
          <div className="icon-circle" style={{width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'}}>
            <i className="fas fa-blog"></i>
            <span className="icon-fallback">📝</span>
          </div>
        </div>

        {/* Main Welcome Text */}
        <div className="welcome-text" style={{marginBottom: '2rem'}}>
          <h1 className="welcome-title" style={{fontSize: '4rem', fontWeight: '900', lineHeight: '1.2', margin: '0'}}>
            <span className="welcome-line" style={{display: 'block', color: 'white', marginBottom: '0.5rem'}}>Welcome To My</span>
            <span className="welcome-gradient" style={{display: 'block', background: 'linear-gradient(135deg, #E74C3C 0%, #9B59B6 50%, #4A90E2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Blog Website</span>
          </h1>
        </div>

        {/* Bottom Icon */}
        <div className="welcome-globe" style={{marginBottom: '3rem'}}>
          <i className="fas fa-globe" style={{fontSize: '2rem', color: 'rgba(255,255,255,0.8)'}}></i>
          <span className="icon-fallback">🌍</span>
        </div>

        {/* Enter Button */}
        <div className="welcome-enter">
          <Link to="/home" className="enter-btn" style={{display: 'inline-block', padding: '1rem 3rem', background: 'linear-gradient(135deg, #E74C3C 0%, #9B59B6 50%, #4A90E2 100%)', color: 'white', textDecoration: 'none', borderRadius: '50px', fontWeight: '600', fontSize: '1.2rem'}}>
            Enter Site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome; 