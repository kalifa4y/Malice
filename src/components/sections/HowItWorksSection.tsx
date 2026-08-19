import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  onOpenOrder: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onOpenOrder }) => {
  const steps = [
    {
      num: '01',
      title: 'Choisissez',
      desc: 'Sélectionnez votre création.',
    },
    {
      num: '02',
      title: 'Commandez',
      desc: 'Validez votre adresse.',
    },
    {
      num: '03',
      title: 'Recevez',
      desc: 'Livraison offerte.',
    }
  ];

  return (
    <section id="how-it-works" className="relative py-32 px-4 max-w-7xl mx-auto flex flex-col items-center pointer-events-none">
      
      <div className="text-center mb-20 pointer-events-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-darker font-medium tracking-[0.1em] uppercase text-theme-text opacity-90">
          L'Expérience
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24 mb-20 w-full max-w-5xl pointer-events-auto">
        {steps.map((step) => (
          <div key={step.num} className="flex flex-col items-center text-center group">
            <span className="font-mono text-xl sm:text-2xl font-black text-theme-text-muted/30 group-hover:text-theme-primary transition-colors duration-500 mb-6">
              //{step.num}
            </span>
            <h3 className="text-xl sm:text-2xl font-darker font-medium tracking-widest uppercase text-theme-text mb-4">
              {step.title}
            </h3>
            <p className="text-xs sm:text-sm text-theme-text-muted font-mono tracking-widest uppercase">
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="pointer-events-auto">
        <button
          onClick={onOpenOrder}
          className="flex items-center gap-4 px-12 py-4 rounded-none border border-theme-primary bg-theme-primary/10 backdrop-blur-md text-theme-text font-darker font-semibold tracking-widest uppercase hover:bg-theme-primary hover:text-white transition-all duration-500 shadow-glow-primary text-sm cursor-pointer"
        >
          <span>Débuter</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      
    </section>
  );
};
