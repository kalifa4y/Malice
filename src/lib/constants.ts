import { ThemeConfig, Pack, DeliveryZone, StoreSettings } from '../types';

export const THEMES: Record<string, ThemeConfig> = {
  mad_hatter_day: {
    id: 'mad_hatter_day',
    name: 'Royaume de Marmoreal',
    subName: "Le Monde Éveillé • Reine Blanche & Jardin d'Absolem",
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
    subName: 'Le Monde de la Nuit • Tarrant Hightopp & Cheshire',
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
    subName: 'Le Royaume Écarlate • Reine Rouge Iracebeth',
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
    tagline: 'Upelkuchen « Mange-Moi » & Douceurs du Monde Éveillé',
    description:
      "Inspiré du palais d'albâtre de la Reine Blanche Mirana. Un coffret rigide doré à chaud réunissant biscuits « Upelkuchen », chocolats grands crus stabilisés pour le climat de Bamako et la clé dorée qui ouvre les portes d'Underland.",
    price: 15000,
    badge: 'Royaume de Marmoreal',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=900&q=80',
    contents: [
      'Sablés royaux « Upelkuchen » (Mange-Moi) pur beurre & vanille bourbon (150g)',
      'Dragées fines au chocolat noir grand cru 70% stabilisé (120g)',
      'Perles gélifiées aux élixirs de fruits exotiques (100g)',
      "Clé dorée du Terrier d'Underland en laiton poli",
      'Écrin rigide doré à chaud façon grimoire de Marmoreal'
    ],
    features: [
      'Chocolats stabilisés haute tenue pour le climat de Bamako',
      'Parchemin calligraphié « Mange-Moi » personnalisable',
      'Livraison isotherme gratuite sur les deux rives'
    ]
  },
  {
    id: 'pack-premium',
    slug: 'premium',
    name: 'Le Banquet 10/6 du Chapelier Fou',
    tagline: 'Table de Tarrant Hightopp • Haute Confiserie d’Underland',
    description:
      "L'écrin magistral de Tarrant Hightopp (le Chapelier Fou). Six créations impossibles avant le petit-déjeuner : pralinés grands crus, calissons royaux, fiole d'élixir « Pishsalver » (Bois-Moi) et montre Chronosphère dorée.",
    price: 25000,
    badge: 'Signature 10/6 • Best-Seller',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=900&q=80',
    contents: [
      "Pralinés & ganaches d'exception de la Table du Thé (250g)",
      "Véritables Calissons royaux aux amandes douces (150g)",
      'Nougat fondant du Bois de Tulgey au miel & pistaches (120g)',
      'Pâtes de fruits impériales cassis, framboise et mangue (100g)',
      'Fiole « Pishsalver » (Bois-Moi) garnie de perles sucrées dorées',
      "Montre à gousset dorée Chronosphère & carte officielle 10/6 du Chapelier",
      "Grand coffret d'apparat gaufré or et ruban cuivre scellé"
    ],
    features: [
      'Expérience complète inspirée du banquet de Tarrant Hightopp',
      'Livraison VIP gratuite en sac isotherme sécurisé à Bamako',
      'Lettre parchemin de l’Oraculum scellée à la cire d’or'
    ]
  },
  {
    id: 'pack-seasonal',
    slug: 'seasonal',
    name: 'Le Décret de Salazen Grum',
    tagline: 'Cour de la Reine Rouge • Roses Peintes & Cœurs Rubis',
    description:
      "Forgé pour la cour d'Iracebeth à Salazen Grum. Cœurs en glaçage rubis, truffes poudrées au cacao d'Afrique de l'Ouest, guimauves telles des roses blanches peintes en rouge et sceau royal cacheté à la main.",
    price: 20000,
    badge: 'Cour Écarlate • Série Limitée',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=900&q=80',
    contents: [
      'Cœurs fondants glaçage rubis & framboise de Salazen Grum (180g)',
      "Guimauves « Roses Blanches Peintes en Rouge » à la fleur d'oranger (100g)",
      "Truffes noires au cacao grand cru d'Afrique de l'Ouest (120g)",
      "Carte Soldat officielle dorée de la Cour d'Iracebeth",
      'Sceau de cire rouge sang cacheté à la main'
    ],
    features: [
      'Édition collector disponible en série limitée à Bamako',
      'Esthétique gothique-royale de la Cour de Salazen Grum',
      'Déballage théâtral avec carte personnalisée'
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
  siteNotice: 'Livraison express offerte partout à Bamako 7j/7 dans nos sacs isothermes sécurisés.',
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
