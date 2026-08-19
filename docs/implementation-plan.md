# Plan d'Exécution & Découpage des Tâches — Maison Alice

> **Projet :** Maison Alice (Bamako, Mali)  
> **Phase du cycle de vie :** 05 — task-planning  
> **Statut :** READY (Validé)  
> **Date :** 2026-08-19  

---

## 1. Objectif Principal

Développer, intégrer et déployer l'application web immersive **Maison Alice** (One-Page 3D/Parallax réactive avec Three.js/Anime.js, métamorphose temporelle des 3 thèmes et typographies, formulaire de commande relié aux paiements Orange/Wave/Moov Money à Bamako, notification WhatsApp et Dashboard administrateur Supabase).

---

## 2. Découpage des Phases et Tâches

```
┌─────────────────────────────────────────────────────────────┐
│  Phase 1 : Socle, Architecture & Design System (T01 - T04)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│  Phase 2 : Scène 3D Parallax & Expérience Immersive (T05-T07)│
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│  Phase 3 : Tunnel Commande, Tarifs Bamako & WhatsApp (T08-T10)│
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│  Phase 4 : Backend Supabase & Dashboard Administrateur (T11-T13)│
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│  Phase 5 : Tests, Sécurité, Optimisations & Recette (T14-T16)│
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Détail des Tâches (Task Breakdown)

### Phase 1 : Socle Technique, Thèmes Dynamiques & Typographies
* **T-001 : Initialisation du Projet Vite + React + TypeScript + TailwindCSS**
  * *Dépendances* : Aucune.
  * *Actions* : Création du projet, configuration TypeScript, Tailwind, Lucide-React, Anime.js, Three.js / R3F, `@supabase/supabase-js`.
  * *Vérification* : `npm run build` et `npm run dev` sans erreur.

* **T-002 : Intégration des Polices Web & Typographies Spéciales**
  * *Dépendances* : T-001.
  * *Actions* : Intégration des polices de titres (`Metroway`, `Neogen`, `Perfect Girl Sans Serif`) et de corps (`Google Sans Flex`, `Manrope`, `Figtree`).
  * *Vérification* : Rendu correct de chaque police dans l'inspecteur CSS.

* **T-003 : Moteur de Thème Temporel Dynamique (`useTimeTheme`)**
  * *Dépendances* : T-002.
  * *Actions* : Implémenter le hook calculant la tranche horaire (00h-08h, 08h-16h, 16h-00h) et injectant les variables CSS de couleurs et classes de polices, avec sélecteur manuel discret "Horloge d'Alice".
  * *Vérification* : Bascule instantanée des couleurs et polices selon l'heure ou le sélecteur.

### Phase 2 : Scène 3D Arrière-plan & Présentation Narrative
* **T-004 : Canvas 3D Three.js Parallax (Option B)**
  * *Dépendances* : T-001, T-003.
  * *Actions* : Création d'un arrière-plan WebGL léger avec cartes à jouer flottantes, montres à gousset, clés dorées, cristaux et confiseries en suspension, réagissant au scroll de la page.
  * *Vérification* : 60 FPS constant sur écran standard, suspension du rendu quand inactif.

* **T-005 : Section Hero Immersive & Storytelling Alice au Pays des Merveilles**
  * *Dépendances* : T-004.
  * *Actions* : Composition visuelle avec le personnage actif (`cat.webp`, `hatter.jpg` ou `reine coeur.png`), slogan féerique, bouton d'action principal et effets de particules.
  * *Vérification* : Adaptation fluide aux dimensions mobile et desktop.

* **T-006 : Showcase Interactif des 3 Packs (Normal, Premium, Saisonnier)**
  * *Dépendances* : T-005.
  * *Actions* : Cartes de produits avec effet glassmorphism / dorure, compositions détaillées, prix en FCFA, badge dynamique pour le Pack Saisonnier.
  * *Vérification* : Clic sur un pack ouvrant directement le tiroir de commande.

### Phase 3 : Tunnel de Commande, Logistique Bamako & WhatsApp
* **T-007 : Module de Calcul de Livraison Dynamique par Zone à Bamako**
  * *Dépendances* : T-006.
  * *Actions* : Liste des communes et quartiers de Bamako (Rive Droite / Rive Gauche) avec calcul instantané du coût de livraison ajouté au total.
  * *Vérification* : Mise à jour du montant total en FCFA en temps réel lors de la sélection du quartier.

* **T-008 : Formulaire de Commande & Instructions de Paiement Mobile**
  * *Dépendances* : T-007.
  * *Actions* : Saisie coordonnées, sélection Orange Money / Wave / Moov Money avec affichage des numéros officiels et instructions de transfert claires.
  * *Vérification* : Validation stricte des données de contact et du format de numéro malien.

* **T-009 : Générateur de Lien WhatsApp & Sauvegarde Commande**
  * *Dépendances* : T-008.
  * *Actions* : Création de la commande avec ID unique (ex: `#MA-2026-1042`), enregistrement en base, et génération du lien universel `https://wa.me/` avec texte pré-rempli.
  * *Vérification* : Le clic ouvre WhatsApp avec le récapitulatif complet et le numéro du vendeur.

### Phase 4 : Base de Données Supabase & Dashboard Administrateur
* **T-010 : Schéma PostgreSQL Supabase, Migrations & Sécurité RLS**
  * *Dépendances* : T-001.
  * *Actions* : Définition des tables `orders`, `settings`, `delivery_zones`, avec politiques RLS (insertion publique pour les commandes, lecture/écriture restreinte aux admins).
  * *Vérification* : Scripts SQL exécutables avec isolation des privilèges.

* **T-011 : Espace Dashboard Administrateur (`/admin`)**
  * *Dépendances* : T-010.
  * *Actions* : Interface de connexion, tableau récapitulatif des commandes en temps réel, filtres par statut, modification du statut en 1 clic.
  * *Vérification* : Connexion sécurisée requise, mise à jour instantanée des statuts.

* **T-012 : Gestionnaire des Tarifs & Paramètres Boutique**
  * *Dépendances* : T-011.
  * *Actions* : Modification des prix des box, activation/désactivation du Pack Saisonnier, mise à jour des numéros de paiement et de la grille tarifaire de livraison.
  * *Vérification* : Les modifications de l'admin se répercutent immédiatement sur la vitrine client.

### Phase 5 : Recette, Performance, Sécurité & Déploiement
* **T-013 : Tests E2E du tunnel de commande & compatibilité mobile**
  * *Dépendances* : T-009, T-012.
  * *Actions* : Parcours complet sur différentes résolutions et connexions lentes.
* **T-014 : Audit de Sécurité & Clés d'Environnement**
  * *Dépendances* : T-013.
  * *Actions* : Vérification qu'aucune clé secrète n'est exposée côté client, protection RLS validée.
* **T-015 : Préparation au Déploiement Production (Vercel / Netlify)**
  * *Dépendances* : T-014.
  * *Actions* : Configuration du build de production et documentation de mise en ligne.

---

## 4. Statut du Gate

* **Statut Planning** : **READY**
* **Prochaine étape** : Phase 06 — system-architecture (Architecture Globale du Système).
