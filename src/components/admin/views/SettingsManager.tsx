import React, { useState } from 'react';
import { StoreSettings } from '../../../types';
import { registerAdminAccount, generateBackupRecoveryKey } from '../../../lib/adminAuth';
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
  Lock,
  Mail,
  KeyRound,
  Copy,
  RefreshCw
} from 'lucide-react';

const InstagramIcon = ({ className = 'w-3.5 h-3.5 text-pink-400' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
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
  const [activeTab, setActiveTab] = useState<'security' | 'payments' | 'footer'>('security');
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

  // Email & Password states
  const [adminEmailInput, setAdminEmailInput] = useState(settings.adminEmail || '');
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSaveSuccessNotice(msg);
    setTimeout(() => {
      setSaveSuccessNotice(null);
    }, 4000);
  };

  const handleSaveGeneral = () => {
    onSaveSettings(localSettings);
    showNotification('Paramètres enregistrés avec succès.');
  };

  const handleUpdateAccountSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    const cleanEmail = adminEmailInput.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setPasswordError('Veuillez saisir une adresse email valide pour la récupération du compte.');
      return;
    }

    const actualCurrentPassword = localSettings.adminPassword || 'admin';
    if (
      currentPasswordInput.trim() !== actualCurrentPassword &&
      !(actualCurrentPassword === 'admin' && currentPasswordInput.trim() === 'alice2026')
    ) {
      setPasswordError('Le mot de passe actuel saisi est incorrect.');
      return;
    }

    const finalPassword = newPasswordInput.trim()
      ? newPasswordInput.trim()
      : actualCurrentPassword;

    if (newPasswordInput.trim()) {
      if (newPasswordInput.trim().length < 4) {
        setPasswordError('Le nouveau mot de passe doit contenir au moins 4 caractères.');
        return;
      }
      if (newPasswordInput !== confirmPasswordInput) {
        setPasswordError('La confirmation ne correspond pas au nouveau mot de passe.');
        return;
      }
    }

    const { settings: updated } = registerAdminAccount(
      cleanEmail,
      finalPassword,
      localSettings.adminRecoveryKey
    );

    setLocalSettings(updated);
    onSaveSettings(updated);

    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setPasswordSuccess(
      'Votre adresse email administrateur et vos identifiants ont été enregistrés avec succès.'
    );
    showNotification('Sécurité du compte mise à jour.');
  };

  const handleRegenerateRecoveryKey = () => {
    const newKey = generateBackupRecoveryKey();
    const updated: StoreSettings = {
      ...localSettings,
      adminRecoveryKey: newKey
    };
    setLocalSettings(updated);
    onSaveSettings(updated);
    showNotification('Nouvelle clé de secours générée.');
  };

  return (
    <div className="space-y-6 font-sans max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-white">
            Paramètres &amp; Sécurité
          </h2>
          <p className="text-xs text-theme-text-muted mt-1">
            Gérez votre email de récupération administrateur, vos comptes Mobile Money et les liens du footer.
          </p>
        </div>

        {activeTab !== 'security' && (
          <button
            type="button"
            onClick={handleSaveGeneral}
            className="px-5 py-2.5 rounded-xl bg-theme-primary text-white font-semibold text-xs shadow-glow-primary hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer les modifications</span>
          </button>
        )}
      </div>

      {saveSuccessNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-sm text-emerald-300">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span className="font-medium">{saveSuccessNotice}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-theme-primary text-white shadow-glow-primary'
              : 'bg-theme-surface/50 border border-white/10 text-theme-text-muted hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-theme-gold" />
          <span>1. Email Admin &amp; Mot de Passe</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'payments'
              ? 'bg-theme-primary text-white shadow-glow-primary'
              : 'bg-theme-surface/50 border border-white/10 text-theme-text-muted hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>2. Paiements Mobile Money</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('footer')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'footer'
              ? 'bg-theme-primary text-white shadow-glow-primary'
              : 'bg-theme-surface/50 border border-white/10 text-theme-text-muted hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4 text-theme-gold" />
          <span>3. Liens Footer &amp; Coordonnées</span>
        </button>
      </div>

      {/* TAB 1: Admin Email & Password Recovery */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl glass-panel space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-2xl bg-theme-gold/15 border border-theme-gold/40 flex items-center justify-center text-theme-gold">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white">
                  Inscription Email &amp; Mot de Passe
                </h3>
                <p className="text-xs text-theme-text-muted">
                  Associez votre email pour recevoir vos codes de réinitialisation en cas d&apos;oubli.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateAccountSecurity} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-theme-text-muted block mb-1.5">
                  Adresse Email Administrateur (pour récupération) *
                </label>
                <input
                  type="email"
                  value={adminEmailInput}
                  onChange={(e) => setAdminEmailInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:border-theme-gold outline-none"
                  placeholder="votre-email@exemple.com"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-theme-text-muted block mb-1.5">
                  Mot de passe actuel *
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:border-theme-gold outline-none font-mono"
                  placeholder="Mot de passe actuel (par défaut : admin)"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                <div>
                  <label className="text-xs font-semibold text-theme-text-muted block mb-1.5">
                    Nouveau mot de passe (Optionnel)
                  </label>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:border-theme-gold outline-none font-mono"
                    placeholder="Laisser vide pour garder"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-theme-text-muted block mb-1.5">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:border-theme-gold outline-none font-mono"
                    placeholder="Répéter le mot de passe"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="flex items-center gap-1.5 text-xs text-theme-text-muted hover:text-white cursor-pointer"
                >
                  {showPasswords ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                  <span>{showPasswords ? 'Masquer' : 'Afficher'} les mots de passe</span>
                </button>
              </div>

              {passwordError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-white shadow-glow-primary transition-all duration-300 hover:brightness-110 cursor-pointer text-sm bg-theme-primary"
              >
                Enregistrer l&apos;Email &amp; le Mot de passe
              </button>
            </form>
          </div>

          {/* Right Column: Backup Recovery Key Card */}
          <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl glass-panel space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-theme-primary/15 border border-theme-primary/40 flex items-center justify-center text-theme-primary">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-white">
                    Clé de Secours Hors-Ligne
                  </h4>
                  <p className="text-xs text-theme-text-muted">
                    Permet de réinitialiser votre mot de passe même sans réseau internet.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-theme-gold/30 text-center space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-theme-text-muted block">
                  Clé de récupération active
                </span>
                <div className="font-mono text-base font-bold text-theme-gold tracking-wider">
                  {localSettings.adminRecoveryKey || 'Enregistrez votre email pour générer'}
                </div>
                {localSettings.adminRecoveryKey && (
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        navigator.clipboard?.writeText(localSettings.adminRecoveryKey || '')
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRegenerateRecoveryKey}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-xs text-theme-text-muted hover:text-white cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Régénérer</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-theme-text-muted space-y-1.5">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-theme-gold" />
                <span>Accès Administrateur Masqué</span>
              </div>
              <p className="leading-relaxed">
                Le bouton Admin ne figure plus sur le footer public. Pour accéder à cet espace,
                ajoutez simplement <code className="text-theme-gold font-mono">#admin</code> à
                l&apos;adresse du site.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Mobile Money Payments */}
      {activeTab === 'payments' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Orange Money */}
          <div className="p-6 rounded-3xl bg-orange-500/10 border border-orange-500/30 space-y-4">
            <div className="flex items-center gap-2 text-base font-bold text-orange-400">
              <div className="w-3 h-3 rounded-full bg-orange-400" />
              <span>Orange Money Mali</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-theme-text-muted block mb-1.5">
                  Numéro Marchand :
                </label>
                <input
                  type="text"
                  value={localSettings.merchantPhones.orange_money.number}
                  onChange={(e) => {
                    const updated = { ...localSettings };
                    updated.merchantPhones.orange_money.number = e.target.value;
                    setLocalSettings(updated);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-white/15 text-sm font-mono text-theme-text focus:border-orange-400 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-theme-text-muted block mb-1.5">
                  Nom du Titulaire :
                </label>
                <input
                  type="text"
                  value={localSettings.merchantPhones.orange_money.name}
                  onChange={(e) => {
                    const updated = { ...localSettings };
                    updated.merchantPhones.orange_money.name = e.target.value;
                    setLocalSettings(updated);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:border-orange-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Wave */}
          <div className="p-6 rounded-3xl bg-sky-500/10 border border-sky-500/30 space-y-4">
            <div className="flex items-center gap-2 text-base font-bold text-sky-400">
              <div className="w-3 h-3 rounded-full bg-sky-400" />
              <span>Wave Mali</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-theme-text-muted block mb-1.5">
                  Numéro Wave :
                </label>
                <input
                  type="text"
                  value={localSettings.merchantPhones.wave.number}
                  onChange={(e) => {
                    const updated = { ...localSettings };
                    updated.merchantPhones.wave.number = e.target.value;
                    setLocalSettings(updated);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-white/15 text-sm font-mono text-theme-text focus:border-sky-400 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-theme-text-muted block mb-1.5">
                  Nom du Titulaire :
                </label>
                <input
                  type="text"
                  value={localSettings.merchantPhones.wave.name}
                  onChange={(e) => {
                    const updated = { ...localSettings };
                    updated.merchantPhones.wave.name = e.target.value;
                    setLocalSettings(updated);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:border-sky-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Moov Money */}
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 space-y-4">
            <div className="flex items-center gap-2 text-base font-bold text-emerald-400">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span>Moov Money Mali</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-theme-text-muted block mb-1.5">
                  Numéro Moov :
                </label>
                <input
                  type="text"
                  value={localSettings.merchantPhones.moov_money.number}
                  onChange={(e) => {
                    const updated = { ...localSettings };
                    updated.merchantPhones.moov_money.number = e.target.value;
                    setLocalSettings(updated);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-white/15 text-sm font-mono text-theme-text focus:border-emerald-400 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-theme-text-muted block mb-1.5">
                  Nom du Titulaire :
                </label>
                <input
                  type="text"
                  value={localSettings.merchantPhones.moov_money.name}
                  onChange={(e) => {
                    const updated = { ...localSettings };
                    updated.merchantPhones.moov_money.name = e.target.value;
                    setLocalSettings(updated);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:border-emerald-400 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Footer Links & Contact Info */}
      {activeTab === 'footer' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-6 rounded-3xl glass-panel space-y-6">
            <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-theme-gold" />
              <span>Réseaux Sociaux &amp; Coordonnées du Footer</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-theme-text-muted flex items-center gap-1.5 mb-1.5">
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                  <span>Lien Instagram :</span>
                </label>
                <input
                  type="url"
                  value={localSettings.footerLinks?.instagram || ''}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      footerLinks: { ...localSettings.footerLinks, instagram: e.target.value }
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-white/15 text-sm font-mono text-theme-text focus:border-theme-gold outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-theme-text-muted flex items-center gap-1.5 mb-1.5">
                  <Globe className="w-3.5 h-3.5 text-theme-gold" />
                  <span>Lien TikTok :</span>
                </label>
                <input
                  type="url"
                  value={localSettings.footerLinks?.tiktok || ''}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      footerLinks: { ...localSettings.footerLinks, tiktok: e.target.value }
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-white/15 text-sm font-mono text-theme-text focus:border-theme-gold outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-theme-text-muted flex items-center gap-1.5 mb-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lien WhatsApp Direct :</span>
                </label>
                <input
                  type="url"
                  value={localSettings.footerLinks?.whatsapp || ''}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      footerLinks: { ...localSettings.footerLinks, whatsapp: e.target.value }
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-white/15 text-sm font-mono text-theme-text focus:border-theme-gold outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-theme-text-muted flex items-center gap-1.5 mb-1.5">
                  <Globe className="w-3.5 h-3.5 text-sky-400" />
                  <span>Lien Facebook (Optionnel) :</span>
                </label>
                <input
                  type="url"
                  value={localSettings.footerLinks?.facebook || ''}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      footerLinks: { ...localSettings.footerLinks, facebook: e.target.value }
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-white/15 text-sm font-mono text-theme-text focus:border-theme-gold outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-theme-text-muted flex items-center gap-1.5 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-theme-primary" />
                  <span>Adresse à Bamako :</span>
                </label>
                <input
                  type="text"
                  value={localSettings.footerLinks?.address || ''}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      footerLinks: { ...localSettings.footerLinks, address: e.target.value }
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:border-theme-gold outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-theme-text-muted flex items-center gap-1.5 mb-1.5">
                  <Phone className="w-3.5 h-3.5 text-theme-gold" />
                  <span>Téléphone Client :</span>
                </label>
                <input
                  type="text"
                  value={localSettings.footerLinks?.phone || ''}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      footerLinks: { ...localSettings.footerLinks, phone: e.target.value }
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-white/15 text-sm font-mono text-theme-text focus:border-theme-gold outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
