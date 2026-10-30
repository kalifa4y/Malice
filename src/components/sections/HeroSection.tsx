import React from 'react';
import { ArrowDown, ShieldCheck, Truck, Sparkles, ShoppingBag } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { ThemeConfig } from '../../types';

interface HeroSectionProps {
  onOpenOrder: () => void;
  onExplorePacks: () => void;
  currentTheme?: ThemeConfig;
  siteNotice?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenOrder,
  onExplorePacks,
  siteNotice
}) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-28 pb-16 text-center overflow-hidden pointer-events-none">
      {/* Subtle radial vignette behind central stage to guarantee crisp readability over 3D scene */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 48%, rgba(7, 10, 18, 0.72) 0%, rgba(7, 10, 18, 0.35) 48%, transparent 78%)'
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center pointer-events-auto max-w-3xl mx-auto w-full">
        {/* Official Brand Logo */}
        <div className="w-full flex justify-center items-center select-none mb-4">
          <Logo size="hero" />
        </div>

        {/* Visible Editorial H1 */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-theme-text leading-[1.1] max-w-2xl">
          La Haute Confiserie &amp; l&apos;Art d&apos;Offrir à Bamako
        </h1>

        <p className="mt-4 text-sm sm:text-base md:text-lg text-theme-text-muted max-w-xl leading-relaxed">
          Des écrins rigides dorés à chaud garnis de chocolats grands crus stabilisés, macarons,
          calissons et douceurs féeriques. Livrés gratuitement sous chaîne de fraîcheur partout à Bamako.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg">
          <button
            type="button"
            onClick={onOpenOrder}
            className="w-full sm:w-auto py-4 px-8 rounded-full bg-theme-primary text-white font-semibold tracking-wider uppercase hover:brightness-110 active:scale-95 transition-all duration-300 shadow-glow-primary text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2.5 whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4 flex-shrink-0" />
            <span>Commander un coffret</span>
          </button>
          <button
            type="button"
            onClick={onExplorePacks}
            className="w-full sm:w-auto py-4 px-8 rounded-full border border-theme-gold/40 bg-black/50 backdrop-blur-md text-theme-text font-semibold tracking-wider uppercase hover:bg-white/10 hover:border-theme-gold active:scale-95 transition-all duration-300 text-xs sm:text-sm cursor-pointer whitespace-nowrap"
          >
            Découvrir les créations
          </button>
        </div>

        {/* Luxury Guarantee Strip */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl text-left">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl glass-panel">
            <ShieldCheck className="w-4 h-4 text-theme-gold flex-shrink-0" />
            <span className="text-xs text-theme-text-muted">
              <strong className="text-theme-text font-semibold block">Tenue Tropicale</strong>
              Chocolats stabilisés climat Bamako
            </span>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl glass-panel">
            <Truck className="w-4 h-4 text-theme-primary flex-shrink-0" />
            <span className="text-xs text-theme-text-muted">
              <strong className="text-theme-text font-semibold block">Livraison Offerte 7j/7</strong>
              Sacs isothermes sur les 2 rives
            </span>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl glass-panel">
            <Sparkles className="w-4 h-4 text-theme-gold flex-shrink-0" />
            <span className="text-xs text-theme-text-muted">
              <strong className="text-theme-text font-semibold block">Carte Scellée à la Cire</strong>
              Message personnalisé offert
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
        className="mt-10 text-theme-text-muted hover:text-theme-gold transition-colors inline-flex items-center gap-2 pointer-events-auto cursor-pointer text-xs uppercase tracking-widest"
      >
        <span>Explorer les coffrets</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
      </button>
    </section>
  );
};
