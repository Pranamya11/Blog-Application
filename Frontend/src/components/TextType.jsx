import React, { useState, useEffect } from 'react';

const TextType = ({ 
  text, 
  typingSpeed = 75, 
  pauseDuration = 1500, 
  showCursor = true, 
  cursorCharacter = "|" 
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showCursorState, setShowCursorState] = useState(true);

  useEffect(() => {
    if (!text || text.length === 0) return;

    const currentText = text[currentTextIndex];
    
    if (isTyping) {
      if (currentCharIndex < currentText.length) {
        const timer = setTimeout(() => {
          setCurrentCharIndex(currentCharIndex + 1);
        }, typingSpeed);
        return () => clearTimeout(timer);
      } else {
        // Finished typing current text
        setIsTyping(false);
        setTimeout(() => {
          setCurrentCharIndex(0);
          setCurrentTextIndex((currentTextIndex + 1) % text.length);
          setIsTyping(true);
        }, pauseDuration);
      }
    }
  }, [currentTextIndex, currentCharIndex, isTyping, text, typingSpeed, pauseDuration]);

  useEffect(() => {
    if (showCursor) {
      const cursorTimer = setInterval(() => {
        setShowCursorState(prev => !prev);
      }, 500);
      return () => clearInterval(cursorTimer);
    }
  }, [showCursor]);

  if (!text || text.length === 0) return null;

  const currentText = text[currentTextIndex];
  const displayedText = currentText.substring(0, currentCharIndex);

  return (
    <span className="text-type">
      {displayedText}
      {showCursor && (
        <span 
          className={`text-type__cursor ${!showCursorState ? 'text-type__cursor--hidden' : ''}`}
        >
          {cursorCharacter}
        </span>
      )}
    </span>
  );
};

export default TextType; 