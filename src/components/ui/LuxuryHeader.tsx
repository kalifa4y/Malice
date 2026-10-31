import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { ThemeConfig, ThemePeriod } from '../../types';
import { MagicClockToggle } from '../theme/MagicClockToggle';

interface LuxuryHeaderProps {
  onOpenOrder: () => void;
  currentTheme: ThemeConfig;
  allThemes: ThemeConfig[];
  currentPeriod: ThemePeriod;
  isManualOverride: boolean;
  currentTimeFormatted: string;
  onSelectTheme: (period: ThemePeriod) => void;
  onResetToRealTime: () => void;
}

export const LuxuryHeader: React.FC<LuxuryHeaderProps> = ({
  onOpenOrder,
  currentTheme,
  allThemes,
  currentPeriod,
  isManualOverride,
  currentTimeFormatted,
  onSelectTheme,
  onResetToRealTime
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-8 py-3.5 sm:py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left Brand Signature */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="pointer-events-auto flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full glass-panel hover:border-theme-gold/50 transition-all duration-300 cursor-pointer group flex-shrink-0"
        >
          <span className="w-2 h-2 rounded-full bg-theme-gold group-hover:scale-125 transition-transform" />
          <span className="font-serif text-xs sm:text-base font-bold tracking-wider text-theme-text whitespace-nowrap">
            Maison Alice
          </span>
        </button>

        {/* Center Navigation Pill */}
        <nav
          aria-label="Navigation principale"
          className="hidden lg:flex items-center gap-1 px-2 py-1.5 rounded-full glass-panel pointer-events-auto text-xs font-medium"
        >
          <button
            type="button"
            onClick={() => scrollTo('packs-showcase')}
            className="px-4 py-2 rounded-full text-theme-text/85 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            Les Coffrets
          </button>
          <button
            type="button"
            onClick={() => scrollTo('how-it-works')}
            className="px-4 py-2 rounded-full text-theme-text/85 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            En 3 Instants
          </button>
          <button
            type="button"
            onClick={() => scrollTo('bamako-delivery')}
            className="px-4 py-2 rounded-full text-theme-text/85 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            Livraison &amp; Paiement
          </button>
        </nav>

        {/* Right Controls: 3 Realms Switcher + Order CTA */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <MagicClockToggle
            currentTheme={currentTheme}
            allThemes={allThemes}
            currentPeriod={currentPeriod}
            isManualOverride={isManualOverride}
            currentTimeFormatted={currentTimeFormatted}
            onSelectTheme={onSelectTheme}
            onResetToRealTime={onResetToRealTime}
          />

          <button
            type="button"
            onClick={onOpenOrder}
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full font-semibold text-white bg-theme-primary shadow-glow-primary transition-all duration-300 hover:brightness-110 active:scale-95 cursor-pointer text-xs sm:text-sm whitespace-nowrap"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span>Commander</span>
          </button>
        </div>
      </div>
    </header>
  );
};
