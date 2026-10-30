import React from 'react';
import { ArrowRight, Truck, Smartphone, ShieldCheck, Clock } from 'lucide-react';

interface BamakoDeliveryPaymentSectionProps {
  onOpenOrder: () => void;
}

export const BamakoDeliveryPaymentSection: React.FC<BamakoDeliveryPaymentSectionProps> = ({
  onOpenOrder
}) => {
  return (
    <section
      id="bamako-delivery"
      className="relative py-24 px-4 max-w-6xl mx-auto flex flex-col items-center pointer-events-none"
    >
      <div className="text-center max-w-2xl mx-auto mb-14 pointer-events-auto">
        <h2 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-theme-text">
          Logistique Isotherme &amp; Mobile Money
        </h2>
        <p className="mt-3 text-sm sm:text-base text-theme-text-muted">
          De l&apos;ACI 2000 à Badalabougou, Kalaban Coura ou Sotuba : nous livrons vos coffrets sans frais
          supplémentaires sur les deux rives de Bamako.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full pointer-events-auto">
        {/* Left Card: Free Insulated Delivery across Bamako */}
        <div className="rounded-3xl glass-panel p-8 sm:p-10 border border-theme-border flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-theme-primary/15 border border-theme-primary/40 flex items-center justify-center text-theme-primary">
              <Truck className="w-6 h-6" />
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-theme-text">
              Livraison Offerte Partout à Bamako
            </h3>

            <p className="text-xs sm:text-sm text-theme-text-muted leading-relaxed">
              Que vous commandiez pour vous-même ou pour surprendre un proche au bureau ou à domicile,
              nos coursiers acheminent chaque écrin dans des sacs isothermes dédiés.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/10">
            <div className="flex items-start gap-2.5 text-xs text-theme-text-muted">
              <Clock className="w-4 h-4 text-theme-gold flex-shrink-0 mt-0.5" />
              <span>Service 7j/7 sur Rive Gauche &amp; Rive Droite</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-theme-text-muted">
              <ShieldCheck className="w-4 h-4 text-theme-gold flex-shrink-0 mt-0.5" />
              <span>Chaîne de fraîcheur garantie jusqu&apos;à la remise</span>
            </div>
          </div>
        </div>

        {/* Right Card: Mobile Money Mali */}
        <div className="rounded-3xl glass-panel p-8 sm:p-10 border border-theme-border flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-theme-gold/15 border border-theme-gold/40 flex items-center justify-center text-theme-gold">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-theme-text">
              Règlement Simple &amp; Instantané
            </h3>

            <p className="text-xs sm:text-sm text-theme-text-muted leading-relaxed">
              Réglez directement via votre compte mobile habituel au Mali et validez votre bon de
              commande en un clic sur WhatsApp avec notre conciergerie.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
            <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-center">
              <div className="font-mono text-xs font-bold text-orange-400">OM</div>
              <div className="text-[11px] font-semibold text-theme-text mt-1">Orange Money</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-center">
              <div className="font-mono text-xs font-bold text-sky-400">WAVE</div>
              <div className="text-[11px] font-semibold text-theme-text mt-1">Wave Mali</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
              <div className="font-mono text-xs font-bold text-emerald-400">MOOV</div>
              <div className="text-[11px] font-semibold text-theme-text mt-1">Moov Money</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 pointer-events-auto">
        <button
          type="button"
          onClick={onOpenOrder}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-theme-gold/50 bg-black/50 backdrop-blur-md text-theme-text font-semibold tracking-wider uppercase hover:bg-theme-primary hover:border-theme-primary hover:text-white transition-all duration-300 text-xs sm:text-sm cursor-pointer"
        >
          <span>Lancer ma commande maintenant</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
