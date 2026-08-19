import React from 'react';
import { ThemeConfig, StoreSettings } from '../../types';
import { Lock, MessageCircle, MapPin, Phone } from 'lucide-react';
import { Logo } from '../ui/Logo';

const InstagramIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface FooterProps {
  currentTheme: ThemeConfig;
  settings?: StoreSettings;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin }) => {
  const footerLinks = settings?.footerLinks;
  const instagramUrl = footerLinks?.instagram || 'https://instagram.com/maisonalice_bamako';
  const tiktokUrl = footerLinks?.tiktok || 'https://tiktok.com/@maisonalice';
  const whatsappUrl = footerLinks?.whatsapp || `https://wa.me/${(settings?.whatsappNotificationNumber || '22370000000').replace(/[^0-9]/g, '')}`;
  const facebookUrl = footerLinks?.facebook;
  const address = footerLinks?.address || 'ACI 2000, Bamako - Mali';
  const phone = footerLinks?.phone || settings?.whatsappNotificationNumber || '+223 70 00 00 00';
  const legalText = footerLinks?.legalText || 'Maison Alice Bamako.';

  return (
    <footer className="relative border-t border-theme-border/20 bg-transparent pt-12 pb-8 px-8 z-10 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-theme-text-muted">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Left Side: Logo and copy */}
        <div className="flex items-center gap-6">
          <Logo size="xs" className="opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
          <div className="flex flex-col space-y-0.5">
            <span>// Copyright © {new Date().getFullYear()}</span>
            <span className="font-bold text-theme-text">{legalText}</span>
            <span className="text-[9px] opacity-75">All Rights Reserved.</span>
          </div>
        </div>

        {/* Center Side: Address & Direct Contact */}
        {(address || phone) && (
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left text-theme-text-muted/80 text-[11px]">
            {address && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-theme-primary opacity-70" />
                <span>{address}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-theme-gold opacity-70" />
                <span>{phone}</span>
              </div>
            )}
          </div>
        )}

        {/* Right Side: Dynamic Social Links & Admin Access */}
        <div className="flex items-center gap-6 md:gap-8">
          {instagramUrl && (
            <a 
              href={instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <InstagramIcon className="w-3 h-3" />
              <span>Instagram</span>
            </a>
          )}
          {tiktokUrl && (
            <a 
              href={tiktokUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors cursor-pointer"
            >
              TikTok
            </a>
          )}
          {facebookUrl && (
            <a 
              href={facebookUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Facebook
            </a>
          )}
          {whatsappUrl && (
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-emerald-400/90 hover:text-emerald-300"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
          )}

          {/* Admin Access Button */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-theme-border/40 hover:border-theme-primary hover:text-white transition-colors cursor-pointer bg-theme-surface/30"
          >
            <Lock className="w-3 h-3 text-theme-primary" />
            <span>Admin</span>
          </button>
        </div>

      </div>
    </footer>
  );
};
