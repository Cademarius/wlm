"use client";

import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full max-w-[1576px] mx-auto border-t border-[#A8A8A8] px-4 sm:px-8 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between">

      <Image src="/assets/home/logo-footer.png" alt="WLM Logo" width={79} height={24} />

      <div className="text-white text-sm font-medium tracking-wide flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-0">
        <Link href="/terms" className="hover:underline whitespace-nowrap">Termes & Conditions</Link>
        <Link href="/legal" className="hover:underline whitespace-nowrap">Mentions légales</Link>
      </div>
    </footer>
  );
};

export default Footer;
