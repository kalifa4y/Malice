import React, { useState } from 'react';
import { ThemeConfig } from '../../types';
import { Sparkles, RotateCw } from 'lucide-react';

interface MagicCardFlipperProps {
  currentTheme: ThemeConfig;
}

export const MagicCardFlipper: React.FC<MagicCardFlipperProps> = ({ currentTheme }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [customMessage, setCustomMessage] = useState('Pour la plus merveilleuse des reines de Bamako.');
  const [senderName, setSenderName] = useState('Le Chapelier Fou');

  return (
    <div className="bento-card p-6 sm:p-8 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="o-badge-tech">
            [ SMART FLIP WAX-SEAL CARD ]
          </span>
          <span className="text-xs font-mono text-theme-text-muted">
            RECTO / VERSO 3D
          </span>
        </div>

        <h4 className="text-2xl sm:text-3xl font-black text-theme-text font-darker mb-1">
          La Carte Secrète "Mange-Moi"
        </h4>
        <p className="body2 text-xs sm:text-sm mb-6">
          Personnalisez la carte manuscrite incluse dans votre coffret. Scellez-la virtuellement d'un sceau de cire avant l'expédition.
        </p>

        {/* 3D Flip Card Container */}
        <div className="perspective-1000 w-full min-h-[170px] mb-6">
          <div 
            className={`relative w-full h-full min-h-[170px] rounded-2xl transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front: Message Editor */}
            <div className="absolute inset-0 backface-hidden p-5 rounded-2xl bg-theme-surface/90 border border-theme-border flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-theme-primary mb-2">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>CARTE CADEAU OFFICIELLE</span>
                  </span>
                  <span className="text-theme-gold">⚜️ MAISON ALICE</span>
                </div>
                <p className="font-serif italic text-sm text-theme-text line-clamp-3">
                  "{customMessage || 'Votre mot doux apparaîtra ici...'}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-theme-border/40 text-[11px]">
                <span className="text-theme-text-muted">De la part de : <strong className="text-theme-text">{senderName || 'Anonyme'}</strong></span>
                <span className="text-theme-primary flex items-center gap-1 font-mono">
                  <span>Cliquer pour retourner</span>
                  <RotateCw className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Back: Golden Wax Sealed Royal Enveloppe */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 p-5 rounded-2xl bg-[#180a14] border border-theme-gold/50 flex flex-col items-center justify-center text-center shadow-xl">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-glow-gold border-2 border-yellow-300/60 mb-2 transform hover:scale-110 transition-transform"
                style={{ backgroundColor: currentTheme.colors.primary }}
              >
                <span className="font-serif font-black text-2xl text-white drop-shadow">
                  {currentTheme.cardSuitSymbol}
                </span>
              </div>
              <span className="text-xs font-black font-darker uppercase tracking-widest text-theme-gold">
                Sceau Royal à la Cire
              </span>
              <span className="text-[10px] font-mono text-theme-text-muted mt-0.5">
                CONFIDENTIEL • DESTINATAIRE EXCLUSIF
              </span>
            </div>
          </div>
        </div>

        {/* Input Fields to live test */}
        <div className="space-y-2 mb-4">
          <input
            type="text"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Écrivez votre message secret..."
            className="w-full px-3.5 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs text-theme-text focus:outline-none focus:border-theme-primary"
          />
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Votre signature..."
            className="w-full px-3.5 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs text-theme-text focus:outline-none focus:border-theme-primary"
          />
        </div>
      </div>

      <button
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full py-2.5 px-4 rounded-xl glass-pill hover:bg-theme-surface text-xs font-bold text-theme-text border border-theme-border flex items-center justify-center gap-2 transition-all cursor-pointer"
      >
        <RotateCw className="w-3.5 h-3.5 text-theme-primary" />
        <span>{isFlipped ? 'Éditer le mot doux (Recto)' : 'Sceller & Voir le Sceau de Cire (Verso)'}</span>
      </button>
    </div>
  );
};
