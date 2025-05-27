"use client";

import { use } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import MobileNavBar from "../components/mobile-nav-bar";
import Image from 'next/image';
import { getTranslation } from '@/lib/i18n/getTranslation';
import { type Language } from '@/lib/i18n/setting';
import AdmirerCard from "../components/admirercard";

const MatchWithACrush = ({ params }: { params: Promise<{ lang: Language }> }) => {
  const resolvedParams = use(params);
  const t = getTranslation(resolvedParams.lang);

  return (
    <div 
      className="w-full min-h-screen flex flex-col text-white bg-[#1C1F3F]"
      style={{ 
        backgroundImage: "url('/images/ui/bg-pattern.webp')",
      }}
    >
      
         <Header lang={resolvedParams.lang} />
         <main className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center w-full">
          {/* User Headers Section */}
          <div className="w-full  mx-auto mt-12">
            <h3 className="text-xl font-semibold text-white mb-6 text-center">Recent Connections</h3>
            <div className="grid grid-cols-2 gap-3">
            
                 <AdmirerCard 
                userName="Kobe Bryant"
                isOnline={true}
                params = {{lang: resolvedParams.lang}}

              />
                 <AdmirerCard 
                userName="Micheal Jordan"
                isOnline={true}
                params = {{lang: resolvedParams.lang}}
           
              />
            </div>
          </div>
        </div>
      </main>

      <Footer className="hidden md:block" lang={resolvedParams.lang} />
      <MobileNavBar className="block md:hidden" activePage="matchcrush" params={{ lang: resolvedParams.lang }} />
    </div>
  );
};

export default MatchWithACrush;