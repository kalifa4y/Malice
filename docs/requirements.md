# Spécification des Exigences Logiciel — Maison Alice

> **Projet :** Maison Alice (Bamako, Mali)  
> **Phase du cycle de vie :** 02 — requirements-engineering  
> **Statut :** READY (Validé)  
> **Version :** 1.0.0  
> **Date :** 2026-08-19  

---

## 1. Vue d'Ensemble & Objectifs du Système

Le système **Maison Alice** est une application web immersive (One-Page narrative en 3D/Parallax) couplée à un espace de gestion administrative (Dashboard Supabase) pour la vente de coffrets cadeaux et snacks haut de gamme à Bamako (Mali).

---

## 2. Acteurs du Système

* **ACT-01 : Visiteur / Client B2C** : Utilisateur non authentifié accédant à la boutique web, explorant l'univers visuel, configurant son pack et passant commande avec paiement mobile.
* **ACT-02 : Administrateur / Fondateur** : Utilisateur authentifié via Supabase Auth accédant au Dashboard pour gérer les commandes, les statuts, les prix et les paramètres de la boutique.
* **ACT-03 : Système Externe / WhatsApp** : Client de messagerie déclenché via lien protocolaire (`wa.me`) pour la transmission de la confirmation de commande et la preuve de paiement.

---

## 3. Capacités Globales du Système (Capabilities)

* **CAP-01** : Navigation immersive One-Page sans navbar conventionnelle avec éléments 3D interactifs en arrière-plan.
* **CAP-02** : Adaptation dynamique de la palette de couleurs et des typographies selon l'heure locale (3 univers : Chat du Cheshire, Chapelier Fou, Reine de Cœur) avec possibilité de bascule manuelle.
* **CAP-03** : Présentation interactive des packs de friandises (Normal, Premium, Saisonnier).
* **CAP-04** : Calcul dynamique des frais de livraison selon la commune/zone à Bamako.
* **CAP-05** : Tunnel de commande express et instructions de paiement mobile (Orange Money, Wave, Moov Money).
* **CAP-06** : Enregistrement temps réel des commandes dans la base de données.
* **CAP-07** : Génération du lien de finalisation et notification WhatsApp instantanée.
* **CAP-08** : Espace d'administration sécurisé pour la gestion opérationnelle et tarifaire.

---

## 4. Exigences Fonctionnelles (Functional Requirements)

### 4.1 Expérience Visuelle & Navigation Immersive
* **FR-001** : Le système doit adapter dynamiquement le thème visuel (palette de couleurs, typographie de titre, typographie de corps) en fonction de l'heure locale de l'utilisateur :
  * `00h00 - 08h00` : **Thème Cheshire Cat** (`Metroway` + `Google Sans Flex` + Palette Nocturne Cyan/Bleu nuit).
  * `08h00 - 16h00` : **Thème Mad Hatter** (`Neogen` + `Manrope` + Palette Absinthe/Cuivre/Corail).
  * `16h00 - 00h00` : **Thème Reine de Cœur** (`Perfect Girl Sans Serif` + `Figtree` + Palette Cramoisi/Bleu Ciel/Or).
* **FR-002** : Le système doit proposer un sélecteur d'ambiance discret ("Horloge magique") permettant à l'utilisateur de forcer manuellement l'un des 3 thèmes.
* **FR-003** : Le système doit intégrer un canvas 3D (Three.js / React Three Fiber) en arrière-plan affichant des éléments thématiques flottants (cartes, montres à gousset, clés, friandises) réagissant au scroll et aux mouvements du curseur/gyroscope.
* **FR-004** : Le système ne doit pas comporter de barre de navigation fixe classique (navbar), mais des ancres de transition narratives et un bouton d'action principal flottant "Commander ma Box".

### 4.2 Présentation des Produits & Offres
* **FR-005** : Le système doit présenter les 3 offres :
  * **Pack Normal** (Prix de base par défaut : 15 000 FCFA).
  * **Pack Premium** (Prix de base par défaut : 25 000 FCFA).
  * **Pack Saisonnier** (Tarif modulable selon l'événement).
* **FR-006** : Chaque fiche de pack doit afficher : titre, visuel studio haute définition, composition détaillée (types de confiseries, chocolats non fondants, biscuits), prix en FCFA, et bouton d'ajout direct au tunnel de commande.
* **FR-007** : Si le Pack Saisonnier est désactivé par l'administrateur, il doit être masqué de la vue client ou afficher un badge "Bientôt disponible".

### 4.3 Tunnel de Commande & Livraison à Bamako
* **FR-008** : Le système doit fournir un formulaire de commande interactif (modale ou tiroir latéral fluide) collectant :
  * Nom et prénom du destinataire.
  * Numéro de téléphone WhatsApp joignable.
  * Commune / Quartier de livraison à Bamako (sélection guidée : Rive Gauche, Rive Droite, Communes I à VI, zones spécifiques comme Badalabougou, ACI 2000, Hamdallaye, Bacodjicoroni, etc.).
  * Instructions de livraison complémentaires (repères visuels).
  * Choix du mode de paiement mobile (**Orange Money**, **Wave**, **Moov Money**).
* **FR-009** : Le système doit calculer automatiquement les frais de livraison en fonction de la zone sélectionnée et afficher le total global (Prix Pack + Frais de livraison).
* **FR-010** : Le système doit afficher les instructions de paiement spécifiques au moyen choisi (Numéro de compte officiel Maison Alice, Nom du titulaire, syntaxe du transfert).

### 4.4 Enregistrement & Notification WhatsApp
* **FR-011** : Lors de la soumission du formulaire, le système doit créer un enregistrement de commande dans Supabase avec un identifiant unique lisible (ex: `#MA-2026-1042`).
* **FR-012** : Le système doit générer un lien WhatsApp universel (`wa.me`) pré-formaté contenant le récapitulatif complet de la commande, le montant total, l'adresse de livraison et l'identifiant de commande, permettant au client d'envoyer sa confirmation au vendeur en un clic.

### 4.5 Dashboard Administrateur
* **FR-013** : Le système doit restreindre l'accès à la route `/admin` via une authentification email/mot de passe sécurisée (Supabase Auth).
* **FR-014** : Le tableau de bord administrateur doit lister l'ensemble des commandes avec filtres par statut, date et mode de paiement.
* **FR-015** : L'administrateur doit pouvoir modifier le statut d'une commande selon le cycle de vie défini.
* **FR-016** : L'administrateur doit pouvoir modifier le prix des packs, le contenu descriptif et le statut d'activation du Pack Saisonnier.
* **FR-017** : L'administrateur doit pouvoir configurer le barème des frais de livraison par zone à Bamako.

---

## 5. Règles Métier (Business Rules)

* **BR-001 (Monnaie)** : Tous les prix et transactions sont exprimés en Francs CFA (XOF / FCFA).
* **BR-002 (Calcul Livraison)** : Aucun retrait physique n'est proposé. Toute commande inclut obligatoirement des frais de livraison calculés selon la grille tarifaire des zones de Bamako.
* **BR-003 (Validation Paiement)** : Une commande reste au statut `En attente de paiement` jusqu'à vérification manuelle par l'administrateur sur son application bancaire/mobile (Orange Money, Wave, Moov Money).
* **BR-004 (Format Téléphone)** : Les numéros de téléphone saisis doivent correspondre au format mobile du Mali (+223 XX XX XX XX ou 8 chiffres).

---

## 6. Cycle de Vie d'une Commande (Order Lifecycle)

```
[Nouvelle Commande] 
       │
       ▼
[En attente de paiement] ─── (Paiement non reçu / abandon) ───► [Annulée]
       │
       ▼ (Paiement vérifié sur Orange/Wave/Moov)
[Payée / Confirmée]
       │
       ▼
[En préparation] (Emballage de la box)
       │
       ▼
[En cours de livraison] (Remis au coursier moto)
       │
       ▼
[Livrée]
```

---

## 7. Exigences Non Fonctionnelles (Non-Functional Requirements)

* **NFR-001 (Performance & 3D Mobile)** : La scène 3D doit maintenir un framerate de 60 FPS sur smartphones récents et 30+ FPS sur appareils d'entrée de gamme, avec adaptation de la résolution ou fallback CSS léger si WebGL n'est pas supporté.
* **NFR-002 (Temps de Chargement)** : Le temps de chargement initial du bundle JavaScript/CSS doit être inférieur à 2.5 secondes sur connexion 4G.
* **NFR-003 (Sécurité)** : Les tables Supabase doivent être protégées par des politiques Row Level Security (RLS) strictes (seul l'administrateur authentifié peut lire et modifier toutes les commandes ; les clients peuvent uniquement insérer une commande anonyme).
* **NFR-004 (Design & Ergonomie)** : Respect scrupuleux des 3 thèmes graphiques et intégration des polices requises (`Metroway`, `Neogen`, `Perfect Girl Sans Serif`, `Google Sans Flex`, `Manrope`, `Figtree`).

---

## 8. Matrice de Traçabilité & Statut

| Réf Exigence | Source | Priorité | Statut |
| :--- | :--- | :--- | :--- |
| **FR-001 à FR-004** | Cadrage Thématique & 3D | **Must** | Confirmé |
| **FR-005 à FR-007** | Offres & Packs de friandises | **Must** | Confirmé |
| **FR-008 à FR-010** | Logistique Bamako & Paiement Mobile | **Must** | Confirmé |
| **FR-011 à FR-012** | Flux Commande & WhatsApp | **Must** | Confirmé |
| **FR-013 à FR-017** | Dashboard Administrateur | **Must** | Confirmé |
| **NFR-001 à NFR-004** | Qualité & Sécurité | **Must** | Confirmé |
