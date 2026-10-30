import React, { useState, useRef, useEffect } from 'react';
import { ThemeConfig, ThemePeriod } from '../../types';
import { Clock, RotateCcw, ChevronDown, Check } from 'lucide-react';

interface MagicClockToggleProps {
  currentTheme: ThemeConfig;
  allThemes: ThemeConfig[];
  currentPeriod: ThemePeriod;
  isManualOverride: boolean;
  currentTimeFormatted: string;
  onSelectTheme: (period: ThemePeriod) => void;
  onResetToRealTime: () => void;
}

const SuitIcon: React.FC<{ suit: ThemeConfig['cardSuit']; className?: string }> = ({
  suit,
  className = 'w-3.5 h-3.5'
}) => {
  switch (suit) {
    case 'spade':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C7 8 4 11.5 4 14.5A4.5 4.5 0 0 0 8.5 19c1.4 0 2.6-.6 3.5-1.6-.2 1.8-.9 3.4-2 4.6h4c-1.1-1.2-1.8-2.8-2-4.6.9 1 2.1 1.6 3.5 1.6a4.5 4.5 0 0 0 4.5-4.5C20 11.5 17 8 12 2z" />
        </svg>
      );
    case 'club':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 3a4 4 0 0 0-3.6 5.8A4 4 0 1 0 7.5 16c1.5 0 2.9-.8 3.6-2-.2 2.2-1 4.3-2.1 6h6c-1.1-1.7-1.9-3.8-2.1-6 .7 1.2 2.1 2 3.6 2a4 4 0 1 0-.9-7.2A4 4 0 0 0 12 3z" />
        </svg>
      );
    case 'heart':
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );
  }
};

export const MagicClockToggle: React.FC<MagicClockToggleProps> = ({
  currentTheme,
  allThemes,
  isManualOverride,
  currentTimeFormatted,
  onSelectTheme,
  onResetToRealTime
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative z-50">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Choisir l'ambiance parmi les 3 Heures d'Alice"
        className="group flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full glass-panel hover:border-theme-gold/60 transition-all duration-300 text-xs cursor-pointer"
      >
        <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border border-theme-gold/40 bg-black/40 text-theme-gold flex-shrink-0">
          <SuitIcon suit={currentTheme.cardSuit} className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </span>

        <div className="flex flex-col items-start text-left leading-tight">
          <div className="flex items-center gap-1">
            <span className="font-mono text-[10px] sm:text-[11px] text-theme-gold font-semibold">
              {currentTimeFormatted || '12:00'}
            </span>
            <span className="text-[10px] text-theme-text-muted hidden md:inline">• Bamako</span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-theme-text font-medium truncate max-w-[82px] sm:max-w-[130px]">
            {currentTheme.character}
          </span>
        </div>

        <ChevronDown
          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-theme-text-muted transition-transform duration-300 flex-shrink-0 ${
            isOpen ? 'rotate-180 text-theme-gold' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-72 sm:w-80 rounded-2xl glass-panel p-4 shadow-2xl border border-theme-border animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-theme-gold" />
              <span className="text-xs font-semibold uppercase tracking-widest text-theme-text">
                Les 3 Heures d&apos;Alice
              </span>
            </div>
            {isManualOverride && (
              <button
                type="button"
                onClick={() => {
                  onResetToRealTime();
                  setIsOpen(false);
                }}
                className="flex items-center gap-1 text-[11px] text-theme-gold hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Heure réelle</span>
              </button>
            )}
          </div>

          <div className="space-y-2">
            {allThemes.map((theme) => {
              const isSelected = currentTheme.id === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => {
                    onSelectTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-300 cursor-pointer border ${
                    isSelected
                      ? 'bg-theme-surface border-theme-gold/60 shadow-glow-gold'
                      : 'hover:bg-white/5 border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                      style={{
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.primary,
                        border: `1px solid ${theme.colors.primary}`
                      }}
                    >
                      <SuitIcon suit={theme.cardSuit} className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-theme-text flex items-center gap-1.5">
                        <span>{theme.name}</span>
                      </div>
                      <div className="text-[11px] text-theme-text-muted">
                        {theme.character} • <span className="font-mono">{theme.timeRange}</span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-theme-gold/20 border border-theme-gold flex items-center justify-center text-theme-gold">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <p className="mt-3 pt-2.5 text-[11px] text-center text-theme-text-muted border-t border-white/10">
            L&apos;atmosphère 3D et la palette s&apos;adaptent à l&apos;heure de Bamako ou à votre sélection.
          </p>
        </div>
      )}
    </div>
  );
};
