import React, { useState, useEffect } from 'react';
import { Pack, DeliveryZone, PaymentMethod, ThemeConfig, StoreSettings, Order } from '../../types';
import { localDB } from '../../lib/supabase';
import { generateWhatsAppOrderUrl, generateOrderNumber } from '../../lib/whatsapp';
import confetti from 'canvas-confetti';
import { 
  X, 
  MapPin, 
  User, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  ExternalLink,
  PackageCheck,
  Navigation
} from 'lucide-react';

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPack: Pack | null;
  packs: Pack[];
  zones: DeliveryZone[];
  settings: StoreSettings;
  currentTheme: ThemeConfig;
  onOrderCreated?: (order: Order) => void;
}

export const OrderDrawer: React.FC<OrderDrawerProps> = ({
  isOpen,
  onClose,
  selectedPack,
  packs,
  settings,
  currentTheme,
  onOrderCreated
}) => {
  const [step, setStep] = useState(1);
  const [currentSelectedPack, setCurrentSelectedPack] = useState<Pack | null>(selectedPack);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('orange_money');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedPack) {
      setCurrentSelectedPack(selectedPack);
    } else if (packs.length > 0 && !currentSelectedPack) {
      setCurrentSelectedPack(packs[0]);
    }
  }, [selectedPack, packs]);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCompletedOrder(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const packPrice = currentSelectedPack ? currentSelectedPack.price : 15000;
  const deliveryFee = 0; // Livraison partout à Bamako gratuite ou gérée autrement
  const totalAmount = packPrice + deliveryFee;

  const requestLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const gmapsLink = `Localisation GPS : https://www.google.com/maps?q=${lat},${lng}`;
          setDeliveryAddress(prev => prev ? prev + '\n' + gmapsLink : gmapsLink);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location", error);
          setIsLocating(false);
          alert("Impossible d'obtenir votre position. Assurez-vous d'avoir autorisé l'accès.");
        }
      );
    } else {
      setIsLocating(false);
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
    }
  };

  const nextStep = () => {
    setFormErrors({});
    if (step === 2) {
      const errors: Record<string, string> = {};
      if (!customerName.trim()) errors.customerName = 'Requis';
      if (!customerPhone.trim() || customerPhone.length < 8) errors.customerPhone = 'Numéro invalide';
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
    }
    if (step === 3) {
      const errors: Record<string, string> = {};
      if (!deliveryAddress.trim()) errors.deliveryAddress = 'Veuillez partager votre position pour continuer';
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
    }
    setStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleOrderSubmit = () => {
    if (!currentSelectedPack) return;

    setIsSubmitting(true);

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: generateOrderNumber(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      packId: currentSelectedPack.id,
      packName: currentSelectedPack.name,
      packPrice: currentSelectedPack.price,
      deliveryZoneId: 'bamako-all',
      deliveryZoneName: 'Partout à Bamako',
      deliveryAddress: deliveryAddress.trim(),
      deliveryFee: 0,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      status: 'pending_payment',
      notes: notes.trim(),
      createdAt: new Date().toISOString()
    };

    localDB.saveOrder(newOrder);
    if (onOrderCreated) {
      onOrderCreated(newOrder);
    }

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: [currentTheme.colors.primary, currentTheme.colors.gold]
    });

    setCompletedOrder(newOrder);
    setIsSubmitting(false);

    const merchantNumber = settings.merchantPhones[paymentMethod]?.number || settings.whatsappNotificationNumber;
    const whatsappUrl = generateWhatsAppOrderUrl(newOrder, merchantNumber);
    window.open(whatsappUrl, '_blank');
  };

  const currentPaymentInfo = settings.merchantPhones[paymentMethod];

  // Helper for Stepper UI
  const StepIndicator = ({ num, active }: { num: number; active: boolean }) => (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
      active 
        ? 'bg-theme-primary text-white shadow-glow-primary scale-110' 
        : 'bg-theme-surface border border-theme-border text-theme-text-muted'
    }`}>
      {num}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-google-sans">
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex sm:pl-10">
        <div className="w-screen max-w-md bg-theme-bg border-l border-theme-border shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-6 pb-4 border-b border-theme-border/50 flex items-center justify-between">
            <h3 className="text-xl font-bold font-darker-grotesque tracking-wider">
              {completedOrder ? 'Commande Confirmée' : 'Votre Commande'}
            </h3>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-theme-surface flex items-center justify-center text-theme-text-muted hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-8">
            {completedOrder ? (
              <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-24 h-24 rounded-full bg-theme-primary/20 text-theme-primary mx-auto flex items-center justify-center shadow-glow-primary mb-8">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h4 className="text-3xl font-black font-darker-grotesque">
                  Félicitations !
                </h4>
                <p className="font-mono text-lg font-bold text-theme-gold bg-theme-surface/50 py-2 rounded-xl border border-theme-border/50">
                  {completedOrder.orderNumber}
                </p>
                <p className="text-sm text-theme-text-muted mt-4">
                  Votre commande est enregistrée. Cliquez ci-dessous pour nous l'envoyer via WhatsApp et finaliser le paiement.
                </p>
                <div className="pt-8">
                  <a
                    href={generateWhatsAppOrderUrl(completedOrder, settings.merchantPhones[completedOrder.paymentMethod]?.number)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:brightness-110 transition-all text-sm shadow-xl"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    Confirmer sur WhatsApp <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-8 relative">
                
                {/* Minimalist Stepper */}
                <div className="flex items-center justify-between relative px-2 mb-8">
                  <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] bg-theme-surface -z-10">
                    <div 
                      className="h-full bg-theme-primary transition-all duration-300"
                      style={{ width: `${((step - 1) / 3) * 100}%` }}
                    />
                  </div>
                  <StepIndicator num={1} active={step >= 1} />
                  <StepIndicator num={2} active={step >= 2} />
                  <StepIndicator num={3} active={step >= 3} />
                  <StepIndicator num={4} active={step >= 4} />
                </div>

                {/* Step 1: Pack */}
                <div className={step === 1 ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden'}>
                  <h4 className="text-lg font-bold font-darker-grotesque mb-6 flex items-center gap-2">
                    <PackageCheck className="w-5 h-5 text-theme-primary" />
                    Le choix du coffret
                  </h4>
                  <div className="space-y-3">
                    {packs.filter(p => p.isActive).map(p => (
                      <button
                        key={p.id}
                        onClick={() => setCurrentSelectedPack(p)}
                        className={`w-full p-4 rounded-2xl border text-left transition-all ${
                          currentSelectedPack?.id === p.id
                            ? 'border-theme-primary bg-theme-primary/10 shadow-glow-primary'
                            : 'border-theme-border/60 bg-theme-surface/20 hover:border-theme-primary/50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm">{p.name}</span>
                          <span className="font-mono font-bold text-theme-gold">{p.price.toLocaleString()} F</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Contact */}
                <div className={step === 2 ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden'}>
                  <h4 className="text-lg font-bold font-darker-grotesque mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-theme-primary" />
                    À qui l'offrons-nous ?
                  </h4>
                  <div className="space-y-5">
                    <div>
                      <input
                        type="text"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        placeholder="Prénom et Nom"
                        className={`w-full px-4 py-4 rounded-xl bg-theme-surface border ${formErrors.customerName ? 'border-red-500' : 'border-theme-border'} text-sm focus:outline-none focus:border-theme-primary transition-colors`}
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={e => setCustomerPhone(e.target.value)}
                        placeholder="Numéro WhatsApp"
                        className={`w-full px-4 py-4 rounded-xl bg-theme-surface border ${formErrors.customerPhone ? 'border-red-500' : 'border-theme-border'} text-sm focus:outline-none focus:border-theme-primary transition-colors font-mono`}
                      />
                    </div>
                  </div>
                </div>

                {/* Step 3: Delivery */}
                <div className={step === 3 ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden'}>
                  <h4 className="text-lg font-bold font-darker-grotesque mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-theme-primary" />
                    Lieu de livraison
                  </h4>
                  <div className="space-y-5">
                    {deliveryAddress ? (
                      <div className="w-full px-4 py-4 rounded-xl bg-theme-primary/10 text-theme-primary border border-theme-primary/50 text-sm font-bold flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Localisation enregistrée
                      </div>
                    ) : (
                      <button
                        onClick={requestLocation}
                        disabled={isLocating}
                        className={`w-full px-4 py-4 rounded-xl border ${formErrors.deliveryAddress ? 'border-red-500 bg-red-500/10 text-red-500' : 'bg-theme-primary/10 text-theme-primary border-theme-primary/30'} text-sm font-bold flex items-center justify-center gap-2 hover:bg-theme-primary/20 transition-colors`}
                      >
                        <Navigation className={`w-5 h-5 ${isLocating ? 'animate-pulse' : ''}`} />
                        {isLocating ? 'Recherche...' : 'Partager ma localisation GPS'}
                      </button>
                    )}
                    {formErrors.deliveryAddress && (
                      <p className="text-red-500 text-xs text-center font-bold">{formErrors.deliveryAddress}</p>
                    )}
                  </div>
                </div>

                {/* Step 4: Payment */}
                <div className={step === 4 ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden'}>
                  <h4 className="text-lg font-bold font-darker-grotesque mb-6 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-theme-primary" />
                    Paiement & Validation
                  </h4>
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-3">
                      {(['orange_money', 'wave', 'moov_money'] as PaymentMethod[]).map(method => (
                        <button
                          key={method}
                          onClick={() => setPaymentMethod(method)}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            paymentMethod === method
                              ? 'border-theme-primary bg-theme-primary/10 shadow-glow-primary'
                              : 'border-theme-border/60 bg-theme-surface/20'
                          }`}
                        >
                          <span className="text-xs font-bold capitalize">{method.replace('_', ' ')}</span>
                        </button>
                      ))}
                    </div>

                    {currentPaymentInfo && (
                      <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme-border/50 text-sm text-center">
                        <div className="text-theme-text-muted text-xs mb-1">Numéro à créditer :</div>
                        <div className="font-mono font-bold text-lg text-theme-primary mb-1 tracking-widest">{currentPaymentInfo.number}</div>
                        <div className="text-theme-text-muted text-xs">{currentPaymentInfo.name}</div>
                      </div>
                    )}

                    <div>
                      <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Message personnalisé / Mot doux (Optionnel)"
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme-border text-sm focus:outline-none focus:border-theme-primary transition-colors resize-none"
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Footer Controls */}
          {!completedOrder && (
            <div className="p-6 bg-theme-surface/40 backdrop-blur-md border-t border-theme-border/50">
              
              {/* Recap before step 4 */}
              <div className="flex justify-between items-end mb-6">
                <div className="text-xs text-theme-text-muted space-y-1">
                  <div>Coffret: <span className="font-bold text-theme-text">{packPrice.toLocaleString()} F</span></div>
                  <div>Livraison: <span className="font-bold text-theme-primary">Gratuite partout à Bamako</span></div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-theme-text-muted mb-1">Total à payer</div>
                  <div className="text-2xl font-black font-mono text-theme-gold leading-none">
                    {totalAmount.toLocaleString()} <span className="text-sm font-sans">F</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {step > 1 && (
                  <button
                    onClick={prevStep}
                    className="p-4 rounded-xl bg-theme-surface border border-theme-border hover:bg-theme-surface/80 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-theme-text" />
                  </button>
                )}
                
                {step < 4 ? (
                  <button
                    onClick={nextStep}
                    className="flex-1 py-4 rounded-xl bg-theme-primary text-white font-bold text-sm shadow-glow-primary hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Continuer</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleOrderSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-4 rounded-xl font-bold text-white text-sm shadow-glow-primary hover:brightness-110 transition-all flex items-center justify-center gap-2"
                    style={{ backgroundColor: currentTheme.colors.primary }}
                  >
                    {isSubmitting ? 'Traitement...' : 'Valider la commande'}
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
