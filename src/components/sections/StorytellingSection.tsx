import React from 'react';
import { ThemeConfig } from '../../types';
import { Sparkles, Heart, Clock, Award, Camera } from 'lucide-react';

interface StorytellingSectionProps {
  currentTheme: ThemeConfig;
}

export const StorytellingSection: React.FC<StorytellingSectionProps> = ({ currentTheme }) => {
  return (
    <section className="relative py-20 px-4 max-w-7xl mx-auto">
      <div className="rounded-3xl glass-panel p-8 sm:p-12 md:p-16 border border-theme-border shadow-2xl relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div 
          className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full blur-[120px] opacity-20 pointer-events-none"
          style={{ backgroundColor: currentTheme.colors.primary }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Story Text */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill mb-4 border border-theme-border text-xs font-bold text-theme-primary uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LE MANIFESTE MAISON ALICE</span>
            </div>

            <h2 className={`text-2xl sm:text-4xl font-black text-theme-text mb-6 tracking-tight leading-tight ${currentTheme.titleFontClass}`}>
              Quand la Haute Confiserie rencontre l'Onirisme à Bamako
            </h2>

            <div className={`space-y-4 text-xs sm:text-sm text-theme-text-muted leading-relaxed ${currentTheme.bodyFontClass}`}>
              <p>
                Née d'une passion pour les contes féeriques et la gourmandise raffinée, <strong className="text-theme-text font-semibold">Maison Alice</strong> réinvente l'art d'offrir des douceurs dans la capitale malienne.
              </p>
              <p>
                Finies les boîtes ordinaires. Nous concevons chaque coffret comme une porte dérobée vers le Pays des Merveilles : des packagings rigides confectionnés avec minutie à Bamako, garnis de chocolats fins stabilisés contre la chaleur estivale, de biscuits sablés d'antan et de bonbons délicats.
              </p>
              <p>
                Que ce soit pour célébrer un anniversaire, déclarer votre flamme, honorer une fête ou s'accorder un plaisir coupable, Maison Alice transforme chaque déballage en souvenir inoubliable.
              </p>
            </div>

            {/* Social Proof Link */}
            <div className="mt-8 pt-6 border-t border-theme-border flex flex-wrap items-center gap-4">
              <span className="text-xs font-bold text-theme-text">Rejoignez le Tea Party :</span>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-pill hover:bg-theme-surface text-xs text-theme-text transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-theme-primary" />
                  <span>@maisonalice.ml</span>
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-pill hover:bg-theme-surface text-xs text-theme-text transition-colors"
                >
                  <span className="text-xs font-bold text-theme-primary">♪</span>
                  <span>TikTok Maison Alice</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-theme-surface/70 border border-theme-border hover:border-theme-primary transition-all duration-300">
              <Award className="w-6 h-6 text-theme-gold mb-3" />
              <h4 className="text-sm font-bold text-theme-text mb-1">Packaging Haute Finition</h4>
              <p className="text-xs text-theme-text-muted">
                Cartonnages rigides confectionnés localement à Bamako avec dorures à chaud et rubans satinés.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-theme-surface/70 border border-theme-border hover:border-theme-primary transition-all duration-300">
              <Heart className="w-6 h-6 text-theme-primary mb-3" />
              <h4 className="text-sm font-bold text-theme-text mb-1">Résistant à la Chaleur</h4>
              <p className="text-xs text-theme-text-muted">
                Sélection stricte de chocolats enrobés et confiseries conservant toute leur texture et brillance.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-theme-surface/70 border border-theme-border hover:border-theme-primary transition-all duration-300">
              <Clock className="w-6 h-6 text-theme-primary mb-3" />
              <h4 className="text-sm font-bold text-theme-text mb-1">Livraison Isotherme</h4>
              <p className="text-xs text-theme-text-muted">
                Vos coffrets sont acheminés dans des glacières sécurisées partout sur les deux rives de Bamako.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-theme-surface/70 border border-theme-border hover:border-theme-primary transition-all duration-300">
              <Sparkles className="w-6 h-6 text-theme-gold mb-3" />
              <h4 className="text-sm font-bold text-theme-text mb-1">L'Effet Wow Garanti</h4>
              <p className="text-xs text-theme-text-muted">
                Clé dorée souvenir, étiquette "Mange-moi" et expérience d'unboxing qui fait sensation sur les réseaux.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
