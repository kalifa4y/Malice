import React from 'react';
import { ArrowRight } from 'lucide-react';
import {
  AnimatedHatterHatSvg,
  AnimatedWaxSealQuillSvg,
  AnimatedChronosphereWatchSvg
} from '../ui/UnderlandIllustrations';

interface HowItWorksSectionProps {
  onOpenOrder: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onOpenOrder }) => {
  const steps = [
    {
      Illustration: AnimatedHatterHatSvg,
      title: '1. Choisissez le coffret',
      subtitle: 'Alice, Chapelier ou Reine de Cœur'
    },
    {
      Illustration: AnimatedWaxSealQuillSvg,
      title: '2. Écrivez votre mot',
      subtitle: 'Ajouté sur une belle carte cadeau'
    },
    {
      Illustration: AnimatedChronosphereWatchSvg,
      title: '3. Livré gratuitement',
      subtitle: 'Partout à Bamako, 7j/7'
    }
  ];

  return (
    <section
      id="how-it-works"
      className="relative py-16 px-4 max-w-5xl mx-auto flex flex-col items-center pointer-events-none"
    >
      <div className="text-center mb-10 pointer-events-auto">
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-theme-text">
          En 3 Étapes
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10 w-full pointer-events-auto">
        {steps.map((step) => {
          const { Illustration } = step;
          return (
            <div
              key={step.title}
              className="rounded-3xl glass-panel p-6 flex flex-col items-center text-center border border-theme-border hover:border-theme-gold/50 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-theme-surface border border-theme-gold/40 flex items-center justify-center text-theme-gold shadow-glow-gold mb-4">
                <Illustration className="w-12 h-12" />
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-semibold text-theme-text">
                {step.title}
              </h3>
              <p className="mt-1 text-xs text-theme-text-muted">
                {step.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      <div className="pointer-events-auto">
        <button
          type="button"
          onClick={onOpenOrder}
          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-theme-primary text-white font-semibold tracking-wider uppercase hover:brightness-110 transition-all duration-300 shadow-glow-primary text-xs sm:text-sm cursor-pointer"
        >
          <span>Commander Maintenant</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
