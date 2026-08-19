# Spécification Design UI/UX & Système Visuel — Maison Alice

> **Projet :** Maison Alice (Bamako, Mali)  
> **Phase du cycle de vie :** 09 — ui-ux-design  
> **Statut :** READY (Validé)  
> **Date :** 2026-08-19  

---

## 1. Direction Artistique & Storytelling Visuel

L'expérience visuelle de **Maison Alice** transcende l'e-commerce traditionnel pour devenir un voyage onirique dans le terrier du Lapin Blanc, adapté aux codes du luxe contemporain à Bamako.

### Principes Directeurs
1. **Élégance Mystérieuse & Féerique** : Finitions sombres, touches dorées, verres dépolis (Glassmorphism), ombres portées douces et lueurs ambiantes (Glows).
2. **Métamorphose Temporelle Vivante** : L'interface s'ajuste au cours de la journée en modifiant ses couleurs dominantes et sa personnalité typographique selon 3 figures emblématiques du conte.
3. **Zéro Friction à l'Achat** : Pas de tunnel à 5 étapes. Un tiroir latéral interactif fluide avec choix du pack, sélection de zone à Bamako et redirection WhatsApp immédiate.
4. **Navigation Sans Navbar Conventionnelle** : Une progression narrative guidée par le scroll, avec une boussole / horloge magique discrète en coin d'écran.

---

## 2. Système Chromatique et Typographique des 3 Thèmes

```
                                      ┌──────────────────────────────────────────────┐
                                      │  1. THÈME CHESHIRE CAT (00h00 - 08h00)       │
                                      │  Asset : assets/cat.webp                     │
                                      │  Ambiance : Nuit Mystique & Forêt Bleutée    │
                                      │  • Fond : #090D16 | Surface : #131B2A        │
                                      │  • Accent : #00F2FE (Cyan électrique néon)   │
                                      │  • Titres : Metroway                         │
                                      │  • Corps : Google Sans Flex                  │
                                      └──────────────────────┬───────────────────────┘
                                                             │
                                      ┌──────────────────────▼───────────────────────┐
                                      │  2. THÈME MAD HATTER (08h00 - 16h00)         │
                                      │  Asset : assets/hatter.jpg                   │
                                      │  Ambiance : L'Heure du Thé & Absinthe Royale │
                                      │  • Fond : #1A2818 | Surface : #253A22        │
                                      │  • Accent : #E25822 (Cuivre & Roux Ardent)   │
                                      │  • Secondaire : #E06D63 & #D4AF37 (Or)       │
                                      │  • Titres : Neogen                           │
                                      │  • Corps : Manrope                           │
                                      └──────────────────────┬───────────────────────┘
                                                             │
                                      ┌──────────────────────▼───────────────────────┐
                                      │  3. THÈME REINE DE CŒUR (16h00 - 00h00)      │
                                      │  Asset : assets/reine coeur.png              │
                                      │  Ambiance : Royauté Sombre & Crépuscule      │
                                      │  • Fond : #120910 | Surface : #1E101B        │
                                      │  • Accent : #DC143C (Rouge Carmin Royal)     │
                                      │  • Secondaire : #4FC3F7 & #FFD700 (Or Pur)   │
                                      │  • Titres : Perfect Girl Sans Serif          │
                                      │  • Corps : Figtree                           │
                                      └──────────────────────────────────────────────┘
```

---

## 3. Structure des Écrans & Parcours Utilisateur

### 3.1 Vitrine One-Page Principale (`/`)
1. **Hero Section Immersive** :
   * Canvas 3D Three.js réactif en arrière-plan (cartes à jouer, horloges, clés, friandises flottantes).
   * Badge lumineux de la tranche horaire courante (ex: `🌙 Nocturne — Chat du Cheshire`).
   * Titre magistral stylisé : *"Maison Alice — L'Excellence Sucrée au Pays des Merveilles"*.
   * Bouton CTA principal : *"Découvrir les Coffrets"* avec halo lumineux.
   * Widget "Horloge Magique" en haut à droite pour tester les 3 ambiances à la volée.
2. **Section Storytelling & Manifeste** :
   * Présentation du concept de luxe accessible à Bamako (confection locale, packaging sur-mesure, chocolats et friandises de prestige).
   * Carte interactive ou visuel mettant en avant le personnage du moment.
3. **Showcase des 3 Coffrets d'Exception** :
   * **Pack Normal (15 000 FCFA)** : Le Coffret Alice (Bonbons fins, sablés pur beurre, dragées chocolat).
   * **Pack Premium (25 000 FCFA)** : Le Coffret Royal du Chapelier (Sélection prestige, nougats, calissons, fiole & clé dorée).
   * **Pack Saisonnier (~20 000 FCFA)** : Le Coffret Éphémère (Édition limitée selon la période).
   * Bouton sur chaque carte : *"Commander ce Coffret"*.
4. **Section Témoignages & Galerie VIP** :
   * Avis de clients satisfaits à Bamako, mise en avant de l'unboxing féerique.
5. **Section FAQ & Instructions de Paiement** :
   * Explication simple des livraisons à Bamako et du règlement par Orange Money, Wave et Moov Money.
6. **Pied de page (Footer)** :
   * Mentions de marque, contacts directs WhatsApp/Instagram/TikTok, lien discret vers `/admin`.

---

### 3.2 Tiroir de Commande Interactif (Order Drawer)
* S'ouvre en glissant depuis la droite (ou depuis le bas sur mobile) avec flou d'arrière-plan (*Backdrop Blur*).
* **Étape 1 : Récapitulatif du Coffret sélectionné** (Image miniature, nom, prix en FCFA).
* **Étape 2 : Coordonnées** (Prénom & Nom, Numéro WhatsApp malien).
* **Étape 3 : Livraison à Bamako** :
  * Menu déroulant classé par zone : Rive Gauche (ACI 2000, Hamdallaye, etc. - 1 500 FCFA), Rive Droite (Badalabougou, Golf, etc. - 2 000 FCFA), Périphérie.
  * Champ texte libre : *Précisions / Repères (ex: 2ème porte après la pharmacie)*.
  * Affichage immédiat du sous-total et du total actualisé.
* **Étape 4 : Choix du Moyen de Paiement Mobile** :
  * Badges interactifs : 🟠 **Orange Money**, 🔵 **Wave**, 🟢 **Moov Money**.
  * Affichage automatique du numéro marchand et du titulaire du compte.
* **Bouton d'Action Final** : *"Valider ma Commande sur WhatsApp ➔"* (Génère le lien direct et enregistre dans Supabase).

---

### 3.3 Dashboard Administrateur (`/admin`)
* **Écran de Connexion** : Email & mot de passe avec design aux couleurs de Maison Alice.
* **Vue Tableau de Bord** :
  * Cartes de statistiques : Total Commandes, Ventes du mois (en FCFA), Commandes en attente.
  * Liste temps réel des commandes avec badge de statut coloré (`En attente de paiement`, `Confirmée`, `En préparation`, `En livraison`, `Livrée`).
  * Modal de détail d'une commande pour changer le statut d'un clic.
  * Onglet "Tarifs & Packs" pour ajuster le prix des coffrets et activer/désactiver le Pack Saisonnier.
  * Onglet "Zones de Livraison" pour ajuster les tarifs par quartier de Bamako.

---

## 4. Accessibilité & Ergonomie Mobile (Mali Mobile Context)

* **Contrastes de couleurs** : Respect du ratio WCAG AA (texte blanc/crème sur fonds sombres riches).
* **Zones tactiles (Touch Targets)** : Boutons et sélecteurs dimensionnés à au moins 48px de hauteur pour un usage tactile sans erreur.
* **Optimisation des animations** : Respect de la directive CSS `@media (prefers-reduced-motion: reduce)` pour désactiver les rotations 3D si l'utilisateur le demande.

---

## 5. Statut du Gate

* **Statut UI/UX Design** : **READY**
* **Prochaine étape** : Phase 10 — frontend-architecture (Architecture des Composants & État Frontend).
