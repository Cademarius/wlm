"use client";

import { useEffect, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import MobileNavBar from "../components/mobile-nav-bar";
import WelcomeModal from "../components/welcome";
import Image from 'next/image';

export default function Legal() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const handleOpenWelcomeModal = () => {
    setShowWelcomeModal(true);
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
      
      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col w-full max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <Image
                src="/images/ui/legal-icon.svg"
                alt="Legal Icon"
                fill
                className="object-contain"
                priority
              />
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">
              Mentions Légales
            </h1>
            
            <p className="text-gray-300 text-lg">
              Informations légales et réglementaires
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 sm:p-12 shadow-xl">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-semibold mb-6 text-white">Éditeur du site</h2>
              <div className="mb-8 text-gray-300">
                <p className="mb-2"><strong>Nom de l&#39;entreprise :</strong> [Nom de votre entreprise]</p>
                <p className="mb-2"><strong>Forme juridique :</strong> [Forme juridique]</p>
                <p className="mb-2"><strong>Adresse :</strong> [Adresse complète]</p>
                <p className="mb-2"><strong>Téléphone :</strong> [Numéro de téléphone]</p>
                <p className="mb-2"><strong>Email :</strong> [Adresse email]</p>
                <p className="mb-2"><strong>SIRET :</strong> [Numéro SIRET]</p>
                <p className="mb-2"><strong>TVA Intracommunautaire :</strong> [Numéro TVA]</p>
              </div>

              <h2 className="text-2xl font-semibold mb-6 text-white">Directeur de la publication</h2>
              <div className="mb-8 text-gray-300">
                <p className="mb-2"><strong>Nom :</strong> [Nom du directeur]</p>
                <p className="mb-2"><strong>Email :</strong> [Email du directeur]</p>
              </div>

              <h2 className="text-2xl font-semibold mb-6 text-white">Hébergement</h2>
              <div className="mb-8 text-gray-300">
                <p className="mb-2"><strong>Hébergeur :</strong> [Nom de l&#39;hébergeur]</p>
                <p className="mb-2"><strong>Adresse :</strong> [Adresse de l&#39;hébergeur]</p>
                <p className="mb-2"><strong>Téléphone :</strong> [Téléphone de l&#39;hébergeur]</p>
              </div>

              <h2 className="text-2xl font-semibold mb-6 text-white">Propriété intellectuelle</h2>
              <div className="mb-8 text-gray-300">
                <p className="mb-4">
                  L&#39;ensemble de ce site relève de la législation française et internationale sur le droit d&#39;auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représications iconographiques et photographiques.
                </p>
                <p>
                  La reproduction de tout ou partie de ce site sur un support électronique quelconque est formellement interdite sauf autorisation expresse du directeur de la publication.
                </p>
              </div>

              <h2 className="text-2xl font-semibold mb-6 text-white">Responsabilité</h2>
              <div className="text-gray-300">
                <p className="mb-4">
                  Les informations contenues sur ce site sont aussi précises que possible et le site est périodiquement remis à jour, mais peut toutefois contenir des inexactitudes, des omissions ou des lacunes.
                </p>
                <p>
                  Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, merci de bien vouloir le signaler par email en décrivant le problème de la manière la plus précise possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer className="hidden md:block" />
      <MobileNavBar className="block md:hidden" activePage="legal" />
      
      <WelcomeModal
        showWelcomeModal={showWelcomeModal}
        handleCloseWelcomeModal={handleCloseWelcomeModal}
        handleCloseWelcomeModalWithoutCookie={handleCloseWelcomeModalWithoutCookie}
      />
    </div>
  );
}