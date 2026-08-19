# Conception des Interfaces et Contrats API — Maison Alice

> **Projet :** Maison Alice (Bamako, Mali)  
> **Phase du cycle de vie :** 08 — api-design  
> **Statut :** READY (Validé)  
> **Date :** 2026-08-19  

---

## 1. Vue d'Ensemble & Style d'Interface

L'application **Maison Alice** utilise deux interfaces de communication principales :
1. **Client BaaS Supabase** : Accès direct sécurisé via `@supabase/supabase-js` (PostgreSQL / PostgREST) avec RLS.
2. **Protocole de Lien WhatsApp (`wa.me`)** : Contrat de message structuré pour la confirmation instantanée et l'envoi de la preuve de virement.

---

## 2. Contrats des Services Supabase

### 2.1 Service Public : Création d'une Commande Client
* **Opération** : `supabase.from('orders').insert(payload)`
* **Droits** : Rôle Public (`anon`).
* **Schéma du Payload** :
```typescript
interface CreateOrderPayload {
  customer_name: string;      // Min 2 caractères, max 100
  customer_phone: string;     // Format: +223 XX XX XX XX ou 8 chiffres
  pack_id: string;            // UUID valide
  pack_name: string;          // ex: "Le Coffret Royal du Chapelier"
  pack_price: number;         // > 0 en FCFA
  delivery_zone_id: string;   // UUID valide
  delivery_zone_name: string; // ex: "ACI 2000 / Hamdallaye"
  delivery_address: string;   // Précisions (rue, porte, repère)
  delivery_fee: number;       // >= 0 en FCFA
  total_amount: number;       // pack_price + delivery_fee
  payment_method: 'orange_money' | 'wave' | 'moov_money';
  notes?: string;
}
```
* **Réponse attendue** :
```typescript
interface OrderResponse {
  id: string;
  order_number: string;       // ex: "#MA-2026-1042"
  status: 'pending_payment';
  created_at: string;
}
```

### 2.2 Service Public : Récupération des Catalogues & Tarifs
* **Opération** : `supabase.from('packs').select('*').eq('is_active', true)`
* **Opération** : `supabase.from('delivery_zones').select('*').eq('is_active', true)`
* **Opération** : `supabase.from('settings').select('*')`

---

### 2.3 Service Administrateur : Gestion des Commandes (`/admin`)
* **Authentification** : Token JWT Supabase Auth (`supabase.auth.signInWithPassword({ email, password })`).
* **Opérations** :
  * `listOrders(filters: { status?: OrderStatus; dateRange?: DateRange })`
  * `updateOrderStatus(orderId: string, newStatus: OrderStatus)`
  * `updatePackPricing(packId: string, price: number, isActive: boolean)`
  * `updateDeliveryZoneFee(zoneId: string, fee: number)`
  * `updatePaymentSettings(settingsPayload: PaymentSettings)`

---

## 3. Contrat du Message WhatsApp (`wa.me`)

* **Générateur URL** :
```typescript
export function generateWhatsAppOrderUrl(order: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  packName: string;
  packPrice: number;
  deliveryZone: string;
  deliveryAddress: string;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: string;
}, merchantPhone: string = "22370000000"): string {
  const paymentLabels: Record<string, string> = {
    orange_money: 'Orange Money 🟠',
    wave: 'Wave 🔵',
    moov_money: 'Moov Money 🟢',
  };

  const message = [
    `🎩 *NOUVELLE COMMANDE — MAISON ALICE*`,
    `──────────────────────────────`,
    `📦 *Commande :* ${order.orderNumber}`,
    `👤 *Client :* ${order.customerName}`,
    `📞 *Téléphone :* ${order.customerPhone}`,
    `🎁 *Pack :* ${order.packName} (${order.packPrice.toLocaleString()} FCFA)`,
    `📍 *Livraison :* ${order.deliveryZone} — ${order.deliveryAddress}`,
    `🛵 *Frais de livraison :* ${order.deliveryFee.toLocaleString()} FCFA`,
    `💰 *TOTAL À PAYER :* ${order.totalAmount.toLocaleString()} FCFA`,
    `💳 *Mode de paiement :* ${paymentLabels[order.paymentMethod] || order.paymentMethod}`,
    `──────────────────────────────`,
    `✅ *Je confirme ma commande et j'envoie ma preuve de paiement !*`
  ].join('\n');

  return `https://wa.me/${merchantPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
}
```

---

## 4. Statut du Gate

* **Statut API Design** : **READY**
* **Prochaine étape** : Phase 09 — ui-ux-design (Design UI/UX & Système Visuel).
