import React from 'react';
import { Pack, ThemeConfig } from '../../types';
import { ArrowRight, Check, Sparkles, Award, Gift } from 'lucide-react';

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
      className="relative py-24 sm:py-32 px-4 max-w-7xl mx-auto flex flex-col items-center pointer-events-none"
    >
      {/* Section Heading with Oraculum Filigree */}
      <div className="text-center max-w-2xl mx-auto mb-16 pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-theme-gold/30 text-[11px] uppercase tracking-[0.2em] text-theme-gold font-semibold mb-3">
          <span>Chapitre I • Le Grimoire de l&apos;Oraculum</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-theme-text">
          Les Écrins Royaux d&apos;Underland
        </h2>
        <p className="mt-4 text-sm sm:text-base text-theme-text-muted leading-relaxed">
          De la table éternelle de Tarrant Hightopp (10/6) aux jardins de Marmoreal et à la cour de Salazen Grum : chaque coffret est façonné à la commande à Bamako et scellé à la cire.
        </p>
      </div>

      {/* Detailed Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full pointer-events-auto items-stretch">
        {activePacks.map((pack) => {
          const isFeatured = pack.slug === 'premium';
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
                {/* Image Header with Badge & Price Tag */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-black/50 border-b border-white/10">
                  <img
                    src={pack.image}
                    alt={pack.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {pack.badge && (
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-theme-gold/40 text-xs font-semibold text-theme-text">
                      {getPackBadgeIcon(pack.slug)}
                      <span>{pack.badge.replace(/^[^\wÀ-ÿ]+/, '').trim()}</span>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-2">
                    <div>
                      <p className="text-xs text-theme-gold font-medium tracking-wide">
                        {pack.tagline}
                      </p>
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
                        {pack.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-7 space-y-6">
                  {/* Price Banner */}
                  <div className="flex items-baseline justify-between pb-4 border-b border-white/10">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-theme-text-muted block">
                        Offrande Tout Compris
                      </span>
                      <span className="text-[11px] text-emerald-400 font-medium">
                        Livraison isotherme offerte à Bamako
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-2xl sm:text-3xl font-bold text-theme-gold">
                        {pack.price.toLocaleString('fr-FR')}
                      </span>
                      <span className="text-xs font-mono text-theme-text-muted ml-1">FCFA</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-theme-text-muted leading-relaxed">
                    {pack.description}
                  </p>

                  {/* Full Composition Directly Visible */}
                  {pack.contents && pack.contents.length > 0 && (
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-theme-gold">
                        Reliques &amp; Douceurs de l&apos;Écrin ({pack.contents.length} pièces)
                      </h4>
                      <ul className="space-y-2">
                        {pack.contents.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-xs sm:text-[13px] text-theme-text/90 leading-snug"
                          >
                            <span className="w-4 h-4 rounded-full bg-theme-primary/20 border border-theme-primary/50 flex items-center justify-center flex-shrink-0 mt-0.5 text-theme-primary">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Key Signatures / Features */}
                  {pack.features && pack.features.length > 0 && (
                    <div className="pt-4 border-t border-white/10 space-y-2">
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-theme-text-muted">
                        Sceau &amp; Privilèges
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {pack.features.map((feat, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-theme-text-muted"
                          >
                            <Sparkles className="w-3 h-3 text-theme-gold flex-shrink-0" />
                            <span>{feat}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="p-6 sm:p-7 pt-0 mt-2">
                <button
                  type="button"
                  onClick={() => onSelectPack(pack)}
                  className={`w-full py-4 px-6 rounded-2xl font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer ${
                    isFeatured
                      ? 'bg-theme-primary text-white shadow-glow-primary hover:brightness-110'
                      : 'bg-white/10 hover:bg-theme-primary text-white border border-white/15 hover:border-theme-primary'
                  }`}
                >
                  <span>Choisir cet Écrin</span>
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
