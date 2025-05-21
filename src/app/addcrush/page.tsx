"use client";

import { useEffect, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
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

      <section className="w-full max-w-[1572px] mx-auto border-b border-[#A8A8A8] pb-2 px-4 sm:px-8 mt-[41px] flex items-center justify-between">
        <h1 className="text-white text-[28px] sm:text-[40px] font-bold leading-[100%] tracking-[1%]">
          Mes crushs
        </h1>
      </section>

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8">
        <Image
        src="/images/ui/illustration.webp"
        alt="Illustration Match"
        width={500}
        height={500}
        className="w-[80%] sm:w-[50%] max-w-[500px] h-auto object-contain"
        priority
      />

        <button
          onClick={handleOpenAddCrushModal}
          className="bg-[#FF4F81] text-white font-medium text-base sm:text-lg md:text-xl lg:text-2xl px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-lg shadow-md hover:bg-[#e04370] transition-all cursor-pointer mt-4"
        >
          Ajouter un crush
        </button>
      </main>


      <Footer />
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
