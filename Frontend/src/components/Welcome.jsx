import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Welcome = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Auto-redirect after animation completes
    const timer = setTimeout(() => {
      setIsAnimating(false);
      navigate('/home');
    }, 4000); 

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div 
      className="welcome-page" 
      style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="welcome-container" style={{textAlign: 'center', color: 'white'}}>
        
        {/* Main Welcome Text */}
        <motion.div 
          className="welcome-text" 
          style={{marginBottom: '2rem'}}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="welcome-title" style={{fontSize: '4rem', fontWeight: '900', lineHeight: '1.2', margin: '0'}}>
            <motion.span 
              className="welcome-line" 
              style={{display: 'block', color: 'white', marginBottom: '0.2rem',height:'100px',width:'700px',fontFamily:'cursive',fontSize:'5rem'}}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Welcome To My
            </motion.span>
            <motion.span 
              className="welcome-gradient" 
              style={{display: 'block',height:'100px',width:'700px',fontFamily:'cursive',fontSize:'4rem', background: 'linear-gradient(135deg, #E74C3C 0%, #9B59B6 50%, #4A90E2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Blog Website
            </motion.span>
          </h1>
        </motion.div>

        {/* Bottom Icon */}
        <motion.div 
          className="welcome-globe" 
          style={{marginBottom: '3rem'}}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <i className="fas fa-globe" style={{fontSize: '2rem', color: 'rgba(255,255,255,0.8)'}}></i>
          <span className="icon-fallback">🌍</span>
        </motion.div>

        {/* Loading Animation */}
        <motion.div 
          className="loading-indicator"
          style={{marginTop: '2rem'}}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <motion.div
            style={{
              width: '60px',
              height: '60px',
              border: '3px solid rgba(255,255,255,0.3)',
              borderTop: '3px solid #4A90E2',
              borderRadius: '50%',
              margin: '0 auto'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <motion.p 
            style={{marginTop: '1rem', fontSize: '1rem', color: 'rgba(255,255,255,0.8)'}}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.8 }}
          >
            Loading your experience...
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Welcome; 