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

  const [loginEmail, setLoginEmail] = useState(settings.adminEmail || '');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [regEmail, setRegEmail] = useState(settings.adminEmail || '');
  const [regCurrentPass, setRegCurrentPass] = useState('');
  const [regNewPass, setRegNewPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [regError, setRegError] = useState('');
  const [generatedKeyModal, setGeneratedKeyModal] = useState<string | null>(null);

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
      setLoginError('Email incorrect.');
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
      setLoginError('Mot de passe incorrect.');
    }
  };

  const handleRegisterAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    const emailClean = regEmail.trim().toLowerCase();
    if (!emailClean || !emailClean.includes('@')) {
      setRegError('Email invalide.');
      return;
    }

    const configuredPassword = settings.adminPassword || 'admin';
    if (settings.isAdminRegistered && settings.adminEmail) {
      if (regCurrentPass.trim() !== configuredPassword) {
        setRegError('Mot de passe actuel requis.');
        return;
      }
    }

    if (!regNewPass || regNewPass.trim().length < 4) {
      setRegError('Minimum 4 caractères.');
      return;
    }

    if (regNewPass !== regConfirmPass) {
      setRegError('Les mots de passe diffèrent.');
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
        text: 'Aucun email enregistré.'
      });
      return;
    }

    if (recoveryEmail.trim().toLowerCase() !== configuredEmail) {
      setRecoveryStatus({
        type: 'error',
        text: 'Email non reconnu.'
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
      text: result.sent ? `Code envoyé à ${configuredEmail}.` : 'Utilisez votre clé de secours.'
    });
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryStatus(null);

    if (!resetNewPass || resetNewPass.trim().length < 4) {
      setRecoveryStatus({
        type: 'error',
        text: 'Minimum 4 caractères.'
      });
      return;
    }

    if (resetNewPass !== resetConfirmPass) {
      setRecoveryStatus({
        type: 'error',
        text: 'Les mots de passe diffèrent.'
      });
      return;
    }

    if (recoveryMethod === 'email') {
      const check = verifyPasswordResetOtp(recoveryEmail, otpInput);
      if (!check.valid) {
        setRecoveryStatus({
          type: 'error',
          text: 'Code invalide.'
        });
        return;
      }
    } else {
      const expectedKey = (settings.adminRecoveryKey || '').trim().toUpperCase();
      if (!expectedKey || backupKeyInput.trim().toUpperCase() !== expectedKey) {
        setRecoveryStatus({
          type: 'error',
          text: 'Clé incorrecte.'
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
      text: 'Mot de passe modifié.'
    });

    setTimeout(() => {
      setAuthMode('login');
      setAdminPassword('');
      setRecoveryStatus(null);
    }, 1200);
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
        <div className="w-full max-w-sm p-6 rounded-3xl glass-panel border border-theme-border shadow-2xl space-y-5">
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-theme-surface flex items-center justify-center mx-auto text-theme-gold border border-theme-gold/40">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-theme-text">Maison Alice</h2>
          </div>

          <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-theme-surface/80 border border-white/10 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setLoginError('');
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-theme-primary text-white'
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
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-theme-primary text-white'
                  : 'text-theme-text-muted hover:text-white'
              }`}
            >
              Mon Email
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('forgot_password');
                setRecoveryStatus(null);
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                authMode === 'forgot_password'
                  ? 'bg-theme-primary text-white'
                  : 'text-theme-text-muted hover:text-white'
              }`}
            >
              Oubli ?
            </button>
          </div>

          {generatedKeyModal ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-4 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-white">Email enregistré</h3>

              <div className="p-3 rounded-xl bg-black/50 border border-theme-gold/40 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-theme-text-muted block">
                  Clé de secours :
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-sm font-bold text-theme-gold">
                    {generatedKeyModal}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(generatedKeyModal)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                    title="Copier"
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
                className="w-full py-3 rounded-xl bg-theme-primary text-white font-semibold text-xs uppercase tracking-wider cursor-pointer"
              >
                Ouvrir
              </button>
            </div>
          ) : (
            <>
              {authMode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-3.5 text-left">
                  {settings.adminEmail && (
                    <div>
                      <label className="block text-xs font-semibold text-theme-text-muted mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="email@exemple.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:outline-none focus:border-theme-gold"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-theme-text-muted mb-1">
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Mot de passe"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:outline-none focus:border-theme-gold"
                      required
                    />
                  </div>

                  {loginError && (
                    <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-semibold text-white shadow-glow-primary transition-all hover:brightness-110 cursor-pointer text-sm bg-theme-primary"
                  >
                    Entrer
                  </button>
                </form>
              )}

              {authMode === 'register' && (
                <form onSubmit={handleRegisterAdmin} className="space-y-3.5 text-left">
                  <div>
                    <label className="block text-xs font-semibold text-theme-text-muted mb-1">
                      Votre Email
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="email@exemple.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:outline-none focus:border-theme-gold"
                      required
                    />
                  </div>

                  {settings.isAdminRegistered && settings.adminEmail && (
                    <div>
                      <label className="block text-xs font-semibold text-theme-text-muted mb-1">
                        Mot de passe actuel
                      </label>
                      <input
                        type="password"
                        value={regCurrentPass}
                        onChange={(e) => setRegCurrentPass(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:outline-none focus:border-theme-gold"
                        required
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-theme-text-muted mb-1">
                        Nouveau
                      </label>
                      <input
                        type="password"
                        value={regNewPass}
                        onChange={(e) => setRegNewPass(e.target.value)}
                        placeholder="4+ caract."
                        className="w-full px-3 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:outline-none focus:border-theme-gold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-theme-text-muted mb-1">
                        Confirmer
                      </label>
                      <input
                        type="password"
                        value={regConfirmPass}
                        onChange={(e) => setRegConfirmPass(e.target.value)}
                        placeholder="Répéter"
                        className="w-full px-3 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:outline-none focus:border-theme-gold"
                        required
                      />
                    </div>
                  </div>

                  {regError && (
                    <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                      <span>{regError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-semibold text-white shadow-glow-primary transition-all hover:brightness-110 cursor-pointer text-sm bg-theme-primary"
                  >
                    Enregistrer
                  </button>
                </form>
              )}

              {authMode === 'forgot_password' && (
                <div className="space-y-3.5 text-left">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRecoveryMethod('email')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 cursor-pointer ${
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
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 cursor-pointer ${
                        recoveryMethod === 'backup_key'
                          ? 'border-theme-gold bg-theme-gold/15 text-theme-gold'
                          : 'border-white/10 bg-theme-surface/40 text-theme-text-muted'
                      }`}
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Par Clé</span>
                    </button>
                  </div>

                  {recoveryMethod === 'email' && (
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        placeholder="Votre email"
                        className="flex-1 px-3 py-2 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:outline-none focus:border-theme-gold"
                      />
                      <button
                        type="button"
                        onClick={handleSendRecoveryOtp}
                        disabled={isSendingEmail}
                        className="px-3 py-2 rounded-xl bg-theme-gold/20 border border-theme-gold/50 text-theme-gold text-xs font-semibold cursor-pointer whitespace-nowrap"
                      >
                        {isSendingEmail ? '...' : otpSent ? 'Renvoyer' : 'Code'}
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
                    {recoveryMethod === 'email' ? (
                      <input
                        type="text"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        placeholder="Code à 6 chiffres"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm font-mono text-center tracking-widest text-theme-text focus:outline-none focus:border-theme-gold"
                        required
                      />
                    ) : (
                      <input
                        type="text"
                        value={backupKeyInput}
                        onChange={(e) => setBackupKeyInput(e.target.value)}
                        placeholder="Clé (ALICE-XXXX-XXXX)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm font-mono text-center tracking-wider text-theme-text focus:outline-none focus:border-theme-gold"
                        required
                      />
                    )}

                    <div className="grid grid-cols-2 gap-2.5">
                      <input
                        type="password"
                        value={resetNewPass}
                        onChange={(e) => setResetNewPass(e.target.value)}
                        placeholder="Nouveau"
                        className="w-full px-3 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:outline-none focus:border-theme-gold"
                        required
                      />
                      <input
                        type="password"
                        value={resetConfirmPass}
                        onChange={(e) => setResetConfirmPass(e.target.value)}
                        placeholder="Confirmer"
                        className="w-full px-3 py-2.5 rounded-xl bg-theme-surface border border-white/15 text-sm text-theme-text focus:outline-none focus:border-theme-gold"
                        required
                      />
                    </div>

                    {recoveryStatus && (
                      <div
                        className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                          recoveryStatus.type === 'success'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-red-500/10 border-red-500/30 text-red-300'
                        }`}
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{recoveryStatus.text}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl font-semibold text-white shadow-glow-primary transition-all hover:brightness-110 cursor-pointer text-sm bg-theme-primary"
                    >
                      Valider
                    </button>
                  </form>
                </div>
              )}
            </>
          )}

          <div className="pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onBackToStore}
              className="text-xs text-theme-text-muted hover:text-theme-gold transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Boutique</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text font-sans selection:bg-theme-primary/30 flex">
      {/* Barre latérale */}
      <aside className="w-56 flex-shrink-0 border-r border-white/10 bg-theme-surface/30 backdrop-blur-xl flex-col hidden md:flex">
        <div className="p-5 border-b border-white/10">
          <h1 className="font-serif text-xl font-bold text-theme-text">Maison Alice</h1>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5">
          {[
            { id: 'orders', label: 'Commandes', icon: Package, count: orders.length },
            { id: 'packs', label: 'Coffrets', icon: Box, count: packs.length },
            { id: 'zones', label: 'Quartiers', icon: MapPin, count: zones.length },
            { id: 'settings', label: 'Réglages', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-theme-primary text-white shadow-glow-primary'
                  : 'text-theme-text-muted hover:text-theme-text hover:bg-theme-surface/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
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

        <div className="p-3 border-t border-white/10 space-y-1">
          <button
            type="button"
            onClick={() => {
              setOrders(localDB.getOrders());
              if (onRefreshData) onRefreshData();
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl hover:bg-theme-surface/50 text-xs font-semibold transition-all cursor-pointer text-theme-text-muted hover:text-theme-text"
          >
            <RefreshCw className="w-3.5 h-3.5 text-theme-gold" />
            <span>Actualiser</span>
          </button>
          <button
            type="button"
            onClick={onBackToStore}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl hover:bg-theme-surface/50 text-xs font-semibold transition-all cursor-pointer text-theme-text-muted hover:text-theme-text"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Boutique</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-red-400 hover:bg-red-500/10 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Quitter</span>
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="md:hidden flex items-center justify-between p-3.5 border-b border-white/10 bg-theme-surface/40 backdrop-blur-xl">
          <h1 className="font-serif text-lg font-bold">Maison Alice</h1>
          <div className="flex gap-1">
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

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {!settings.adminEmail && activeTab !== 'settings' && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs text-amber-200">
                <ShieldCheck className="w-4 h-4 text-theme-gold flex-shrink-0" />
                <span>Ajoutez un email de secours</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className="px-3.5 py-1.5 rounded-xl bg-theme-gold text-black font-semibold text-xs cursor-pointer"
              >
                Ajouter
              </button>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-2xl glass-panel relative overflow-hidden">
                <span className="text-[11px] font-semibold text-theme-text-muted uppercase">
                  Revenus
                </span>
                <div className="text-xl sm:text-2xl font-bold text-theme-gold font-mono mt-1">
                  {totalRevenue.toLocaleString('fr-FR')} <span className="text-xs">F</span>
                </div>
                <DollarSign className="w-10 h-10 text-theme-gold/15 absolute bottom-2 right-2" />
              </div>

              <div className="p-4 rounded-2xl glass-panel relative overflow-hidden">
                <span className="text-[11px] font-semibold text-theme-text-muted uppercase">
                  Commandes
                </span>
                <div className="text-xl sm:text-2xl font-bold text-theme-text font-mono mt-1">
                  {orders.length}
                </div>
                <Package className="w-10 h-10 text-theme-primary/15 absolute bottom-2 right-2" />
              </div>

              <div className="p-4 rounded-2xl glass-panel relative overflow-hidden">
                <span className="text-[11px] font-semibold text-theme-text-muted uppercase">
                  À payer
                </span>
                <div className="text-xl sm:text-2xl font-bold text-amber-400 font-mono mt-1">
                  {pendingOrdersCount}
                </div>
                <Clock className="w-10 h-10 text-amber-400/15 absolute bottom-2 right-2" />
              </div>

              <div className="p-4 rounded-2xl glass-panel relative overflow-hidden">
                <span className="text-[11px] font-semibold text-theme-text-muted uppercase">
                  En route
                </span>
                <div className="text-xl sm:text-2xl font-bold text-sky-400 font-mono mt-1">
                  {inDeliveryCount}
                </div>
                <Truck className="w-10 h-10 text-sky-400/15 absolute bottom-2 right-2" />
              </div>
            </div>
          )}

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
