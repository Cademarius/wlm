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
        {/* Feed */}
        <Link 
          href={`/${params.lang}/feed`}
          className={`flex flex-col items-center justify-center w-1/3 py-2 transition-all duration-200 cursor-pointer ${
            activePage === "feed" 
              ? "text-[#FF4F81]" 
              : "text-gray-300 hover:text-white"
          }`}
          aria-current={activePage === "feed" ? "page" : undefined}
        >
          <div className={`flex items-center justify-center transition-all duration-200 ${
            activePage === "feed" 
              ? "bg-[#FF4F81] shadow-lg shadow-[#FF4F81]/50 scale-110" 
              : "bg-gray-700/50 hover:bg-gray-700"
          } rounded-full h-12 w-12 -mt-5 border-4 border-[#161837]`}>
            <Home 
              size={20} 
              className="text-white" 
              strokeWidth={activePage === "feed" ? 2.5 : 2}
            />
          </div>
          <span className={`text-xs mt-1 font-medium ${
            activePage === "feed" ? "font-semibold" : ""
          }`}>
            {t.mobileNavBar.feed}
          </span>
        </Link>
        
        {/* Add Crush */}
        <Link 
          href={`/${params.lang}/addcrush`}
          className={`flex flex-col items-center justify-center w-1/3 py-2 transition-all duration-200 cursor-pointer ${
            activePage === "addcrush" 
              ? "text-[#FF4F81]" 
              : "text-gray-300 hover:text-white"
          }`}
          aria-current={activePage === "addcrush" ? "page" : undefined}
        >
          <div className={`flex items-center justify-center transition-all duration-200 ${
            activePage === "addcrush" 
              ? "bg-[#FF4F81] shadow-lg shadow-[#FF4F81]/50 scale-110" 
              : "bg-gray-700/50 hover:bg-gray-700"
          } rounded-full h-12 w-12 -mt-5 border-4 border-[#161837]`}>
            <Heart 
              size={20} 
              fill={activePage === "addcrush" ? "white" : "none"} 
              className="text-white" 
              strokeWidth={activePage === "addcrush" ? 2.5 : 2}
            />
          </div>
          <span className={`text-xs mt-1 font-medium ${
            activePage === "addcrush" ? "font-semibold" : ""
          }`}>
            {t.mobileNavBar.crush}
          </span>
        </Link>
        
        {/* Matches */}
        <Link 
          href={`/${params.lang}/matchcrush`}
          className={`flex flex-col items-center justify-center w-1/3 py-2 transition-all duration-200 cursor-pointer ${
            activePage === "matchcrush" 
              ? "text-[#FF4F81]" 
              : "text-gray-300 hover:text-white"
          }`}
          aria-current={activePage === "matchcrush" ? "page" : undefined}
        >
          <div className={`flex items-center justify-center transition-all duration-200 ${
            activePage === "matchcrush" 
              ? "bg-[#FF4F81] shadow-lg shadow-[#FF4F81]/50 scale-110" 
              : "bg-gray-700/50 hover:bg-gray-700"
          } rounded-full h-12 w-12 -mt-5 border-4 border-[#161837]`}>
            <User 
              size={20} 
              className="text-white" 
              strokeWidth={activePage === "matchcrush" ? 2.5 : 2}
            />
          </div>
          <span className={`text-xs mt-1 font-medium ${
            activePage === "matchcrush" ? "font-semibold" : ""
          }`}>
            {t.mobileNavBar.matches}
          </span>
        </Link>
      </div>
      
      {/* Add safe area padding for iOS devices */}
      <div className="h-safe-bottom bg-[#161837]"></div>
    </nav>
  );
};

export default MobileNavBar;