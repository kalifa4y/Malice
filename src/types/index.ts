export type ThemePeriod = 'cheshire_night' | 'mad_hatter_day' | 'queen_of_hearts_evening';

export type CardSuit = 'spade' | 'club' | 'heart' | 'diamond';

export interface ThemeConfig {
  id: ThemePeriod;
  name: string;
  subName: string;
  character: string;
  timeRange: string;
  startHour: number;
  endHour: number;
  assetImage: string;
  cardSuit: CardSuit;
  cardSuitSymbol: string;
  titleFontClass: string;
  titleFontName: string;
  bodyFontClass: string;
  bodyFontName: string;
  colors: {
    bg: string;
    bgTranslucent: string;
    surface: string;
    surfaceHover: string;
    border: string;
    primary: string;
    primaryHover: string;
    primaryGlow: string;
    accent: string;
    gold: string;
    goldGlow: string;
    text: string;
    textMuted: string;
  };
}

export type PaymentMethod = 'orange_money' | 'wave' | 'moov_money';

export type OrderStatus = 
  | 'pending_payment' 
  | 'confirmed' 
  | 'preparing' 
  | 'shipping' 
  | 'delivered' 
  | 'cancelled';

export interface Pack {
  id: string;
  slug: 'normal' | 'premium' | 'seasonal';
  name: string;
  tagline: string;
  description: string;
  price: number; // in FCFA
  badge?: string;
  isActive: boolean;
  image: string;
  contents: string[];
  features: string[];
}

export interface DeliveryZone {
  id: string;
  name: string;
  riverSide: 'rive_gauche' | 'rive_droite' | 'peripherie';
  fee: number; // in FCFA
  estimatedHours: number;
  isActive: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  packId: string;
  packName: string;
  packPrice: number;
  deliveryZoneId: string;
  deliveryZoneName: string;
  deliveryAddress: string;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface FooterLinks {
  instagram?: string;
  tiktok?: string;
  whatsapp?: string;
  facebook?: string;
  address?: string;
  phone?: string;
  legalText?: string;
}

export interface StoreSettings {
  merchantPhones: {
    orange_money: { number: string; name: string };
    wave: { number: string; name: string };
    moov_money: { number: string; name: string };
  };
  whatsappNotificationNumber: string;
  siteNotice?: string;
  currency: string;
  adminPassword?: string;
  footerLinks?: FooterLinks;
}
