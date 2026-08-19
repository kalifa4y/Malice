import React, { useState } from 'react';
import { Order, Pack, DeliveryZone, StoreSettings, OrderStatus, ThemeConfig } from '../../types';
import { localDB } from '../../lib/supabase';
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
  Settings
} from 'lucide-react';

interface AdminDashboardProps {
  currentTheme: ThemeConfig;
  onBackToStore: () => void;
  onRefreshData?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToStore,
  onRefreshData
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localDB.isAdminLoggedIn());
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'orders' | 'packs' | 'zones' | 'settings'>('orders');
  
  // State
  const [orders, setOrders] = useState<Order[]>(() => localDB.getOrders());
  const [packs, setPacks] = useState<Pack[]>(() => localDB.getPacks());
  const [zones, setZones] = useState<DeliveryZone[]>(() => localDB.getZones());
  const [settings, setSettings] = useState<StoreSettings>(() => localDB.getSettings());

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const configuredPassword = settings.adminPassword || 'admin';
    if (adminPassword.trim() === configuredPassword || (configuredPassword === 'admin' && adminPassword.trim() === 'alice2026')) {
      localDB.setAdminLoggedIn(true);
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Mot de passe administrateur incorrect');
    }
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
    const existingIdx = packs.findIndex(p => p.id === pack.id);
    let newPacks = [...packs];
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
    const newPacks = packs.filter(p => p.id !== packId);
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

  // Metrics
  const totalRevenue = orders
    .filter(o => o.status === 'confirmed' || o.status === 'shipping' || o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'pending_payment').length;
  const inDeliveryCount = orders.filter(o => o.status === 'shipping' || o.status === 'preparing').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-theme-bg font-google-sans">
        <div className="w-full max-w-md p-8 rounded-3xl glass-panel border border-theme-border shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-theme-surface flex items-center justify-center mx-auto text-theme-primary border border-theme-primary/50 shadow-glow-primary">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-3xl font-black text-theme-text font-darker-grotesque">
              Espace Administrateur
            </h2>
            <p className="text-sm text-theme-text-muted mt-1 font-google-sans">
              Maison Alice • Bamako
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <input
                type="password"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                placeholder="Mot de passe"
                className="w-full px-4 py-3 rounded-xl bg-theme-surface border border-theme-border text-sm text-theme-text focus:outline-none focus:border-theme-primary transition-colors text-center font-bold tracking-widest"
              />
              {loginError && (
                <p className="text-xs text-red-400 mt-2 text-center">{loginError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl font-bold text-white shadow-glow-primary transition-all duration-300 hover:brightness-110 cursor-pointer text-sm bg-theme-primary"
            >
              Déverrouiller
            </button>
          </form>

          <div className="pt-4 border-t border-theme-border">
            <button
              onClick={onBackToStore}
              className="text-xs text-theme-text-muted hover:text-theme-primary transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour à la vitrine</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text font-google-sans selection:bg-theme-primary/30 flex">
      
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-theme-border bg-theme-surface/5 backdrop-blur-xl flex flex-col hidden md:flex">
        <div className="p-6 border-b border-theme-border">
          <h1 className="text-2xl font-black text-theme-text font-darker-grotesque leading-tight">
            Maison Alice
          </h1>
          <p className="text-[10px] text-theme-text-muted uppercase tracking-widest mt-1">
            Admin Dashboard
          </p>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {[
            { id: 'orders', label: 'Commandes', icon: Package, count: orders.length },
            { id: 'packs', label: 'Coffrets', icon: Box, count: packs.length },
            { id: 'zones', label: 'Zones', icon: MapPin, count: zones.length },
            { id: 'settings', label: 'Paramètres', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-theme-primary text-white shadow-glow-primary'
                  : 'text-theme-text-muted hover:text-theme-text hover:bg-theme-surface/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-theme-primary'}`} />
                <span>{tab.label}</span>
              </div>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-theme-surface border border-theme-border text-theme-text'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-theme-border space-y-2">
          <button
            onClick={() => {
              setOrders(localDB.getOrders());
              if (onRefreshData) onRefreshData();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-theme-surface/50 text-xs font-bold transition-all cursor-pointer text-theme-text-muted hover:text-theme-text"
          >
            <RefreshCw className="w-4 h-4 text-theme-primary" />
            <span>Actualiser</span>
          </button>
          <button
            onClick={onBackToStore}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-theme-surface/50 text-xs font-bold transition-all cursor-pointer text-theme-text-muted hover:text-theme-text"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Vitrine Client</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 text-xs font-bold transition-colors cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-theme-border bg-theme-surface/5 backdrop-blur-xl">
          <h1 className="text-xl font-black font-darker-grotesque">Maison Alice</h1>
          <div className="flex gap-2">
            {[
              { id: 'orders', icon: Package },
              { id: 'packs', icon: Box },
              { id: 'zones', icon: MapPin },
              { id: 'settings', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`p-2 rounded-lg ${activeTab === tab.id ? 'bg-theme-primary text-white' : 'text-theme-text-muted'}`}
              >
                <tab.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
          
          {/* Header Area */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black font-darker-grotesque capitalize">
                {activeTab === 'orders' ? 'Commandes' : activeTab === 'packs' ? 'Coffrets' : activeTab === 'zones' ? 'Zones de Livraison' : 'Paramètres'}
              </h2>
              <p className="text-sm text-theme-text-muted mt-1">
                Gérez vos {activeTab} et suivez votre activité.
              </p>
            </div>
          </div>

          {/* Premium Metrics Grid (Only on Orders) */}
          {activeTab === 'orders' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl hover:bg-black/60 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <DollarSign className="w-16 h-16 text-theme-gold" />
                </div>
                <div className="relative z-10">
                  <span className="text-xs font-bold text-theme-text-muted uppercase tracking-wider">Chiffre d'Affaires</span>
                  <div className="text-2xl sm:text-3xl font-black text-theme-gold font-mono mt-2">
                    {totalRevenue.toLocaleString('fr-FR')} <span className="text-sm font-google-sans text-theme-text-muted">F</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl hover:bg-black/60 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Package className="w-16 h-16 text-theme-primary" />
                </div>
                <div className="relative z-10">
                  <span className="text-xs font-bold text-theme-text-muted uppercase tracking-wider">Commandes</span>
                  <div className="text-2xl sm:text-3xl font-black text-theme-text font-mono mt-2">
                    {orders.length}
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl hover:bg-black/60 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Clock className="w-16 h-16 text-amber-400" />
                </div>
                <div className="relative z-10">
                  <span className="text-xs font-bold text-theme-text-muted uppercase tracking-wider">En attente</span>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono mt-2">
                    {pendingOrdersCount}
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl hover:bg-black/60 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Truck className="w-16 h-16 text-blue-400" />
                </div>
                <div className="relative z-10">
                  <span className="text-xs font-bold text-theme-text-muted uppercase tracking-wider">En livraison</span>
                  <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono mt-2">
                    {inDeliveryCount}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'orders' && (
              <OrdersView orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} />
            )}
            {activeTab === 'packs' && (
              <PacksManager packs={packs} onSavePack={handleSavePack} onDeletePack={handleDeletePack} />
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
