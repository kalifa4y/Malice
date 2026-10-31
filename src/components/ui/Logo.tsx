import React, { useRef } from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
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
  const clickCountRef = useRef(0);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sizeMap = {
    xs: 'w-20 sm:w-24',
    sm: 'w-32 sm:w-40',
    md: 'w-48 sm:w-56',
    lg: 'w-64 sm:w-72',
    xl: 'w-64 sm:w-80 md:w-96',
    hero: 'w-full max-w-[290px] sm:max-w-[380px] md:max-w-[450px]'
  };

  const handleLogoClick = () => {
    clickCountRef.current += 1;

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      window.location.hash = '#admin';
      return;
    }

    resetTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1800);

    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center select-none cursor-pointer ${sizeMap[size]} ${className}`}
      onClick={handleLogoClick}
    >
      <picture className="w-full h-auto">
        <source srcSet="/assets/maison-alice-logo-transparent.webp" type="image/webp" />
        <img
          src="/assets/maison-alice-logo-transparent.png"
          alt="Maison Alice"
          className="w-full h-auto object-contain pointer-events-none select-none filter drop-shadow-[0_14px_32px_rgba(0,0,0,0.85)]"
          draggable={false}
        />
      </picture>
    </div>
  );
};
