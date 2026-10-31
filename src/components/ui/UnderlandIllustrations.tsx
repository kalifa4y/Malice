import React from 'react';

/**
 * Custom Animated SVG Illustrations anchored in Tim Burton's Alice in Wonderland (Underland / 10/6)
 */

export const AnimatedHatterHatSvg: React.FC<{ className?: string }> = ({
  className = 'w-14 h-14'
}) => (
  <svg
    className={className}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Magical floating sparkles */}
    <circle cx="16" cy="20" r="2" fill="currentColor" className="animate-ping opacity-60" />
    <circle cx="66" cy="18" r="1.8" fill="currentColor" className="animate-pulse" />

    <g className="origin-center animate-[wiggle_4s_ease-in-out_infinite]">
      {/* HatPins */}
      <line x1="24" y1="36" x2="12" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="11" cy="15" r="3.2" fill="var(--theme-primary)" stroke="currentColor" strokeWidth="1.4" />
      <line x1="27" y1="40" x2="14" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="13" cy="25" r="2.2" fill="currentColor" />

      {/* Flared Victorian Top Hat Crown */}
      <path
        d="M24 54L19 20C28 15 52 15 61 20L56 54Z"
        fill="var(--theme-surface)"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Copper Ribbon Band */}
      <path
        d="M23 44H57L56 54H24L23 44Z"
        fill="var(--theme-primary)"
        fillOpacity="0.35"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      {/* 10/6 Tag Card */}
      <g transform="rotate(11 50 39)">
        <rect
          x="41"
          y="30"
          width="17"
          height="14"
          rx="2"
          fill="#FAF3E0"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <text
          x="49.5"
          y="40"
          textAnchor="middle"
          fill="#1B120C"
          fontSize="7.2"
          fontWeight="bold"
          fontFamily="Georgia, serif"
        >
          10/6
        </text>
      </g>

      {/* Curved Brim */}
      <path
        d="M11 54C18 59 62 59 69 54C66 50 14 50 11 54Z"
        fill="var(--theme-surface)"
        stroke="currentColor"
        strokeWidth="2.2"
      />
    </g>
  </svg>
);

export const AnimatedPotionFlaskSvg: React.FC<{ className?: string }> = ({
  className = 'w-14 h-14'
}) => (
  <svg
    className={className}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Cork stopper */}
    <path
      d="M35 12H45L43 21H37L35 12Z"
      fill="currentColor"
      fillOpacity="0.45"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    {/* Bottle neck ring */}
    <rect x="33" y="21" width="14" height="4" rx="2" stroke="currentColor" strokeWidth="2" />

    {/* Faceted Crystal Flask */}
    <path
      d="M36 25V32L21 46C19 48 19 52 20 55L24 64C25 66 28 68 31 68H49C52 68 55 66 56 64L60 55C61 52 61 48 59 46L44 32V25"
      fill="var(--theme-surface)"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />

    {/* Bubbling Glowing Elixir inside */}
    <path
      d="M23 51C29 48 35 53 41 50C47 47 53 51 57 50L54 62C53 64 51 65 48 65H32C29 65 27 64 26 62L23 51Z"
      fill="var(--theme-primary)"
      fillOpacity="0.7"
      className="animate-pulse"
    />

    {/* Rising Potion Bubbles */}
    <circle cx="35" cy="56" r="2.2" fill="#fff" className="animate-bounce" />
    <circle cx="44" cy="52" r="1.6" fill="#fff" className="animate-ping" />
    <circle cx="40" cy="44" r="1.5" fill="currentColor" className="animate-pulse" />

    {/* Hanging "BOIS-MOI" Mini Tag */}
    <path d="M44 28L56 33" stroke="currentColor" strokeWidth="1.4" />
    <rect
      x="52"
      y="31"
      width="18"
      height="10"
      rx="1.5"
      fill="#FAF3E0"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <line x1="55" y1="36" x2="67" y2="36" stroke="#7A1C2E" strokeWidth="1.5" />
  </svg>
);

export const AnimatedChronosphereWatchSvg: React.FC<{ className?: string }> = ({
  className = 'w-14 h-14'
}) => (
  <svg
    className={className}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Top Crown Bow */}
    <circle cx="40" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
    <rect x="37" y="17" width="6" height="4" fill="currentColor" />

    {/* Rotating Outer Chronosphere Ring */}
    <ellipse
      cx="40"
      cy="44"
      rx="28"
      ry="24"
      stroke="var(--theme-primary)"
      strokeWidth="1.6"
      strokeDasharray="5 3"
      className="origin-center animate-[spin_14s_linear_infinite]"
    />

    {/* Watch Gold Case */}
    <circle
      cx="40"
      cy="44"
      r="21"
      fill="var(--theme-surface)"
      stroke="currentColor"
      strokeWidth="2.4"
    />
    <circle
      cx="40"
      cy="44"
      r="17"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.5"
    />

    {/* Clock Hands */}
    <line
      x1="40"
      y1="44"
      x2="40"
      y2="31"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      className="origin-[40px_44px] animate-[spin_8s_linear_infinite]"
    />
    <line
      x1="40"
      y1="44"
      x2="50"
      y2="44"
      stroke="var(--theme-primary)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="40" cy="44" r="2.5" fill="currentColor" />
  </svg>
);

export const AnimatedWaxSealQuillSvg: React.FC<{ className?: string }> = ({
  className = 'w-14 h-14'
}) => (
  <svg
    className={className}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Parchment Card */}
    <rect
      x="16"
      y="20"
      width="44"
      height="44"
      rx="6"
      fill="var(--theme-surface)"
      stroke="currentColor"
      strokeWidth="2"
    />
    <line x1="24" y1="31" x2="46" y2="31" stroke="currentColor" strokeWidth="1.6" strokeOpacity="0.6" strokeLinecap="round" />
    <line x1="24" y1="38" x2="40" y2="38" stroke="currentColor" strokeWidth="1.6" strokeOpacity="0.4" strokeLinecap="round" />

    {/* Pulsing Royal Wax Seal */}
    <g className="animate-pulse">
      <circle
        cx="46"
        cy="52"
        r="11"
        fill="var(--theme-primary)"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M46 56.5C46 56.5 41 53.2 41 49.8C41 48.2 42.3 47 43.8 47C44.8 47 45.6 47.5 46 48.3C46.4 47.5 47.2 47 48.2 47C49.7 47 51 48.2 51 49.8C51 53.2 46 56.5 46 56.5Z"
        fill="currentColor"
      />
    </g>

    {/* Floating Feather Quill */}
    <path
      d="M46 42L65 15C65 15 54 17 49 25C45 31 46 42 46 42Z"
      fill="currentColor"
      fillOpacity="0.25"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

export const AnimatedGoldenKeySvg: React.FC<{ className?: string }> = ({
  className = 'w-6 h-6'
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    aria-hidden="true"
  >
    <circle cx="8" cy="8" r="4.5" className="animate-pulse" />
    <path d="M11.5 11.5L20 20M17 17L19.5 14.5M19.5 19.5L21.5 17.5" strokeLinecap="round" />
  </svg>
);

export const ItemMicroIllustration: React.FC<{ text: string; className?: string }> = ({
  text,
  className = 'w-4 h-4'
}) => {
  const lower = text.toLowerCase();

  // 1. Key / Clé
  if (lower.includes('clé')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="7.5" cy="7.5" r="4" />
        <path d="M10.5 10.5L20 20M16 16l2.5-2.5M18.5 18.5L21 16" strokeLinecap="round" />
      </svg>
    );
  }

  // 2. Potion / Fiole / Bois-Moi
  if (lower.includes('fiole') || lower.includes('bois-moi') || lower.includes('pishsalver')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M9 3h6M10 3v5l-5 7a3 3 0 0 0 2.5 4.5h9A3 3 0 0 0 19 15l-5-7V3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 14h10" stroke="var(--theme-primary)" strokeLinecap="round" />
      </svg>
    );
  }

  // 3. Watch / Montre / Chronosphère / 10/6
  if (lower.includes('montre') || lower.includes('chronosphère') || lower.includes('10/6')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v4l2.5 2.5M9 2h6M12 2v3" strokeLinecap="round" />
      </svg>
    );
  }

  // 4. Heart / Cœur / Rose / Carte / Sceau
  if (
    lower.includes('cœur') ||
    lower.includes('rose') ||
    lower.includes('carte') ||
    lower.includes('sceau')
  ) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }

  // 5. Default Confectionery / Pastry / Chocolate Diamond Star
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 2l2.6 6.4L21 11l-6.4 2.6L12 20l-2.6-6.4L3 11l6.4-2.6L12 2z" strokeLinejoin="round" />
    </svg>
  );
};
