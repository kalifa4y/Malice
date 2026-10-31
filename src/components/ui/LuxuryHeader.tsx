import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { ThemeConfig, ThemePeriod } from '../../types';
import { MagicClockToggle } from '../theme/MagicClockToggle';

interface LuxuryHeaderProps {
  onOpenOrder: () => void;
  currentTheme: ThemeConfig;
  currentPeriod: ThemePeriod;
  currentTimeFormatted: string;
}

export const LuxuryHeader: React.FC<LuxuryHeaderProps> = ({
  onOpenOrder,
  currentTheme,
  currentPeriod,
  currentTimeFormatted
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-8 py-3.5 sm:py-4 pointer-events-none">
      <div className="relative max-w-7xl mx-auto flex items-center justify-end">
        {/* Navigation parfaitement centrée sur l'axe vertical du logo et du Hero */}
        <nav
          aria-label="Navigation principale"
          className="hidden lg:flex items-center gap-1 px-2 py-1.5 rounded-full glass-panel pointer-events-auto text-xs font-medium lg:absolute lg:left-1/2 lg:-translate-x-1/2"
        >
          <button
            type="button"
            onClick={() => scrollTo('packs-showcase')}
            className="px-4 py-2 rounded-full text-theme-text/85 hover:text-white hover:bg-white/10 transition-all cursor-pointer whitespace-nowrap"
          >
            Nos Coffrets
          </button>
          <button
            type="button"
            onClick={() => scrollTo('how-it-works')}
            className="px-4 py-2 rounded-full text-theme-text/85 hover:text-white hover:bg-white/10 transition-all cursor-pointer whitespace-nowrap"
          >
            En 3 Étapes
          </button>
          <button
            type="button"
            onClick={() => scrollTo('bamako-delivery')}
            className="px-4 py-2 rounded-full text-theme-text/85 hover:text-white hover:bg-white/10 transition-all cursor-pointer whitespace-nowrap"
          >
            Livraison &amp; Paiement
          </button>
        </nav>

        {/* Droite : Petite horloge automatique des 3 royaumes + Bouton Commander */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-auto">
          <MagicClockToggle
            currentTheme={currentTheme}
            currentPeriod={currentPeriod}
            currentTimeFormatted={currentTimeFormatted}
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
