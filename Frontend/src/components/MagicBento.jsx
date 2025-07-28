import React, { useEffect, useRef } from 'react';

const MagicBento = ({ 
  children,
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  enableTilt = true,
  enableMagnetism = true,
  clickEffect = true,
  spotlightRadius = 300,
  particleCount = 12,
  glowColor = "132, 0, 255"
}) => {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const spotlightRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let animationFrameId;

    // Create particles
    if (enableStars) {
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(${glowColor}, 0.8);
          border-radius: 50%;
          pointer-events: none;
          z-index: 10;
        `;
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        container.appendChild(particle);
        particlesRef.current.push(particle);
      }
    }

    // Create spotlight
    if (enableSpotlight) {
      const spotlight = document.createElement('div');
      spotlight.className = 'global-spotlight';
      spotlight.style.cssText = `
        position: fixed;
        width: ${spotlightRadius}px;
        height: ${spotlightRadius}px;
        background: radial-gradient(circle, rgba(${glowColor}, 0.1) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 200;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      document.body.appendChild(spotlight);
      spotlightRef.current = spotlight;
    }

    // Mouse move handler
    const handleMouseMove = (e) => {
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Update CSS custom properties for glow effect
      if (enableBorderGlow) {
        const glowX = ((x / rect.width) * 100);
        const glowY = ((y / rect.height) * 100);
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);
        const intensity = Math.max(0, 1 - (distance / maxDistance));

        container.style.setProperty('--glow-x', `${glowX}%`);
        container.style.setProperty('--glow-y', `${glowY}%`);
        container.style.setProperty('--glow-intensity', intensity.toString());
      }

      // Update spotlight
      if (enableSpotlight && spotlightRef.current) {
        const spotlight = spotlightRef.current;
        spotlight.style.left = (e.clientX - spotlightRadius / 2) + 'px';
        spotlight.style.top = (e.clientY - spotlightRadius / 2) + 'px';
        spotlight.style.opacity = '1';
      }

      // Animate particles
      if (enableStars) {
        particlesRef.current.forEach((particle, index) => {
          const speed = 0.5 + (index % 3) * 0.2;
          const time = Date.now() * 0.001 * speed;
          const x = parseFloat(particle.style.left) + Math.sin(time) * 2;
          const y = parseFloat(particle.style.top) + Math.cos(time) * 2;
          
          particle.style.left = `${Math.max(0, Math.min(100, x))}%`;
          particle.style.top = `${Math.max(0, Math.min(100, y))}%`;
        });
      }
    };

    // Mouse leave handler
    const handleMouseLeave = () => {
      if (enableBorderGlow) {
        container.style.setProperty('--glow-intensity', '0');
      }
      if (enableSpotlight && spotlightRef.current) {
        spotlightRef.current.style.opacity = '0';
      }
    };

    // Click effect
    const handleClick = (e) => {
      if (!clickEffect) return;
      
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: 20px;
        height: 20px;
        background: rgba(${glowColor}, 0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 100;
        transform: translate(-50%, -50%);
        animation: ripple 0.6s ease-out;
      `;
      
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    };

    // Add event listeners
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    if (clickEffect) {
      container.addEventListener('click', handleClick);
    }

    // Add CSS for ripple animation
    if (!document.querySelector('#magic-bento-styles')) {
      const style = document.createElement('style');
      style.id = 'magic-bento-styles';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: translate(-50%, -50%) scale(20);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (clickEffect) {
        container.removeEventListener('click', handleClick);
      }
      
      // Clean up particles
      particlesRef.current.forEach(particle => particle.remove());
      particlesRef.current = [];
      
      // Clean up spotlight
      if (spotlightRef.current) {
        spotlightRef.current.remove();
        spotlightRef.current = null;
      }
      
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [enableStars, enableSpotlight, enableBorderGlow, enableTilt, enableMagnetism, clickEffect, spotlightRadius, particleCount, glowColor]);

  const classes = [
    'card',
    textAutoHide && 'card--text-autohide',
    enableBorderGlow && 'card--border-glow',
    enableStars && 'particle-container'
  ].filter(Boolean).join(' ');

  return (
    <div ref={containerRef} className={classes}>
      {children}
    </div>
  );
};

export default MagicBento; 