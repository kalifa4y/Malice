# Rapport de Recherche Technique — Maison Alice

> **Projet :** Maison Alice (Bamako, Mali)  
> **Phase du cycle de vie :** 03 — technical-research  
> **Statut :** READY (Validé)  
> **Auteur :** Lead Software Architect & Technical Researcher  
> **Date :** 2026-08-19  

---

## 1. Objectifs de la Recherche Technique

1. Valider la faisabilité technique d'un canvas 3D interactif d'arrière-plan (Three.js / Anime.js) fluide sur mobile à Bamako (réseaux 4G/3G, contraintes GPU mobile).
2. Valider le mécanisme de bascule dynamique des 3 thèmes chromatiques et typographiques (Metroway / Neogen / Perfect Girl + Google Fonts).
3. Définir l'intégration de Supabase (Database, Auth, Realtime, RLS) pour le tunnel de commande et le dashboard d'administration sans backend serveur lourd (Serverless).
4. Structurer l'intégration WhatsApp sans dépendance à des APIs payantes (Meta Cloud API / Twilio).

---

## 2. Évaluation des Technologies Candidates

### 2.1 Moteur 3D & Animation (Option B : Éléments flottants en arrière-plan)

| Critère | Three.js / React Three Fiber | Canvas 2D / CSS 3D Transforms | Spline WebGL Export |
| :--- | :--- | :--- | :--- |
| **Effet visuel immersif** | ⭐⭐⭐⭐⭐ (Très élevé) | ⭐⭐⭐ (Moyen) | ⭐⭐⭐⭐ (Élevé) |
| **Poids du bundle** | ~140 KB gzip | ~5 KB | ~1.2 MB (Très lourd) |
| **Contrôle & Réactivité au scroll** | Total (Anime.js / r3f) | Limité | Moyen |
| **Compatibilité mobile Mali** | Optimisable (low-poly / shaders légers) | Maximale | Mauvaise (Lenteur 4G) |
| **Recommandation** | **Three.js avec @react-three/fiber ou Canvas WebGL léger** | Fallback si WebGL désactivé | Écarté (trop lourd) |

* **Décision technique** : Utilisation de **Three.js** avec des géométries procédurales optimisées (cartes flottantes, cylindres horloges, clés dorées étincelantes et particules confiseries) avec un fallback gracieux si WebGL n'est pas supporté.
* **Bibliothèque d'animation** : **Anime.js (v3)** et **Framer Motion / Lucide-React** pour les micro-interactions de l'interface et transitions douces de caméras.

---

### 2.2 Gestion des Polices et Thèmes Dynamiques

* **Polices de Titres (DaFont / Webfonts)** :
  * Thème 1 : `Metroway` (`@font-face` WOFF2 localisé).
  * Thème 2 : `Neogen` (`@font-face` WOFF2 localisé).
  * Thème 3 : `Perfect Girl Sans Serif` (`@font-face` WOFF2 localisé).
* **Polices de Corps / UI (Google Fonts)** :
  * Thème 1 : `Google Sans Flex` / `Plus Jakarta Sans`
  * Thème 2 : `Manrope`
  * Thème 3 : `Figtree`
* **Mécanisme de bascule** : Variables CSS injectées sur l'élément racine `:root` ou `document.documentElement` selon l'heure locale calculée (`Intl.DateTimeFormat` sur le fuseau horaire de l'utilisateur ou sélecteur manuel dans l'état React).

---

### 2.3 Backend, Données & Sécurité (Supabase)

* **Architecture** : Backend-as-a-Service (BaaS) via `@supabase/supabase-js`.
* **Modèle de données** :
  1. `orders` : Id, order_number, customer_name, customer_phone, delivery_zone, delivery_address, pack_type, total_amount, payment_method, status, created_at.
  2. `settings` : Prix des packs, activation pack saisonnier, numéros de paiement Wave/Orange/Moov.
  3. `delivery_zones` : Nom du quartier/commune de Bamako, rive, frais en FCFA.
* **Politiques de Sécurité (RLS)** :
  * Insertion `orders` : Publique (`anon`) autorisée avec validation des champs obligatoires.
  * Lecture / Modification `orders` : Réservée aux utilisateurs authentifiés (`auth.uid() IS NOT NULL` / Rôle Admin).
  * Lecture `settings` & `delivery_zones` : Publique (`anon`).
  * Modification `settings` & `delivery_zones` : Réservée au rôle Admin.

---

### 2.4 Intégration WhatsApp & Format de Transmission

* **Format du lien** : `https://wa.me/223XXXXXXXX?text=${encodeURIComponent(message)}`
* **Contenu du message type** :
  ```text
  🎩 *NOUVELLE COMMANDE MAISON ALICE*
  ──────────────────────────────
  📦 Commande : #MA-2026-1042
  👤 Client : Aminata Traoré
  📞 Téléphone : +223 76 00 00 00
  🎁 Pack : Pack Premium (25 000 FCFA)
  📍 Lieu : ACI 2000, Rive Gauche (2 000 FCFA)
  💰 Total : 27 000 FCFA
  💳 Moyen de paiement : Orange Money
  ──────────────────────────────
  ✅ J'ai effectué mon transfert et je joins ma capture d'écran !
  ```

---

## 3. Matrice des Risques Techniques & Mitigations

| Risque Technique | Probabilité | Impact | Mitigation Technique |
| :--- | :--- | :--- | :--- |
| **Chute de FPS sur smartphones Android entrée de gamme** | Moyenne | Élevé | Détection du `devicePixelRatio` (limité à 1.5 max), réduction du nombre de particules (max 50 mesh low-poly), suspension du rendu 3D hors viewport. |
| **Blocage du lien WhatsApp sur certains navigateurs in-app (TikTok / Insta webview)** | Faible | Moyen | Utilisation du protocole universel `https://wa.me/` testé sur toutes les webviews sociales + copie automatique du numéro dans le presse-papier en fallback. |
| **Accès non autorisé au Dashboard Admin** | Faible | Élevé | Supabase Auth avec JWT chiffré, Row Level Security sur PostgreSQL activé sur 100% des tables. |

---

## 4. Recommandations Finales pour l'Architecture

1. **Stack Validée** : React 18+ / Vite / TypeScript / TailwindCSS / Three.js / Anime.js / Supabase.
2. **Déploiement Frontend** : Vercel / Netlify / Cloudflare Pages avec SPA Fallback (`index.html`).
3. **Statut de faisabilité** : **100% Validé et Prêt pour la phase 04 / 05**.
