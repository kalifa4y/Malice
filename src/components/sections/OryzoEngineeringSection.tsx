import React from 'react';
import { ThemeConfig } from '../../types';
import { SensorySlider } from '../interactive/SensorySlider';
import { MagicCardFlipper } from '../interactive/MagicCardFlipper';
import { Layers, Truck, Box } from 'lucide-react';

interface OryzoEngineeringSectionProps {
  currentTheme: ThemeConfig;
}

export const OryzoEngineeringSection: React.FC<OryzoEngineeringSectionProps> = ({ currentTheme }) => {
  return (
    <section className="relative py-24 px-4 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="o-badge-tech mb-4">
          [ SPÉCIFICATIONS & HAUTE FACTURE ]
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-theme-text mb-4 font-darker tracking-tight leading-none">
          L'Ingénierie de la Douceur à Bamako
        </h2>
        <p className="body1 text-sm sm:text-base max-w-2xl mx-auto">
          Chaque détail de nos coffrets a été pensé pour dépasser les standards ordinaires : du cartonnage rigide façonné à la main jusqu'au bouclier thermique anti-chaleur.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bento Item 1: Sensory & Thermal Slider */}
        <SensorySlider currentTheme={currentTheme} />

        {/* Bento Item 2: Smart Flip Wax-Seal Card */}
        <MagicCardFlipper currentTheme={currentTheme} />
      </div>

      {/* Secondary Bento Grid Row: 3 Compact Spec Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Spec Card 1: Box Architecture */}
        <div className="bento-card p-6">
          <div className="flex items-center justify-between mb-4">
            <Box className="w-5 h-5 text-theme-primary" />
            <span className="text-[10px] font-mono text-theme-text-muted">SPEC #01 • RIGIDITÉ</span>
          </div>
          <h4 className="text-2xl font-black text-theme-text font-darker mb-1.5">
            Cartonnage Rigide 2.4mm
          </h4>
          <p className="body2 text-xs mb-4">
            Structure indéformable fabriquée localement à Bamako avec finitions touché velours et dorures à chaud 24 carats.
          </p>
          <div className="o-dashline" />
          <div className="flex justify-between text-[11px] font-mono text-theme-text-muted">
            <span>Résistance écrasement :</span>
            <span className="font-bold text-theme-primary">Jusqu'à 15 kg</span>
          </div>
        </div>

        {/* Spec Card 2: Tropical Insulation */}
        <div className="bento-card p-6">
          <div className="flex items-center justify-between mb-4">
            <Layers className="w-5 h-5 text-theme-gold" />
            <span className="text-[10px] font-mono text-theme-text-muted">SPEC #02 • ISOTHERMIE</span>
          </div>
          <h4 className="text-2xl font-black text-theme-text font-darker mb-1.5">
            Triple Écran Thermique
          </h4>
          <p className="body2 text-xs mb-4">
            Papier de soie paraffiné, coussin d'air protecteur et sac isotherme hermétique scellé avant le départ coursier.
          </p>
          <div className="o-dashline" />
          <div className="flex justify-between text-[11px] font-mono text-theme-text-muted">
            <span>Delta T° garanti :</span>
            <span className="font-bold text-theme-gold">-12°C constant</span>
          </div>
        </div>

        {/* Spec Card 3: Fast Dispatch Bamako */}
        <div className="bento-card p-6">
          <div className="flex items-center justify-between mb-4">
            <Truck className="w-5 h-5 text-theme-primary" />
            <span className="text-[10px] font-mono text-theme-text-muted">SPEC #03 • LOGISTIQUE</span>
          </div>
          <h4 className="text-2xl font-black text-theme-text font-darker mb-1.5">
            Courtiers Dédiés 7j/7
          </h4>
          <p className="body2 text-xs mb-4">
            Acheminement express sur les Rives Gauche & Droite du fleuve Niger. Remise en main propre avec protocole gant blanc.
          </p>
          <div className="o-dashline" />
          <div className="flex justify-between text-[11px] font-mono text-theme-text-muted">
            <span>Délai moyen Bamako :</span>
            <span className="font-bold text-theme-primary">2h à 4h</span>
          </div>
        </div>
      </div>
    </section>
  );
};
