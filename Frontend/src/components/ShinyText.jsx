import React from 'react';

const ShinyText = ({ text, disabled = false, speed = 3, className = '' }) => {
  const shinyClass = `shiny-text ${disabled ? 'disabled' : ''} ${className}`;
  
  return (
    <span className={shinyClass} style={{ animationDuration: `${speed}s` }}>
      {text}
    </span>
  );
};

export default ShinyText; 