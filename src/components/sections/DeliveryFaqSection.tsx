import React, { useState } from 'react';
import { ThemeConfig } from '../../types';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface DeliveryFaqSectionProps {
  currentTheme: ThemeConfig;
}

export const DeliveryFaqSection: React.FC<DeliveryFaqSectionProps> = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Comment fonctionne la livraison gratuite à Bamako ?',
      a: "Nous assurons la livraison gratuitement partout à Bamako 7 jours sur 7 par coursiers dédiés équipés de sacs isothermes hermétiques. Dans le formulaire de commande, vous pouvez soit indiquer le quartier et les repères d'adresse (idéal pour offrir à un proche), soit partager votre position GPS en un clic."
    },
    {
      q: "Comment s'effectue le paiement (Orange Money, Wave, Moov Money) ?",
      a: "Lors de la dernière étape de votre commande, vous choisissez votre opérateur mobile préféré. Le numéro officiel Maison Alice s'affiche immédiatement. Une fois la commande validée, votre récapitulatif s'ouvre directement dans WhatsApp pour finaliser l'envoi avec notre service client."
    },
    {
      q: 'Les chocolats et friandises résistent-ils à la chaleur de Bamako ?',
      a: 'Oui. Nos chocolats pralinés à haute teneur en cacao, dragées, calissons et nougats sont rigoureusement sélectionnés et stabilisés pour préserver leur brillance et leur croquant sous le climat malien, et voyagent exclusivement sous protection isotherme.'
    },
    {
      q: 'Puis-je faire livrer un coffret cadeau directement à un destinataire avec un mot personnalisé ?',
      a: 'Tout à fait. Vous pouvez préciser le quartier de la personne à qui vous offrez le coffret ainsi que votre message personnel. Nous calligraphions gratuitement votre mot sur une carte Maison Alice scellée à la cire avant la remise.'
    }
  ];

  return (
    <section
      id="faq-section"
      className="relative py-24 px-4 max-w-4xl mx-auto pointer-events-auto"
    >
      <div className="text-center mb-14">
        <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-theme-text mb-3 tracking-tight">
          Questions Fréquentes &amp; Garanties
        </h2>
        <p className="text-sm sm:text-base text-theme-text-muted max-w-xl mx-auto">
          Tout ce que vous devez savoir pour commander ou faire livrer votre coffret en toute sérénité.
        </p>
      </div>

      <div className="space-y-3.5">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className={`rounded-2xl glass-panel border transition-all duration-300 overflow-hidden ${
                isOpen ? 'border-theme-gold/60 shadow-lg' : 'border-theme-border'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-theme-text hover:text-theme-gold transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-theme-gold flex-shrink-0" />
                  <span>{faq.q}</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-theme-text-muted transition-transform duration-300 flex-shrink-0 ${
                    isOpen ? 'rotate-180 text-theme-gold' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-2 text-xs sm:text-sm text-theme-text-muted leading-relaxed border-t border-white/10">
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
