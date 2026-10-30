import { createClient } from '@supabase/supabase-js';
import { Order, Pack, DeliveryZone, StoreSettings } from '../types';
import { INITIAL_PACKS, BAMAKO_DELIVERY_ZONES, DEFAULT_STORE_SETTINGS } from './constants';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project.supabase.co'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local Persistence Fallback for offline, preview & demo
const STORAGE_KEYS = {
  ORDERS: 'maison_alice_orders',
  PACKS: 'maison_alice_packs_v2',
  ZONES: 'maison_alice_zones',
  SETTINGS: 'maison_alice_settings',
  ADMIN_SESSION: 'maison_alice_admin_auth'
};

export const localDB = {
  getOrders: (): Order[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (!data) {
        return [];
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveOrder: (order: Order): void => {
    const orders = localDB.getOrders();
    orders.unshift(order);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  updateOrderStatus: (orderId: string, status: Order['status']): void => {
    const orders = localDB.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index !== -1) {
      orders[index].status = status;
      orders[index].updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    }
  },

  getPacks: (): Pack[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PACKS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PACKS, JSON.stringify(INITIAL_PACKS));
        return INITIAL_PACKS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PACKS;
    }
  },

  savePacks: (packs: Pack[]): void => {
    localStorage.setItem(STORAGE_KEYS.PACKS, JSON.stringify(packs));
  },

  getZones: (): DeliveryZone[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ZONES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ZONES, JSON.stringify(BAMAKO_DELIVERY_ZONES));
        return BAMAKO_DELIVERY_ZONES;
      }
      return JSON.parse(data);
    } catch {
      return BAMAKO_DELIVERY_ZONES;
    }
  },

  saveZones: (zones: DeliveryZone[]): void => {
    localStorage.setItem(STORAGE_KEYS.ZONES, JSON.stringify(zones));
  },

  getSettings: (): StoreSettings => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_STORE_SETTINGS));
        return DEFAULT_STORE_SETTINGS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_STORE_SETTINGS;
    }
  },

  saveSettings: (settings: StoreSettings): void => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  isAdminLoggedIn: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
  },

  setAdminLoggedIn: (value: boolean): void => {
    if (value) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    }
  }
};
