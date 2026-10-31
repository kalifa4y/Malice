import { useState, useEffect } from 'react';
import { useTimeTheme } from './hooks/useTimeTheme';
import { localDB } from './lib/supabase';
import { Pack, DeliveryZone, StoreSettings } from './types';
import { Confectionery3DScene } from './components/3d/Confectionery3DScene';
import { LuxuryHeader } from './components/ui/LuxuryHeader';
import { HeroSection } from './components/sections/HeroSection';
import { PackShowcase } from './components/sections/PackShowcase';
import { HowItWorksSection } from './components/sections/HowItWorksSection';
import { BamakoDeliveryPaymentSection } from './components/sections/BamakoDeliveryPaymentSection';
import { Footer } from './components/sections/Footer';
import { OrderDrawer } from './components/order/OrderDrawer';
import { AdminDashboard } from './components/admin/AdminDashboard';

export function App() {
  const {
    currentTheme,
    currentPeriod,
    currentTimeFormatted
  } = useTimeTheme();

  const [currentView, setCurrentView] = useState<'store' | 'admin'>(() => {
    return window.location.hash === '#admin' ? 'admin' : 'store';
  });

  const [packs, setPacks] = useState<Pack[]>(() => localDB.getPacks());
  const [zones, setZones] = useState<DeliveryZone[]>(() => localDB.getZones());
  const [settings, setSettings] = useState<StoreSettings>(() => localDB.getSettings());

  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false);
  const [selectedPackForOrder, setSelectedPackForOrder] = useState<Pack | null>(null);

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

  const navigateToStore = () => {
    window.history.pushState('', document.title, window.location.pathname + window.location.search);
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
    <div className="relative min-h-screen selection:bg-theme-primary selection:text-white font-sans text-theme-text overflow-x-hidden">
      <Confectionery3DScene currentTheme={currentTheme} />

      <LuxuryHeader
        onOpenOrder={() => handleOpenOrder()}
        currentTheme={currentTheme}
        currentPeriod={currentPeriod}
        currentTimeFormatted={currentTimeFormatted}
      />

      <main className="relative z-10">
        <HeroSection
          onOpenOrder={() => handleOpenOrder()}
          onExplorePacks={handleExplorePacks}
        />

        <PackShowcase
          packs={packs}
          currentTheme={currentTheme}
          onSelectPack={(pack) => handleOpenOrder(pack)}
        />

        <HowItWorksSection onOpenOrder={() => handleOpenOrder()} />

        <BamakoDeliveryPaymentSection onOpenOrder={() => handleOpenOrder()} />
      </main>

      <Footer currentTheme={currentTheme} settings={settings} />

      <OrderDrawer
        isOpen={isOrderDrawerOpen}
        onClose={() => setIsOrderDrawerOpen(false)}
        selectedPack={selectedPackForOrder}
        packs={packs}
        zones={zones}
        settings={settings}
        currentTheme={currentTheme}
        onOrderCreated={() => {
          refreshData();
        }}
      />
    </div>
  );
}

export default App;
