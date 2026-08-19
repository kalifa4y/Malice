import React, { useState } from 'react';
import { ThemeConfig, ThemePeriod } from '../../types';
import { Clock, Sparkles, RotateCcw, ChevronDown } from 'lucide-react';

interface MagicClockToggleProps {
  currentTheme: ThemeConfig;
  allThemes: ThemeConfig[];
  currentPeriod: ThemePeriod;
  isManualOverride: boolean;
  currentTimeFormatted: string;
  onSelectTheme: (period: ThemePeriod) => void;
  onResetToRealTime: () => void;
}

export const MagicClockToggle: React.FC<MagicClockToggleProps> = ({
  currentTheme,
  allThemes,
  isManualOverride,
  currentTimeFormatted,
  onSelectTheme,
  onResetToRealTime
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50">
      {/* Floating Magic Clock Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel hover:border-theme-primary transition-all duration-300 shadow-glow-primary text-xs md:text-sm font-medium"
        title="Changer l'heure magique d'Alice"
      >
        <div className="relative flex items-center justify-center">
          <Clock className="w-4 h-4 text-theme-primary animate-spin-slow" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-theme-primary animate-ping" />
        </div>

        <div className="flex flex-col items-start text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-theme-primary font-bold">{currentTimeFormatted}</span>
            <span className="text-[10px] text-theme-text-muted">• Bamako</span>
          </div>
          <span className="text-[10px] text-theme-text font-semibold truncate max-w-[130px]">
            {currentTheme.character}
          </span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-theme-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 md:w-80 rounded-2xl glass-panel p-3.5 shadow-2xl border border-theme-border animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-theme-border">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-theme-gold" />
              <span className="text-xs font-bold uppercase tracking-wider text-theme-text">
                Les 3 Heures d'Alice
              </span>
            </div>
            {isManualOverride && (
              <button
                onClick={() => {
                  onResetToRealTime();
                  setIsOpen(false);
                }}
                className="flex items-center gap-1 text-[10px] text-theme-primary hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                Heure réelle
              </button>
            )}
          </div>

          <div className="space-y-2">
            {allThemes.map((theme) => {
              const isSelected = currentTheme.id === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    onSelectTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-300 ${
                    isSelected
                      ? 'bg-theme-surface border border-theme-primary shadow-glow-primary scale-[1.02]'
                      : 'hover:bg-theme-surface/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-serif text-lg font-bold shadow-md"
                      style={{ 
                        backgroundColor: theme.colors.surface, 
                        color: theme.colors.primary,
                        border: `1px solid ${theme.colors.primary}`
                      }}
                    >
                      {theme.cardSuitSymbol}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-theme-text flex items-center gap-1.5">
                        {theme.character}
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-theme-primary animate-pulse" />}
                      </div>
                      <div className="text-[10px] text-theme-text-muted">
                        {theme.timeRange}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span 
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                      style={{ 
                        color: theme.colors.primary, 
                        borderColor: theme.colors.border,
                        backgroundColor: theme.colors.surface
                      }}
                    >
                      {theme.titleFontName}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2 text-[10px] text-center text-theme-text-muted border-t border-theme-border">
            ✨ Les palettes et polices changent automatiquement au fil de la journée.
          </div>
        </div>
      )}
    </div>
  );
};
