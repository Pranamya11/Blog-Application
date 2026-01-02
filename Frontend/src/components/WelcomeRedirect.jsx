import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomeRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to welcome page on component mount
    navigate('/');
  }, [navigate]);

  return null;
};

export default WelcomeRedirect; 