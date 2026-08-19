import React, { useState } from 'react';
import { ThemeConfig } from '../../types';
import { Sparkles, Thermometer, ShieldCheck, Flame } from 'lucide-react';

interface SensorySliderProps {
  currentTheme: ThemeConfig;
}

export const SensorySlider: React.FC<SensorySliderProps> = ({ currentTheme }) => {
  const [level, setLevel] = useState<number>(2); // 1, 2, 3

  const profiles = [
    {
      id: 1,
      name: 'Intensité Grand Cru',
      spec: 'Cacao Noir 70%',
      tag: 'T = 18°C',
      desc: 'Ganaches pures fèves d\'Afrique et pralinés croustillants à haute concentration aromatique.',
      icon: Flame,
      stat: '0.00% Fongible',
      color: currentTheme.colors.primary
    },
    {
      id: 2,
      name: 'Équilibre & Sablés',
      spec: 'Pur Beurre & Vanille',
      tag: 'T = 24°C',
      desc: 'Sablés d\'antan à la fleur de sel et dragées fines crémeuses dosées à la perfection.',
      icon: Sparkles,
      stat: '100% Céleste',
      color: currentTheme.colors.gold
    },
    {
      id: 3,
      name: 'Bouclier Tropical',
      spec: 'Tenue Anti-Chaleur 38°C',
      tag: 'T = 38°C',
      desc: 'Enrobage exclusif stabilisé pour supporter les chaleurs torrides de Bamako sans fondre.',
      icon: ShieldCheck,
      stat: '99.8% Indestructible',
      color: currentTheme.colors.primary
    }
  ];

  const currentProfile = profiles[level - 1];
  const IconComp = currentProfile.icon;

  return (
    <div className="bento-card p-6 sm:p-8 relative">
      <div className="flex items-center justify-between mb-4">
        <span className="o-badge-tech">
          [ THERMAL & FLAVOR MATRIX ]
        </span>
        <div className="flex items-center gap-1.5 text-xs font-mono text-theme-text-muted">
          <Thermometer className="w-3.5 h-3.5 text-theme-primary" />
          <span>{currentProfile.tag}</span>
        </div>
      </div>

      <div className="flex items-center gap-3.5 mb-3">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-md transition-all duration-300"
          style={{ 
            backgroundColor: `${currentProfile.color}15`,
            borderColor: currentProfile.color,
            color: currentProfile.color
          }}
        >
          <IconComp className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xl sm:text-2xl font-black text-theme-text font-darker leading-none">
            {currentProfile.name}
          </h4>
          <span className="text-xs font-bold font-mono uppercase" style={{ color: currentProfile.color }}>
            {currentProfile.spec}
          </span>
        </div>
      </div>

      <p className="body2 text-xs sm:text-sm mb-6 min-h-[42px]">
        {currentProfile.desc}
      </p>

      {/* Interactive 3-step Track Slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-[11px] font-mono font-bold text-theme-text-muted px-1">
          <button 
            onClick={() => setLevel(1)} 
            className={`cursor-pointer transition-colors ${level === 1 ? 'text-theme-primary font-black' : 'hover:text-theme-text'}`}
          >
            01. Cacao Grand Cru
          </button>
          <button 
            onClick={() => setLevel(2)} 
            className={`cursor-pointer transition-colors ${level === 2 ? 'text-theme-gold font-black' : 'hover:text-theme-text'}`}
          >
            02. Sablé Beurre
          </button>
          <button 
            onClick={() => setLevel(3)} 
            className={`cursor-pointer transition-colors ${level === 3 ? 'text-theme-primary font-black' : 'hover:text-theme-text'}`}
          >
            03. Bouclier 38°C
          </button>
        </div>

        <div className="relative h-3 bg-theme-surface rounded-full p-0.5 border border-theme-border flex items-center">
          <div 
            className="absolute top-0.5 bottom-0.5 rounded-full transition-all duration-300 shadow-glow-primary"
            style={{ 
              backgroundColor: currentProfile.color,
              left: level === 1 ? '2px' : level === 2 ? '33.3%' : '66.6%',
              width: '33.3%'
            }}
          />
        </div>
      </div>

      <div className="o-dashline" />

      <div className="flex items-center justify-between text-xs font-mono text-theme-text-muted pt-1">
        <span>Précision Bamako :</span>
        <span className="font-bold text-theme-text">{currentProfile.stat}</span>
      </div>
    </div>
  );
};
