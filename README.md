<div align="center">
  <img src="public/assets/maison-alice-logo-transparent.png" alt="Maison Alice" width="320" />

  <h1>Maison Alice — Chocolats &amp; Coffrets Cadeaux</h1>
  <p><strong>Chocolats fins, douceurs artisanales et coffrets cadeaux inspirés d'Alice au Pays des Merveilles.</strong></p>

  <p>
    <a href="https://maisonalice.netlify.app">Site en ligne</a> •
    <a href="https://wa.me/22371039647">WhatsApp Direct (+223 71 03 96 47)</a>
  </p>
</div>

---

## Présentation

**Maison Alice** est une boutique en ligne de chocolats fins et de coffrets cadeaux gourmands inspirée de l'univers d'*Alice au Pays des Merveilles*. Chaque coffret est préparé avec soin, accompagné d'une carte personnalisée et livré gratuitement 7j/7.

---

## Nouveautés — La Nouvelle Version (v3.0)

### 1. Horloge Automatique des 3 Royaumes
* **Changement 100 % automatique selon l'heure réelle** (aucun sélecteur manuel).
* **Petite horloge animée à côté du bouton « Commander »** : l'aiguille tourne autour de **3 points lumineux** qui représentent les 3 ambiances du site :
  * **08h00 — 16h00** : *Royaume Blanc* (Jour)
  * **16h00 — 00h00** : *Reine de Cœur* (Soir)
  * **00h00 — 08h00** : *Chapelier Fou* (Nuit)

### 2. En-tête & Barre de Navigation Centrée
* Suppression du badge texte superflu en haut à gauche.
* **Alignement vertical central exact** (`left-1/2 -translate-x-1/2`) de la barre de navigation (*Nos Coffrets • En 3 Étapes • Livraison & Paiement*) avec le logo principal et la présentation du Hero.
* Groupe **Horloge + Commander** positionné à droite.

### 3. Cartes des 3 Coffrets en Grille `3 + 2`
* Remplacement des listes verticales allongées par une **grille de 5 petits blocs alignés (3 en haut + 2 en bas)** avec icône illustrée et intitulé court :
  * **Le Coffret d'Alice** (15 000 FCFA) : *Sablés « Mange-Moi », Chocolats 70%, Bonbons fruits, Clé dorée, Carte cadeau*.
  * **Le Coffret du Chapelier** (25 000 FCFA) : *Pralinés & ganaches, Calissons & nougat, Fiole « Bois-Moi », Montre dorée, Carte cadeau dorée*.
  * **Le Coffret de la Reine** (20 000 FCFA) : *Cœurs chocolat, Guimauves rose, Truffes cacao, Carte Royale, Sceau de cire*.

### 4. Français 100 % Simple & Accessible
* Suppression de tous les mots anglais et des termes complexes sur la vitrine, le tunnel de commande et l'espace d'administration.
* Vocabulaire clair, direct et immédiatement compréhensible par toute la clientèle francophone.

### 5. Logos Officiels Mobile Money & Commande WhatsApp
* Intégration des logos officiels **Orange Money**, **Wave** et **Moov Money** (`public/assets/payments/`) dans la section livraison/paiement, le tiroir de commande en 4 étapes et l'administration.
* Validation de commande directe vers WhatsApp au **`+223 71 03 96 47`** avec choix du quartier ou partage de position GPS en un clic.

### 6. Pied de Page (Footer) Refondu
* **Logo Maison Alice très grand format** positionné à gauche, accompagné de la présentation complète de la maison.
* Mention épurée **Maison Alice** (sans mention *SARL* ni *Bamako*).
* **Icônes officielles Font Awesome Brands** en SVG (*Instagram*, *TikTok*, *Facebook*) et bouton **WhatsApp Direct** (`+223 71 03 96 47`).

### 7. Espace d'Administration Épuré (`#admin` ou 5 clics rapides sur le Logo)
* **Accès intuitif caché** : effectuez **5 clics rapides sur le logo Maison Alice** (en haut ou dans le pied de page) pour ouvrir l'espace d'administration sans modifier l'URL.
* Réduction de **-70 % des textes** pour une interface de gestion rapide et directe :
  * **Commandes** : indicateurs clés (*Revenus, Commandes, À payer, En route*), recherche instantanée et filtres en français (*Toutes, À payer, Payées, En route, Livrées*).
  * **Coffrets** : modification en 3 étapes avec compression d'image WebP automatique côté navigateur.
  * **Quartiers** : gestion des tarifs et délais.
  * **Réglages** : gestion des numéros Mobile Money, des liens de contact et récupération de mot de passe par email (code à 6 chiffres) ou clé de secours hors-ligne.

---

## Stack Technique

| Couche | Technologies |
| :--- | :--- |
| **Interface Web** | React 18, TypeScript, Vite 6 |
| **Style & Design** | Tailwind CSS, variables CSS dynamiques selon l'heure |
| **Scène 3D Temps Réel** | Three.js (WebGL) & Anime.js |
| **Icônes & Illustrations** | Lucide React, SVG animés sur mesure, Font Awesome Brands SVG |
| **Persistance & Données** | Stockage local synchronisé (`localStorage`) & client Supabase |
| **Tests Automatisés** | Vitest & JSDOM (`src/tests/maison-alice.test.ts`) |
| **Déploiement** | Netlify (`netlify.toml`) |

---

## Structure du Projet

```text
├── public/
│   └── assets/
│       ├── maison-alice-logo-transparent.png
│       ├── maison-alice-logo-transparent.webp
│       └── payments/
│           ├── orange-money.png
│           ├── wave.png
│           └── moov-money.png
├── src/
│   ├── components/
│   │   ├── 3d/               # Scène 3D WebGL (Confectionery3DScene.tsx)
│   │   ├── admin/            # Espace d'administration épuré (#admin)
│   │   ├── order/            # Tiroir de commande en 4 étapes (OrderDrawer.tsx)
│   │   ├── sections/         # Hero, Coffrets (grille 3+2), Étapes, Paiement, Footer
│   │   ├── theme/            # Horloge automatique des 3 royaumes (MagicClockToggle.tsx)
│   │   └── ui/               # Barre de navigation centrée, Logo, Illustrations SVG
│   ├── hooks/                # Cycle horaire automatique (useTimeTheme.ts)
│   ├── lib/                  # Constantes, WhatsApp, Auth Admin, Optimisation WebP
│   └── tests/                # Suite de tests unitaires (maison-alice.test.ts)
└── index.html                # Métadonnées SEO & données structurées Schema.org
```

---

## Installation & Commandes

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement (http://localhost:3000)
npm run dev

# 3. Exécuter les tests unitaires
npx vitest run

# 4. Compiler pour la production
npm run build
```

---

## Contact

* **Maison Alice**
* **Téléphone & WhatsApp** : [+223 71 03 96 47](https://wa.me/22371039647)
* **Site officiel** : [https://maisonalice.netlify.app](https://maisonalice.netlify.app)
