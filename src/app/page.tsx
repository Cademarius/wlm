"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Footer from "../app/components/footer";
import Link from "next/link";

const illustrations = [
  { src: "/assets/home/hg.png", alt: "Illustration Haut Gauche", styles: "top-[14%] left-[5%] md:left-[10%] lg:left-[12%] xl:left-[15%]", animation: { y: [0, -10, 0] } },
  { src: "/assets/home/hd.png", alt: "Illustration Haut Droite", styles: "top-[14%] right-[5%] md:right-[10%] lg:right-[12%] xl:right-[15%]", animation: { y: [0, 10, 0] } },
  { src: "/assets/home/bg.png", alt: "Illustration Bas Gauche", styles: "bottom-[25%] left-[5%] md:left-[10%] lg:left-[12%] xl:left-[15%]", animation: { scale: [1, 1.1, 1] } },
  { src: "/assets/home/bd.png", alt: "Illustration Bas Droite", styles: "bottom-[25%] right-[5%] md:right-[10%] lg:right-[12%] xl:right-[15%]", animation: { rotate: [0, 5, 0] } },
];

export default function HomePage() {
  return (
    <div
      className="relative flex flex-col justify-between h-screen bg-cover bg-center bg-[#1C1F3F]"
      style={{ backgroundImage: "url('/assets/background.webp')" }}
    >

      <header className="absolute top-10 left-1/2 transform -translate-x-1/2 w-[15vw] max-w-[211px] min-w-[120px]">
        <Image src="/assets/home/logo.png" alt="WLM Logo" width={211} height={100} priority />
      </header>

      <div className="absolute inset-0 pointer-events-none">
        {illustrations.map(({ src, alt, styles, animation }, index) => (
          <motion.img
            key={index}
            src={src}
            alt={alt}
            className={`absolute w-[22vw] sm:w-[18vw] md:w-[14vw] lg:w-[12vw] xl:w-[10vw] max-w-[220px] min-w-[110px] ${styles}`}
            animate={animation}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <main className="flex flex-col items-center justify-center text-center px-4 w-full max-w-[1040px] mx-auto space-y-6 flex-1 relative z-10">
        <h1 className="text-white font-bold font-poppins text-4xl sm:text-5xl md:text-6xl lg:text-[64px] leading-tight tracking-wide">
          Qui t’a crushé en secret ?
        </h1>
        <p className="text-white font-medium font-poppins text-base sm:text-lg md:text-xl lg:text-2xl leading-snug tracking-wide max-w-[800px]">
          Découvre qui a des sentiments pour toi ! Ajoute tes crushs et vois si c’est réciproque.
        </p>
        <Link href="/addcrush">
          <button className="bg-[#FF4F81] text-white font-medium text-base sm:text-lg px-6 py-3 rounded-lg shadow-md hover:bg-[#e04370] transition-all cursor-pointer">
            Commencer
          </button>
        </Link>
      </main>
      <Footer />
    </div>
  );
}