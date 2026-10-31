import React from 'react';
import { ShoppingBag, ArrowDown } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { ThemeConfig, ThemePeriod } from '../../types';
import {
  AnimatedPotionFlaskSvg,
  AnimatedChronosphereWatchSvg,
  AnimatedWaxSealQuillSvg
} from '../ui/UnderlandIllustrations';

interface HeroSectionProps {
  onOpenOrder: () => void;
  onExplorePacks: () => void;
  currentTheme?: ThemeConfig;
  allThemes?: ThemeConfig[];
  onSelectTheme?: (period: ThemePeriod) => void;
  siteNotice?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenOrder,
  onExplorePacks,
  currentTheme,
  allThemes,
  onSelectTheme
}) => {
  const activePeriod: ThemePeriod = currentTheme?.id || 'cheshire_night';

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-12 text-center overflow-hidden pointer-events-none">
      {/* Subtle radial vignette behind central stage */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 46%, rgba(8, 10, 18, 0.7) 0%, rgba(8, 10, 18, 0.32) 48%, transparent 76%)'
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center pointer-events-auto max-w-2xl mx-auto w-full">
        {/* Compact 3 Realms Switcher */}
        {allThemes && onSelectTheme && (
          <div className="mb-5 inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-full glass-panel border border-theme-gold/40">
            {allThemes.map((t) => {
              const isActive = t.id === activePeriod;
              const shortLabel =
                t.id === 'mad_hatter_day'
                  ? 'Marmoreal • Éveillé'
                  : t.id === 'cheshire_night'
                    ? 'Tulgey • Nuit 10/6'
                    : 'Salazen • Cour Rouge';
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onSelectTheme(t.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-theme-primary text-white shadow-glow-primary'
                      : 'text-theme-text-muted hover:text-theme-text hover:bg-white/10'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/40"
                    style={{ backgroundColor: t.colors.primary }}
                  />
                  <span>{shortLabel}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Official Brand Logo */}
        <div className="w-full flex justify-center items-center select-none mb-2">
          <Logo size="hero" />
        </div>

        {/* Short Punchy Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-theme-text leading-tight">
          Haute Confiserie d&apos;Underland
        </h1>

        <p className="mt-2 text-xs sm:text-sm uppercase tracking-[0.22em] text-theme-gold font-medium">
          Coffrets Cadeaux &amp; Chocolats Grands Crus • Bamako
        </p>

        {/* Action Buttons */}
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md">
          <button
            type="button"
            onClick={onOpenOrder}
            className="w-full sm:w-auto py-3.5 px-8 rounded-full bg-theme-primary text-white font-semibold tracking-wider uppercase hover:brightness-110 active:scale-95 transition-all duration-300 shadow-glow-primary text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4 flex-shrink-0" />
            <span>Commander</span>
          </button>
          <button
            type="button"
            onClick={onExplorePacks}
            className="w-full sm:w-auto py-3.5 px-8 rounded-full border border-theme-gold/45 bg-black/50 backdrop-blur-md text-theme-text font-semibold tracking-wider uppercase hover:bg-white/10 hover:border-theme-gold active:scale-95 transition-all duration-300 text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span>Voir les Coffrets</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Animated Illustrated Badges (Minimal Text) */}
        <div className="mt-9 grid grid-cols-3 gap-2.5 sm:gap-4 w-full max-w-lg">
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl glass-panel text-center">
            <div className="text-theme-gold mb-1">
              <AnimatedPotionFlaskSvg className="w-9 h-9 sm:w-10 sm:h-10" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-theme-text">
              Tenue Tropicale
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 rounded-2xl glass-panel text-center">
            <div className="text-theme-gold mb-1">
              <AnimatedChronosphereWatchSvg className="w-9 h-9 sm:w-10 sm:h-10" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-theme-text">
              Livraison Offerte
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 rounded-2xl glass-panel text-center">
            <div className="text-theme-gold mb-1">
              <AnimatedWaxSealQuillSvg className="w-9 h-9 sm:w-10 sm:h-10" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-theme-text">
              Mot Scellé Offert
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
