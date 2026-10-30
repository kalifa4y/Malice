import React from 'react';
import { ArrowDown, ShieldCheck, Truck, Sparkles, ShoppingBag, Compass } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { ThemeConfig, ThemePeriod } from '../../types';

interface HeroSectionProps {
  onOpenOrder: () => void;
  onExplorePacks: () => void;
  currentTheme?: ThemeConfig;
  allThemes?: ThemeConfig[];
  onSelectTheme?: (period: ThemePeriod) => void;
  siteNotice?: string;
}

const REALM_QUOTES: Record<ThemePeriod, { quote: string; author: string; badge: string }> = {
  mad_hatter_day: {
    badge: 'Royaume I • Marmoreal (Monde Éveillé)',
    quote: '« Il m’arrive parfois de croire à six douceurs impossibles avant le petit-déjeuner. »',
    author: 'Chroniques de l’Oraculum • Cour de la Reine Blanche'
  },
  cheshire_night: {
    badge: 'Royaume II • Bois de Tulgey (Monde de la Nuit • 10/6)',
    quote: '« Au Pays d’Underland, les meilleures personnes ont toutes un grain de folie. »',
    author: 'Tarrant Hightopp • Le Chapelier Fou (10/6)'
  },
  queen_of_hearts_evening: {
    badge: 'Royaume III • Salazen Grum (Cour de la Reine Rouge)',
    quote: '« Qui a osé peindre mes roses blanches d’un glaçage rouge rubis ? »',
    author: 'Décret Royal d’Iracebeth • Salazen Grum'
  }
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenOrder,
  onExplorePacks,
  currentTheme,
  allThemes,
  onSelectTheme,
  siteNotice
}) => {
  const activePeriod: ThemePeriod = currentTheme?.id || 'cheshire_night';
  const realmLore = REALM_QUOTES[activePeriod] || REALM_QUOTES.cheshire_night;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-28 pb-16 text-center overflow-hidden pointer-events-none">
      {/* Subtle radial vignette behind central stage to guarantee crisp readability over 3D scene */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 46%, rgba(8, 10, 18, 0.72) 0%, rgba(8, 10, 18, 0.36) 50%, transparent 80%)'
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center pointer-events-auto max-w-3xl mx-auto w-full">
        {/* Interactive 3 Realms of Underland Switcher Bar */}
        {allThemes && onSelectTheme && (
          <div className="mb-5 inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-full glass-panel border border-theme-gold/40">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 text-[11px] uppercase tracking-widest text-theme-gold font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Royaumes :</span>
            </span>
            {allThemes.map((t) => {
              const isActive = t.id === activePeriod;
              const shortLabel =
                t.id === 'mad_hatter_day'
                  ? 'Marmoreal (Éveillé)'
                  : t.id === 'cheshire_night'
                    ? 'Bois de Tulgey (Nuit 10/6)'
                    : 'Salazen Grum (Cour Rouge)';
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onSelectTheme(t.id)}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-theme-primary text-white shadow-glow-primary'
                      : 'text-theme-text-muted hover:text-theme-text hover:bg-white/10'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full border border-white/40"
                    style={{ backgroundColor: t.colors.primary }}
                  />
                  <span>{shortLabel}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Official Brand Logo */}
        <div className="w-full flex justify-center items-center select-none mb-3">
          <Logo size="hero" />
        </div>

        {/* Active Underland Realm Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-theme-gold/35 text-[11px] uppercase tracking-[0.2em] text-theme-gold font-semibold mb-3">
          <span>{realmLore.badge}</span>
        </div>

        {/* Visible Editorial H1 */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-theme-text leading-[1.08] max-w-2xl">
          Les Confiseries d&apos;Underland &amp; la Table 10/6 à Bamako
        </h1>

        {/* Iconic Tim Burton Quote */}
        <blockquote className="mt-4 px-5 py-2.5 rounded-2xl bg-black/35 border border-theme-gold/25 max-w-xl">
          <p className="font-serif italic text-base sm:text-lg text-theme-gold leading-snug">
            {realmLore.quote}
          </p>
          <footer className="mt-1 text-[11px] uppercase tracking-widest text-theme-text-muted">
            — {realmLore.author}
          </footer>
        </blockquote>

        <p className="mt-4 text-sm sm:text-base text-theme-text-muted max-w-xl leading-relaxed">
          Des écrins rigides dorés à chaud façonnés comme l&apos;Oraculum : sablés{' '}
          <em className="text-theme-text not-italic font-medium">« Upelkuchen » (Mange-Moi)</em>,
          fiole d&apos;élixir{' '}
          <em className="text-theme-text not-italic font-medium">« Pishsalver » (Bois-Moi)</em>,
          chocolats grands crus stabilisés et reliques dorées. Livrés gratuitement à Bamako.
        </p>

        {/* Action Buttons */}
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg">
          <button
            type="button"
            onClick={onOpenOrder}
            className="w-full sm:w-auto py-4 px-8 rounded-full bg-theme-primary text-white font-semibold tracking-wider uppercase hover:brightness-110 active:scale-95 transition-all duration-300 shadow-glow-primary text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2.5 whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4 flex-shrink-0" />
            <span>Commander un Écrin</span>
          </button>
          <button
            type="button"
            onClick={onExplorePacks}
            className="w-full sm:w-auto py-4 px-8 rounded-full border border-theme-gold/45 bg-black/50 backdrop-blur-md text-theme-text font-semibold tracking-wider uppercase hover:bg-white/10 hover:border-theme-gold active:scale-95 transition-all duration-300 text-xs sm:text-sm cursor-pointer whitespace-nowrap"
          >
            Explorer l&apos;Oraculum
          </button>
        </div>

        {/* Luxury Guarantee Strip */}
        <div className="mt-9 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl text-left">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl glass-panel">
            <ShieldCheck className="w-4 h-4 text-theme-gold flex-shrink-0" />
            <span className="text-xs text-theme-text-muted">
              <strong className="text-theme-text font-semibold block">Alchimie Tropicale</strong>
              Chocolats stabilisés climat Bamako
            </span>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl glass-panel">
            <Truck className="w-4 h-4 text-theme-primary flex-shrink-0" />
            <span className="text-xs text-theme-text-muted">
              <strong className="text-theme-text font-semibold block">Coursier Royal Offert</strong>
              Sacs isothermes sur les 2 rives
            </span>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl glass-panel">
            <Sparkles className="w-4 h-4 text-theme-gold flex-shrink-0" />
            <span className="text-xs text-theme-text-muted">
              <strong className="text-theme-text font-semibold block">Sceau de l&apos;Oraculum</strong>
              Lettre calligraphiée &amp; cire d&apos;or
            </span>
          </div>
        </div>

        {siteNotice && (
          <p className="mt-5 text-xs text-theme-gold/90 font-medium tracking-wide">
            {siteNotice}
          </p>
        )}
      </div>

      {/* Scroll Down Indicator */}
      <button
        type="button"
        onClick={onExplorePacks}
        className="mt-8 text-theme-text-muted hover:text-theme-gold transition-colors inline-flex items-center gap-2 pointer-events-auto cursor-pointer text-xs uppercase tracking-widest"
      >
        <span>Franchir le Terrier</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
      </button>
    </section>
  );
};
