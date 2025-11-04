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
      className={`fixed bottom-0 left-0 right-0 bg-[#161837]/95 backdrop-blur-lg border-t border-[#FF4F81]/30 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.3)] ${className}`}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex justify-around items-center h-16 px-2">
        {/* Feed */}
        <Link 
          href={`/${params.lang}/feed`}
          className={`flex flex-col items-center justify-center w-1/3 py-2 transition-all duration-300 cursor-pointer touch-manipulation active:scale-95 ${
            activePage === "feed" 
              ? "text-[#FF4F81]" 
              : "text-gray-300 hover:text-white active:text-white/70"
          }`}
          aria-current={activePage === "feed" ? "page" : undefined}
          aria-label={t.mobileNavBar.feed}
        >
          <div className={`flex items-center justify-center transition-all duration-300 transform ${
            activePage === "feed" 
              ? "bg-gradient-to-br from-[#FF4F81] to-[#FF3D6D] shadow-lg shadow-[#FF4F81]/60 scale-110" 
              : "bg-gradient-to-br from-gray-700/60 to-gray-800/60 hover:from-gray-700 hover:to-gray-800 hover:scale-105"
          } rounded-full h-12 w-12 min-w-[48px] min-h-[48px] -mt-5 border-4 border-[#161837]`}>
            <Home 
              size={20} 
              className="text-white" 
              strokeWidth={activePage === "feed" ? 2.5 : 2}
            />
          </div>
          <span className={`text-xs mt-1 font-medium transition-all duration-200 ${
            activePage === "feed" ? "font-semibold scale-105" : ""
          }`}>
            {t.mobileNavBar.feed}
          </span>
        </Link>
        
        {/* Add Crush */}
        <Link 
          href={`/${params.lang}/addcrush`}
          className={`flex flex-col items-center justify-center w-1/3 py-2 transition-all duration-300 cursor-pointer touch-manipulation active:scale-95 ${
            activePage === "addcrush" 
              ? "text-[#FF4F81]" 
              : "text-gray-300 hover:text-white active:text-white/70"
          }`}
          aria-current={activePage === "addcrush" ? "page" : undefined}
          aria-label={t.mobileNavBar.crush}
        >
          <div className={`flex items-center justify-center transition-all duration-300 transform ${
            activePage === "addcrush" 
              ? "bg-gradient-to-br from-[#FF4F81] to-[#FF3D6D] shadow-lg shadow-[#FF4F81]/60 scale-110" 
              : "bg-gradient-to-br from-gray-700/60 to-gray-800/60 hover:from-gray-700 hover:to-gray-800 hover:scale-105"
          } rounded-full h-12 w-12 min-w-[48px] min-h-[48px] -mt-5 border-4 border-[#161837]`}>
            <Heart 
              size={20} 
              fill={activePage === "addcrush" ? "white" : "none"} 
              className="text-white" 
              strokeWidth={activePage === "addcrush" ? 2.5 : 2}
            />
          </div>
          <span className={`text-xs mt-1 font-medium transition-all duration-200 ${
            activePage === "addcrush" ? "font-semibold scale-105" : ""
          }`}>
            {t.mobileNavBar.crush}
          </span>
        </Link>
        
        {/* Matches */}
        <Link 
          href={`/${params.lang}/matchcrush`}
          className={`flex flex-col items-center justify-center w-1/3 py-2 transition-all duration-300 cursor-pointer touch-manipulation active:scale-95 ${
            activePage === "matchcrush" 
              ? "text-[#FF4F81]" 
              : "text-gray-300 hover:text-white active:text-white/70"
          }`}
          aria-current={activePage === "matchcrush" ? "page" : undefined}
          aria-label={t.mobileNavBar.matches}
        >
          <div className={`flex items-center justify-center transition-all duration-300 transform ${
            activePage === "matchcrush" 
              ? "bg-gradient-to-br from-[#FF4F81] to-[#FF3D6D] shadow-lg shadow-[#FF4F81]/60 scale-110" 
              : "bg-gradient-to-br from-gray-700/60 to-gray-800/60 hover:from-gray-700 hover:to-gray-800 hover:scale-105"
          } rounded-full h-12 w-12 min-w-[48px] min-h-[48px] -mt-5 border-4 border-[#161837]`}>
            <User 
              size={20} 
              className="text-white" 
              strokeWidth={activePage === "matchcrush" ? 2.5 : 2}
            />
          </div>
          <span className={`text-xs mt-1 font-medium transition-all duration-200 ${
            activePage === "matchcrush" ? "font-semibold scale-105" : ""
          }`}>
            {t.mobileNavBar.matches}
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNavBar;