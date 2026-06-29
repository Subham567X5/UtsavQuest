import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function UtsavQuestLogo({ className = '', size = 'md' }: LogoProps) {
  const dimensionClass = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-16 h-16' : 'w-11 h-11';

  return (
    <div className={`relative flex items-center justify-center select-none shrink-0 ${dimensionClass} ${className}`}>
      {/* Ambient Backlight Glow */}
      <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-md animate-pulse pointer-events-none" />

      <svg className="w-full h-full relative" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logo-pink-purple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" /> {/* rose-500 */}
            <stop offset="50%" stopColor="#ec4899" /> {/* pink-500 */}
            <stop offset="100%" stopColor="#8b5cf6" /> {/* violet-500 */}
          </linearGradient>
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Star Dust Spinning Dotted Ring */}
        <circle 
          cx="50" 
          cy="50" 
          r="44" 
          stroke="url(#logo-pink-purple)" 
          strokeWidth="2" 
          strokeDasharray="6 8" 
          className="origin-center animate-[spin_20s_linear_infinite]" 
        />

        {/* 2. Soft Glowing Background Circle */}
        <circle cx="50" cy="50" r="38" fill="#0c0a09" fillOpacity="0.8" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" />

        {/* 3. Magical Sparkle Stars inside */}
        <path 
          d="M 50 16 L 52 23 L 59 25 L 52 27 L 50 34 L 48 27 L 41 25 L 48 23 Z" 
          fill="#fef08a" 
          className="animate-pulse" 
        />
        <circle cx="28" cy="38" r="1.5" fill="#fde047" className="animate-ping" />
        <circle cx="72" cy="62" r="2" fill="#fde047" className="animate-pulse" />

        {/* 4. Present / Gift Box Base */}
        <rect 
          x="32" 
          y="46" 
          width="36" 
          height="28" 
          rx="5" 
          fill="url(#logo-pink-purple)" 
          filter="url(#neon-glow)" 
        />

        {/* 5. Gift Lid */}
        <rect 
          x="28" 
          y="40" 
          width="44" 
          height="7" 
          rx="2" 
          fill="#f43f5e" 
          stroke="#ffffff" 
          strokeOpacity="0.15" 
          strokeWidth="1" 
        />

        {/* 6. Gold Ribbon Wrap */}
        <rect x="47" y="40" width="6" height="34" fill="#fbbf24" />
        <rect x="32" y="57" width="36" height="5" fill="#fbbf24" />

        {/* 7. Gold Ribbon Bow Ribbon loops */}
        <path 
          d="M 47 40 C 40 32 32 36 47 40 Z" 
          fill="#fbbf24" 
          stroke="#d97706" 
          strokeWidth="0.5" 
        />
        <path 
          d="M 53 40 C 60 32 68 36 53 40 Z" 
          fill="#fbbf24" 
          stroke="#d97706" 
          strokeWidth="0.5" 
        />

        {/* 8. Center Jewel/Heart on the Bow */}
        <path 
          d="M 50 37.5 C 50 37.5 48 35.5 48 34 C 48 32.5 49 32 50 33 C 51 32 52 32.5 52 34 C 52 35.5 50 37.5 50 37.5 Z" 
          fill="#f43f5e" 
        />
      </svg>
    </div>
  );
}
