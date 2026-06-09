import React from 'react';
import logo from '../assets/image-optimized.png';

export default function Logo({ className = '', compact = false }) {
  return (
    <img
      src={logo}
      alt="Burger El Khawaga"
      loading="eager"
      decoding="async"
      fetchPriority="high"
      className={`brand-logo ${compact ? 'compact' : 'full'} ${className}`.trim()}
    />
  );
}
