"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { use } from "react";
import { getTranslation } from '@/lib/i18n/getTranslation';
import { type Language } from '@/lib/i18n/setting';

// Constants d'animation
const ANIMATION_CONFIG = {
  transition: { 
    duration: 2, 
    repeat: Infinity, 
    ease: "easeInOut" as const,
    repeatType: "mirror" as const
  }
};

import type { TargetAndTransition } from "framer-motion";

// Types pour les illustrations
type Illustration = {
  src: string;
  alt: string;
  styles: string;
  width: number;
  height: number;
  animation: TargetAndTransition;
};

// Configuration des illustrations
const illustrations: Illustration[] = [
  { 
    src: "/images/ui/top-left-illustration.webp",
    alt: "Illustration Haut Gauche",
    styles: "top-[14%] left-[5%] md:left-[10%] lg:left-[12%] xl:left-[15%]",
    width: 220,
    height: 220,
    animation: { 
      scale: [1, 1.05, 1],
      y: [0, -10, 0]
    }
  },
  { 
    src: "/images/ui/top-right-illustration.webp",
    alt: "Illustration Haut Droite",
    styles: "top-[14%] right-[5%] md:right-[10%] lg:right-[12%] xl:right-[15%]",
    width: 220,
    height: 220,
    animation: { 
      scale: [1, 1.05, 1],
      y: [0, 10, 0]
    }
  },
  { 
    src: "/images/ui/bottom-left-illustration.webp",
    alt: "Illustration Bas Gauche",
    styles: "bottom-[25%] left-[5%] md:left-[10%] lg:left-[12%] xl:left-[15%]",
    width: 220,
    height: 220,
    animation: { 
      scale: [1, 1.1, 1]
    }
  },
  { 
    src: "/images/ui/bottom-right-illustration.webp",
    alt: "Illustration Bas Droite",
    styles: "bottom-[25%] right-[5%] md:right-[10%] lg:right-[12%] xl:right-[15%]",
    width: 220,
    height: 220,
    animation: { 
      rotate: [-5, 5, -5]
    }
  }
];

export default function HomePage({ params }: { params: Promise<{ lang: Language }> }) {
  const resolvedParams = use(params);
  const t = getTranslation(resolvedParams.lang);

  return (
    <div
      className="relative flex flex-col min-h-screen bg-cover bg-center"
      style={{ 
        backgroundImage: "url('/images/ui/background.webp')",
        contain: "paint"
      }}
      role="main"
      aria-label={t.home.pageAriaLabel}
    >
      {/* Safe area pour PWA iOS/Android */}
      <div className="h-[env(safe-area-inset-top)]" />
      
      {/* Header - Logo optimisé pour mobile */}
      <header className="flex-shrink-0 pt-6 pb-4 sm:pt-8 md:pt-10 px-4 flex justify-center z-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-32 sm:w-40 md:w-48 lg:w-52"
        >
          <Image
            src="/images/branding/wholikeme-desktop-logo.webp"
            alt={t.home.logoAlt}
            width={211}
            height={100}
            priority
            loading="eager"
            fetchPriority="high"
            quality={90}
            className="w-full h-auto"
          />
        </motion.div>
      </header>

      {/* Illustrations d'arrière-plan */}
      <div className="absolute inset-0 pointer-events-none z-10" aria-hidden="true">
        {illustrations.map(({ src, alt, styles, animation, width, height }, index) => {
          // Les 2 premières (top-left et top-right) visibles sur mobile, les 2 autres cachées
          const isTopIllustration = index < 2;
          const mobileVisibilityClass = isTopIllustration ? 'block' : 'hidden sm:block';
          
          return (
            <motion.div
              key={index}
              className={`absolute ${styles} ${mobileVisibilityClass}`}
              animate={animation}
              transition={ANIMATION_CONFIG.transition}
              style={{
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'translate3d(0, 0, 0)',
              }}
            >
              <div className={`relative ${
                isTopIllustration 
                  ? 'w-[18vw] sm:w-[14vw] md:w-[12vw] lg:w-[10vw] max-w-[160px] min-w-[70px]'
                  : 'w-[16vw] sm:w-[14vw] md:w-[12vw] lg:w-[10vw] max-w-[180px] min-w-[80px]'
              } aspect-square opacity-70 sm:opacity-80 md:opacity-100`}>
                <Image 
                  src={src} 
                  alt={alt} 
                  width={width}
                  height={height}
                  className="object-contain w-full h-full"
                  priority={index < 2}
                  loading={index < 2 ? "eager" : "lazy"}
                  quality={75}
                  style={{
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Contenu principal - optimisé pour mobile */}
      <main className="relative z-20 flex flex-col items-center justify-center flex-1 text-center px-4 sm:px-6 md:px-8 w-full max-w-4xl mx-auto pb-safe">
        <motion.div 
          className="space-y-4 sm:space-y-6 md:space-y-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Titre principal */}
          <h1 className="text-white font-bold font-poppins text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-wide drop-shadow-lg px-2 antialiased">
            {t.home.title}
          </h1>
          
          {/* Description */}
          <p className="text-white/95 font-medium font-poppins text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed tracking-wide max-w-2xl mx-auto drop-shadow-md px-4 antialiased">
            {t.home.description}
          </p>
          
          {/* CTA Button - plus proéminent sur mobile */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pt-2 sm:pt-4"
          >
            <Link href={`/${resolvedParams.lang}/addcrush`} className="inline-block">
              <button
                className="bg-[#FF4F81] hover:bg-[#e04370] active:bg-[#d03d64] transition-all duration-200 text-white font-semibold text-base sm:text-lg md:text-xl px-8 py-3.5 sm:px-10 sm:py-4 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30 cursor-pointer w-full sm:w-auto min-w-[200px] sm:min-w-[240px]"
                aria-label={t.home.buttonAriaLabel}
              >
                {t.home.buttonText}
              </button>
            </Link>
          </motion.div>

          {/* Indicateur subtil pour scroller (optionnel) */}
          <motion.div
            className="pt-6 sm:pt-8 md:hidden"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-6 h-10 border-2 border-white/40 rounded-full mx-auto flex items-start justify-center p-2">
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Safe area pour barre de navigation PWA */}
      <div className="h-[env(safe-area-inset-bottom)] flex-shrink-0" />
    </div>
  );
}