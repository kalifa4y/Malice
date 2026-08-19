import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero';
  cardSuit?: string;
  className?: string;
  onClick?: () => void;
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  className = '',
  onClick
}) => {
  const sizeMap = {
    xs: 'w-24 sm:w-28',
    sm: 'w-36 sm:w-44',
    md: 'w-56 sm:w-64',
    lg: 'w-72 sm:w-80',
    hero: 'w-full max-w-[340px] sm:max-w-[440px] md:max-w-[520px] lg:max-w-[560px]'
  };

  return (
    <div 
      className={`inline-flex items-center justify-center select-none ${sizeMap[size]} ${className}`}
      onClick={onClick}
    >
      <img
        src="/assets/maison-alice-logo-transparent.png"
        alt="Maison Alice - Au Pays des Saveurs"
        className="w-full h-auto object-contain pointer-events-none select-none filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
        draggable={false}
      />
    </div>
  );
};
