import React from 'react';

interface CrossLogoProps {
  size?: number;
  className?: string;
  onClick?: () => void;
}

const CrossLogo: React.FC<CrossLogoProps> = ({ size = 64, className = '', onClick }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      <defs>
        <clipPath id="crossClip">
          {/* Vertical bar */}
          <rect x="62" y="4" width="76" height="192" rx="6" />
          {/* Horizontal bar */}
          <rect x="4" y="62" width="192" height="76" rx="6" />
        </clipPath>
      </defs>

      {/* Cross shape — dark background with gold border */}
      <g clipPath="url(#crossClip)">
        {/* Dark fill */}
        <rect x="0" y="0" width="200" height="200" fill="#1F1A14" />

        {/* Ornamental gold border lines */}
        {/* Vertical bar border */}
        <rect x="62" y="4" width="76" height="192" rx="6" stroke="#9B7542" strokeWidth="3" fill="none" />
        {/* Horizontal bar border */}
        <rect x="4" y="62" width="192" height="76" rx="6" stroke="#9B7542" strokeWidth="3" fill="none" />

        {/* Inner frame */}
        <rect x="68" y="10" width="64" height="180" rx="3" stroke="#9B7542" strokeWidth="1" fill="none" opacity="0.5" />
        <rect x="10" y="68" width="180" height="64" rx="3" stroke="#9B7542" strokeWidth="1" fill="none" opacity="0.5" />

        {/* Corner decorative diamonds — top arm */}
        <path d="M100 16 L106 24 L100 32 L94 24 Z" fill="#9B7542" opacity="0.8" />
        <path d="M100 38 L104 44 L100 50 L96 44 Z" fill="#9B7542" opacity="0.5" />

        {/* Bottom arm */}
        <path d="M100 168 L106 176 L100 184 L94 176 Z" fill="#9B7542" opacity="0.8" />
        <path d="M100 150 L104 156 L100 162 L96 156 Z" fill="#9B7542" opacity="0.5" />

        {/* Left arm */}
        <path d="M16 100 L24 94 L32 100 L24 106 Z" fill="#9B7542" opacity="0.8" />
        <path d="M38 100 L44 96 L50 100 L44 104 Z" fill="#9B7542" opacity="0.5" />

        {/* Right arm */}
        <path d="M168 100 L176 94 L184 100 L176 106 Z" fill="#9B7542" opacity="0.8" />
        <path d="M150 100 L156 96 L162 100 L156 104 Z" fill="#9B7542" opacity="0.5" />

        {/* Decorative corner crosses at the 4 intersections */}
        {/* Top-left intersection */}
        <line x1="68" y1="68" x2="78" y2="78" stroke="#9B7542" strokeWidth="0.8" opacity="0.6" />
        <line x1="78" y1="68" x2="68" y2="78" stroke="#9B7542" strokeWidth="0.8" opacity="0.6" />
        {/* Top-right intersection */}
        <line x1="122" y1="68" x2="132" y2="78" stroke="#9B7542" strokeWidth="0.8" opacity="0.6" />
        <line x1="132" y1="68" x2="122" y2="78" stroke="#9B7542" strokeWidth="0.8" opacity="0.6" />
        {/* Bottom-left intersection */}
        <line x1="68" y1="122" x2="78" y2="132" stroke="#9B7542" strokeWidth="0.8" opacity="0.6" />
        <line x1="78" y1="122" x2="68" y2="132" stroke="#9B7542" strokeWidth="0.8" opacity="0.6" />
        {/* Bottom-right intersection */}
        <line x1="122" y1="122" x2="132" y2="132" stroke="#9B7542" strokeWidth="0.8" opacity="0.6" />
        <line x1="132" y1="122" x2="122" y2="132" stroke="#9B7542" strokeWidth="0.8" opacity="0.6" />

        {/* Geometric African-inspired patterns along arms */}
        {/* Top arm — zigzag */}
        <polyline points="82,20 88,28 94,20" stroke="#9B7542" strokeWidth="1" fill="none" opacity="0.4" />
        <polyline points="106,20 112,28 118,20" stroke="#9B7542" strokeWidth="1" fill="none" opacity="0.4" />
        <polyline points="82,40 88,48 94,40" stroke="#9B7542" strokeWidth="1" fill="none" opacity="0.4" />
        <polyline points="106,40 112,48 118,40" stroke="#9B7542" strokeWidth="1" fill="none" opacity="0.4" />

        {/* Bottom arm — zigzag */}
        <polyline points="82,160 88,168 94,160" stroke="#9B7542" strokeWidth="1" fill="none" opacity="0.4" />
        <polyline points="106,160 112,168 118,160" stroke="#9B7542" strokeWidth="1" fill="none" opacity="0.4" />
        <polyline points="82,180 88,172 94,180" stroke="#9B7542" strokeWidth="1" fill="none" opacity="0.4" />
        <polyline points="106,180 112,172 118,180" stroke="#9B7542" strokeWidth="1" fill="none" opacity="0.4" />

        {/* Left arm — zigzag */}
        <polyline points="20,82 28,88 20,94" stroke="#9B7542" strokeWidth="1" fill="none" opacity="0.4" />
        <polyline points="20,106 28,112 20,118" stroke="#9B7542" strokeWidth="1" fill="none" opacity="0.4" />
        <polyline points="40,82 48,88 40,94" stroke="#9B7542" strokeWidth="1" fill="none" opacity="0.4" />
        <polyline points="40,106 48,112 40,118" stroke="#9B7542" strokeWidth="1" fill="none" opacity="0.4" />

        {/* Right arm — zigzag */}
        <polyline points="160,82 168,88 160,94" stroke="#9B7542" strokeWidth="1" fill="none" opacity="0.4" />
        <polyline points="160,106 168,112 160,118" stroke="#9B7542" strokeWidth="1" fill="none" opacity="0.4" />
        <polyline points="180,82 172,88 180,94" stroke="#9B7542" strokeWidth="1" fill="none" opacity="0.4" />
        <polyline points="180,106 172,112 180,118" stroke="#9B7542" strokeWidth="1" fill="none" opacity="0.4" />

        {/* Center circle with gold ring */}
        <circle cx="100" cy="100" r="26" fill="#1F1A14" stroke="#9B7542" strokeWidth="2" />
        <circle cx="100" cy="100" r="22" fill="none" stroke="#9B7542" strokeWidth="0.5" opacity="0.4" />

        {/* Woman silhouette with afro — centered */}
        <g transform="translate(100,100)" fill="#9B7542">
          {/* Afro hair — large rounded shape */}
          <ellipse cx="0" cy="-6" rx="16" ry="17" opacity="0.9" />
          {/* Face oval */}
          <ellipse cx="0" cy="-2" rx="7" ry="9" fill="#1F1A14" />
          {/* Neck */}
          <rect x="-3" y="6" width="6" height="5" fill="#1F1A14" />
          {/* Shoulders */}
          <path d="M-3 11 Q-12 14 -14 18 L14 18 Q12 14 3 11 Z" fill="#1F1A14" />
          {/* Face features — subtle gold hints */}
          <ellipse cx="-2.5" cy="-4" rx="0.8" ry="0.5" fill="#9B7542" opacity="0.5" /> {/* left eye */}
          <ellipse cx="2.5" cy="-4" rx="0.8" ry="0.5" fill="#9B7542" opacity="0.5" /> {/* right eye */}
          <ellipse cx="0" cy="1" rx="1.5" ry="0.6" fill="#9B7542" opacity="0.3" /> {/* lips */}
        </g>
      </g>
    </svg>
  );
};

export default CrossLogo;
