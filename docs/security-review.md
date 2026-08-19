# Maison Alice — Revue de Sécurité Applicative (Phase 13)

## 1. Contexte & Modèle de Menaces
Le site **Maison Alice** propose des coffrets cadeaux à Bamako avec paiement direct par Mobile Money (Orange Money, Wave, Moov Money) et notification WhatsApp.

### Acteurs & Périmètres :
- **Visiteurs / Acheteurs** : Accès public à la vitrine, consultation des packs et soumission de commande.
- **Administrateur Boutique** : Gestion des commandes, modification des prix et des zones de livraison.
- **Opérateurs Télécoms / WhatsApp** : Canaux tiers sécurisés pour les transferts et la messagerie.

---

## 2. Analyse Détaillée des Risques & Mitigations

### 2.1 Absence de Données Bancaires Sensibles (PCI-DSS)
- **Analyse** : Aucun numéro de carte bancaire ni code secret n'est collecté sur le site. Les paiements s'effectuent par virement direct sur les applications officielles Orange Money / Wave / Moov Money.
- **Niveau de Risque** : **NUL / HORS PÉRIMÈTRE**.

### 2.2 Protection contre les Injections & XSS
- **Analyse** : Toutes les entrées utilisateurs (Nom, Téléphone, Adresse, Note cadeau) sont rendues via les composants sécurisés React JSX sans recours à `dangerouslySetInnerHTML`.
- **Encodage WhatsApp** : Les paramètres d'URL WhatsApp utilisent systématiquement `encodeURIComponent()` pour parer toute injection de lien ou altération de payload.
- **Mitigation** : **PASS**.

### 2.3 Sécurisation de l'Espace Administrateur
- **Analyse** : En mode preview local, l'authentification s'appuie sur une session vérifiée avec mot de passe maître.
- **Recommandation Production** : En production avec Supabase, activer Supabase Auth avec Magic Link ou Authentification par e-mail avec Row Level Security (RLS) sur la table `orders` et `store_settings`.
- **Mitigation** : Les politiques RLS ont été rédigées dans `docs/database-design.md`.
- **Statut** : **PASS WITH RECOMMENDATIONS**.

### 2.4 Intégrité des Dépendances & Supply Chain
- **Audit npm** : `found 0 vulnerabilities` sur l'arbre de dépendances (React 18, Three.js, Lucide, TailwindCSS, Vite).
- **Statut** : **PASS**.

---

## 3. Bilan de Sécurité
**STATUT DU GATE : PASS** (Aucune vulnérabilité critique ou bloquante identifiée).
