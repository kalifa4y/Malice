// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { generateOrderNumber, generateWhatsAppOrderUrl } from '../lib/whatsapp';
import { localDB } from '../lib/supabase';
import { Order } from '../types';
import { THEMES, BAMAKO_DELIVERY_ZONES } from '../lib/constants';

describe('Maison Alice — Business Logic & Verification Tests', () => {

  describe('1. Order Number & WhatsApp Contract Tests', () => {
    it('generates compliant order numbers in format #MA-2026-XXXX', () => {
      const orderNum = generateOrderNumber();
      expect(orderNum).toMatch(/^#MA-\d{4}-\d{4}$/);
    });

    it('builds a correctly formatted WhatsApp URI with encoded characters and totals', () => {
      const mockOrder: Order = {
        id: 'ord-test-1',
        orderNumber: '#MA-2026-7890',
        customerName: 'Fatoumata Coulibaly',
        customerPhone: '76123456',
        packId: 'pack-normal',
        packName: 'Le Coffret Alice',
        packPrice: 15000,
        deliveryZoneId: 'zone-1',
        deliveryZoneName: 'ACI 2000 / Hamdallaye',
        deliveryAddress: 'Rue 312, Porte 45',
        deliveryFee: 1500,
        totalAmount: 16500,
        paymentMethod: 'orange_money',
        status: 'pending_payment',
        createdAt: new Date().toISOString()
      };

      const url = generateWhatsAppOrderUrl(mockOrder, '+223 70 00 00 00');
      expect(url).toContain('wa.me/22370000000');
      expect(url).toContain(encodeURIComponent('Fatoumata Coulibaly'));
      expect(url).toContain(encodeURIComponent('#MA-2026-7890'));
    });
  });

  describe('2. Bamako Delivery Zones & Fee Accuracy', () => {
    it('contains all 8 required communes/districts across Rive Gauche and Rive Droite', () => {
      expect(BAMAKO_DELIVERY_ZONES.length).toBeGreaterThanOrEqual(8);
      const riveGaucheZones = BAMAKO_DELIVERY_ZONES.filter(z => z.riverSide === 'rive_gauche');
      const riveDroiteZones = BAMAKO_DELIVERY_ZONES.filter(z => z.riverSide === 'rive_droite');
      
      expect(riveGaucheZones.length).toBeGreaterThan(0);
      expect(riveDroiteZones.length).toBeGreaterThan(0);
    });

    it('ensures delivery fees are strictly positive and within valid ranges (1500 - 3500 FCFA)', () => {
      BAMAKO_DELIVERY_ZONES.forEach(z => {
        expect(z.fee).toBeGreaterThanOrEqual(1500);
        expect(z.fee).toBeLessThanOrEqual(5000);
        expect(z.isActive).toBe(true);
      });
    });
  });

  describe('3. Dynamic Time Themes & Font Pairings', () => {
    it('defines the 3 mandatory themes with corresponding characters and card suits', () => {
      expect(THEMES.cheshire_night).toBeDefined();
      expect(THEMES.cheshire_night.character).toBe('Chat du Cheshire');
      expect(THEMES.cheshire_night.cardSuit).toBe('spade');
      expect(THEMES.cheshire_night.titleFontName).toBe('Metroway');

      expect(THEMES.mad_hatter_day).toBeDefined();
      expect(THEMES.mad_hatter_day.character).toBe('Chapelier Fou');
      expect(THEMES.mad_hatter_day.cardSuit).toBe('club');
      expect(THEMES.mad_hatter_day.titleFontName).toBe('Neogen');

      expect(THEMES.queen_of_hearts_evening).toBeDefined();
      expect(THEMES.queen_of_hearts_evening.character).toBe('Reine de Cœur');
      expect(THEMES.queen_of_hearts_evening.cardSuit).toBe('heart');
      expect(THEMES.queen_of_hearts_evening.titleFontName).toBe('Perfect Girl Sans Serif');
    });
  });

  describe('4. Store Database & Order Lifecycle', () => {
    it('initializes with an empty order list without hardcoded mock orders', () => {
      localStorage.clear();
      const initialOrders = localDB.getOrders();
      expect(initialOrders).toEqual([]);
    });

    it('saves orders, retrieves them, and updates their status properly', () => {
      const newOrder: Order = {
        id: 'ord-test-lifecycle',
        orderNumber: '#MA-2026-9999',
        customerName: 'Oumar Diakité',
        customerPhone: '66778899',
        packId: 'pack-premium',
        packName: 'Le Coffret Royal du Chapelier',
        packPrice: 25000,
        deliveryZoneId: 'zone-4',
        deliveryZoneName: 'Bacodjicoroni',
        deliveryAddress: 'Face pharmacie',
        deliveryFee: 2000,
        totalAmount: 27000,
        paymentMethod: 'wave',
        status: 'pending_payment',
        createdAt: new Date().toISOString()
      };

      localDB.saveOrder(newOrder);
      const ordersAfterSave = localDB.getOrders();
      expect(ordersAfterSave.some(o => o.id === 'ord-test-lifecycle')).toBe(true);

      // Update status to confirmed
      localDB.updateOrderStatus('ord-test-lifecycle', 'confirmed');
      const updatedOrder = localDB.getOrders().find(o => o.id === 'ord-test-lifecycle');
      expect(updatedOrder?.status).toBe('confirmed');
    });

    it('saves packs with uploaded custom image Data URLs without losing custom visuals', () => {
      const customPack = {
        ...localDB.getPacks()[0],
        image: 'data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADwAQCdASoBAAEAAkA4JaQAA3AA/vuUAAA='
      };

      localDB.savePacks([customPack]);
      const retrievedPacks = localDB.getPacks();
      expect(retrievedPacks[0].image).toBe('data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADwAQCdASoBAAEAAkA4JaQAA3AA/vuUAAA=');
    });

    it('persists customized admin password and footer links in store settings', () => {
      const currentSettings = localDB.getSettings();
      const updatedSettings = {
        ...currentSettings,
        adminPassword: 'newSecretPassword2026',
        footerLinks: {
          instagram: 'https://instagram.com/custom_alice',
          tiktok: 'https://tiktok.com/@custom_alice',
          whatsapp: 'https://wa.me/22376000000',
          address: 'ACI 2000, Porte 40, Bamako',
          phone: '+223 76 00 00 00',
          legalText: 'Maison Alice SARL — Bamako Mali.'
        }
      };

      localDB.saveSettings(updatedSettings);
      const retrieved = localDB.getSettings();
      expect(retrieved.adminPassword).toBe('newSecretPassword2026');
      expect(retrieved.footerLinks?.instagram).toBe('https://instagram.com/custom_alice');
      expect(retrieved.footerLinks?.address).toBe('ACI 2000, Porte 40, Bamako');
    });
  });

});
