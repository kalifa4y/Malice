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
  Navigation,
  Gift
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

const POPULAR_BAMAKO_AREAS = [
  'ACI 2000',
  'Badalabougou',
  'Hamdallaye',
  'Hippodrome',
  'Bacodjicoroni',
  'Kalaban Coura',
  'Faladié',
  'Sotuba'
];

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
  const [isGift, setIsGift] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [gpsCoordinatesLink, setGpsCoordinatesLink] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
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
      setFormErrors({});
      setLocationNotice(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const packPrice = currentSelectedPack ? currentSelectedPack.price : 15000;
  const deliveryFee = 0; // Livraison offerte partout à Bamako
  const totalAmount = packPrice + deliveryFee;

  const requestLocation = () => {
    setIsLocating(true);
    setLocationNotice(null);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const gmapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
          setGpsCoordinatesLink(gmapsLink);
          setIsLocating(false);
          setFormErrors((prev) => ({ ...prev, deliveryAddress: '' }));
        },
        () => {
          setIsLocating(false);
          setLocationNotice(
            "Position GPS non détectée. Aucun souci : indiquez simplement le quartier et vos repères ci-dessus."
          );
        }
      );
    } else {
      setIsLocating(false);
      setLocationNotice("La géolocalisation n'est pas disponible sur cet appareil. Saisissez le quartier ci-dessus.");
    }
  };

  const getFullDeliveryAddress = () => {
    const parts: string[] = [];
    if (selectedDistrict.trim()) parts.push(`Quartier : ${selectedDistrict.trim()}`);
    if (deliveryAddress.trim()) parts.push(deliveryAddress.trim());
    if (gpsCoordinatesLink.trim()) parts.push(`GPS : ${gpsCoordinatesLink.trim()}`);
    return parts.join(' — ');
  };

  const nextStep = () => {
    setFormErrors({});
    if (step === 2) {
      const errors: Record<string, string> = {};
      if (!customerName.trim()) errors.customerName = 'Veuillez indiquer votre nom';
      if (!customerPhone.trim() || customerPhone.replace(/[^0-9]/g, '').length < 8) {
        errors.customerPhone = 'Veuillez saisir un numéro WhatsApp valide';
      }
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
    }
    if (step === 3) {
      const combinedAddress = getFullDeliveryAddress();
      if (!combinedAddress) {
        setFormErrors({
          deliveryAddress:
            'Veuillez indiquer un quartier/repère à Bamako ou partager votre position GPS.'
        });
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleOrderSubmit = () => {
    if (!currentSelectedPack) return;

    setIsSubmitting(true);
    const finalAddress = getFullDeliveryAddress() || 'Bamako';

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: generateOrderNumber(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      isGift,
      recipientName: isGift ? recipientName.trim() : undefined,
      recipientPhone: isGift ? recipientPhone.trim() : undefined,
      packId: currentSelectedPack.id,
      packName: currentSelectedPack.name,
      packPrice: currentSelectedPack.price,
      deliveryZoneId: 'bamako-all',
      deliveryZoneName: selectedDistrict.trim() || 'Bamako (Livraison Offerte)',
      deliveryAddress: finalAddress,
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
      particleCount: 75,
      spread: 68,
      origin: { y: 0.6 },
      colors: [currentTheme.colors.primary, currentTheme.colors.gold]
    });

    setCompletedOrder(newOrder);
    setIsSubmitting(false);

    const merchantNumber =
      settings.merchantPhones[paymentMethod]?.number || settings.whatsappNotificationNumber;
    const whatsappUrl = generateWhatsAppOrderUrl(newOrder, merchantNumber);
    window.open(whatsappUrl, '_blank');
  };

  const currentPaymentInfo = settings.merchantPhones[paymentMethod];

  const StepIndicator = ({ num, label, active }: { num: number; label: string; active: boolean }) => (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
          active
            ? 'bg-theme-primary text-white shadow-glow-primary scale-105'
            : 'bg-theme-surface border border-theme-border text-theme-text-muted'
        }`}
      >
        {num}
      </div>
      <span className={`text-[10px] font-medium ${active ? 'text-theme-text' : 'text-theme-text-muted'}`}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex sm:pl-10">
        <div className="w-screen max-w-md bg-theme-bg border-l border-theme-border shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 pb-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-2xl font-bold text-theme-text">
                {completedOrder ? 'Commande Enregistrée' : 'Votre Coffret Maison Alice'}
              </h3>
              <p className="text-xs text-theme-text-muted">
                Livraison isotherme offerte partout à Bamako
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer le panneau de commande"
              className="w-10 h-10 rounded-full hover:bg-theme-surface flex items-center justify-center text-theme-text-muted hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {completedOrder ? (
              <div className="text-center space-y-6 py-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-20 h-20 rounded-full bg-theme-primary/20 text-theme-primary mx-auto flex items-center justify-center shadow-glow-primary">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="font-serif text-3xl font-bold text-theme-text">
                  Merci pour votre confiance
                </h4>
                <p className="font-mono text-base font-bold text-theme-gold bg-theme-surface/60 py-2.5 px-4 rounded-xl border border-theme-gold/30 inline-block">
                  {completedOrder.orderNumber}
                </p>
                <p className="text-xs sm:text-sm text-theme-text-muted leading-relaxed">
                  Votre commande a bien été préparée. Cliquez ci-dessous pour transmettre le bon de
                  commande sur WhatsApp et finaliser la livraison avec notre équipe.
                </p>
                <div className="pt-4">
                  <a
                    href={generateWhatsAppOrderUrl(
                      completedOrder,
                      settings.merchantPhones[completedOrder.paymentMethod]?.number
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:brightness-110 transition-all text-sm shadow-xl"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    <span>Envoyer sur WhatsApp</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-6 relative">
                {/* Stepper */}
                <div className="flex items-center justify-between relative px-2 mb-6">
                  <div className="absolute left-8 right-8 top-4 -translate-y-1/2 h-[2px] bg-theme-surface -z-10">
                    <div
                      className="h-full bg-theme-primary transition-all duration-300"
                      style={{ width: `${((step - 1) / 3) * 100}%` }}
                    />
                  </div>
                  <StepIndicator num={1} label="Coffret" active={step >= 1} />
                  <StepIndicator num={2} label="Contact" active={step >= 2} />
                  <StepIndicator num={3} label="Lieu" active={step >= 3} />
                  <StepIndicator num={4} label="Paiement" active={step >= 4} />
                </div>

                {/* Step 1: Pack Choice */}
                {step === 1 && (
                  <div className="space-y-4 animate-in fade-in">
                    <h4 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2 text-theme-text">
                      <PackageCheck className="w-5 h-5 text-theme-gold" />
                      <span>1. Choisissez votre coffret</span>
                    </h4>
                    <div className="space-y-3">
                      {packs
                        .filter((p) => p.isActive)
                        .map((p) => {
                          const isSelected = currentSelectedPack?.id === p.id;
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setCurrentSelectedPack(p)}
                              className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-theme-gold bg-theme-primary/15 shadow-glow-gold'
                                  : 'border-white/10 bg-theme-surface/40 hover:border-theme-gold/40'
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <div>
                                  <span className="font-serif font-bold text-base text-theme-text block">
                                    {p.name}
                                  </span>
                                  <span className="text-xs text-theme-text-muted">{p.tagline}</span>
                                </div>
                                <span className="font-mono font-bold text-sm text-theme-gold whitespace-nowrap">
                                  {p.price.toLocaleString('fr-FR')} F
                                </span>
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Step 2: Customer & Optional Gift Recipient */}
                {step === 2 && (
                  <div className="space-y-5 animate-in fade-in">
                    <h4 className="font-serif text-xl font-semibold flex items-center gap-2 text-theme-text">
                      <User className="w-5 h-5 text-theme-gold" />
                      <span>2. Vos coordonnées</span>
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-theme-text-muted mb-1.5">
                          Votre Prénom et Nom *
                        </label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Ex : Fatoumata Coulibaly"
                          className={`w-full px-4 py-3.5 rounded-xl bg-theme-surface border ${
                            formErrors.customerName ? 'border-red-500' : 'border-white/15'
                          } text-sm text-theme-text focus:outline-none focus:border-theme-gold transition-colors`}
                        />
                        {formErrors.customerName && (
                          <p className="text-xs text-red-400 mt-1">{formErrors.customerName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-theme-text-muted mb-1.5">
                          Votre Numéro WhatsApp *
                        </label>
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="Ex : +223 76 00 00 00"
                          className={`w-full px-4 py-3.5 rounded-xl bg-theme-surface border ${
                            formErrors.customerPhone ? 'border-red-500' : 'border-white/15'
                          } text-sm font-mono text-theme-text focus:outline-none focus:border-theme-gold transition-colors`}
                        />
                        {formErrors.customerPhone && (
                          <p className="text-xs text-red-400 mt-1">{formErrors.customerPhone}</p>
                        )}
                      </div>

                      {/* Optional Gift Toggle */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setIsGift(!isGift)}
                          className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between text-xs font-semibold transition-all cursor-pointer ${
                            isGift
                              ? 'border-theme-gold bg-theme-gold/10 text-theme-gold'
                              : 'border-white/10 bg-theme-surface/40 text-theme-text-muted hover:text-theme-text'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Gift className="w-4 h-4" />
                            <span>J&apos;offre ce coffret à un proche</span>
                          </span>
                          <span className="text-[11px] underline">
                            {isGift ? 'Activé' : 'Optionnel'}
                          </span>
                        </button>

                        {isGift && (
                          <div className="mt-3 p-4 rounded-xl bg-theme-surface/50 border border-white/10 space-y-3">
                            <input
                              type="text"
                              value={recipientName}
                              onChange={(e) => setRecipientName(e.target.value)}
                              placeholder="Nom de la personne qui reçoit le cadeau"
                              className="w-full px-3.5 py-2.5 rounded-lg bg-theme-bg border border-white/15 text-xs text-theme-text focus:outline-none focus:border-theme-gold"
                            />
                            <input
                              type="tel"
                              value={recipientPhone}
                              onChange={(e) => setRecipientPhone(e.target.value)}
                              placeholder="Téléphone du destinataire pour le livreur"
                              className="w-full px-3.5 py-2.5 rounded-lg bg-theme-bg border border-white/15 text-xs font-mono text-theme-text focus:outline-none focus:border-theme-gold"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Flexible Bamako Delivery (Neighborhood/Address Input + Optional GPS) */}
                {step === 3 && (
                  <div className="space-y-5 animate-in fade-in">
                    <div>
                      <h4 className="font-serif text-xl font-semibold flex items-center gap-2 text-theme-text">
                        <MapPin className="w-5 h-5 text-theme-gold" />
                        <span>3. Lieu de livraison à Bamako</span>
                      </h4>
                      <p className="text-xs text-theme-text-muted mt-1">
                        Indiquez le quartier ou l&apos;adresse du destinataire, ou ajoutez votre position GPS.
                      </p>
                    </div>

                    {/* Quick District Pills */}
                    <div>
                      <label className="block text-xs font-semibold text-theme-text-muted mb-2">
                        Quartier / Commune à Bamako :
                      </label>
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        {POPULAR_BAMAKO_AREAS.map((area) => (
                          <button
                            key={area}
                            type="button"
                            onClick={() => {
                              setSelectedDistrict(area);
                              setFormErrors((prev) => ({ ...prev, deliveryAddress: '' }));
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                              selectedDistrict === area
                                ? 'bg-theme-primary text-white border-theme-primary'
                                : 'bg-theme-surface/50 border-white/10 text-theme-text-muted hover:text-white'
                            }`}
                          >
                            {area}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={selectedDistrict}
                        onChange={(e) => {
                          setSelectedDistrict(e.target.value);
                          setFormErrors((prev) => ({ ...prev, deliveryAddress: '' }));
                        }}
                        placeholder="Quartier (ex : ACI 2000, Badalabougou, Kalaban...)"
                        className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:outline-none focus:border-theme-gold"
                      />
                    </div>

                    {/* Detailed Landmarks / Street Description */}
                    <div>
                      <label className="block text-xs font-semibold text-theme-text-muted mb-1.5">
                        Précisions d&apos;adresse ou repères (Optionnel si GPS) :
                      </label>
                      <textarea
                        rows={2}
                        value={deliveryAddress}
                        onChange={(e) => {
                          setDeliveryAddress(e.target.value);
                          setFormErrors((prev) => ({ ...prev, deliveryAddress: '' }));
                        }}
                        placeholder="Ex : Près de la place CAN, immeuble vitré, ou instructions pour le coursier..."
                        className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:outline-none focus:border-theme-gold resize-none"
                      />
                    </div>

                    {/* Optional One-Click GPS Share */}
                    <div className="pt-1">
                      {gpsCoordinatesLink ? (
                        <div className="w-full p-3.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Position GPS jointe à la commande</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setGpsCoordinatesLink('')}
                            className="text-[11px] underline text-emerald-200 cursor-pointer"
                          >
                            Retirer
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={requestLocation}
                          disabled={isLocating}
                          className="w-full px-4 py-3.5 rounded-xl border border-theme-gold/40 bg-theme-gold/10 text-theme-gold text-xs font-semibold flex items-center justify-center gap-2 hover:bg-theme-gold/20 transition-colors cursor-pointer"
                        >
                          <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                          <span>
                            {isLocating
                              ? 'Détection GPS en cours...'
                              : 'Optionnel : Joindre ma position GPS actuelle'}
                          </span>
                        </button>
                      )}
                      {locationNotice && (
                        <p className="text-[11px] text-amber-300 mt-2 text-center">{locationNotice}</p>
                      )}
                      {formErrors.deliveryAddress && (
                        <p className="text-red-400 text-xs mt-2 text-center font-medium">
                          {formErrors.deliveryAddress}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 4: Payment & Custom Card Note */}
                {step === 4 && (
                  <div className="space-y-5 animate-in fade-in">
                    <h4 className="font-serif text-xl font-semibold flex items-center gap-2 text-theme-text">
                      <Sparkles className="w-5 h-5 text-theme-gold" />
                      <span>4. Règlement &amp; Mot Personnalisé</span>
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-theme-text-muted mb-2">
                          Choisissez votre moyen de paiement Mobile Money :
                        </label>
                        <div className="grid grid-cols-3 gap-2.5">
                          {(
                            [
                              { id: 'orange_money', label: 'Orange Money' },
                              { id: 'wave', label: 'Wave Mali' },
                              { id: 'moov_money', label: 'Moov Money' }
                            ] as { id: PaymentMethod; label: string }[]
                          ).map((method) => (
                            <button
                              key={method.id}
                              type="button"
                              onClick={() => setPaymentMethod(method.id)}
                              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                                paymentMethod === method.id
                                  ? 'border-theme-gold bg-theme-primary/20 text-white shadow-glow-gold'
                                  : 'border-white/10 bg-theme-surface/40 text-theme-text-muted hover:text-white'
                              }`}
                            >
                              <span className="text-xs font-semibold block">{method.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {currentPaymentInfo && (
                        <div className="p-4 rounded-2xl bg-theme-surface/60 border border-theme-gold/30 text-center space-y-1">
                          <div className="text-theme-text-muted text-[11px]">
                            Compte officiel à créditer :
                          </div>
                          <div className="font-mono font-bold text-base sm:text-lg text-theme-gold tracking-wider">
                            {currentPaymentInfo.number}
                          </div>
                          <div className="text-theme-text text-xs font-medium">
                            {currentPaymentInfo.name}
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-theme-text-muted mb-1.5">
                          Message à calligraphier sur la carte scellée (Optionnel) :
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Votre mot doux ou instructions particulières..."
                          rows={2}
                          className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:outline-none focus:border-theme-gold transition-colors resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Controls */}
          {!completedOrder && (
            <div className="p-6 bg-theme-surface/60 backdrop-blur-md border-t border-white/10">
              <div className="flex justify-between items-end mb-5">
                <div className="text-xs text-theme-text-muted space-y-1">
                  <div>
                    Coffret :{' '}
                    <span className="font-semibold text-theme-text">
                      {packPrice.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                  <div>
                    Livraison Bamako :{' '}
                    <span className="font-semibold text-emerald-400">Offerte (0 FCFA)</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-theme-text-muted mb-0.5">
                    Total à régler
                  </div>
                  <div className="text-2xl font-bold font-mono text-theme-gold leading-none">
                    {totalAmount.toLocaleString('fr-FR')}{' '}
                    <span className="text-xs font-sans">FCFA</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    aria-label="Étape précédente"
                    className="p-4 rounded-xl bg-theme-surface border border-white/15 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5 text-theme-text" />
                  </button>
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 py-4 rounded-xl bg-theme-primary text-white font-semibold text-sm shadow-glow-primary hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Continuer</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleOrderSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-4 rounded-xl font-semibold text-white text-sm shadow-glow-primary hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    style={{ backgroundColor: currentTheme.colors.primary }}
                  >
                    <span>{isSubmitting ? 'Validation...' : 'Valider et ouvrir WhatsApp'}</span>
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
