import React, { useState } from 'react';
import { StoreSettings } from '../../../types';
import { 
  Save, 
  Smartphone, 
  Globe, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  MessageCircle, 
  MapPin, 
  Phone, 
  Lock 
} from 'lucide-react';

const InstagramIcon = ({ className = "w-3.5 h-3.5 text-pink-400" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface SettingsManagerProps {
  settings: StoreSettings;
  onSaveSettings: (settings: StoreSettings) => void;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({ settings, onSaveSettings }) => {
  const [activeTab, setActiveTab] = useState<'payments' | 'footer' | 'security'>('payments');
  const [localSettings, setLocalSettings] = useState<StoreSettings>({
    ...settings,
    footerLinks: {
      instagram: settings.footerLinks?.instagram || 'https://instagram.com/maisonalice_bamako',
      tiktok: settings.footerLinks?.tiktok || 'https://tiktok.com/@maisonalice',
      whatsapp: settings.footerLinks?.whatsapp || 'https://wa.me/22370000000',
      facebook: settings.footerLinks?.facebook || 'https://facebook.com/maisonalice',
      address: settings.footerLinks?.address || 'ACI 2000, Bamako - Mali',
      phone: settings.footerLinks?.phone || '+223 70 00 00 00',
      legalText: settings.footerLinks?.legalText || 'Maison Alice SARL — Bamako.'
    }
  });

  // Password change states
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Global save notification
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSaveSuccessNotice(msg);
    setTimeout(() => {
      setSaveSuccessNotice(null);
    }, 4000);
  };

  const handleSaveGeneral = () => {
    onSaveSettings(localSettings);
    showNotification('Paramètres enregistrés avec succès !');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    const actualCurrentPassword = localSettings.adminPassword || 'admin';

    // Verify current password
    if (currentPasswordInput.trim() !== actualCurrentPassword && !(actualCurrentPassword === 'admin' && currentPasswordInput.trim() === 'alice2026')) {
      setPasswordError('Le mot de passe actuel saisi est incorrect.');
      return;
    }

    // Validate new password
    if (!newPasswordInput || newPasswordInput.length < 4) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins 4 caractères.');
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordError('La confirmation ne correspond pas au nouveau mot de passe.');
      return;
    }

    const updated = {
      ...localSettings,
      adminPassword: newPasswordInput.trim()
    };

    setLocalSettings(updated);
    onSaveSettings(updated);

    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setPasswordSuccess('Votre mot de passe administrateur a été modifié avec succès.');
    showNotification('Mot de passe administrateur mis à jour !');
  };

  return (
    <div className="space-y-6 font-google-sans max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-darker-grotesque text-white">
            Paramètres & Configuration
          </h2>
          <p className="text-xs text-theme-text-muted mt-1">
            Gérez vos comptes marchands, coordonnées, liens du footer et sécurité d'accès.
          </p>
        </div>

        {activeTab !== 'security' && (
          <button
            onClick={handleSaveGeneral}
            className="px-5 py-2.5 rounded-xl bg-theme-primary text-white font-bold text-xs shadow-glow-primary hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer les modifications</span>
          </button>
        )}
      </div>

      {/* Global Success Notification */}
      {saveSuccessNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-sm text-emerald-300 shadow-glow-primary animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span className="font-semibold">{saveSuccessNotice}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'payments'
              ? 'bg-theme-primary text-white shadow-glow-primary'
              : 'bg-theme-surface/50 border border-white/10 text-theme-text-muted hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>1. Paiements Mobile Money</span>
        </button>

        <button
          onClick={() => setActiveTab('footer')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'footer'
              ? 'bg-theme-primary text-white shadow-glow-primary'
              : 'bg-theme-surface/50 border border-white/10 text-theme-text-muted hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4 text-theme-gold" />
          <span>2. Liens Footer & Coordonnées</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-theme-primary text-white shadow-glow-primary'
              : 'bg-theme-surface/50 border border-white/10 text-theme-text-muted hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>3. Mot de Passe & Sécurité</span>
        </button>
      </div>

      {/* TAB 1: Mobile Money Payments */}
      {activeTab === 'payments' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Orange Money */}
          <div className="p-6 rounded-3xl bg-orange-500/10 border border-orange-500/30 space-y-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-base font-bold text-orange-400">
              <div className="w-3 h-3 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.6)]" />
              <span>Orange Money Mali</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-theme-text-muted block mb-1.5">Numéro Marchand :</label>
                <input
                  type="text"
                  value={localSettings.merchantPhones.orange_money.number}
                  onChange={e => {
                    const updated = { ...localSettings };
                    updated.merchantPhones.orange_money.number = e.target.value;
                    setLocalSettings(updated);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme-border text-sm font-mono text-theme-text focus:border-orange-400 outline-none"
                  placeholder="+223 70 00 00 00"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-theme-text-muted block mb-1.5">Nom du Titulaire :</label>
                <input
                  type="text"
                  value={localSettings.merchantPhones.orange_money.name}
                  onChange={e => {
                    const updated = { ...localSettings };
                    updated.merchantPhones.orange_money.name = e.target.value;
                    setLocalSettings(updated);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme-border text-sm text-theme-text focus:border-orange-400 outline-none"
                  placeholder="Maison Alice SARL"
                />
              </div>
            </div>
          </div>

          {/* Wave */}
          <div className="p-6 rounded-3xl bg-blue-500/10 border border-blue-500/30 space-y-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-base font-bold text-blue-400">
              <div className="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.6)]" />
              <span>Wave Mali</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-theme-text-muted block mb-1.5">Numéro Wave :</label>
                <input
                  type="text"
                  value={localSettings.merchantPhones.wave.number}
                  onChange={e => {
                    const updated = { ...localSettings };
                    updated.merchantPhones.wave.number = e.target.value;
                    setLocalSettings(updated);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme-border text-sm font-mono text-theme-text focus:border-blue-400 outline-none"
                  placeholder="+223 70 00 00 00"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-theme-text-muted block mb-1.5">Nom du Titulaire :</label>
                <input
                  type="text"
                  value={localSettings.merchantPhones.wave.name}
                  onChange={e => {
                    const updated = { ...localSettings };
                    updated.merchantPhones.wave.name = e.target.value;
                    setLocalSettings(updated);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme-border text-sm text-theme-text focus:border-blue-400 outline-none"
                  placeholder="Maison Alice SARL"
                />
              </div>
            </div>
          </div>

          {/* Moov Money */}
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 space-y-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-base font-bold text-emerald-400">
              <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
              <span>Moov Money Mali</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-theme-text-muted block mb-1.5">Numéro Moov :</label>
                <input
                  type="text"
                  value={localSettings.merchantPhones.moov_money.number}
                  onChange={e => {
                    const updated = { ...localSettings };
                    updated.merchantPhones.moov_money.number = e.target.value;
                    setLocalSettings(updated);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme-border text-sm font-mono text-theme-text focus:border-emerald-400 outline-none"
                  placeholder="+223 60 00 00 00"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-theme-text-muted block mb-1.5">Nom du Titulaire :</label>
                <input
                  type="text"
                  value={localSettings.merchantPhones.moov_money.name}
                  onChange={e => {
                    const updated = { ...localSettings };
                    updated.merchantPhones.moov_money.name = e.target.value;
                    setLocalSettings(updated);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme-border text-sm text-theme-text focus:border-emerald-400 outline-none"
                  placeholder="Maison Alice SARL"
                />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: Footer Links & Contact Info */}
      {activeTab === 'footer' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl space-y-6">
            <h3 className="text-base font-bold font-darker-grotesque text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-theme-gold" />
              <span>Réseaux Sociaux & Liens du Footer</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Instagram */}
              <div>
                <label className="text-xs font-bold text-theme-text-muted flex items-center gap-1.5 mb-1.5">
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                  <span>Lien Instagram :</span>
                </label>
                <input
                  type="url"
                  value={localSettings.footerLinks?.instagram || ''}
                  onChange={e => {
                    setLocalSettings({
                      ...localSettings,
                      footerLinks: { ...localSettings.footerLinks, instagram: e.target.value }
                    });
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme-border text-sm font-mono text-theme-text focus:border-theme-primary outline-none"
                  placeholder="https://instagram.com/maisonalice_bamako"
                />
              </div>

              {/* TikTok */}
              <div>
                <label className="text-xs font-bold text-theme-text-muted flex items-center gap-1.5 mb-1.5">
                  <span>🎵</span>
                  <span>Lien TikTok :</span>
                </label>
                <input
                  type="url"
                  value={localSettings.footerLinks?.tiktok || ''}
                  onChange={e => {
                    setLocalSettings({
                      ...localSettings,
                      footerLinks: { ...localSettings.footerLinks, tiktok: e.target.value }
                    });
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme-border text-sm font-mono text-theme-text focus:border-theme-primary outline-none"
                  placeholder="https://tiktok.com/@maisonalice"
                />
              </div>

              {/* WhatsApp Footer Link */}
              <div>
                <label className="text-xs font-bold text-theme-text-muted flex items-center gap-1.5 mb-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lien WhatsApp Direct :</span>
                </label>
                <input
                  type="url"
                  value={localSettings.footerLinks?.whatsapp || ''}
                  onChange={e => {
                    setLocalSettings({
                      ...localSettings,
                      footerLinks: { ...localSettings.footerLinks, whatsapp: e.target.value }
                    });
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme-border text-sm font-mono text-theme-text focus:border-theme-primary outline-none"
                  placeholder="https://wa.me/22370000000"
                />
              </div>

              {/* Facebook */}
              <div>
                <label className="text-xs font-bold text-theme-text-muted flex items-center gap-1.5 mb-1.5">
                  <span>📘</span>
                  <span>Lien Facebook (Optionnel) :</span>
                </label>
                <input
                  type="url"
                  value={localSettings.footerLinks?.facebook || ''}
                  onChange={e => {
                    setLocalSettings({
                      ...localSettings,
                      footerLinks: { ...localSettings.footerLinks, facebook: e.target.value }
                    });
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme-border text-sm font-mono text-theme-text focus:border-theme-primary outline-none"
                  placeholder="https://facebook.com/maisonalice"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Address */}
              <div>
                <label className="text-xs font-bold text-theme-text-muted flex items-center gap-1.5 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-theme-primary" />
                  <span>Adresse / Localisation à Bamako :</span>
                </label>
                <input
                  type="text"
                  value={localSettings.footerLinks?.address || ''}
                  onChange={e => {
                    setLocalSettings({
                      ...localSettings,
                      footerLinks: { ...localSettings.footerLinks, address: e.target.value }
                    });
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme-border text-sm text-theme-text focus:border-theme-primary outline-none"
                  placeholder="ACI 2000, Bamako - Mali"
                />
              </div>

              {/* Direct Phone */}
              <div>
                <label className="text-xs font-bold text-theme-text-muted flex items-center gap-1.5 mb-1.5">
                  <Phone className="w-3.5 h-3.5 text-theme-gold" />
                  <span>Téléphone Appel Client :</span>
                </label>
                <input
                  type="text"
                  value={localSettings.footerLinks?.phone || ''}
                  onChange={e => {
                    setLocalSettings({
                      ...localSettings,
                      footerLinks: { ...localSettings.footerLinks, phone: e.target.value }
                    });
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme-border text-sm font-mono text-theme-text focus:border-theme-primary outline-none"
                  placeholder="+223 70 00 00 00"
                />
              </div>
            </div>

            {/* Legal text */}
            <div className="pt-2">
              <label className="text-xs font-bold text-theme-text-muted block mb-1.5">
                Texte Légal & Copyright :
              </label>
              <input
                type="text"
                value={localSettings.footerLinks?.legalText || ''}
                onChange={e => {
                  setLocalSettings({
                    ...localSettings,
                    footerLinks: { ...localSettings.footerLinks, legalText: e.target.value }
                  });
                }}
                className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme-border text-sm text-theme-text focus:border-theme-primary outline-none"
                placeholder="Maison Alice SARL — Bamako."
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Admin Password & Security */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-8 rounded-3xl bg-black/50 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6 max-w-xl">
            
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-glow-primary">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-darker-grotesque text-white">
                  Modifier le Mot de Passe Administrateur
                </h3>
                <p className="text-xs text-theme-text-muted">
                  Ce mot de passe protège l'accès à votre tableau de bord et à vos commandes.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              
              {/* Current Password */}
              <div>
                <label className="text-xs font-bold text-theme-text-muted block mb-1.5">
                  Mot de passe actuel :
                </label>
                <div className="relative">
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={currentPasswordInput}
                    onChange={e => setCurrentPasswordInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme-border text-sm text-theme-text focus:border-theme-primary outline-none font-mono"
                    placeholder="Saisissez votre mot de passe actuel"
                    required
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="text-xs font-bold text-theme-text-muted block mb-1.5">
                  Nouveau mot de passe :
                </label>
                <div className="relative">
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={newPasswordInput}
                    onChange={e => setNewPasswordInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme-border text-sm text-theme-text focus:border-theme-primary outline-none font-mono"
                    placeholder="Au moins 4 caractères"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-xs font-bold text-theme-text-muted block mb-1.5">
                  Confirmer le nouveau mot de passe :
                </label>
                <div className="relative">
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={confirmPasswordInput}
                    onChange={e => setConfirmPasswordInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme-border text-sm text-theme-text focus:border-theme-primary outline-none font-mono"
                    placeholder="Répétez le nouveau mot de passe"
                    required
                  />
                </div>
              </div>

              {/* Toggle visibility */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="flex items-center gap-1.5 text-xs text-theme-text-muted hover:text-white cursor-pointer"
                >
                  {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPasswords ? 'Masquer' : 'Afficher'} les caractères</span>
                </button>
              </div>

              {/* Error & Success alerts */}
              {passwordError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-white shadow-glow-primary transition-all duration-300 hover:brightness-110 cursor-pointer text-sm bg-theme-primary mt-2"
              >
                Mettre à jour le mot de passe
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
