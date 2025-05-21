"use client";

import dynamic from 'next/dynamic';
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

// Import dynamique des composants non-critiques
const Footer = dynamic(() => import("../app/components/footer"), {
  loading: () => <div className="h-16" />,
  ssr: false
});

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

export default function HomePage() {
  return (
    <div
      className="relative flex flex-col justify-between min-h-screen bg-cover bg-center"
      style={{ 
        backgroundImage: "url('/images/ui/background.webp')",
        contain: "paint"
      }}
      role="main"
      aria-label="Page d'accueil de WhoLikeMe"
    >
      <header className="absolute top-10 left-1/2 transform -translate-x-1/2 w-[15vw] max-w-[211px] min-w-[120px] z-20">
        <Image
          src="/images/branding/wholikeme-desktop-logo.webp"
          alt="Logo WhoLikeMe"
          width={211}
          height={100}
          priority
          loading="eager"
          fetchPriority="high"
          quality={90}
        />
      </header>

      <div className="absolute inset-0 pointer-events-none z-10" aria-hidden="true">
        {illustrations.map(({ src, alt, styles, animation, width, height }, index) => (
          <motion.div
            key={index}
            className={`absolute ${styles}`}
            animate={animation}
            transition={ANIMATION_CONFIG.transition}
          >
            <div className="relative w-[22vw] sm:w-[18vw] md:w-[14vw] lg:w-[12vw] xl:w-[10vw] max-w-[220px] min-w-[110px] aspect-square">
              <Image 
                src={src} 
                alt={alt} 
                width={width}
                height={height}
                className="object-contain w-full h-full"
                priority={index < 2}
                loading={index < 2 ? "eager" : "lazy"}
                quality={75}
              />
            </div>
          </motion.div>
        ))}
      </div>

    
      {/* Contenu principal */}
      <main className="relative z-20 flex flex-col items-center justify-center text-center px-4 w-full max-w-[1040px] mx-auto space-y-6 flex-1">
        <h1 className="text-white font-bold font-poppins text-4xl sm:text-5xl md:text-6xl lg:text-[64px] leading-tight tracking-wide">
          Qui t’a crushé en secret ?
        </h1>
        <p className="text-white font-medium font-poppins text-base sm:text-lg md:text-xl lg:text-2xl leading-snug tracking-wide max-w-[800px]">
          Découvre qui a des sentiments pour toi ! Ajoute tes crushs et vois si c’est réciproque.
        </p>
        <Link href="/addcrush" passHref>
          <button
            className="bg-[#FF4F81] hover:bg-[#e04370] transition-all text-white font-medium text-base sm:text-lg px-6 py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
            aria-label="Commencer à ajouter un crush"
          >
            Commencer
          </button>
        </Link>
      </main>

      {/* Pied de page */}
      <Footer />
    </div>
  );
}