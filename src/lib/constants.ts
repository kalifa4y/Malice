import { ThemeConfig, Pack, DeliveryZone, StoreSettings } from '../types';

export const THEMES: Record<string, ThemeConfig> = {
  cheshire_night: {
    id: 'cheshire_night',
    name: 'Nuit Mystique',
    subName: 'Le Chat du Cheshire',
    character: 'Chat du Cheshire',
    timeRange: '00h00 — 08h00',
    startHour: 0,
    endHour: 8,
    assetImage: '/assets/cat.webp',
    cardSuit: 'spade',
    cardSuitSymbol: '♠',
    titleFontClass: 'font-metroway',
    titleFontName: 'Metroway',
    bodyFontClass: 'font-google-sans',
    bodyFontName: 'Google Sans Flex',
    colors: {
      bg: '#090d16',
      bgTranslucent: 'rgba(9, 13, 22, 0.88)',
      surface: '#131b2a',
      surfaceHover: '#1c273c',
      border: 'rgba(0, 242, 254, 0.25)',
      primary: '#00f2fe',
      primaryHover: '#38f9d7',
      primaryGlow: 'rgba(0, 242, 254, 0.45)',
      accent: '#a78bfa',
      gold: '#f59e0b',
      goldGlow: 'rgba(245, 158, 11, 0.4)',
      text: '#f1f5f9',
      textMuted: '#94a3b8',
    }
  },
  mad_hatter_day: {
    id: 'mad_hatter_day',
    name: 'L\'Heure du Thé',
    subName: 'Le Chapelier Fou',
    character: 'Chapelier Fou',
    timeRange: '08h00 — 16h00',
    startHour: 8,
    endHour: 16,
    assetImage: '/assets/hatter.jpg',
    cardSuit: 'club',
    cardSuitSymbol: '♣',
    titleFontClass: 'font-neogen',
    titleFontName: 'Neogen',
    bodyFontClass: 'font-manrope',
    bodyFontName: 'Manrope',
    colors: {
      bg: '#142012',
      bgTranslucent: 'rgba(20, 32, 18, 0.88)',
      surface: '#1f331c',
      surfaceHover: '#2a4426',
      border: 'rgba(226, 88, 34, 0.3)',
      primary: '#e25822',
      primaryHover: '#ff7235',
      primaryGlow: 'rgba(226, 88, 34, 0.45)',
      accent: '#e06d63',
      gold: '#d4af37',
      goldGlow: 'rgba(212, 175, 55, 0.4)',
      text: '#fdfbf7',
      textMuted: '#a3b899',
    }
  },
  queen_of_hearts_evening: {
    id: 'queen_of_hearts_evening',
    name: 'Royauté Crépusculaire',
    subName: 'La Reine de Cœur',
    character: 'Reine de Cœur',
    timeRange: '16h00 — 00h00',
    startHour: 16,
    endHour: 24,
    assetImage: '/assets/reine coeur.png',
    cardSuit: 'heart',
    cardSuitSymbol: '♥',
    titleFontClass: 'font-perfect-girl',
    titleFontName: 'Perfect Girl Sans Serif',
    bodyFontClass: 'font-figtree',
    bodyFontName: 'Figtree',
    colors: {
      bg: '#12080f',
      bgTranslucent: 'rgba(18, 8, 15, 0.88)',
      surface: '#220e1d',
      surfaceHover: '#31152a',
      border: 'rgba(220, 20, 60, 0.3)',
      primary: '#dc143c',
      primaryHover: '#f42c54',
      primaryGlow: 'rgba(220, 20, 60, 0.45)',
      accent: '#4fc3f7',
      gold: '#ffd700',
      goldGlow: 'rgba(255, 215, 0, 0.4)',
      text: '#fff9fa',
      textMuted: '#b899a8',
    }
  }
};

export const INITIAL_PACKS: Pack[] = [
  {
    id: 'pack-normal',
    slug: 'normal',
    name: 'Le Coffret Alice',
    tagline: 'L\'Éveil des Sens & Douceurs Gourmandes',
    description: 'Une boîte rigide habillée de velours noir et ruban satin. Un assortiment délicat de friandises fines et chocolats stabilisés résistants à la chaleur tropicale de Bamako.',
    price: 15000,
    badge: 'Classique Raffiné',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80',
    contents: [
      'Sablés artisanaux pur beurre & vanille bourbon (150g)',
      'Dragées fines au chocolat noir grand cru 70% (120g)',
      'Bonbons gélifiés artisanaux aux extraits de fruits exotiques (100g)',
      'Clé dorée d\'Alice souvenir en laiton poli',
      'Boîte coffret luxe rigide dorée à chaud'
    ],
    features: [
      'Packaging rigide local confectionné avec soin',
      'Chocolats stabilisés pour le climat de Bamako',
      'Carte d\'invitation "Mange-moi" personnalisable'
    ]
  },
  {
    id: 'pack-premium',
    slug: 'premium',
    name: 'Le Coffret Royal du Chapelier',
    tagline: 'L\'Expérience Ultime de Haute Confiserie',
    description: 'Le joyau de Maison Alice. Une composition royale de chocolats prestigieux, nougats fins, calissons de Provence et accessoires de collection du Pays des Merveilles.',
    price: 25000,
    badge: '★ Best-Seller Prestige',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=800&q=80',
    contents: [
      'Chocolats pralinés & ganaches d\'exception enrobées (250g)',
      'Véritables Calissons d\'Aix aux amandes douces (150g)',
      'Nougat artisanal fondant au miel & pistaches (120g)',
      'Pâtes de fruits royales cassis, framboise et mangue (100g)',
      'Montre à gousset dorée décorative du Pays des Merveilles',
      'Fiole magique "Bois-moi" aux perles sucrées parfumées',
      'Grand coffret d\'apparat gaufré or avec ruban satin scellé'
    ],
    features: [
      'Le cadeau d\'exception pour surprendre et marquer les esprits',
      'Livraison VIP en sac isotherme sécurisé',
      'Carte manuscrite calligraphiée offerte'
    ]
  },
  {
    id: 'pack-seasonal',
    slug: 'seasonal',
    name: 'Le Coffret Éphémère de la Reine',
    tagline: 'Édition Spéciale & Créations de Saison',
    description: 'Une édition collector éphémère aux couleurs et saveurs de la fête du moment (Saint-Valentin, Fêtes de fin d\'année, Célébrations royales).',
    price: 20000,
    badge: '👑 Édition Limitée',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80',
    contents: [
      'Cœurs fondants au chocolat rubis & framboise (180g)',
      'Guimauves artisanales à la fleur d\'oranger (100g)',
      'Truffes poudrées au cacao d\'Afrique (120g)',
      'Carte à jouer dorée officielle de la Reine de Cœur',
      'Sceau de cire rouge cacheté à la main'
    ],
    features: [
      'Disponible en quantité ultra-limitée',
      'Thématique renouvelée à chaque temps fort de l\'année',
      'Effet déballage garanti sur TikTok et Instagram'
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
  siteNotice: 'Livraison express partout à Bamako 7j/7 dans nos sacs isothermes sécurisés.',
  currency: 'FCFA',
  adminPassword: 'admin',
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
