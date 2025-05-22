"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import MobileNavBar from "../components/mobile-nav-bar";
import Image from 'next/image';

const MatchWithACrush = () => {
  return (
    <div 
      className="w-full min-h-screen flex flex-col text-white bg-[#1C1F3F]"
      style={{ 
        backgroundImage: "url('/images/ui/bg-pattern.webp')",
      }}
    >
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
             <div className="flex flex-col items-center w-full">
               <div className="relative w-full aspect-[4/3] max-w-3xl mx-auto mb-12">
                 <Image
                   src="/images/ui/illustration.svg"
                   alt="Illustration Match"
                   fill
                   className="object-contain animate-float"
                   priority
                   sizes="(max-width: 640px) 90vw, (max-width: 1024px) 75vw, 60vw"
                 />
               </div>
               
               <div className="text-center max-w-2xl mx-auto">
                 <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 text-white">
                  Aucun admirateur pour le moment
                 </h2>
               </div>
             </div>
        </main>

      <Footer className="hidden md:block" />
      <MobileNavBar className="block md:hidden" activePage="matchcrush" />
    </div>
  );
};

export default MatchWithACrush;