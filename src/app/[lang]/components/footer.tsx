"use client";

import Image from "next/image";
import Link from "next/link";
import { getTranslation } from '@/lib/i18n/getTranslation';
import { type Language } from '@/lib/i18n/setting';

// Types pour les liens du footer
type FooterLink = {
  href: string;
  labelKey: keyof ReturnType<typeof getTranslation>["footer"]["links"];
};

// Types pour les props du Footer
type FooterProps = {
  className?: string;
  lang: Language;
};

// Configuration des liens (utilisant des clés pour les traductions)
const footerLinks: FooterLink[] = [
  { href: "/legal", labelKey: "legalNotice" },
  { href: "/privacy", labelKey: "privacy" },
];

const Footer = ({ className = "", lang }: FooterProps) => {
  const t = getTranslation(lang);
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className={`w-full max-w-[1576px] mx-auto border-t border-[#A8A8A8]/30 backdrop-blur-sm px-4 sm:px-8 py-4 sm:py-6 lg:py-8 ${className}`}
      role="contentinfo"
      aria-label={t.footer.ariaLabel}
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-0">
        {/* Logo et copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
          <Link href={`/${lang}`} aria-label={t.footer.homeAriaLabel} className="group">
            <Image 
              src="/images/branding/wholikeme-desktop-logo.webp" 
              alt={t.footer.logoAlt}
              width={79} 
              height={24}
              className="transform group-hover:scale-105 transition-all duration-200 ease-out"
              loading="lazy"
              quality={90}
            />
          </Link>
          <span className="text-white/90 text-xs sm:text-sm font-light">
            © {currentYear} WhoLikeMe
          </span>
        </div>

        {/* Navigation */}
        <nav 
          className="flex flex-wrap justify-center lg:justify-end items-center gap-1 sm:gap-3 lg:gap-6"
          aria-label={t.footer.navAriaLabel}
        >
          {footerLinks.map(({ href, labelKey }, index) => (
            <div key={href} className="flex items-center">
              <Link
                href={`/${lang}${href}`}
                className="text-white/80 hover:text-[#FF4F81] text-xs sm:text-sm font-medium tracking-wide transition-all duration-200 ease-out hover:underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-[#FF4F81]/50 focus:ring-offset-2 focus:ring-offset-[#1C1F3F] rounded-sm px-2 py-1"
              >
                {t.footer.links[labelKey]}
              </Link>
              {/* Séparateur */}
              {index < footerLinks.length - 1 && (
                <span className="text-white/40 mx-1 sm:mx-2 text-xs hidden sm:inline">
                  •
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;