import React from 'react';
import { ThemeConfig, StoreSettings } from '../../types';
import { MessageCircle, Phone } from 'lucide-react';
import { Logo } from '../ui/Logo';

const InstagramIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface FooterProps {
  currentTheme: ThemeConfig;
  settings?: StoreSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const footerLinks = settings?.footerLinks;
  const instagramUrl = footerLinks?.instagram || 'https://instagram.com/maisonalice_bamako';
  const tiktokUrl = footerLinks?.tiktok || 'https://tiktok.com/@maisonalice';
  const whatsappUrl =
    footerLinks?.whatsapp ||
    `https://wa.me/${(settings?.whatsappNotificationNumber || '22371039647').replace(/[^0-9]/g, '')}`;
  const facebookUrl = footerLinks?.facebook;
  const phone = footerLinks?.phone || settings?.whatsappNotificationNumber || '+223 71 03 96 47';
  const brandTitle = (footerLinks?.legalText || 'Maison Alice')
    .replace(/\bSARL\b/gi, '')
    .replace(/[—\-•]\s*Bamako\.?/gi, '')
    .trim() || 'Maison Alice';

  return (
    <footer className="relative border-t border-white/10 bg-black/50 backdrop-blur-xl pt-12 pb-10 px-6 sm:px-8 z-10 text-xs text-theme-text-muted">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Gauche : Logo & Marque */}
        <div className="flex items-center gap-5">
          <Logo
            size="xs"
            className="opacity-85 hover:opacity-100 transition-opacity duration-300"
          />
          <div className="flex flex-col space-y-1">
            <span className="font-serif text-base font-bold text-theme-text">{brandTitle}</span>
            <span className="text-[11px] text-theme-text-muted">
              © {new Date().getFullYear()} Maison Alice • Chocolats &amp; Coffrets Cadeaux.
            </span>
          </div>
        </div>

        {/* Centre : Numéro de téléphone */}
        {phone && (
          <div className="flex items-center gap-4 text-center sm:text-left text-theme-text-muted text-xs">
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 hover:text-theme-gold transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-theme-primary flex-shrink-0" />
              <span className="font-mono">{phone}</span>
            </a>
          </div>
        )}

        {/* Droite : Réseaux sociaux & WhatsApp */}
        <div className="flex flex-wrap items-center justify-center gap-5">
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-theme-gold" />
              <span>Instagram</span>
            </a>
          )}
          {tiktokUrl && (
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              TikTok
            </a>
          )}
          {facebookUrl && (
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Facebook
            </a>
          )}
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition-colors flex items-center gap-1.5 font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};
