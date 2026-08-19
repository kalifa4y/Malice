import React from 'react';
import { ThemeConfig } from '../../types';
import { Star, Sparkles } from 'lucide-react';

interface TestimonialsTableSectionProps {
  currentTheme: ThemeConfig;
}

export const TestimonialsTableSection: React.FC<TestimonialsTableSectionProps> = ({ currentTheme }) => {
  const reviews = [
    {
      id: 1,
      rating: 5,
      quote: "C'est sans hésiter le <span class='quote-highlight'>meilleur coffret cadeau</span> que j'ai reçu à Bamako. Le déballage est digne d'un conte de fées et les chocolats sont restés d'un croquant parfait !",
      author: "Fatoumata D.",
      role: "Amatrice d'art & gastronome à l'ACI 2000",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 2,
      rating: 5,
      quote: "J'ai offert le Coffret Royal à ma fiancée. L'effet de la <span class='quote-highlight'>clé dorée</span> et de la fiole magique a rendu ce moment inoubliable.",
      author: "Ibrahim K.",
      role: "Entrepreneur à Badalabougou",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 3,
      rating: 5,
      quote: "Enfin une marque à Bamako qui comprend le <span class='quote-highlight'>vrai luxe</span>. Le service client sur WhatsApp est d'une rapidité exemplaire et le packaging est sublime.",
      author: "Aminata S.",
      role: "Créatrice de contenu lifestyle",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 4,
      rating: 5,
      quote: "« Qu'on leur coupe la tête s'ils n'en reprennent pas ! » Le sablé pur beurre et les dragées au chocolat noir sont tout simplement <span class='quote-highlight'>royaux</span>.",
      author: "La Reine de Cœur",
      role: "Souveraine du Pays des Merveilles",
      avatar: "/assets/reine coeur.png"
    }
  ];

  return (
    <section className="relative py-24 px-4 max-w-5xl mx-auto overflow-hidden">
      {/* Ambient Theme Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[140px] opacity-15 pointer-events-none"
        style={{ backgroundColor: currentTheme.colors.primary }}
      />
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="o-badge-tech mb-4">
          [ LIVRE D'OR & CRITIQUES ]
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-theme-text mb-3 font-darker tracking-tight leading-none">
          Ce que les Gourmets en disent
        </h2>
        <p className="body1 text-sm sm:text-base">
          Des retours authentiques de clients comblés et de personnages de légende à Bamako.
        </p>
      </div>

      {/* Testimonials Table Wrapper */}
      <div className="rounded-3xl glass-panel p-6 sm:p-10 border border-theme-border shadow-2xl">
        {/* Table Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div className="flex items-center gap-2 font-mono text-xs text-theme-text-muted">
            <Sparkles className="w-4 h-4 text-theme-gold" />
            <span className="font-bold uppercase tracking-wider text-theme-text">Avis Certifiés Bamako</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-mono text-xs font-bold text-theme-gold bg-theme-surface px-2.5 py-1 rounded-full border border-theme-border">
              [ 4.9 / 5 ]
            </span>
          </div>
        </div>

        <div className="o-dashline" />

        {/* Testimonials List Items */}
        <div className="space-y-8">
          {reviews.map((rev) => (
            <div key={rev.id} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Left Column: Rating & Quote */}
                <div className="md:col-span-9 space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-[11px] font-mono font-bold text-theme-text-muted ml-2">
                      [ {rev.rating}/5 ]
                    </span>
                  </div>

                  <blockquote 
                    className="text-base sm:text-lg md:text-xl font-darker font-bold text-theme-text leading-snug tracking-wide"
                    dangerouslySetInnerHTML={{ __html: `"${rev.quote}"` }}
                  />

                  <div className="flex items-center gap-2 text-xs font-mono text-theme-text-muted pt-1">
                    <span className="font-bold text-theme-text">{rev.author}</span>
                    <span>•</span>
                    <span className="text-[11px] text-theme-text-muted/80">{rev.role}</span>
                  </div>
                </div>

                {/* Right Column: Avatar Thumbnail */}
                <div className="md:col-span-3 flex justify-start md:justify-end">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-theme-border shadow-lg group">
                    <img 
                      src={rev.avatar} 
                      alt={rev.author}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-theme-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>

              <div className="o-dashline" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
