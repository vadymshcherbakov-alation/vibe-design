import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

export const TableIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  color = 'currentColor'
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Add the actual SVG path from your Neo design system */}
      <rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <line x1="3" y1="9" x2="21" y2="9" stroke={color} strokeWidth="2"/>
      <line x1="9" y1="21" x2="9" y2="9" stroke={color} strokeWidth="2"/>
    </svg>
  );
};