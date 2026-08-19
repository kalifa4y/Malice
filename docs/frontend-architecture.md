# Architecture Frontend — Maison Alice

> **Projet :** Maison Alice (Bamako, Mali)  
> **Phase du cycle de vie :** 10 — frontend-architecture  
> **Framework :** React 18+ / TypeScript / Vite / TailwindCSS / Three.js / Anime.js  
> **Statut :** READY (Validé)  
> **Date :** 2026-08-19  

---

## 1. Arborescence du Code Source (`src/`)

```text
src/
├── assets/                  # Images sources (cat.webp, hatter.jpg, reine coeur.png)
├── fonts/                   # Polices locales (Metroway, Neogen, Perfect Girl Sans Serif)
├── components/
│   ├── 3d/                  # Scène 3D Three.js d'arrière-plan & objets flottants
│   │   ├── BackgroundCanvas.tsx
│   │   ├── FloatingCards.tsx
│   │   ├── PocketWatch.tsx
│   │   └── GoldenKeys.tsx
│   ├── theme/               # Moteur de métamorphose temporelle
│   │   ├── ThemeProvider.tsx
│   │   └── MagicClockToggle.tsx
│   ├── sections/            # Sections de la One-Page
│   │   ├── HeroSection.tsx
│   │   ├── StorytellingSection.tsx
│   │   ├── PackShowcase.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── DeliveryFaqSection.tsx
│   │   └── Footer.tsx
│   ├── order/               # Tiroir interactif de commande & Bamako Shipping
│   │   ├── OrderDrawer.tsx
│   │   ├── DeliveryCalculator.tsx
│   │   ├── PaymentInstructionCard.tsx
│   │   └── WhatsAppConfirmationModal.tsx
│   ├── admin/               # Dashboard Administrateur sécurisé
│   │   ├── AdminLogin.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── OrderStatusBadge.tsx
│   │   ├── OrderDetailsModal.tsx
│   │   └── PricingManager.tsx
│   └── ui/                  # Composants atomiques réutilisables (Button, Input, Badge, GlassCard)
├── hooks/
│   ├── useTimeTheme.ts      # Gestion du cycle temporel et des variables CSS
│   ├── useOrders.ts         # Hook Supabase pour les commandes temps réel
│   └── useDeliveryZones.ts  # Hook de récupération et calcul des zones de Bamako
├── lib/
│   ├── supabase.ts          # Client initialisé Supabase
│   ├── whatsapp.ts          # Générateur du lien wa.me préformaté
│   └── constants.ts         # Données statiques de fallback (Packs, Tarifs, Horaires)
├── types/
│   ├── index.ts             # Types globaux (Order, Pack, DeliveryZone, ThemeConfig)
└── index.css                # Définition des variables CSS et des 3 thèmes
```

---

## 2. Système d'Injection des Thèmes & Typographies

Le hook `useTimeTheme.ts` et le composant `ThemeProvider.tsx` gèrent la réactivité dynamique :

```typescript
export type ThemePeriod = 'cheshire_night' | 'mad_hatter_day' | 'queen_of_hearts_evening';

export interface ThemeConfig {
  id: ThemePeriod;
  name: string;
  character: string;
  timeRange: string;
  assetPath: string;
  titleFont: string;       // 'font-metroway' | 'font-neogen' | 'font-perfect-girl'
  bodyFont: string;        // 'font-google-sans' | 'font-manrope' | 'font-figtree'
  colors: {
    bg: string;
    surface: string;
    primary: string;
    accent: string;
    gold: string;
    text: string;
  };
}
```

---

## 3. Pipeline de Rendu 3D (Three.js WebGL Optimization)

1. **Rendu non intrusif** : Le canvas 3D est positionné en `fixed inset-0 pointer-events-none -z-10`.
2. **Gestion du Scroll Parallax** : Écouteur passif sur `window.scrollY` modulant l'angle de caméra et la rotation des cartes/montres.
3. **Adaptive Pixel Ratio** :
   ```typescript
   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
   ```
4. **Visibility Listener** : Arrêt de la boucle `requestAnimationFrame` lors du changement d'onglet (`document.visibilityState === 'hidden'`).

---

## 4. Statut du Gate

* **Statut Frontend Architecture** : **READY**
* **Prochaine étape** : Phase 11 — implementation (Construction du code source et développement complet).
