import React, { useState, useRef, useEffect } from 'react';
import { ThemeConfig, ThemePeriod } from '../../types';
import { Compass, RotateCcw, ChevronDown, Check } from 'lucide-react';

interface MagicClockToggleProps {
  currentTheme: ThemeConfig;
  allThemes: ThemeConfig[];
  currentPeriod: ThemePeriod;
  isManualOverride: boolean;
  currentTimeFormatted: string;
  onSelectTheme: (period: ThemePeriod) => void;
  onResetToRealTime: () => void;
}

const RealmEmblem: React.FC<{ realmId: ThemePeriod; className?: string }> = ({
  realmId,
  className = 'w-3.5 h-3.5'
}) => {
  switch (realmId) {
    case 'cheshire_night':
      // Tarrant Hightopp 10/6 Top Hat Emblem (Bois de Tulgey)
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M4 19h16" strokeLinecap="round" />
          <path d="M6.5 19L5 7c2.5-1.5 11.5-1.5 14 0l-1.5 12" strokeLinejoin="round" />
          <path d="M6.2 15h11.6" strokeLinecap="round" />
        </svg>
      );
    case 'mad_hatter_day':
      // White Queen Crown of Marmoreal Emblem (Monde Éveillé)
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M3 18h18M4 15l2-9 6 5 6-5 2 9H4z" strokeLinejoin="round" />
        </svg>
      );
    case 'queen_of_hearts_evening':
    default:
      // Royal Heart of Salazen Grum (Cour Écarlate)
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
        aria-label="Voyager entre les 3 Royaumes d'Underland"
        className="group flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full glass-panel hover:border-theme-gold/60 transition-all duration-300 text-xs cursor-pointer"
      >
        <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border border-theme-gold/40 bg-black/40 text-theme-gold flex-shrink-0">
          <RealmEmblem realmId={currentTheme.id} className="w-3.5 h-3.5" />
        </span>

        <div className="flex flex-col items-start text-left leading-tight">
          <div className="flex items-center gap-1">
            <span className="font-mono text-[10px] sm:text-[11px] text-theme-gold font-semibold">
              {currentTimeFormatted || '10:06'}
            </span>
            <span className="text-[10px] text-theme-text-muted hidden md:inline">• Royaume</span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-theme-text font-medium truncate max-w-[96px] sm:max-w-[155px]">
            {currentTheme.name}
          </span>
        </div>

        <ChevronDown
          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-theme-text-muted transition-transform duration-300 flex-shrink-0 ${
            isOpen ? 'rotate-180 text-theme-gold' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-2xl glass-panel p-4 shadow-2xl border border-theme-border animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-theme-gold" />
              <span className="text-xs font-semibold uppercase tracking-widest text-theme-text">
                Les 3 Royaumes d&apos;Underland
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
                <span>Chronosphère Auto</span>
              </button>
            )}
          </div>

          <div className="space-y-2.5">
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
                      ? 'bg-theme-surface border-theme-gold/70 shadow-glow-gold'
                      : 'hover:bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                      style={{
                        backgroundColor: theme.colors.bg,
                        color: theme.colors.gold,
                        border: `1px solid ${theme.colors.primary}`
                      }}
                    >
                      <RealmEmblem realmId={theme.id} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-theme-text flex items-center gap-2">
                        <span className="truncate">{theme.name}</span>
                        <span className="flex items-center gap-1 flex-shrink-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-white/20"
                            style={{ backgroundColor: theme.colors.bg }}
                          />
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-white/20"
                            style={{ backgroundColor: theme.colors.primary }}
                          />
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-white/20"
                            style={{ backgroundColor: theme.colors.gold }}
                          />
                        </span>
                      </div>
                      <div className="text-[11px] text-theme-text-muted truncate">
                        {theme.subName}
                      </div>
                      <div className="text-[10px] font-mono text-theme-gold/80 mt-0.5">
                        Cycle Chronosphère : {theme.timeRange}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-theme-gold/20 border border-theme-gold flex items-center justify-center text-theme-gold flex-shrink-0 ml-2">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <p className="mt-3 pt-2.5 text-[11px] text-center text-theme-text-muted border-t border-white/10">
            Voyagez entre le Monde Éveillé (Marmoreal), le Monde de la Nuit (Bois de Tulgey 10/6) et la Cour Écarlate (Salazen Grum).
          </p>
        </div>
      )}
    </div>
  );
};
