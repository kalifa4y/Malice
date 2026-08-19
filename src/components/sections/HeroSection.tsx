import React from 'react';
import { ArrowDown } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  onOpenOrder: () => void;
  onExplorePacks: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenOrder,
  onExplorePacks
}) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center overflow-hidden pointer-events-none">
      
      {/* Centered Main Stage: Logo + Action Buttons (Aligned on central vertical axis) */}
      <div className="relative z-10 flex flex-col items-center justify-center pointer-events-auto max-w-2xl mx-auto w-full pt-10 sm:pt-6">
        
        {/* 2. Official Brand Logo (No hover effects, pure transparent background) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-full flex justify-center items-center select-none"
        >
          <Logo size="hero" />
        </motion.div>

        {/* 3. Action Buttons (Directly below logo, perfectly centered and aligned) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-md"
        >
          <button
            onClick={onOpenOrder}
            className="w-full sm:w-48 py-3.5 px-6 rounded-none bg-theme-primary text-white font-darker font-bold tracking-widest uppercase hover:brightness-110 active:scale-95 transition-all duration-300 shadow-glow-primary text-sm cursor-pointer"
          >
            Commander
          </button>
          <button
            onClick={onExplorePacks}
            className="w-full sm:w-48 py-3.5 px-6 rounded-none border border-white/20 bg-black/40 backdrop-blur-md text-white font-darker font-bold tracking-widest uppercase hover:bg-white/10 hover:border-white/40 active:scale-95 transition-all duration-300 shadow-lg text-sm cursor-pointer"
          >
            Découvrir
          </button>
        </motion.div>

      </div>

      {/* Scroll Down Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        onClick={onExplorePacks}
        className="absolute bottom-8 left-8 text-white/50 hover:text-white transition-colors items-center gap-2 pointer-events-auto cursor-pointer font-mono text-xs uppercase tracking-widest hidden sm:flex"
      >
        <span>Scroll down to discover</span>
        <ArrowDown className="w-3 h-3 animate-bounce" />
      </motion.button>

      {/* Minimal Manifesto (igloo.inc style) */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute top-24 right-8 text-right hidden lg:block text-white/50 font-mono text-[10px] sm:text-xs uppercase tracking-widest leading-relaxed"
      >
        <p className="font-bold text-white mb-2">////// MANIFESTO</p>
        <p className="max-w-[250px] ml-auto">
          L'élégance de la confiserie.<br/>
          Une sélection rigoureuse de<br/>
          douceurs d'exception pour les<br/>
          palais les plus exigeants.
        </p>
      </motion.div>

    </section>
  );
};
