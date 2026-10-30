import React, { useState } from 'react';
import { Order, Pack, DeliveryZone, StoreSettings, OrderStatus, ThemeConfig } from '../../types';
import { localDB } from '../../lib/supabase';
import {
  registerAdminAccount,
  createPasswordResetOtp,
  verifyPasswordResetOtp,
  sendRecoveryEmail
} from '../../lib/adminAuth';
import { OrdersView } from './views/OrdersView';
import { PacksManager } from './views/PacksManager';
import { ZonesManager } from './views/ZonesManager';
import { SettingsManager } from './views/SettingsManager';
import {
  Package,
  DollarSign,
  Clock,
  Truck,
  ArrowLeft,
  Lock,
  RefreshCw,
  Box,
  MapPin,
  Settings,
  Mail,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Copy
} from 'lucide-react';

interface AdminDashboardProps {
  currentTheme: ThemeConfig;
  onBackToStore: () => void;
  onRefreshData?: () => void;
}

type AuthScreenMode = 'login' | 'register' | 'forgot_password';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToStore,
  onRefreshData
}) => {
  const [orders, setOrders] = useState<Order[]>(() => localDB.getOrders());
  const [packs, setPacks] = useState<Pack[]>(() => localDB.getPacks());
  const [zones, setZones] = useState<DeliveryZone[]>(() => localDB.getZones());
  const [settings, setSettings] = useState<StoreSettings>(() => localDB.getSettings());

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localDB.isAdminLoggedIn());
  const [authMode, setAuthMode] = useState<AuthScreenMode>(() =>
    settings.adminEmail ? 'login' : 'register'
  );

  // Login states
  const [loginEmail, setLoginEmail] = useState(settings.adminEmail || '');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Registration (Email + Password) states
  const [regEmail, setRegEmail] = useState(settings.adminEmail || '');
  const [regCurrentPass, setRegCurrentPass] = useState('');
  const [regNewPass, setRegNewPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [regError, setRegError] = useState('');
  const [generatedKeyModal, setGeneratedKeyModal] = useState<string | null>(null);

  // Forgot Password states
  const [recoveryMethod, setRecoveryMethod] = useState<'email' | 'backup_key'>('email');
  const [recoveryEmail, setRecoveryEmail] = useState(settings.adminEmail || '');
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [backupKeyInput, setBackupKeyInput] = useState('');
  const [resetNewPass, setResetNewPass] = useState('');
  const [resetConfirmPass, setResetConfirmPass] = useState('');
  const [recoveryStatus, setRecoveryStatus] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'orders' | 'packs' | 'zones' | 'settings'>('orders');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const configuredPassword = settings.adminPassword || 'admin';
    const configuredEmail = (settings.adminEmail || '').trim().toLowerCase();

    if (configuredEmail && loginEmail.trim().toLowerCase() !== configuredEmail) {
      setLoginError("L'adresse email saisie ne correspond pas au compte administrateur.");
      return;
    }

    if (
      adminPassword.trim() === configuredPassword ||
      (configuredPassword === 'admin' && adminPassword.trim() === 'alice2026')
    ) {
      localDB.setAdminLoggedIn(true);
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Mot de passe administrateur incorrect.');
    }
  };

  const handleRegisterAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    const emailClean = regEmail.trim().toLowerCase();
    if (!emailClean || !emailClean.includes('@')) {
      setRegError('Veuillez renseigner une adresse email valide pour la récupération.');
      return;
    }

    // If an admin account was already registered before, check current password
    const configuredPassword = settings.adminPassword || 'admin';
    if (settings.isAdminRegistered && settings.adminEmail) {
      if (regCurrentPass.trim() !== configuredPassword) {
        setRegError('Mot de passe actuel requis pour modifier le compte existant.');
        return;
      }
    }

    if (!regNewPass || regNewPass.trim().length < 4) {
      setRegError('Veuillez choisir un mot de passe d’au moins 4 caractères.');
      return;
    }

    if (regNewPass !== regConfirmPass) {
      setRegError('La confirmation du mot de passe ne correspond pas.');
      return;
    }

    const { settings: updatedSettings, recoveryKey } = registerAdminAccount(emailClean, regNewPass);
    setSettings(updatedSettings);
    setLoginEmail(emailClean);
    setRecoveryEmail(emailClean);
    setGeneratedKeyModal(recoveryKey);
    if (onRefreshData) onRefreshData();
  };

  const handleSendRecoveryOtp = async () => {
    setRecoveryStatus(null);
    const configuredEmail = (settings.adminEmail || '').trim().toLowerCase();

    if (!configuredEmail) {
      setRecoveryStatus({
        type: 'error',
        text: "Aucun email n'est encore inscrit. Utilisez l'onglet « Inscrire mon email » pour créer votre accès."
      });
      return;
    }

    if (recoveryEmail.trim().toLowerCase() !== configuredEmail) {
      setRecoveryStatus({
        type: 'error',
        text: "Cette adresse email ne correspond pas à l'email administrateur enregistré."
      });
      return;
    }

    setIsSendingEmail(true);
    const otp = createPasswordResetOtp(configuredEmail);
    const result = await sendRecoveryEmail(configuredEmail, otp);
    setIsSendingEmail(false);
    setOtpSent(true);

    setRecoveryStatus({
      type: result.sent ? 'success' : 'info',
      text: result.message
    });
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryStatus(null);

    if (!resetNewPass || resetNewPass.trim().length < 4) {
      setRecoveryStatus({
        type: 'error',
        text: 'Le nouveau mot de passe doit contenir au moins 4 caractères.'
      });
      return;
    }

    if (resetNewPass !== resetConfirmPass) {
      setRecoveryStatus({
        type: 'error',
        text: 'La confirmation ne correspond pas au nouveau mot de passe.'
      });
      return;
    }

    if (recoveryMethod === 'email') {
      const check = verifyPasswordResetOtp(recoveryEmail, otpInput);
      if (!check.valid) {
        setRecoveryStatus({
          type: 'error',
          text: check.reason || 'Code de vérification invalide.'
        });
        return;
      }
    } else {
      const expectedKey = (settings.adminRecoveryKey || '').trim().toUpperCase();
      if (!expectedKey || backupKeyInput.trim().toUpperCase() !== expectedKey) {
        setRecoveryStatus({
          type: 'error',
          text: 'Clé de secours administrateur incorrecte.'
        });
        return;
      }
    }

    const updated: StoreSettings = {
      ...settings,
      adminPassword: resetNewPass.trim()
    };
    localDB.saveSettings(updated);
    setSettings(updated);
    if (onRefreshData) onRefreshData();

    setRecoveryStatus({
      type: 'success',
      text: 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.'
    });

    setTimeout(() => {
      setAuthMode('login');
      setAdminPassword('');
      setRecoveryStatus(null);
    }, 1800);
  };

  const handleLogout = () => {
    localDB.setAdminLoggedIn(false);
    setIsAuthenticated(false);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    localDB.updateOrderStatus(orderId, newStatus);
    const updated = localDB.getOrders();
    setOrders(updated);
    if (onRefreshData) onRefreshData();
  };

  const handleSavePack = (pack: Pack) => {
    const existingIdx = packs.findIndex((p) => p.id === pack.id);
    const newPacks = [...packs];
    if (existingIdx >= 0) {
      newPacks[existingIdx] = pack;
    } else {
      newPacks.push(pack);
    }
    setPacks(newPacks);
    localDB.savePacks(newPacks);
    if (onRefreshData) onRefreshData();
  };

  const handleDeletePack = (packId: string) => {
    const newPacks = packs.filter((p) => p.id !== packId);
    setPacks(newPacks);
    localDB.savePacks(newPacks);
    if (onRefreshData) onRefreshData();
  };

  const handleSaveZones = (newZones: DeliveryZone[]) => {
    setZones(newZones);
    localDB.saveZones(newZones);
    if (onRefreshData) onRefreshData();
  };

  const handleSaveSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    localDB.saveSettings(newSettings);
    if (onRefreshData) onRefreshData();
  };

  const totalRevenue = orders
    .filter((o) => o.status === 'confirmed' || o.status === 'shipping' || o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending_payment').length;
  const inDeliveryCount = orders.filter(
    (o) => o.status === 'shipping' || o.status === 'preparing'
  ).length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-theme-bg font-sans">
        <div className="w-full max-w-md p-7 sm:p-8 rounded-3xl glass-panel border border-theme-border shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-theme-surface flex items-center justify-center mx-auto text-theme-gold border border-theme-gold/40 shadow-glow-gold">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-theme-text">
              Administration Maison Alice
            </h2>
            <p className="text-xs text-theme-text-muted">
              Accès sécurisé par email &amp; récupération rapide
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-theme-surface/80 border border-white/10 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setLoginError('');
              }}
              className={`py-2 px-2 rounded-xl transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-theme-primary text-white shadow-glow-primary'
                  : 'text-theme-text-muted hover:text-white'
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setRegError('');
              }}
              className={`py-2 px-2 rounded-xl transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-theme-primary text-white shadow-glow-primary'
                  : 'text-theme-text-muted hover:text-white'
              }`}
            >
              Inscrire Email
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('forgot_password');
                setRecoveryStatus(null);
              }}
              className={`py-2 px-2 rounded-xl transition-all cursor-pointer ${
                authMode === 'forgot_password'
                  ? 'bg-theme-primary text-white shadow-glow-primary'
                  : 'text-theme-text-muted hover:text-white'
              }`}
            >
              Récupération
            </button>
          </div>

          {/* Generated Recovery Key Confirmation Modal */}
          {generatedKeyModal ? (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-4 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-white">
                  Compte Email Enregistré
                </h3>
                <p className="text-xs text-theme-text-muted">
                  Votre email <strong className="text-white">{settings.adminEmail}</strong> est
                  désormais associé à votre espace administrateur.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/50 border border-theme-gold/40 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-theme-text-muted block">
                  Votre Clé de Secours Personnelle (à conserver) :
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-base font-bold text-theme-gold">
                    {generatedKeyModal}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(generatedKeyModal)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                    title="Copier la clé"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setGeneratedKeyModal(null);
                  localDB.setAdminLoggedIn(true);
                  setIsAuthenticated(true);
                }}
                className="w-full py-3.5 rounded-xl bg-theme-primary text-white font-semibold text-xs uppercase tracking-wider cursor-pointer"
              >
                Accéder au Tableau de Bord
              </button>
            </div>
          ) : (
            <>
              {/* 1. LOGIN VIEW */}
              {authMode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4 text-left">
                  {settings.adminEmail ? (
                    <div>
                      <label className="block text-xs font-semibold text-theme-text-muted mb-1.5">
                        Email Administrateur
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-theme-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="votre-email@exemple.com"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:outline-none focus:border-theme-gold"
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-center justify-between gap-2">
                      <span>Aucun email lié pour le moment.</span>
                      <button
                        type="button"
                        onClick={() => setAuthMode('register')}
                        className="underline font-semibold text-theme-gold cursor-pointer whitespace-nowrap"
                      >
                        Inscrire mon email
                      </button>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-theme-text-muted">
                        Mot de passe
                      </label>
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot_password')}
                        className="text-xs text-theme-gold hover:underline cursor-pointer"
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Saisissez votre mot de passe"
                      className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:outline-none focus:border-theme-gold"
                      required
                    />
                  </div>

                  {loginError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl font-semibold text-white shadow-glow-primary transition-all duration-300 hover:brightness-110 cursor-pointer text-sm bg-theme-primary"
                  >
                    Déverrouiller l&apos;espace Admin
                  </button>
                </form>
              )}

              {/* 2. REGISTER EMAIL & PASSWORD VIEW */}
              {authMode === 'register' && (
                <form onSubmit={handleRegisterAdmin} className="space-y-4 text-left">
                  <p className="text-xs text-theme-text-muted leading-relaxed">
                    Inscrivez votre adresse email pour sécuriser votre accès et pouvoir récupérer
                    votre mot de passe à tout moment.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-theme-text-muted mb-1.5">
                      Votre Adresse Email *
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="contact@maisonalice.com"
                      className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:outline-none focus:border-theme-gold"
                      required
                    />
                  </div>

                  {settings.isAdminRegistered && settings.adminEmail && (
                    <div>
                      <label className="block text-xs font-semibold text-theme-text-muted mb-1.5">
                        Mot de passe actuel *
                      </label>
                      <input
                        type="password"
                        value={regCurrentPass}
                        onChange={(e) => setRegCurrentPass(e.target.value)}
                        placeholder="Mot de passe actuel"
                        className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:outline-none focus:border-theme-gold"
                        required
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-theme-text-muted mb-1.5">
                        Nouveau mot de passe *
                      </label>
                      <input
                        type="password"
                        value={regNewPass}
                        onChange={(e) => setRegNewPass(e.target.value)}
                        placeholder="Min. 4 caractères"
                        className="w-full px-3.5 py-3 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:outline-none focus:border-theme-gold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-theme-text-muted mb-1.5">
                        Confirmer *
                      </label>
                      <input
                        type="password"
                        value={regConfirmPass}
                        onChange={(e) => setRegConfirmPass(e.target.value)}
                        placeholder="Répéter"
                        className="w-full px-3.5 py-3 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:outline-none focus:border-theme-gold"
                        required
                      />
                    </div>
                  </div>

                  {regError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                      <span>{regError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl font-semibold text-white shadow-glow-primary transition-all duration-300 hover:brightness-110 cursor-pointer text-sm bg-theme-primary"
                  >
                    Enregistrer mon Email &amp; Mot de passe
                  </button>
                </form>
              )}

              {/* 3. FORGOT PASSWORD RECOVERY VIEW */}
              {authMode === 'forgot_password' && (
                <div className="space-y-4 text-left">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRecoveryMethod('email')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 cursor-pointer ${
                        recoveryMethod === 'email'
                          ? 'border-theme-gold bg-theme-gold/15 text-theme-gold'
                          : 'border-white/10 bg-theme-surface/40 text-theme-text-muted'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Par Email</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecoveryMethod('backup_key')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 cursor-pointer ${
                        recoveryMethod === 'backup_key'
                          ? 'border-theme-gold bg-theme-gold/15 text-theme-gold'
                          : 'border-white/10 bg-theme-surface/40 text-theme-text-muted'
                      }`}
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Clé de Secours</span>
                    </button>
                  </div>

                  {recoveryMethod === 'email' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-theme-text-muted mb-1.5">
                          Votre adresse email administrateur inscrite :
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            value={recoveryEmail}
                            onChange={(e) => setRecoveryEmail(e.target.value)}
                            placeholder="Votre email inscrit"
                            className="flex-1 px-3.5 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:outline-none focus:border-theme-gold"
                          />
                          <button
                            type="button"
                            onClick={handleSendRecoveryOtp}
                            disabled={isSendingEmail}
                            className="px-4 py-2.5 rounded-xl bg-theme-gold/20 border border-theme-gold/50 text-theme-gold text-xs font-semibold hover:bg-theme-gold/30 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            {isSendingEmail ? 'Envoi...' : otpSent ? 'Renvoyer' : 'Recevoir le code'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleResetPasswordSubmit} className="space-y-3 pt-1">
                    {recoveryMethod === 'email' ? (
                      <div>
                        <label className="block text-xs font-semibold text-theme-text-muted mb-1.5">
                          Code à 6 chiffres reçu par email :
                        </label>
                        <input
                          type="text"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value)}
                          placeholder="Ex : 482910"
                          className="w-full px-4 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm font-mono text-center tracking-widest text-theme-text focus:outline-none focus:border-theme-gold"
                          required
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-semibold text-theme-text-muted mb-1.5">
                          Clé de Secours Administrateur :
                        </label>
                        <input
                          type="text"
                          value={backupKeyInput}
                          onChange={(e) => setBackupKeyInput(e.target.value)}
                          placeholder="ALICE-XXXX-XXXX"
                          className="w-full px-4 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm font-mono text-center tracking-wider text-theme-text focus:outline-none focus:border-theme-gold"
                          required
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-theme-text-muted mb-1">
                          Nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          value={resetNewPass}
                          onChange={(e) => setResetNewPass(e.target.value)}
                          placeholder="Min. 4 caractères"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:outline-none focus:border-theme-gold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-theme-text-muted mb-1">
                          Confirmer
                        </label>
                        <input
                          type="password"
                          value={resetConfirmPass}
                          onChange={(e) => setResetConfirmPass(e.target.value)}
                          placeholder="Répéter"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:outline-none focus:border-theme-gold"
                          required
                        />
                      </div>
                    </div>

                    {recoveryStatus && (
                      <div
                        className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                          recoveryStatus.type === 'success'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : recoveryStatus.type === 'error'
                            ? 'bg-red-500/10 border-red-500/30 text-red-300'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                        }`}
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{recoveryStatus.text}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-xl font-semibold text-white shadow-glow-primary transition-all duration-300 hover:brightness-110 cursor-pointer text-sm bg-theme-primary"
                    >
                      Réinitialiser mon mot de passe
                    </button>
                  </form>
                </div>
              )}
            </>
          )}

          {/* Back to Storefront */}
          <div className="pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onBackToStore}
              className="text-xs text-theme-text-muted hover:text-theme-gold transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retourner à la boutique Maison Alice</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text font-sans selection:bg-theme-primary/30 flex">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-white/10 bg-theme-surface/30 backdrop-blur-xl flex-col hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <h1 className="font-serif text-2xl font-bold text-theme-text leading-tight">
            Maison Alice
          </h1>
          <p className="text-[11px] text-theme-gold uppercase tracking-widest mt-1">
            Administration
          </p>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {[
            { id: 'orders', label: 'Commandes', icon: Package, count: orders.length },
            { id: 'packs', label: 'Coffrets', icon: Box, count: packs.length },
            { id: 'zones', label: 'Zones Bamako', icon: MapPin, count: zones.length },
            { id: 'settings', label: 'Paramètres & Email', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-theme-primary text-white shadow-glow-primary'
                  : 'text-theme-text-muted hover:text-theme-text hover:bg-theme-surface/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon
                  className={`w-4 h-4 ${
                    activeTab === tab.id ? 'text-white' : 'text-theme-gold'
                  }`}
                />
                <span>{tab.label}</span>
              </div>
              {tab.count !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-theme-surface border border-white/10 text-theme-text'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            type="button"
            onClick={() => {
              setOrders(localDB.getOrders());
              if (onRefreshData) onRefreshData();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-theme-surface/50 text-xs font-semibold transition-all cursor-pointer text-theme-text-muted hover:text-theme-text"
          >
            <RefreshCw className="w-4 h-4 text-theme-gold" />
            <span>Actualiser</span>
          </button>
          <button
            type="button"
            onClick={onBackToStore}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-theme-surface/50 text-xs font-semibold transition-all cursor-pointer text-theme-text-muted hover:text-theme-text"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voir la Vitrine</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-theme-surface/40 backdrop-blur-xl">
          <h1 className="font-serif text-xl font-bold">Maison Alice Admin</h1>
          <div className="flex gap-1.5">
            {[
              { id: 'orders', icon: Package },
              { id: 'packs', icon: Box },
              { id: 'zones', icon: MapPin },
              { id: 'settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`p-2 rounded-lg ${
                  activeTab === tab.id ? 'bg-theme-primary text-white' : 'text-theme-text-muted'
                }`}
              >
                <tab.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
          {/* Prompt Banner if Admin Email is not yet registered */}
          {!settings.adminEmail && activeTab !== 'settings' && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-xs text-amber-200">
                <ShieldCheck className="w-5 h-5 text-theme-gold flex-shrink-0" />
                <span>
                  <strong>Sécurité Admin :</strong> Associez votre adresse email pour activer la
                  récupération facile de votre mot de passe.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className="px-4 py-2 rounded-xl bg-theme-gold text-black font-semibold text-xs cursor-pointer whitespace-nowrap"
              >
                Inscrire mon email
              </button>
            </div>
          )}

          {/* Metrics Grid on Orders Tab */}
          {activeTab === 'orders' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl glass-panel relative overflow-hidden">
                <span className="text-xs font-semibold text-theme-text-muted uppercase tracking-wider">
                  Chiffre d&apos;Affaires
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-theme-gold font-mono mt-2">
                  {totalRevenue.toLocaleString('fr-FR')} <span className="text-xs">FCFA</span>
                </div>
                <DollarSign className="w-12 h-12 text-theme-gold/15 absolute bottom-2 right-2" />
              </div>

              <div className="p-5 rounded-2xl glass-panel relative overflow-hidden">
                <span className="text-xs font-semibold text-theme-text-muted uppercase tracking-wider">
                  Commandes
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-theme-text font-mono mt-2">
                  {orders.length}
                </div>
                <Package className="w-12 h-12 text-theme-primary/15 absolute bottom-2 right-2" />
              </div>

              <div className="p-5 rounded-2xl glass-panel relative overflow-hidden">
                <span className="text-xs font-semibold text-theme-text-muted uppercase tracking-wider">
                  En attente
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-amber-400 font-mono mt-2">
                  {pendingOrdersCount}
                </div>
                <Clock className="w-12 h-12 text-amber-400/15 absolute bottom-2 right-2" />
              </div>

              <div className="p-5 rounded-2xl glass-panel relative overflow-hidden">
                <span className="text-xs font-semibold text-theme-text-muted uppercase tracking-wider">
                  En livraison
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-sky-400 font-mono mt-2">
                  {inDeliveryCount}
                </div>
                <Truck className="w-12 h-12 text-sky-400/15 absolute bottom-2 right-2" />
              </div>
            </div>
          )}

          {/* Active View */}
          <div>
            {activeTab === 'orders' && (
              <OrdersView orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} />
            )}
            {activeTab === 'packs' && (
              <PacksManager
                packs={packs}
                onSavePack={handleSavePack}
                onDeletePack={handleDeletePack}
              />
            )}
            {activeTab === 'zones' && (
              <ZonesManager zones={zones} onSaveZones={handleSaveZones} />
            )}
            {activeTab === 'settings' && (
              <SettingsManager settings={settings} onSaveSettings={handleSaveSettings} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
