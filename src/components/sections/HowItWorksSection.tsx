import React from 'react';
import { ArrowRight, Gift, MapPin, Sparkles } from 'lucide-react';

interface HowItWorksSectionProps {
  onOpenOrder: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onOpenOrder }) => {
  const steps = [
    {
      icon: Gift,
      title: 'Choisissez Votre Écrin',
      desc: 'Sélectionnez le coffret Maison Alice qui accompagnera votre attention parmi nos créations permanentes et éphémères.'
    },
    {
      icon: Sparkles,
      title: 'Ajoutez Votre Mot Doux',
      desc: 'Rédigez votre message personnel : nous le calligraphions sur une carte scellée à la cire dorée ou rouge.'
    },
    {
      icon: MapPin,
      title: 'Recevez Partout à Bamako',
      desc: 'Indiquez le quartier ou partagez votre position GPS. Notre coursier livre gratuitement en sac isotherme.'
    }
  ];

  return (
    <section
      id="how-it-works"
      className="relative py-24 px-4 max-w-6xl mx-auto flex flex-col items-center pointer-events-none"
    >
      <div className="text-center max-w-xl mx-auto mb-16 pointer-events-auto">
        <h2 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-theme-text">
          Le Rituel de Commande
        </h2>
        <p className="mt-3 text-sm sm:text-base text-theme-text-muted">
          Une expérience fluide pensée pour offrir ou se faire plaisir en quelques instants à Bamako.
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
                  <span className="font-mono text-xs font-semibold text-theme-text-muted px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    Étape {idx + 1}
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
          <span>Composer ma commande</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
