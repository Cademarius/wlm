"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Image from 'next/image';

const MatchWithACrush = () => {
  return (
    <div 
    className="w-full min-h-screen flex flex-col text-white bg-[#1C1F3F]"
    style={{ 
      backgroundImage: "url('/assets/background.webp')",
    }}
    >
      <Header />

      <section className="w-full max-w-[1572px] mx-auto border-b border-[#A8A8A8] pb-2 px-4 sm:px-8 mt-[41px] flex items-center justify-start">
        <h1 className="text-white text-[28px] sm:text-[40px] font-bold leading-[100%] tracking-[1%]">
          Qui m&apos;a crushé ?
        </h1>
      </section>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-8">
        <Image 
          src="/assets/illustration.png" 
          alt="Illustration Match" 
          width={500}
          height={500}
          className="w-[80%] sm:w-[50%] max-w-[500px] h-auto object-contain"
          priority
        />
      </main>
      <Footer />
    </div>
  );
};

export default MatchWithACrush;