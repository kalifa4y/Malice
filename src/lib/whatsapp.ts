import { Order } from '../types';

export function generateWhatsAppOrderUrl(order: Order, merchantPhone: string = "22370000000"): string {
  const paymentLabels: Record<string, string> = {
    orange_money: 'Orange Money 🟠',
    wave: 'Wave 🔵',
    moov_money: 'Moov Money 🟢',
  };

  const cleanPhone = merchantPhone.replace(/[^0-9]/g, '');

  const lines = [
    `🎩 *NOUVELLE COMMANDE — MAISON ALICE*`,
    `──────────────────────────────`,
    `📦 *Commande N° :* ${order.orderNumber}`,
    `👤 *Client(e) :* ${order.customerName}`,
    `📞 *Téléphone :* ${order.customerPhone}`,
    `🎁 *Coffret :* ${order.packName} (${order.packPrice.toLocaleString('fr-FR')} FCFA)`,
    `📍 *Lieu de livraison :* ${order.deliveryZoneName}`,
    `🏡 *Adresse / Repères :* ${order.deliveryAddress}`,
    `🛵 *Frais de livraison :* ${order.deliveryFee.toLocaleString('fr-FR')} FCFA`,
    `💰 *TOTAL À RÉGLER :* ${order.totalAmount.toLocaleString('fr-FR')} FCFA`,
    `💳 *Mode de paiement :* ${paymentLabels[order.paymentMethod] || order.paymentMethod}`,
  ];

  if (order.notes) {
    lines.push(`📝 *Message / Note :* ${order.notes}`);
  }

  lines.push(`──────────────────────────────`);
  lines.push(`✅ *Bonjour Maison Alice ! Je valide ma commande et je vous joins ma capture de transfert.*`);

  const fullMessage = lines.join('\n');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(fullMessage)}`;
}

export function generateOrderNumber(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();
  return `#MA-${year}-${randomNum}`;
}
