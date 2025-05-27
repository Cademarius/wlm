"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import MobileNavBar from "../components/mobile-nav-bar";
import LoginModal from "../components/login";
import WelcomeModal from "../components/welcome";
import UserHeader from "../components/crushcard"; 
import AdmirerCard from "../components/admirercard"; 
import Image from 'next/image';
import { getTranslation } from '@/lib/i18n/getTranslation';
import { type Language } from '@/lib/i18n/setting';

const AddACrush = ({ params }: { params: Promise<{ lang: Language }> }) => {
  const resolvedParams = use(params);
  const t = getTranslation(resolvedParams.lang);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showCrushCardModal, setCrushCardModal] = useState(false);

  const handleOpenWelcomeModal = () => {
    setShowWelcomeModal(true);
  };
  const handleOpenCrushCardModal = () => {
    setShowWelcomeModal(true);
  };

  const handleCloseCrushCardModal = () => {
    setShowWelcomeModal(false);
    localStorage.setItem("beginner", "true");
  };
  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
    localStorage.setItem("beginner", "true");
  };

  const handleCloseWelcomeModalWithoutCookie = () => {
    setShowWelcomeModal(false);
  };

  const handleOpenLoginModal = () => {
    setShowLoginModal(true);
  };

  useEffect(() => {
    const beginner = localStorage.getItem("beginner");
    if (!beginner) {
      handleOpenWelcomeModal();
    }
  }, []);

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
              <UserHeader 
                userName="Darell Chooks"
                isOnline={true}
                status={false}
                params = {{lang: resolvedParams.lang}}
              />
              <UserHeader 
                userName="Marie Dupont"
                isOnline={true}
                status={true}

                params = {{lang: resolvedParams.lang}}

              />
              <UserHeader 
                userName="Alex Johnson"
                isOnline={false}
                status={false}

                params = {{lang: resolvedParams.lang}}

              />
              <UserHeader 
                userName="Sophie Martin"
                isOnline={true}
                status={true}

                params = {{lang: resolvedParams.lang}}

              />
                 <UserHeader 
                userName="Kobe Bryant"
                isOnline={true}
                status={true}
                params = {{lang: resolvedParams.lang}}

              />
                 <UserHeader 
                userName="Micheal Jordan"
                isOnline={true}
                status={true}
                params = {{lang: resolvedParams.lang}}
           
              />
            </div>
          </div>
        </div>
      </main>

      <Footer className="hidden md:block" lang={resolvedParams.lang} />
      <MobileNavBar className="block md:hidden" activePage="addcrush" params={{ lang: resolvedParams.lang }} />
      <LoginModal 
        showLoginModal={showLoginModal}
        handleCloseLoginModal={() => setShowLoginModal(false)}
        params={{ lang: resolvedParams.lang }}
      />
      <WelcomeModal
        showWelcomeModal={showWelcomeModal}
        handleCloseWelcomeModal={handleCloseWelcomeModal}
        handleCloseWelcomeModalWithoutCookie={handleCloseWelcomeModalWithoutCookie}
        params={{ lang: resolvedParams.lang }}
      />
    </div>
  );
};

export default AddACrush;