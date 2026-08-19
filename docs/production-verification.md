# Maison Alice — Vérification de Production (Phase 15)

## 1. Liste de Contrôle Post-Déploiement (Smoke Tests)

| Étape de Test | Procédure | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- |
| **ST-01 : Chargement Initial** | Ouvrir l'URL de production sur mobile et desktop | Page interactive chargée en < 1.5s, police appliquée, 3D active | **PASS** |
| **ST-02 : Horloge & Thème** | Vérifier l'heure de Bamako (UTC+0) | Thème correspondant activé avec les bonnes couleurs et le symbole de carte | **PASS** |
| **ST-03 : Unboxing & Coffrets** | Cliquer sur "Détails" d'un coffret | Modal de composition complet s'ouvre sans débordement | **PASS** |
| **ST-04 : Tunnel de Commande** | Remplir le formulaire avec un quartier de Bamako | Calcul automatique du total avec frais de livraison exacts | **PASS** |
| **ST-05 : Redirection WhatsApp** | Cliquer sur "Valider ma Commande sur WhatsApp" | Ouvre l'app WhatsApp avec le message structuré et le numéro marchand | **PASS** |
| **ST-06 : Espace Admin** | Se connecter sur `/#admin` avec le mot de passe | Dashboard opérationnel avec commandes, filtres et métriques à jour | **PASS** |

---

## 2. Bilan de Phase
**STATUT DU GATE : PASS** (Tous les flux critiques testés et conformes).
