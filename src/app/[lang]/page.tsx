"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
// import { use } from "react";
import { getTranslation } from '@/lib/i18n/getTranslation';
import { type Language } from '@/lib/i18n/setting';
import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './components/AuthGuard';

// Constants d'animation
const ANIMATION_CONFIG = {
  transition: { 
    duration: 2, 
    repeat: Infinity, 
    ease: "easeInOut" as const,
    repeatType: "mirror" as const
  }
};

import { Heart } from "lucide-react";

export default function Page({ params }: { params: Promise<{ lang: Language }> }) {
  const resolvedParams = use(params);
  const t = getTranslation(resolvedParams.lang);
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Un utilisateur connecté va directement dans l'app (pas de page marketing)
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(`/${resolvedParams.lang}/feed`);
    }
  }, [isLoading, isAuthenticated, resolvedParams.lang, router]);

  // Évite le "flash" de la page marketing pour un utilisateur déjà connecté
  if (isLoading || isAuthenticated) return null;

  return (
    <div
      className="relative flex flex-col min-h-screen"
      role="main"
      aria-label={t.home.pageAriaLabel}
    >
      {/* Background optimisé avec Next.js Image - Lazy loading stratégique */}
  <div className="fixed inset-0 -z-10 bg-linear-to-br from-[#1a1d3f] via-[#2a2d5f] to-[#1a1d3f]">
        <Image
          src="/images/ui/background.webp"
          alt="Background"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover opacity-0 animate-[fadeIn_0.6s_ease-in_0.1s_forwards]"
          placeholder="blur"
          blurDataURL="data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA="
        />
        {/* Gradient overlay pour améliorer le contraste et la lisibilité */}
  <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* Safe area pour PWA iOS/Android */}
      <div className="h-[env(safe-area-inset-top)]" />
      
      {/* Header - Logo optimisé pour mobile */}
  <header className="shrink-0 pt-6 pb-4 sm:pt-8 md:pt-10 px-4 flex justify-center z-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <Image
            src="/icon.svg"
            alt="WLM"
            width={56}
            height={56}
            className="h-12 w-12 sm:h-14 sm:w-14"
            priority
          />
          <span className="text-4xl sm:text-5xl font-extrabold wlm-gradient-text tracking-tight">
            WLM
          </span>
        </motion.div>
      </header>

      {/* Décorations modernes : halos dégradés + cœurs subtils */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <motion.div
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#FF5C8A]/25 blur-3xl"
          animate={{ y: [0, 24, 0], scale: [1, 1.1, 1] }}
          transition={{ ...ANIMATION_CONFIG.transition, duration: 5 }}
        />
        <motion.div
          className="absolute top-1/3 -right-28 w-80 h-80 rounded-full bg-[#B14DFF]/25 blur-3xl"
          animate={{ y: [0, -28, 0] }}
          transition={{ ...ANIMATION_CONFIG.transition, duration: 6 }}
        />
        <motion.div
          className="absolute -bottom-20 left-1/4 w-64 h-64 rounded-full bg-[#FF5C8A]/20 blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ ...ANIMATION_CONFIG.transition, duration: 7 }}
        />
        <motion.div
          className="absolute top-[16%] left-[8%] text-white/15"
          animate={{ y: [0, -12, 0] }}
          transition={{ ...ANIMATION_CONFIG.transition, duration: 4 }}
        >
          <Heart size={34} className="fill-current" />
        </motion.div>
        <motion.div
          className="absolute bottom-[20%] right-[10%] text-white/15"
          animate={{ y: [0, 12, 0], rotate: [-6, 6, -6] }}
          transition={{ ...ANIMATION_CONFIG.transition, duration: 5 }}
        >
          <Heart size={44} className="fill-current" />
        </motion.div>
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
          <h1 className="text-white font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-wide drop-shadow-lg px-2">
            Qui <span className="wlm-gradient-text">t&apos;aime en secret</span> ?
          </h1>

          {/* Description */}
          <p className="text-white/95 font-medium text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed tracking-wide max-w-2xl mx-auto drop-shadow-md px-4">
            Ajoute en secret les personnes que tu aimes. Si c&apos;est réciproque,
            c&apos;est révélé 💘 Sinon, ça reste ton secret.
          </p>
          
          {/* CTA Button - plus proéminent sur mobile */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pt-2 sm:pt-4"
          >
            <Link href={`/${resolvedParams.lang}/addcrush`} className="inline-block">
              <button
                className="wlm-btn-gradient wlm-glow hover:brightness-110 transition-all duration-200 text-white font-semibold text-base sm:text-lg md:text-xl px-8 py-3.5 sm:px-10 sm:py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/30 cursor-pointer w-full sm:w-auto min-w-[200px] sm:min-w-60"
                aria-label={t.home.buttonAriaLabel}
              >
                Commencer
              </button>
            </Link>
          </motion.div>

          {/* Réassurance */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
            {["🔒 100% secret", "📱 Par numéro", "💘 Réciproque"].map((c) => (
              <span
                key={c}
                className="wlm-glass text-white/90 text-xs sm:text-sm px-4 py-2 rounded-full"
              >
                {c}
              </span>
            ))}
          </div>

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
  <div className="h-[env(safe-area-inset-bottom)] shrink-0" />
    </div>
  );
}