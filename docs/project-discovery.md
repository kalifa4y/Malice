# Project Discovery — Maison Alice (Bamako, Mali)

> **Statut de découverte :** READY (Validé & Prêt pour l'ingénierie des exigences)  
> **Phase du cycle de vie :** 01 — project-discovery ➔ 02 — requirements-engineering  
> **Date de mise à jour :** 2026-08-19  

---

## 1. Vue d'ensemble du Projet (Project Overview)

**Maison Alice** est une marque de coffrets et boîtes cadeaux de friandises, snacks et confiseries de luxe accessible à **Bamako (Mali)**, entièrement inspirée de l'univers visuel et narratif du film et conte *Alice au pays des merveilles*.

Le projet digital et commercial intègre :
1. **L'Expérience One-Page Immersive 3D (Option B)** : Un site vitrine narratif sans barre de navigation classique, avec éléments 3D flottants (cartes à jouer, montres à gousset, clés dorées, douceurs) réagissant au scroll parallax, soutenu par des photographies studio luxueuses des boîtes.
2. **Métamorphose Temporelle Dynamique (3 Thèmes & Personnages)** :
   * **00h00 - 08h00** : Thème *Cheshire Cat* (Mystère Nocturne, Bleu nuit & Cyan électrique lumineux).
   * **08h00 - 16h00** : Thème *Mad Hatter* (Extravagance Diurne, Vert Absinthe, Roux cuivré & Dorures).
   * **16h00 - 00h00** : Thème *Reine de Cœur* (Royauté Crépusculaire, Rouge Cramoisi, Bleu Ciel & Or Impérial).
3. **Tunnel de Commande & Paiements Locaux** : Sélection du pack, calcul de livraison par zone/distance à Bamako, règlement direct par **Orange Money**, **Wave** et **Moov Money**.
4. **Flux WhatsApp & Base de Données Supabase** : Enregistrement temps réel des commandes, alerte WhatsApp directe au fondateur et espace client direct.
5. **Dashboard Administrateur Tout-en-Un** : Gestion complète des commandes, statuts, modification des prix, activation/désactivation des packs saisonniers et barème des frais de livraison.

---

## 2. Problème et Opportunité (Problem Statement)

* **Constat local** : À Bamako, le secteur du cadeau gourmand manque d'une offre raffinée, thématisée et moderne. Les achats se font soit via des canaux informels sans garantie esthétique, soit via des paniers impersonnels.
* **Opportunité** : Offrir aux jeunes actifs et citadins branchés de Bamako un produit d'exception prêt à offrir (unboxing féerique) soutenu par un site vitrine 3D qui surpasse tous les standards locaux.

---

## 3. Utilisateurs Cibles & Rôles

* **Clients (B2C)** : Jeunes femmes et jeunes adultes de Bamako (18 - 35 ans), actifs, sensibles à l'esthétique, utilisateurs intensifs de TikTok, Instagram, Wave, Orange Money et Moov Money.
* **Administrateur / Fondateur** : Accès complet pour piloter les ventes, ajuster les tarifs, gérer les stocks/packs et valider les paiements.

---

## 4. Les 3 Thèmes Chromatiques & Typographiques Confirmés

| Période | Personnage | Ambiance & Palette de Couleurs (Extraite des Assets) | Typographie Titres | Typographie Corps / UI |
| :--- | :--- | :--- | :--- | :--- |
| **00h00 - 08h00** | **Cheshire Cat** (`cat.webp`) | • Fond : Nuit Profonde (`#090D16`)<br>• Accent Primaire : Cyan Électrique (`#00F2FE`, `#00C2CB`)<br>• Nuances : Gris Fumée & Nuit Bleutée (`#1B2436`, `#2E3D52`)<br>• Texte : Blanc Éthéré (`#F1F5F9`) | **Metroway** | **Google Sans Flex** |
| **08h00 - 16h00** | **Mad Hatter** (`hatter.jpg`) | • Fond : Vert Absinthe & Mousse (`#1B2E16`, `#2B4420`)<br>• Accent Primaire : Cuivre & Roux Flamboyant (`#E25822`, `#FF6F3C`)<br>• Accents : Rose Corail & Or Vieilli (`#E06D63`, `#D4AF37`)<br>• Texte : Crème Porcelaine (`#FDFBF7`) | **Neogen** | **Manrope** |
| **16h00 - 00h00** | **Reine de Cœur** (`reine coeur.png`) | • Fond : Ébène & Velours Noir (`#0E080C`, `#1A0F17`)<br>• Accent Primaire : Rouge Cramoisi & Carmin (`#DC143C`, `#9B111E`)<br>• Accents : Bleu Ciel Royal & Or Éclatant (`#4FC3F7`, `#FFD700`)<br>• Texte : Nacre & Perle (`#FFF9FA`) | **Perfect Girl Sans Serif** | **Figtree** |

---

## 5. Spécifications du Système & Logistique

1. **Expérience 3D (Option B)** :
   * Particules et objets 3D en arrière-plan (Three.js / React Three Fiber / Anime.js) : cartes à jouer virevoltantes, clés dorées flottantes, fioles magiques, friandises stylisées.
   * Parallax fluide au scroll, optimisé 60 FPS sur mobile.
   * Visuels studio haute fidélité des boîtes fermées et ouvertes.
2. **Logistique & Livraison** :
   * **100% Livraison à domicile ou bureau** (Aucun point de retrait physique).
   * **Frais de livraison variables** calculés dynamiquement selon la zone/distance à Bamako (Rive Gauche / Rive Droite, Communes I à VI, zones périphériques).
3. **Tunnel de Commande & Paiement** :
   * Formulaire épuré : Nom/Prénom, Téléphone WhatsApp, Quartier / Précision adresse, Choix du moyen de paiement (Orange Money, Wave, Moov Money).
   * Affichage des numéros officiels et bouton de confirmation directe WhatsApp.
   * Sauvegarde en base de données Supabase avec génération d'un numéro de commande unique.
4. **Administration & Gestion** :
   * Dashboard sécurisé (Supabase Auth).
   * Gestion complète des commandes et statuts (`Nouvelle`, `Payée`, `En préparation`, `En cours de livraison`, `Livrée`, `Annulée`).
   * Modification directe des prix des packs et frais de livraison par zone.
   * Bouton d'activation/désactivation du Pack Saisonnier et personnalisation du message d'alerte.

---

## 6. Décisions d'Architecture Validées

* **Frontend** : React + Vite + TypeScript + Three.js + Anime.js + TailwindCSS.
* **Backend & Données** : Supabase (PostgreSQL, Realtime, Row Level Security, Auth).
* **Polices** : Webfonts locales téléchargeables (Metroway, Neogen, Perfect Girl Sans Serif) + Google Fonts (Google Sans Flex, Manrope, Figtree).
* **Déploiement cible** : Vercel / Netlify / Cloudflare Pages.

---

## 7. Statut du Gate

* **Statut Discovery** : **READY** (Validé)
* **Prochaine étape** : Phase 02 — requirements-engineering (Rédaction du cahier des charges fonctionnel et technique détaillé).
