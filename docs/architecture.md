# Architecture Globale du Système — Maison Alice

> **Projet :** Maison Alice (Bamako, Mali)  
> **Phase du cycle de vie :** 06 — system-architecture  
> **Statut :** READY (Validé)  
> **Date :** 2026-08-19  

---

## 1. Vue d'Ensemble & Style Architectural

Le système **Maison Alice** adopte une architecture **Jamstack / Serverless BaaS (Backend-as-a-Service)** conçue pour offrir des performances maximales sur mobile, une fluidité 3D optimale et un coût d'infrastructure nul au démarrage.

```mermaid
flowchart TD
    subgraph Client ["Client Layer (Web & Mobile Browser)"]
        UI["React 18 + Vite SPA"]
        ThreeCanvas["Three.js 3D Background Engine"]
        ThemeEngine["Dynamic Theme & Font Engine"]
        OrderDrawer["Order & Bamako Delivery Engine"]
    end

    subgraph External ["External Communication"]
        WhatsApp["WhatsApp Client (wa.me Protocol)"]
    end

    subgraph BaaS ["Supabase Cloud Platform (PostgreSQL)"]
        Auth["Supabase Auth (Admin JWT)"]
        DB[("PostgreSQL Database")]
        RLS["Row Level Security (RLS) Engine"]
        Realtime["Supabase Realtime Subscriptions"]
    end

    UI --> ThreeCanvas
    UI --> ThemeEngine
    UI --> OrderDrawer
    OrderDrawer -->|1. Création Commande (Public INSERT)| RLS
    OrderDrawer -->|2. Déclenchement lien| WhatsApp
    RLS --> DB
    Auth -->|Authentification Admin| RLS
    DB -->|Mise à jour live| Realtime
    Realtime -->|Flux temps réel| UI
```

---

## 2. Découpage des Composants Principaux

### 2.1 Moteur 3D & Animation (`components/3d/`)
* **Rôle** : Rendre un canvas Three.js léger en arrière-plan avec des géométries 3D procédurales (cartes à jouer tournoyantes, montres à gousset, clés dorées, friandises).
* **Gestion des performances** :
  * Détection du framerate et du `devicePixelRatio` (clamp à 1.5).
  * `requestAnimationFrame` suspendu lorsque l'onglet est masqué (`document.hidden`).
  * Réaction aux événements de scroll de la page pour le parallax.

### 2.2 Moteur de Thème Temporel (`components/theme/` & `hooks/useTimeTheme.ts`)
* **Rôle** : Calculer la plage horaire courante (00h-08h, 08h-16h, 16h-00h) et injecter les variables CSS et classes de polices correspondantes.
* **Composant Horloge Magique** : Sélecteur discret flottant permettant à l'utilisateur d'explorer les 3 univers à la demande sans attendre l'heure réelle.

### 2.3 Tunnel de Commande & Logistique Bamako (`components/order/`)
* **Rôle** : Formulaire guidé, sélection du pack, sélecteur de commune/quartier de Bamako avec calcul instantané des frais de livraison, affichage des numéros Orange Money, Wave et Moov Money.
* **Génération WhatsApp** : Construction de l'URL universelle `https://wa.me/` encodant le récapitulatif complet de la commande.

### 2.4 Espace Administration (`components/admin/` & `/admin`)
* **Rôle** : Dashboard protégé par Supabase Auth pour consulter les commandes en temps réel, modifier leur statut, ajuster les prix et le barème de livraison.

---

## 3. Flux de Données Critiques (Critical Data Flows)

### Flux de Commande Client
```
1. Client sélectionne un Pack et son quartier à Bamako
   ↓
2. Calcul du Total (Prix Pack + Frais de livraison)
   ↓
3. Client clique sur "Confirmer & Commander"
   ↓
4. Insertion de la commande dans Supabase (table 'orders', statut: 'pending_payment')
   ↓
5. Génération du lien WhatsApp 'wa.me' avec le numéro de commande #MA-XXXX
   ↓
6. Redirection fluide vers WhatsApp pour l'envoi de la confirmation et capture de paiement
```

---

## 4. Frontières de Sécurité (Security Boundaries)

* **Client Public (`anon`)** :
  * Droit d'insertion (`INSERT`) uniquement sur la table `orders`.
  * Droit de lecture (`SELECT`) sur `settings` et `delivery_zones`.
  * Aucun droit de lecture (`SELECT`) ni de modification (`UPDATE`/`DELETE`) sur les données personnelles des autres commandes clients.
* **Administrateur Authentifié (`authenticated`)** :
  * Droit total (`ALL`) sur `orders`, `settings`, `delivery_zones` sous réserve de validation JWT Supabase Auth.

---

## 5. Statut du Gate

* **Statut Architecture** : **READY**
* **Prochaine étape** : Phase 07 — database-design (Modélisation de la Base de Données PostgreSQL Supabase).
