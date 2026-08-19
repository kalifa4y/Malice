import React, { useState } from 'react';
import { ThemeConfig } from '../../types';
import { Truck, HelpCircle, ChevronDown } from 'lucide-react';

interface DeliveryFaqSectionProps {
  currentTheme: ThemeConfig;
}

export const DeliveryFaqSection: React.FC<DeliveryFaqSectionProps> = ({ currentTheme }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Comment fonctionne la livraison à Bamako ?",
      a: "Nous assurons la livraison par coursiers dédiés dans des sacs isothermes hermétiques partout à Bamako 7 jours sur 7. Les frais sont calculés selon votre commune/quartier (ex: 1 500 FCFA pour ACI 2000 ou Badalabougou, 2 000 FCFA pour Bacodjicoroni ou Hippodrome). La livraison a lieu sous 2 à 4 heures ou au créneau horaire de votre choix."
    },
    {
      q: "Comment s'effectue le paiement (Orange Money, Wave, Moov) ?",
      a: "Lors de la validation de votre commande, vous sélectionnez votre moyen de paiement préféré. Nos numéros officiels Maison Alice vous sont indiqués. Après avoir effectué votre transfert sur votre application mobile (ou par code USSD), vous confirmez votre commande sur WhatsApp en envoyant la capture d'écran du paiement."
    },
    {
      q: "Les chocolats et friandises fondent-ils avec la chaleur de Bamako ?",
      a: "Absolument pas ! Nous sélectionnons exclusivement des chocolats pralinés à haute tenue en cacao et des bonbons fins formulés pour supporter les températures tropicales sans altération. De plus, nos livraisons s'effectuent sous chaîne de fraîcheur."
    },
    {
      q: "Puis-je envoyer un coffret cadeau anonyme ou avec un mot doux ?",
      a: "Oui ! Vous pouvez indiquer dans le formulaire de commande que vous souhaitez offrir la box. Nous rédigerons gratuitement une magnifique carte personnalisée scellée à la cire et nous livrerons la personne de votre choix à Bamako."
    }
  ];

  return (
    <section className="relative py-20 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill mb-4 border border-theme-border text-xs font-semibold tracking-wider text-theme-primary">
          <Truck className="w-3.5 h-3.5" />
          <span>LIVRAISON & PAIEMENT À BAMAKO</span>
        </div>
        <h2 className={`text-3xl sm:text-4xl font-black text-theme-text mb-4 tracking-tight ${currentTheme.titleFontClass}`}>
          Questions Fréquentes & Guide Pratique
        </h2>
        <p className="text-sm text-theme-text-muted max-w-xl mx-auto">
          Tout ce que vous devez savoir pour commander votre box en toute sérénité.
        </p>
      </div>

      {/* Payment Options Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <div className="p-5 rounded-2xl glass-panel border border-orange-500/30 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-black text-sm">
            OM
          </div>
          <div>
            <div className="text-xs font-bold text-theme-text">Orange Money</div>
            <div className="text-[11px] text-theme-text-muted">Paiement direct & instantané</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-blue-500/30 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-sm">
            W
          </div>
          <div>
            <div className="text-xs font-bold text-theme-text">Wave Mali</div>
            <div className="text-[11px] text-theme-text-muted">Transfert sans frais</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm">
            MM
          </div>
          <div>
            <div className="text-xs font-bold text-theme-text">Moov Money</div>
            <div className="text-[11px] text-theme-text-muted">Transfert rapide & sécurisé</div>
          </div>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className={`rounded-2xl glass-panel border transition-all duration-300 overflow-hidden ${
                isOpen ? 'border-theme-primary/60 shadow-lg' : 'border-theme-border'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-theme-text hover:text-theme-primary transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-theme-primary flex-shrink-0" />
                  <span>{faq.q}</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-theme-text-muted transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-theme-primary' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-theme-text-muted leading-relaxed border-t border-theme-border/40 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
