# Maison Alice — Guide de Déploiement & Production (Phase 14)

## 1. Vue d'Ensemble
L'application **Maison Alice** est un SPA React + Vite optimisé pour un hébergement statique ultra-rapide sur CDN mondial (Vercel, Netlify, Cloudflare Pages ou GitHub Pages) couplé à Supabase pour la persistance temps réel.

---

## 2. Procédure de Build Production

```bash
# 1. Installation propre des dépendances
npm ci

# 2. Vérification TypeScript et compilation Vite
npm run build
```

Les fichiers générés se trouvent dans le répertoire `dist/` :
- `dist/index.html`
- `dist/assets/` (fichiers JS minifiés, CSS, images)
- `dist/logo-favicon.svg`

---

## 3. Variables d'Environnement (.env.production)

```env
# Configuration Supabase (Optionnel en preview, Requis en production)
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon-publique

# Numéro WhatsApp Marchand Officiel Maison Alice Bamako
VITE_MERCHANT_WHATSAPP_NUMBER=+22370000000
```

---

## 4. Déploiement sur Vercel / Netlify / Cloudflare Pages

### Vercel :
```bash
npx vercel --prod
```
- **Framework Preset** : `Vite`
- **Build Command** : `npm run build`
- **Output Directory** : `dist`

### Netlify :
- **Build command** : `npm run build`
- **Publish directory** : `dist`

---

## 5. Bilan de Phase
**STATUT DU GATE : PASS** (Build de production validé, prêt pour mise en ligne).
