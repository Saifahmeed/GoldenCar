import React from 'react';
import logoImg from '../assets/logo.png';

export default function Logo({ height = 42, className = '' }) {
  return (
    <img
      src={logoImg}
      alt="Golden Car Stores"
      height={height}
      className={className}
      style={{
        height: `${height}px`,
        width: 'auto',
        objectFit: 'contain',
        display: 'block',
        filter: 'drop-shadow(0 0 8px rgba(227, 30, 36, 0.3))',
        transition: 'height 0.3s ease',
      }}
    />
  );
}
