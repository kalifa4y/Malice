import { ThemeConfig, Pack, DeliveryZone, StoreSettings } from '../types';

export const THEMES: Record<string, ThemeConfig> = {
  mad_hatter_day: {
    id: 'mad_hatter_day',
    name: 'Royaume de Marmoreal',
    subName: 'Le Monde Éveillé • Reine Blanche',
    character: 'Marmoreal • Monde Éveillé',
    timeRange: '08h00 — 16h00',
    startHour: 8,
    endHour: 16,
    assetImage: '/assets/hatter.jpg',
    cardSuit: 'club',
    cardSuitSymbol: '♣',
    titleFontClass: 'font-neogen',
    titleFontName: 'Cormorant Garamond',
    bodyFontClass: 'font-manrope',
    bodyFontName: 'Plus Jakarta Sans',
    colors: {
      bg: '#160f24',
      bgTranslucent: 'rgba(22, 15, 36, 0.88)',
      surface: '#231838',
      surfaceHover: '#2f204a',
      border: 'rgba(235, 200, 107, 0.34)',
      primary: '#d93870',
      primaryHover: '#ec5387',
      primaryGlow: 'rgba(217, 56, 112, 0.42)',
      accent: '#c4b5fd',
      gold: '#ebc86b',
      goldGlow: 'rgba(235, 200, 107, 0.4)',
      text: '#faf5ff',
      textMuted: '#c8b6dc',
    }
  },
  cheshire_night: {
    id: 'cheshire_night',
    name: 'Bois de Tulgey • 10/6',
    subName: 'Le Monde de la Nuit • Chapelier Fou',
    character: 'Bois de Tulgey • Nuit 10/6',
    timeRange: '00h00 — 08h00',
    startHour: 0,
    endHour: 8,
    assetImage: '/assets/cat.webp',
    cardSuit: 'spade',
    cardSuitSymbol: '♠',
    titleFontClass: 'font-metroway',
    titleFontName: 'Cormorant Garamond',
    bodyFontClass: 'font-google-sans',
    bodyFontName: 'Plus Jakarta Sans',
    colors: {
      bg: '#061318',
      bgTranslucent: 'rgba(6, 19, 24, 0.88)',
      surface: '#0c222b',
      surfaceHover: '#13313d',
      border: 'rgba(229, 154, 56, 0.32)',
      primary: '#18b8a6',
      primaryHover: '#2dd4bf',
      primaryGlow: 'rgba(24, 184, 166, 0.42)',
      accent: '#e07828',
      gold: '#e59a38',
      goldGlow: 'rgba(229, 154, 56, 0.4)',
      text: '#eefaf8',
      textMuted: '#94bbb6',
    }
  },
  queen_of_hearts_evening: {
    id: 'queen_of_hearts_evening',
    name: 'Cour de Salazen Grum',
    subName: 'Le Royaume Écarlate • Reine Rouge',
    character: 'Salazen Grum • Cour Rouge',
    timeRange: '16h00 — 00h00',
    startHour: 16,
    endHour: 24,
    assetImage: '/assets/reine coeur.png',
    cardSuit: 'heart',
    cardSuitSymbol: '♥',
    titleFontClass: 'font-perfect-girl',
    titleFontName: 'Cormorant Garamond',
    bodyFontClass: 'font-figtree',
    bodyFontName: 'Plus Jakarta Sans',
    colors: {
      bg: '#130508',
      bgTranslucent: 'rgba(19, 5, 8, 0.88)',
      surface: '#240910',
      surfaceHover: '#330d17',
      border: 'rgba(220, 30, 53, 0.34)',
      primary: '#dc1e35',
      primaryHover: '#f23047',
      primaryGlow: 'rgba(220, 30, 53, 0.45)',
      accent: '#f59e0b',
      gold: '#dfb742',
      goldGlow: 'rgba(223, 183, 66, 0.4)',
      text: '#fdf2f4',
      textMuted: '#cfa3ac',
    }
  }
};

export const INITIAL_PACKS: Pack[] = [
  {
    id: 'pack-normal',
    slug: 'normal',
    name: "L'Écrin de Marmoreal",
    tagline: 'Royaume Blanc • 5 Créations',
    description: 'Sablés « Mange-Moi », chocolats 70% et Clé d’Or d’Underland.',
    price: 15000,
    badge: 'Marmoreal',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=900&q=80',
    contents: [
      'Sablés « Mange-Moi » (150g)',
      'Dragées Chocolat 70% (120g)',
      'Perles Fruits Exotiques (100g)',
      "Clé d'Or d'Underland",
      'Carte Scellée à la Cire'
    ],
    features: [
      'Tenue Tropicale',
      'Livraison Offerte'
    ]
  },
  {
    id: 'pack-premium',
    slug: 'premium',
    name: 'Le Banquet 10/6 du Chapelier',
    tagline: 'Table de Tarrant • 7 Créations',
    description: 'Pralinés, calissons, Fiole « Bois-Moi » et Montre Chronosphère.',
    price: 25000,
    badge: 'Signature 10/6',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=900&q=80',
    contents: [
      'Pralinés & Ganaches (250g)',
      'Calissons aux Amandes (150g)',
      'Nougat Miel & Pistache (120g)',
      'Fiole « Bois-Moi » Sucrée',
      'Montre Or Chronosphère',
      'Carte Officielle 10/6',
      'Grand Coffret Doré à Chaud'
    ],
    features: [
      'Coffret Prestige',
      'Livraison VIP Offerte'
    ]
  },
  {
    id: 'pack-seasonal',
    slug: 'seasonal',
    name: 'Le Décret de Salazen Grum',
    tagline: 'Cour Écarlate • 5 Créations',
    description: 'Cœurs rubis, truffes grand cru et Roses Blanches Peintes.',
    price: 20000,
    badge: 'Cour Rouge',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=900&q=80',
    contents: [
      'Cœurs Glaçage Rubis (180g)',
      'Guimauves Roses Peintes (100g)',
      'Truffes Cacao Noir (120g)',
      'Carte Soldat Dorée',
      'Sceau de Cire Rouge Sang'
    ],
    features: [
      'Série Limitée',
      'Livraison Offerte'
    ]
  }
];

export const BAMAKO_DELIVERY_ZONES: DeliveryZone[] = [
  { id: 'zone-1', name: 'ACI 2000 / Hamdallaye', riverSide: 'rive_gauche', fee: 1500, estimatedHours: 3, isActive: true },
  { id: 'zone-2', name: 'Badalabougou / Quartier du Fleuve', riverSide: 'rive_droite', fee: 1500, estimatedHours: 3, isActive: true },
  { id: 'zone-3', name: 'Hippodrome / Quinzambougou / Korofina', riverSide: 'rive_gauche', fee: 2000, estimatedHours: 4, isActive: true },
  { id: 'zone-4', name: 'Bacodjicoroni / Golf / Torokorobougou', riverSide: 'rive_droite', fee: 2000, estimatedHours: 4, isActive: true },
  { id: 'zone-5', name: 'Kalaban Coura / Daoudabougou / Faladié', riverSide: 'rive_droite', fee: 2000, estimatedHours: 4, isActive: true },
  { id: 'zone-6', name: 'Yirimadio / Niamana / Missabougou', riverSide: 'rive_droite', fee: 2500, estimatedHours: 5, isActive: true },
  { id: 'zone-7', name: 'Sebenikoro / Djicoroni Para / Lafiabougou', riverSide: 'rive_gauche', fee: 2500, estimatedHours: 5, isActive: true },
  { id: 'zone-8', name: 'Sotuba / Moribabougou (Périphérie)', riverSide: 'peripherie', fee: 3500, estimatedHours: 6, isActive: true },
];

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  merchantPhones: {
    orange_money: { number: '+223 70 00 00 00', name: 'Maison Alice SARL' },
    wave: { number: '+223 70 00 00 00', name: 'Maison Alice SARL' },
    moov_money: { number: '+223 60 00 00 00', name: 'Maison Alice SARL' },
  },
  whatsappNotificationNumber: '+223 70 00 00 00',
  siteNotice: 'Livraison offerte à Bamako 7j/7.',
  currency: 'FCFA',
  adminEmail: '',
  adminPassword: 'admin',
  adminRecoveryKey: '',
  isAdminRegistered: false,
  footerLinks: {
    instagram: 'https://instagram.com/maisonalice_bamako',
    tiktok: 'https://tiktok.com/@maisonalice',
    whatsapp: 'https://wa.me/22370000000',
    facebook: 'https://facebook.com/maisonalice',
    address: 'ACI 2000, Bamako - Mali',
    phone: '+223 70 00 00 00',
    legalText: 'Maison Alice SARL — Bamako.'
  }
};
