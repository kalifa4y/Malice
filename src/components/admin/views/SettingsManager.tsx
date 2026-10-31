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
    }, 3000);
  };

  const handleSaveGeneral = () => {
    onSaveSettings(localSettings);
    showNotification('Enregistré.');
  };

  const handleUpdateAccountSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    const cleanEmail = adminEmailInput.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setPasswordError('Email invalide.');
      return;
    }

    const actualCurrentPassword = localSettings.adminPassword || 'admin';
    if (
      currentPasswordInput.trim() !== actualCurrentPassword &&
      !(actualCurrentPassword === 'admin' && currentPasswordInput.trim() === 'alice2026')
    ) {
      setPasswordError('Mot de passe actuel incorrect.');
      return;
    }

    const finalPassword = newPasswordInput.trim()
      ? newPasswordInput.trim()
      : actualCurrentPassword;

    if (newPasswordInput.trim()) {
      if (newPasswordInput.trim().length < 4) {
        setPasswordError('Minimum 4 caractères.');
        return;
      }
      if (newPasswordInput !== confirmPasswordInput) {
        setPasswordError('Les mots de passe diffèrent.');
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
    setPasswordSuccess('Accès mis à jour.');
  };

  const handleRegenerateRecoveryKey = () => {
    const newKey = generateBackupRecoveryKey();
    const updated: StoreSettings = {
      ...localSettings,
      adminRecoveryKey: newKey
    };
    setLocalSettings(updated);
    onSaveSettings(updated);
    showNotification('Nouvelle clé créée.');
  };

  return (
    <div className="space-y-5 font-sans max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-serif text-2xl font-bold text-white">Réglages</h2>

        {activeTab !== 'security' && (
          <button
            type="button"
            onClick={handleSaveGeneral}
            className="px-4 py-2 rounded-xl bg-theme-primary text-white font-semibold text-xs shadow-glow-primary hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer</span>
          </button>
        )}
      </div>

      {saveSuccessNotice && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveSuccessNotice}</span>
        </div>
      )}

      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-theme-primary text-white'
              : 'bg-theme-surface/50 border border-white/10 text-theme-text-muted hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-theme-gold" />
          <span>Accès &amp; Email</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'payments'
              ? 'bg-theme-primary text-white'
              : 'bg-theme-surface/50 border border-white/10 text-theme-text-muted hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Paiements</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('footer')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'footer'
              ? 'bg-theme-primary text-white'
              : 'bg-theme-surface/50 border border-white/10 text-theme-text-muted hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4 text-theme-gold" />
          <span>Contact &amp; Liens</span>
        </button>
      </div>

      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 p-5 rounded-3xl glass-panel space-y-4">
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-theme-gold" />
              <span>Identifiants</span>
            </h3>

            <form onSubmit={handleUpdateAccountSecurity} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-theme-text-muted block mb-1">
                  Email de secours
                </label>
                <input
                  type="email"
                  value={adminEmailInput}
                  onChange={(e) => setAdminEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:border-theme-gold outline-none"
                  placeholder="email@exemple.com"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-theme-text-muted block mb-1">
                  Mot de passe actuel
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:border-theme-gold outline-none font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-semibold text-theme-text-muted block mb-1">
                    Nouveau mot de passe
                  </label>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:border-theme-gold outline-none font-mono"
                    placeholder="Optionnel"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-theme-text-muted block mb-1">
                    Confirmer
                  </label>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:border-theme-gold outline-none font-mono"
                    placeholder="Répéter"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="flex items-center gap-1.5 text-xs text-theme-text-muted hover:text-white cursor-pointer"
              >
                {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPasswords ? 'Masquer' : 'Afficher'}</span>
              </button>

              {passwordError && (
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold text-white shadow-glow-primary transition-all hover:brightness-110 cursor-pointer text-sm bg-theme-primary"
              >
                Enregistrer
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 p-5 rounded-3xl glass-panel space-y-4 flex flex-col justify-center">
            <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-theme-gold" />
              <span>Clé de secours</span>
            </h4>

            <div className="p-4 rounded-2xl bg-black/50 border border-theme-gold/30 text-center space-y-2">
              <div className="font-mono text-base font-bold text-theme-gold tracking-wider">
                {localSettings.adminRecoveryKey || 'Aucune clé'}
              </div>
              {localSettings.adminRecoveryKey && (
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard?.writeText(localSettings.adminRecoveryKey || '')
                    }
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRegenerateRecoveryKey}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-xs text-theme-text-muted hover:text-white cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Nouvelle clé</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-orange-500/10 border border-orange-500/30 space-y-3">
            <div className="text-sm font-bold text-orange-400">Orange Money</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-theme-text-muted block mb-1">
                  Numéro
                </label>
                <input
                  type="text"
                  value={localSettings.merchantPhones.orange_money.number}
                  onChange={(e) => {
                    const updated = { ...localSettings };
                    updated.merchantPhones.orange_money.number = e.target.value;
                    setLocalSettings(updated);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm font-mono text-theme-text outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-theme-text-muted block mb-1">
                  Titulaire
                </label>
                <input
                  type="text"
                  value={localSettings.merchantPhones.orange_money.name}
                  onChange={(e) => {
                    const updated = { ...localSettings };
                    updated.merchantPhones.orange_money.name = e.target.value;
                    setLocalSettings(updated);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text outline-none"
                />
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-sky-500/10 border border-sky-500/30 space-y-3">
            <div className="text-sm font-bold text-sky-400">Wave</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-theme-text-muted block mb-1">
                  Numéro
                </label>
                <input
                  type="text"
                  value={localSettings.merchantPhones.wave.number}
                  onChange={(e) => {
                    const updated = { ...localSettings };
                    updated.merchantPhones.wave.number = e.target.value;
                    setLocalSettings(updated);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm font-mono text-theme-text outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-theme-text-muted block mb-1">
                  Titulaire
                </label>
                <input
                  type="text"
                  value={localSettings.merchantPhones.wave.name}
                  onChange={(e) => {
                    const updated = { ...localSettings };
                    updated.merchantPhones.wave.name = e.target.value;
                    setLocalSettings(updated);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text outline-none"
                />
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
            <div className="text-sm font-bold text-emerald-400">Moov Money</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-theme-text-muted block mb-1">
                  Numéro
                </label>
                <input
                  type="text"
                  value={localSettings.merchantPhones.moov_money.number}
                  onChange={(e) => {
                    const updated = { ...localSettings };
                    updated.merchantPhones.moov_money.number = e.target.value;
                    setLocalSettings(updated);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm font-mono text-theme-text outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-theme-text-muted block mb-1">
                  Titulaire
                </label>
                <input
                  type="text"
                  value={localSettings.merchantPhones.moov_money.name}
                  onChange={(e) => {
                    const updated = { ...localSettings };
                    updated.merchantPhones.moov_money.name = e.target.value;
                    setLocalSettings(updated);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'footer' && (
        <div className="p-5 rounded-3xl glass-panel space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-semibold text-theme-text-muted flex items-center gap-1.5 mb-1">
                <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                <span>Instagram</span>
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm font-mono text-theme-text outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-theme-text-muted flex items-center gap-1.5 mb-1">
                <Globe className="w-3.5 h-3.5 text-theme-gold" />
                <span>TikTok</span>
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm font-mono text-theme-text outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-theme-text-muted flex items-center gap-1.5 mb-1">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm font-mono text-theme-text outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-theme-text-muted flex items-center gap-1.5 mb-1">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span>Facebook</span>
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm font-mono text-theme-text outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-theme-text-muted flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-theme-primary" />
                <span>Adresse</span>
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-theme-text-muted flex items-center gap-1.5 mb-1">
                <Phone className="w-3.5 h-3.5 text-theme-gold" />
                <span>Téléphone</span>
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm font-mono text-theme-text outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
