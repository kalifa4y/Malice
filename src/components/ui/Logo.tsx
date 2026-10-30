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
    xs: 'w-20 sm:w-24',
    sm: 'w-32 sm:w-40',
    md: 'w-48 sm:w-56',
    lg: 'w-64 sm:w-72',
    hero: 'w-full max-w-[290px] sm:max-w-[380px] md:max-w-[450px]'
  };

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${sizeMap[size]} ${className}`}
      onClick={onClick}
    >
      <picture className="w-full h-auto">
        <source srcSet="/assets/maison-alice-logo-transparent.webp" type="image/webp" />
        <img
          src="/assets/maison-alice-logo-transparent.png"
          alt="Maison Alice - Au Pays des Saveurs"
          className="w-full h-auto object-contain pointer-events-none select-none filter drop-shadow-[0_14px_32px_rgba(0,0,0,0.85)]"
          draggable={false}
        />
      </picture>
    </div>
  );
};
