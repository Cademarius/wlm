"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import MobileNavBar from "../components/mobile-nav-bar";
import Image from 'next/image';

const Feed = () => {
  return (
    <div
      className="w-full min-h-screen flex flex-col text-white bg-[#1C1F3F]"
      style={{
        backgroundImage: "url('/images/ui/bg-pattern.webp')",
      }}
    >
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 pb-24 md:pb-8">
        <Image
          src="/images/ui/illustration.webp"
          alt="Illustration Match"
          width={500}
          height={500}
          className="w-[80%] sm:w-[50%] max-w-[500px] h-auto object-contain"
          priority
        />
      </main>
      <Footer className="hidden md:block" />
      <MobileNavBar className="block md:hidden" activePage="feed" />
    </div>
  );
};

export default Feed;