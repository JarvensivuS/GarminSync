/**
 * Card Component
 * 
 * A reusable card component with tilt animation effect and styling.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.isAnimated - Whether to enable animations
 * @returns {React.Component} Styled card with optional tilt effect
 */

import React, { useRef, useEffect } from 'react';

const Card = ({ children, className, onClick, isAnimated = true }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / card.clientWidth) * 100;
      const y = ((e.clientY - rect.top) / card.clientHeight) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    };

    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const cardContent = (
    <div 
      ref={cardRef}
      className={`card gpu-accelerated ${className || ''}`} 
      onClick={onClick} 
      style={{ cursor: 'pointer' }}
    >
      {children}
    </div>
  );

  return cardContent;
};

/**
 * CardContent Component
 * 
 * Container for card content with standardized styling
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to display
 * @param {string} props.className - Additional CSS classes
 * @returns {React.Component} Styled card content container
 */

const CardContent = ({ children, className }) => (
  <div className={`card-content ${className || ''}`}>
    {children}
  </div>
);

/**
 * CardHeader Component
 * 
 * Styled header section for cards
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Header content
 * @param {string} props.title - Card title text
 * @param {string} props.className - Additional CSS classes
 * @returns {React.Component} Styled card header
 */

const CardHeader = ({ children, title, className }) => (
  <div className={`card-header ${className || ''}`}>
    {title ? <h3 className="card-title">{title}</h3> : children}
  </div>
);

/**
 * IconText Component
 * 
 * Text with a leading icon, commonly used in cards
 * 
 * @param {Object} props
 * @param {React.ComponentType} props.Icon - Icon component to render
 * @param {string} props.text - Label text
 * @param {string|number} props.value - Value to display
 * @returns {React.Component} Styled text with icon
 */

const IconText = ({ Icon, text, value }) => (
  <div className="icon-text">
    <Icon className="icon" />
    <span>{text}: {value}</span>
  </div>
);

export { Card, CardContent, CardHeader, IconText };