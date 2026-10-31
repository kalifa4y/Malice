import React from 'react';
import { Pack, ThemeConfig } from '../../types';
import { ArrowRight, Sparkles, Award, Gift } from 'lucide-react';
import {
  ItemMicroIllustration,
  AnimatedHatterHatSvg
} from '../ui/UnderlandIllustrations';

interface PackShowcaseProps {
  packs: Pack[];
  currentTheme: ThemeConfig;
  onSelectPack: (pack: Pack) => void;
}

export const PackShowcase: React.FC<PackShowcaseProps> = ({
  packs,
  onSelectPack
}) => {
  const activePacks = packs.filter((p) => p.isActive);

  const getPackBadgeIcon = (slug: Pack['slug']) => {
    if (slug === 'premium') return <Award className="w-3.5 h-3.5 text-theme-gold" />;
    if (slug === 'seasonal') return <Sparkles className="w-3.5 h-3.5 text-theme-primary" />;
    return <Gift className="w-3.5 h-3.5 text-theme-gold" />;
  };

  return (
    <section
      id="packs-showcase"
      className="relative py-20 px-4 max-w-7xl mx-auto flex flex-col items-center pointer-events-none"
    >
      {/* En-tête de section */}
      <div className="text-center max-w-lg mx-auto mb-12 pointer-events-auto flex flex-col items-center">
        <div className="text-theme-gold mb-2">
          <AnimatedHatterHatSvg className="w-12 h-12" />
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-theme-text">
          Nos 3 Coffrets Cadeaux
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-theme-text-muted">
          Livraison gratuite partout à Bamako
        </p>
      </div>

      {/* Grille des 3 Coffrets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 w-full pointer-events-auto items-stretch">
        {activePacks.map((pack) => {
          const isFeatured = pack.slug === 'premium';
          const items = pack.contents || [];
          const totalItems = items.length;

          return (
            <article
              key={pack.id}
              className={`group relative rounded-3xl glass-panel flex flex-col justify-between overflow-hidden transition-all duration-500 hover:-translate-y-1.5 ${
                isFeatured
                  ? 'border-theme-gold/65 shadow-glow-gold ring-1 ring-theme-gold/35'
                  : 'border-theme-border hover:border-theme-gold/50'
              }`}
            >
              <div>
                {/* Visuel du coffret avec Prix & Titre */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-black/50 border-b border-white/10">
                  <img
                    src={pack.image}
                    alt={pack.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {pack.badge && (
                    <div className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-theme-gold/40 text-[11px] font-semibold text-theme-text">
                      {getPackBadgeIcon(pack.slug)}
                      <span>{pack.badge.replace(/^[^\wÀ-ÿ]+/, '').trim()}</span>
                    </div>
                  )}

                  <div className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-theme-gold/50">
                    <span className="font-mono text-sm sm:text-base font-bold text-theme-gold">
                      {pack.price.toLocaleString('fr-FR')}
                    </span>
                    <span className="text-[10px] font-mono text-theme-text-muted ml-1">FCFA</span>
                  </div>

                  <div className="absolute bottom-3.5 left-5 right-5">
                    <p className="text-[11px] text-theme-gold font-medium uppercase tracking-wider">
                      {pack.tagline}
                    </p>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
                      {pack.name}
                    </h3>
                  </div>
                </div>

                {/* Grille de petits blocs (3 en haut + 2 en bas) */}
                <div className="p-4 sm:p-5">
                  {totalItems > 0 && (
                    <div className="grid grid-cols-6 gap-2.5">
                      {items.map((item, i) => {
                        // Si 5 éléments : les 3 premiers prennent 2 colonnes (3 en haut), les 2 derniers prennent 3 colonnes (2 en bas)
                        const isBottomPair = totalItems % 3 === 2 && i >= totalItems - 2;
                        const isSingleLast = totalItems % 3 === 1 && i === totalItems - 1;
                        const spanClass = isBottomPair
                          ? 'col-span-3'
                          : isSingleLast
                            ? 'col-span-6'
                            : 'col-span-2';

                        return (
                          <div
                            key={i}
                            className={`${spanClass} min-h-[76px] p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-theme-gold/35 transition-colors flex flex-col items-center justify-center text-center gap-1.5`}
                          >
                            <span className="w-7 h-7 rounded-xl bg-theme-primary/20 border border-theme-primary/40 flex items-center justify-center flex-shrink-0 text-theme-gold">
                              <ItemMicroIllustration text={item} className="w-3.5 h-3.5" />
                            </span>
                            <span className="text-[11px] sm:text-xs text-theme-text font-medium leading-tight line-clamp-2 break-words max-w-full">
                              {item}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Bouton Commander */}
              <div className="p-4 sm:p-5 pt-0">
                <button
                  type="button"
                  onClick={() => onSelectPack(pack)}
                  className={`w-full py-3.5 px-6 rounded-2xl font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    isFeatured
                      ? 'bg-theme-primary text-white shadow-glow-primary hover:brightness-110'
                      : 'bg-white/10 hover:bg-theme-primary text-white border border-white/15 hover:border-theme-primary'
                  }`}
                >
                  <span>Commander</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
