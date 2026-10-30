import React from 'react';
import { ArrowRight, Gift, MapPin, Sparkles } from 'lucide-react';

interface HowItWorksSectionProps {
  onOpenOrder: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onOpenOrder }) => {
  const steps = [
    {
      icon: Gift,
      title: 'Choisissez Votre Royaume',
      desc: "Sélectionnez l'écrin de Marmoreal, le Banquet 10/6 de Tarrant Hightopp ou le Décret Écarlate de Salazen Grum."
    },
    {
      icon: Sparkles,
      title: 'Scellez le Parchemin',
      desc: 'Confiez-nous votre message : il est calligraphié sur un parchemin inspiré de l’Oraculum et scellé à la cire.'
    },
    {
      icon: MapPin,
      title: 'Le Coursier de McTwisp',
      desc: 'Indiquez votre quartier à Bamako ou partagez votre GPS. Livraison gratuite sous chaîne du froid sur les deux rives.'
    }
  ];

  return (
    <section
      id="how-it-works"
      className="relative py-24 px-4 max-w-6xl mx-auto flex flex-col items-center pointer-events-none"
    >
      <div className="text-center max-w-xl mx-auto mb-16 pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-theme-gold/30 text-[11px] uppercase tracking-[0.2em] text-theme-gold font-semibold mb-3">
          <span>Chapitre II • La Chronosphère</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-theme-text">
          Le Rituel d&apos;Underland en 3 Actes
        </h2>
        <p className="mt-3 text-sm sm:text-base text-theme-text-muted">
          Une traversée de l&apos;autre côté du miroir pour offrir ou savourer nos créations à Bamako.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-14 w-full pointer-events-auto">
        {steps.map((step, idx) => {
          const IconComponent = step.icon;
          return (
            <div
              key={step.title}
              className="rounded-3xl glass-panel p-7 sm:p-8 flex flex-col justify-between border border-theme-border hover:border-theme-gold/50 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-theme-surface border border-theme-gold/40 flex items-center justify-center text-theme-gold shadow-glow-gold">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-theme-gold px-3 py-1 rounded-full bg-white/5 border border-theme-gold/30">
                    Acte {idx + 1}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-semibold text-theme-text mb-3">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-theme-text-muted leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pointer-events-auto">
        <button
          type="button"
          onClick={onOpenOrder}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-theme-primary text-white font-semibold tracking-wider uppercase hover:brightness-110 transition-all duration-300 shadow-glow-primary text-xs sm:text-sm cursor-pointer"
        >
          <span>Ouvrir le Grimoire de Commande</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
