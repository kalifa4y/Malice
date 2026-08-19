import { useState, useEffect } from 'react';
import { useTimeTheme } from './hooks/useTimeTheme';
import { localDB } from './lib/supabase';
import { Pack, Order, DeliveryZone, StoreSettings } from './types';
import { Confectionery3DScene } from './components/3d/Confectionery3DScene';
import { LuxuryHeader } from './components/ui/LuxuryHeader';
import { HeroSection } from './components/sections/HeroSection';
import { PackShowcase } from './components/sections/PackShowcase';
import { HowItWorksSection } from './components/sections/HowItWorksSection';
import { BamakoDeliveryPaymentSection } from './components/sections/BamakoDeliveryPaymentSection';
import { Footer } from './components/sections/Footer';
import { OrderDrawer } from './components/order/OrderDrawer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ShoppingBag } from 'lucide-react';

export function App() {
  const { currentTheme } = useTimeTheme();

  const [currentView, setCurrentView] = useState<'store' | 'admin'>(() => {
    return window.location.hash === '#admin' ? 'admin' : 'store';
  });

  const [packs, setPacks] = useState<Pack[]>(() => localDB.getPacks());
  const [zones, setZones] = useState<DeliveryZone[]>(() => localDB.getZones());
  const [settings, setSettings] = useState<StoreSettings>(() => localDB.getSettings());

  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false);
  const [selectedPackForOrder, setSelectedPackForOrder] = useState<Pack | null>(null);

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('store');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const refreshData = () => {
    setPacks(localDB.getPacks());
    setZones(localDB.getZones());
    setSettings(localDB.getSettings());
  };

  const handleOpenOrder = (pack?: Pack) => {
    if (pack) {
      setSelectedPackForOrder(pack);
    } else if (packs.length > 0) {
      setSelectedPackForOrder(packs[0]);
    }
    setIsOrderDrawerOpen(true);
  };

  const handleExplorePacks = () => {
    const el = document.getElementById('packs-showcase');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateToAdmin = () => {
    window.location.hash = '#admin';
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToStore = () => {
    window.location.hash = '';
    setCurrentView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'admin') {
    return (
      <AdminDashboard
        currentTheme={currentTheme}
        onBackToStore={navigateToStore}
        onRefreshData={refreshData}
      />
    );
  }

  return (
    <div className="relative min-h-screen selection:bg-theme-primary selection:text-white font-google-sans text-theme-text overflow-x-hidden">
      {/* 3D WebGL Photorealistic Confectionery Parallax Scene */}
      <Confectionery3DScene />

      {/* Minimalist Floating Luxury Header */}
      <LuxuryHeader
        onOpenOrder={() => handleOpenOrder()}
      />

      {/* Main Streamlined Content Sections */}
      <main className="relative z-10">
        {/* 1. Hero Section with Original Transparent Logo */}
        <HeroSection
          onOpenOrder={() => handleOpenOrder()}
          onExplorePacks={handleExplorePacks}
        />

        {/* 2. Collections Showcase (Normal 15k, Premium 25k, Seasonal 20k) */}
        <PackShowcase
          packs={packs}
          currentTheme={currentTheme}
          onSelectPack={(pack) => handleOpenOrder(pack)}
        />

        {/* 3. Comment ça marche (3 étapes claires) */}
        <HowItWorksSection
          onOpenOrder={() => handleOpenOrder()}
        />

        {/* 4. Logistique & Paiements Mobiles Bamako */}
        <BamakoDeliveryPaymentSection
          onOpenOrder={() => handleOpenOrder()}
        />
      </main>

      {/* Luxury Footer with Official Logo & Admin Access */}
      <Footer
        currentTheme={currentTheme}
        settings={settings}
        onOpenAdmin={navigateToAdmin}
      />

      {/* Floating Action Button (Mobile) */}
      <div className="fixed bottom-5 right-5 z-40 sm:hidden">
        <button
          onClick={() => handleOpenOrder()}
          className="flex items-center gap-2 px-5 py-3.5 rounded-full font-bold text-white bg-theme-primary shadow-2xl transition-transform active:scale-95 cursor-pointer shadow-glow-primary"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Commander</span>
        </button>
      </div>

      {/* Slide-in Order Drawer with Bamako Shipping & WhatsApp Confirmation */}
      <OrderDrawer
        isOpen={isOrderDrawerOpen}
        onClose={() => setIsOrderDrawerOpen(false)}
        selectedPack={selectedPackForOrder}
        packs={packs}
        zones={zones}
        settings={settings}
        currentTheme={currentTheme}
        onOrderCreated={(order: Order) => {
          console.log('Nouvelle commande créée :', order);
          refreshData();
        }}
      />
    </div>
  );
}
export default App;
