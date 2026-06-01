import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'simple';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className = '', variant = 'light', size = 'md' }: LogoProps) {
  // Map size classes
  const sizeMap = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-14',
    xl: 'h-20'
  };

  const heightClass = sizeMap[size] || 'h-11';

  return (
    <div className={`inline-flex items-center select-none ${heightClass} ${className}`}>
      <svg 
        viewBox="0 0 350 120" 
        className="h-full w-auto" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Side: Booklet / Menu Icon (Orange #eb791e) */}
        <g id="booklet-icon">
          {/* Back page outline */}
          <path 
            d="M 12 30 H 48 L 58 12 L 80 12 V 105 H 12 Z" 
            stroke="#eb791e" 
            strokeWidth="3.5" 
            strokeLinejoin="round" 
            strokeLinecap="round"
          />
          {/* Front page outline with folder fold */}
          <path 
            d="M 12 30 L 58 30 V 111 H 12 Z" 
            stroke="#eb791e" 
            strokeWidth="3.5" 
            strokeLinejoin="round" 
            strokeLinecap="round" 
            fill="white"
          />
          {/* Detailed Fork on the left */}
          <path 
            d="M 24 52 V 70 M 24 70 V 88 M 20 52 C 20 62 28 62 28 52 M 20 52 V 57 M 28 52 V 57" 
            stroke="#eb791e" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Detailed Knife on the right */}
          <path 
            d="M 46 88 V 68 M 46 68 C 46 60 41 52 41 52 V 68 Z" 
            stroke="#eb791e" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Top and bottom horizontal decorative book-lines inside front cover */}
          <line x1="20" y1="41" x2="50" y2="41" stroke="#eb791e" strokeWidth="3" strokeLinecap="round" />
          <line x1="20" y1="99" x2="50" y2="99" stroke="#eb791e" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Right Side: Text elements */}
        {/* "Menu" in Navy Bold - styled close to original logo */}
        <text 
          x="82" 
          y="68" 
          fill="#0c3160" 
          fontSize="56" 
          fontWeight="900" 
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="-1.5px"
        >
          Menu
        </text>

        {/* Solid orange block starting under "Menu" */}
        <rect 
          x="82" 
          y="76" 
          width="264" 
          height="35" 
          rx="2" 
          fill="#eb791e" 
        />

        {/* "Sem Estresse" inside the orange block */}
        <text 
          x="86" 
          y="102" 
          fill="#ffffff" 
          fontSize="26" 
          fontWeight="800" 
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.5px"
        >
          Sem Estresse
        </text>
      </svg>
    </div>
  );
}
