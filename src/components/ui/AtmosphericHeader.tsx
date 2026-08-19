import React from 'react';
import { ThemeConfig, ThemePeriod } from '../../types';
import { Logo } from './Logo';
import { MagicClockToggle } from '../theme/MagicClockToggle';
import { ShoppingBag } from 'lucide-react';

interface AtmosphericHeaderProps {
  currentTheme: ThemeConfig;
  allThemes: ThemeConfig[];
  currentPeriod: ThemePeriod;
  isManualOverride: boolean;
  currentTimeFormatted: string;
  onSelectTheme: (period: ThemePeriod) => void;
  onResetToRealTime: () => void;
  onOpenOrder: () => void;
}

export const AtmosphericHeader: React.FC<AtmosphericHeaderProps> = ({
  currentTheme,
  allThemes,
  currentPeriod,
  isManualOverride,
  currentTimeFormatted,
  onSelectTheme,
  onResetToRealTime,
  onOpenOrder
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 py-3.5 flex items-center justify-between pointer-events-none">
      {/* Brand Mini Anchor */}
      <div className="pointer-events-auto flex items-center gap-2">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel hover:border-theme-primary transition-all duration-300 shadow-lg cursor-pointer"
        >
          <Logo size="xs" cardSuit={currentTheme.cardSuit} showSubtitle={false} />
        </button>
      </div>

      {/* Floating Pill Anchors (Desktop) */}
      <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full glass-panel border border-theme-border pointer-events-auto shadow-lg text-xs font-semibold">
        <button
          onClick={() => scrollTo('packs-showcase')}
          className="px-4 py-1.5 rounded-full hover:bg-theme-surface text-theme-text-muted hover:text-theme-text transition-colors cursor-pointer"
        >
          Les Coffrets
        </button>
        <button
          onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })}
          className="px-4 py-1.5 rounded-full hover:bg-theme-surface text-theme-text-muted hover:text-theme-text transition-colors cursor-pointer"
        >
          L'Univers
        </button>
        <button
          onClick={() => window.scrollTo({ top: document.body.scrollHeight * 0.75, behavior: 'smooth' })}
          className="px-4 py-1.5 rounded-full hover:bg-theme-surface text-theme-text-muted hover:text-theme-text transition-colors cursor-pointer"
        >
          Livraison Bamako
        </button>
      </nav>

      {/* Right Controls: Magic Clock + Order CTA */}
      <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
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
          onClick={onOpenOrder}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full font-bold text-white shadow-glow-primary transition-all duration-300 hover:brightness-110 cursor-pointer text-xs"
          style={{ backgroundColor: currentTheme.colors.primary }}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Commander</span>
        </button>
      </div>
    </header>
  );
};
