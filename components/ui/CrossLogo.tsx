import React from 'react';

interface CrossLogoProps {
  size?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
}

const CrossLogo: React.FC<CrossLogoProps> = ({ size = 64, color = '#9B7542', className = '', onClick }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      {/* Vertical bar of the cross */}
      <rect x="38" y="8" width="24" height="84" rx="4" fill={color} />
      {/* Horizontal bar of the cross */}
      <rect x="8" y="38" width="84" height="24" rx="4" fill={color} />
    </svg>
  );
};

export default CrossLogo;
