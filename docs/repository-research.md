# Étude du Référentiel de Code — Maison Alice

> **Projet :** Maison Alice (Bamako, Mali)  
> **Phase du cycle de vie :** 04 — repository-research  
> **Statut :** READY (Validé — Initialisation de projet greenfield)  
> **Date :** 2026-08-19  

---

## 1. Vue d'Ensemble du Référentiel (Repository Overview)

* **État du dépôt** : Projet nouveau (Greenfield).
* **Arborescence observée** :
  ```text
  c:\Users\legion\Desktop\Maison Alice\
  ├── assets/
  │   ├── cat.webp (Asset Thème 1 : Cheshire Cat - 00h-08h)
  │   ├── hatter.jpg (Asset Thème 2 : Mad Hatter - 08h-16h)
  │   └── reine coeur.png (Asset Thème 3 : Reine de Cœur - 16h-00h)
  └── docs/
      ├── project-discovery.md
      ├── requirements.md
      └── technical-research.md
  ```

---

## 2. Inventaire des Ressources Graphiques Confirmées

1. `assets/cat.webp` : Visuel maître pour l'univers nocturne (palette Cyan électrique / Nuit bleue / Gris argenté).
2. `assets/hatter.jpg` : Visuel maître pour l'univers diurne (palette Cuivre ardent / Vert absinthe / Or vieilli).
3. `assets/reine coeur.png` : Visuel maître pour l'univers crépusculaire royal (palette Rouge cramoisi / Bleu ciel royal / Or impérial).

---

## 3. Conventions de Structure Prévues pour l'Initialisation

```text
src/
├── assets/             # Images, polices locales (.woff2)
├── components/
│   ├── 3d/             # Scène Three.js, objets flottants (cartes, montres, clés, snacks)
│   ├── theme/          # Gestionnaire de thème dynamique (cycle horaire + sélecteur magique)
│   ├── sections/       # Hero, Storytelling, Showcase des Packs, Avis & FAQ
│   ├── order/          # Tiroir de commande, calcul dynamique livraison Bamako, instructions paiement
│   └── admin/          # Dashboard d'administration sécurisé Supabase
├── hooks/              # useTimeTheme, useOrders, useSettings, useDeliveryZones
├── lib/                # Client Supabase, formatteurs de devise (FCFA), générateur WhatsApp
├── types/              # Types TypeScript (Order, Pack, DeliveryZone, Settings, ThemeMode)
└── styles/             # Variables CSS des 3 thèmes, utilitaires Tailwind
```

---

## 4. Statut du Gate

* **Statut Repository Research** : **READY**
* **Prochaine étape** : Phase 05 — task-planning (Plan d'exécution détaillé des tâches).
