"use client";

import { useEffect, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import MobileNavBar from "../components/mobile-nav-bar";
import AddModal from "../components/add";
import WelcomeModal from "../components/welcome";
import Image from 'next/image';

const AddACrush = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const handleOpenAddCrushModal = () => {
    setShowAddModal(true);
  };

  const handleOpenWelcomeModal = () => {
    setShowWelcomeModal(true);
  };

  const handleCloseAddCrushModal = () => {
    setShowAddModal(false);
  };

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
    localStorage.setItem("beginner", "true");
  };

  const handleCloseWelcomeModalWithoutCookie = () => {
    setShowWelcomeModal(false);
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
              Aucun crush pour le moment
            </h2>
            
            <p className="text-gray-300 text-base sm:text-lg lg:text-xl mb-8">
              Commencez par ajouter les personnes qui vous intéressent pour découvrir vos matchs potentiels
            </p>

            <button
              onClick={handleOpenAddCrushModal}
              className="inline-flex items-center justify-center gap-2 bg-[#FF4F81] text-white font-medium text-lg px-8 py-4 rounded-xl shadow-lg hover:bg-[#e04370] transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF4F81] focus:ring-opacity-50"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Ajouter un crush
            </button>
          </div>
        </div>
      </main>

      <Footer className="hidden md:block" />
      <MobileNavBar className="block md:hidden" activePage="addcrush" />
      <AddModal
        showAddModal={showAddModal}
        handleCloseAddCrushModal={handleCloseAddCrushModal}
      />
      <WelcomeModal
        showWelcomeModal={showWelcomeModal}
        handleCloseWelcomeModal={handleCloseWelcomeModal}
        handleCloseWelcomeModalWithoutCookie={handleCloseWelcomeModalWithoutCookie}
      />
    </div>
  );
};

export default AddACrush;