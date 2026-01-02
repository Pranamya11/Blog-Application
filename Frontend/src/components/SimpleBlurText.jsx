import React, { useState, useEffect } from 'react';

const SimpleBlurText = ({ text, className = '', delay = 150 }) => {
  const [visibleWords, setVisibleWords] = useState([]);
  const words = text.split(' ');

  useEffect(() => {
    const timer = setTimeout(() => {
      // Show words one by one
      words.forEach((word, index) => {
        setTimeout(() => {
          setVisibleWords(prev => [...prev, word]);
        }, index * delay);
      });
    }, 500); // Start after 500ms

    return () => clearTimeout(timer);
  }, [text, delay]);

  return (
    <div className={className} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {words.map((word, index) => (
        <span
          key={index}
          style={{
            opacity: visibleWords.includes(word) ? 1 : 0,
            filter: visibleWords.includes(word) ? 'blur(0px)' : 'blur(10px)',
            transform: visibleWords.includes(word) ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s ease-out',
            marginRight: '8px',
            color: 'inherit'
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
};

export default SimpleBlurText; 