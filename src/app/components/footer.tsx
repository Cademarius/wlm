"use client";

import Image from "next/image";
import Link from "next/link";

// Types pour les liens du footer
type FooterLink = {
  href: string;
  label: string;
};

// Configuration des liens
const footerLinks: FooterLink[] = [
  { href: "/terms", label: "Termes & Conditions" },
  { href: "/legal", label: "Mentions légales" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="w-full max-w-[1576px] mx-auto border-t border-[#A8A8A8] px-4 sm:px-8 py-6 sm:py-8"
      role="contentinfo"
      aria-label="Pied de page du site"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center">
          <Link href="/" aria-label="Retour à l'accueil">
            <Image 
              src="/images/branding/wholikeme-desktop-logo.webp" 
              alt="Logo WhoLikeMe"
              width={79} 
              height={24}
              className="transform hover:scale-105 transition-transform"
              loading="lazy"
              quality={90}
            />
          </Link>
          <span className="text-white text-sm ml-2">
            © {currentYear} WhoLikeMe
          </span>
        </div>

        <nav 
          className="text-white text-sm font-medium tracking-wide flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-0"
          aria-label="Navigation du pied de page"
        >
          {footerLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="hover:underline whitespace-nowrap transition-colors hover:text-[#FF4F81] focus:outline-none focus:ring-2 focus:ring-[#FF4F81] rounded-sm"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;