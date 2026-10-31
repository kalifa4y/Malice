import React from 'react';
import { Truck, Smartphone } from 'lucide-react';
import { AnimatedGoldenKeySvg } from '../ui/UnderlandIllustrations';

interface BamakoDeliveryPaymentSectionProps {
  onOpenOrder: () => void;
}

export const BamakoDeliveryPaymentSection: React.FC<BamakoDeliveryPaymentSectionProps> = () => {
  return (
    <section
      id="bamako-delivery"
      className="relative py-14 px-4 max-w-5xl mx-auto pointer-events-none"
    >
      <div className="rounded-3xl glass-panel p-6 sm:p-8 pointer-events-auto border border-theme-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Left: Free Bamako Delivery */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-theme-primary/20 border border-theme-primary/40 flex items-center justify-center text-theme-gold flex-shrink-0">
              <Truck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                <AnimatedGoldenKeySvg className="w-3.5 h-3.5" />
                <span>0 FCFA • Sac Isotherme 7j/7</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-semibold text-theme-text">
                Livraison Offerte à Bamako
              </h3>
              <p className="text-xs text-theme-text-muted mt-0.5">
                Rive Gauche &amp; Rive Droite • Quartier ou Position GPS
              </p>
            </div>
          </div>

          {/* Right: Mobile Money Badges */}
          <div className="flex flex-col sm:items-end justify-center">
            <div className="flex items-center gap-1.5 text-xs text-theme-text-muted mb-2.5">
              <Smartphone className="w-3.5 h-3.5 text-theme-gold" />
              <span>Paiement Mobile &amp; Validation WhatsApp</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5 w-full sm:w-auto">
              <div className="px-3.5 py-2.5 rounded-xl bg-black/45 border border-orange-500/35 text-center">
                <span className="text-xs font-bold text-orange-400 block">OM</span>
                <span className="text-[10px] text-theme-text-muted">Orange</span>
              </div>
              <div className="px-3.5 py-2.5 rounded-xl bg-black/45 border border-sky-400/35 text-center">
                <span className="text-xs font-bold text-sky-400 block">WAVE</span>
                <span className="text-[10px] text-theme-text-muted">Wave</span>
              </div>
              <div className="px-3.5 py-2.5 rounded-xl bg-black/45 border border-blue-500/35 text-center">
                <span className="text-xs font-bold text-blue-400 block">MOOV</span>
                <span className="text-[10px] text-theme-text-muted">Moov</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
