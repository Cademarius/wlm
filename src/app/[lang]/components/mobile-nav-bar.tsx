"use client";

import Link from "next/link";
import { Home, Heart, User } from "lucide-react";
import { getTranslation } from '@/lib/i18n/getTranslation';
import { type Language } from '@/lib/i18n/setting';

interface MobileNavBarProps {
  className?: string;
  activePage: string;
  params: { lang: Language };
}

const MobileNavBar = ({ className, activePage, params }: MobileNavBarProps) => {
  const t = getTranslation(params.lang);

  return (
    <nav 
      className={`fixed bottom-0 left-0 right-0 bg-[#161837] border-t border-gray-700 z-50 ${className}`}
    >
      <div className="flex justify-around items-center h-16">
        <Link 
          href={`/${params.lang}/feed`}
          className={`flex flex-col items-center justify-center w-1/3 py-2 transition-colors duration-200 ${
            activePage === "feed" 
              ? "text-[#FF4F81]" 
              : "text-gray-300 hover:text-white"
          }`}
          aria-current={activePage === "feed" ? "page" : undefined}
        >
          <Home size={24} />
          <span className="text-xs mt-1">{t.mobileNavBar.feed}</span>
        </Link>
        
        <Link 
          href={`/${params.lang}/addcrush`}
          className={`flex flex-col items-center justify-center w-1/3 py-2 transition-colors duration-200 ${
            activePage === "addcrush" 
              ? "text-[#FF4F81]" 
              : "text-gray-300 hover:text-white"
          }`}
          aria-current={activePage === "addcrush" ? "page" : undefined}
        >
          <div className={`flex items-center justify-center ${
            activePage === "addcrush" 
              ? "bg-[#FF4F81]" 
              : "bg-gray-700"
          } rounded-full h-12 w-12 -mt-5 border-4 border-[#161837]`}>
            <Heart 
              size={24} 
              fill={activePage === "addcrush" ? "white" : "none"} 
              className="text-white" 
            />
          </div>
          <span className="text-xs mt-1">{t.mobileNavBar.crush}</span>
        </Link>
        
        <Link 
          href={`/${params.lang}/matchcrush`}
          className={`flex flex-col items-center justify-center w-1/3 py-2 transition-colors duration-200 ${
            activePage === "matchcrush" 
              ? "text-[#FF4F81]" 
              : "text-gray-300 hover:text-white"
          }`}
          aria-current={activePage === "matchcrush" ? "page" : undefined}
        >
          <User size={24} />
          <span className="text-xs mt-1">{t.mobileNavBar.matches}</span>
        </Link>
      </div>
      
      {/* Add safe area padding for iOS devices */}
      <div className="h-safe-bottom bg-[#161837]"></div>
    </nav>
  );
};

export default MobileNavBar;