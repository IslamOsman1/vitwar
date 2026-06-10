import React from 'react';
import logo from '../assets/image.png';

export default function Logo({ className = '', compact = false }) {
  return (
    <img
      src={logo}
      alt="Vitwar"
      loading="eager"
      decoding="async"
      className={`brand-logo ${compact ? 'compact' : 'full'} ${className}`.trim()}
    />
  );
}
