/**
 * TiltCard Component
 * 
 * Enhanced card component with 3D tilt effect on hover.
 * Tracks mouse position to create a dynamic perspective effect.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.tiltAmount - Maximum tilt angle in degrees
 * @param {number} props.perspective - Perspective distance for 3D effect
 * @param {number} props.scale - Scale factor on hover
 * @param {number} props.transitionDuration - Animation duration in ms
 * @param {number} props.glareOpacity - Opacity of glare effect (0-1)
 * @param {number} props.glareSize - Size of glare effect
 * @returns {React.Component} Interactive card with 3D tilt effect
 */

import React, { useState, useRef, useEffect } from 'react';

const TiltCard = ({ 
  children, 
  className = '', 
  tiltAmount = 10,      
  perspective = 1000,   
  scale = 1.02,        
  transitionDuration = 200 
}) => {
  const cardRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      if (!isHovering) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const percentageX = (x - centerX) / centerX;
      const percentageY = (y - centerY) / centerY;
      
      const rotateX = percentageY * -tiltAmount;
      const rotateY = percentageX * tiltAmount;

      setCoordinates({ 
        x: rotateY, 
        y: rotateX, 
        scale, 
        translateZ: 50 
      });
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setCoordinates({ x: 0, y: 0, scale: 1, translateZ: 0 });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHovering, tiltAmount, scale]);

  const mainTransform = `
    perspective(${perspective}px)
    rotateX(${coordinates.y}deg)
    rotateY(${coordinates.x}deg)
    scale3d(${coordinates.scale || 1}, ${coordinates.scale || 1}, 1)
    translateZ(${coordinates.translateZ || 0}px)
  `;

  return (
    <div
      ref={cardRef}
      className={`tilt-card ${className}`}
      style={{
        transform: mainTransform,
        transition: !isHovering ? `transform ${transitionDuration}ms ease-out` : 'none',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        cursor: 'pointer'  
      }}
    >
      <div 
        className="tilt-card-content" 
        style={{ 
          transform: 'translateZ(2px)', 
          height: '100%'
        }}
      >
        {children}
      </div>
      
      <div
        className="ambient-light"
      />
    </div>
  );
};

export default TiltCard;