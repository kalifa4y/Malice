import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface LuxuryHeaderProps {
  onOpenOrder: () => void;
}

export const LuxuryHeader: React.FC<LuxuryHeaderProps> = ({ onOpenOrder }) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-5 flex items-center justify-between pointer-events-none">
      {/* Left empty slot for balanced flex spacing */}
      <div className="w-28 sm:w-36 hidden md:block" />

      {/* 1. Center Navigation Links - No default border/box, Glassmorphism on Hover, Perfectly Centered */}
      <nav className="hidden md:flex items-center gap-2 pointer-events-auto absolute left-1/2 -translate-x-1/2 text-xs font-semibold tracking-wider font-google-sans">
        <button
          onClick={() => scrollTo('packs-showcase')}
          className="px-5 py-2.5 rounded-full text-white/80 hover:text-white border border-transparent hover:border-white/15 hover:bg-white/10 hover:backdrop-blur-md transition-all duration-300 cursor-pointer shadow-none hover:shadow-lg"
        >
          Les Coffrets
        </button>
        <button
          onClick={() => scrollTo('how-it-works')}
          className="px-5 py-2.5 rounded-full text-white/80 hover:text-white border border-transparent hover:border-white/15 hover:bg-white/10 hover:backdrop-blur-md transition-all duration-300 cursor-pointer shadow-none hover:shadow-lg"
        >
          Comment ça marche
        </button>
        <button
          onClick={() => scrollTo('bamako-delivery')}
          className="px-5 py-2.5 rounded-full text-white/80 hover:text-white border border-transparent hover:border-white/15 hover:bg-white/10 hover:backdrop-blur-md transition-all duration-300 cursor-pointer shadow-none hover:shadow-lg"
        >
          Livraison Bamako
        </button>
      </nav>

      {/* Right Action CTA */}
      <div className="pointer-events-auto flex items-center gap-3 ml-auto md:ml-0">
        <button
          onClick={onOpenOrder}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-white bg-theme-primary shadow-glow-primary transition-all duration-300 hover:brightness-110 active:scale-95 cursor-pointer text-xs sm:text-sm tracking-wide"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Commander</span>
        </button>
      </div>
    </header>
  );
};
