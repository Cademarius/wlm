"use client";

import { useEffect, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import MobileNavBar from "../components/mobile-nav-bar";
import WelcomeModal from "../components/welcome";
import Image from 'next/image';

export default function Privacy() {
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
                src="/images/ui/privacy-icon.svg"
                alt="Privacy Icon"
                fill
                className="object-contain"
                priority
              />
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">
              Politique de Confidentialité
            </h1>
            
            <p className="text-gray-300 text-lg">
              Protection et gestion de vos données personnelles
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 sm:p-12 shadow-xl">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-semibold mb-6 text-white">1. Collecte des données</h2>
              <div className="mb-8 text-gray-300">
                <p className="mb-4">
                  Nous collectons les données personnelles que vous nous fournissez directement lors de :
                </p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Votre inscription sur notre plateforme</li>
                <li>L&apos;ajout de profils de crush</li>
                <li>L&apos;utilisation de nos services de matching</li>
                <li>Vos interactions avec d&apos;autres utilisateurs</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mb-6 text-white">2. Utilisation des données</h2>
              <div className="mb-8 text-gray-300">
                <p className="mb-4">Vos données personnelles sont utilisées pour :</p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li>Fournir et améliorer nos services de matching</li>
                  <li>Personnaliser votre expérience utilisateur</li>
                  <li>Vous envoyer des notifications importantes</li>
                  <li>Assurer la sécurité de la plateforme</li>
                  <li>Respecter nos obligations légales</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mb-6 text-white">3. Partage des données</h2>
              <div className="mb-8 text-gray-300">
                <p className="mb-4">
                  Nous ne vendons, ne louons, ni ne partageons vos données personnelles avec des tiers, sauf dans les cas suivants :
                </p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li>Avec votre consentement explicite</li>
                  <li>Pour respecter une obligation légale</li>
                  <li>Avec nos prestataires de services (sous contrat strict)</li>
                  <li>Droit d&apos;opposition au traitement</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mb-6 text-white">4. Sécurité des données</h2>
              <div className="mb-8 text-gray-300">
                <p className="mb-4">
                  Nous mettons en place des mesures techniques et organisationnelles appropriées pour protéger vos données :
                </p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li>Chiffrement des données sensibles</li>
                  <li>Accès restreint aux données personnelles</li>
                  <li>Surveillance continue de nos systèmes</li>
                  <li>Formation régulière de nos équipes</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mb-6 text-white">5. Vos droits</h2>
              <div className="mb-8 text-gray-300">
                <p className="mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                 <li>Droit d&#39;accès à vos données personnelles</li>
                  <li>Droit de rectification des données inexactes</li>
                  <li>Droit à l&#39;effacement de vos données</li>
                  <li>Droit à la portabilité de vos données</li>
                 <li>Droit d&#39;opposition au traitement</li>
                  <li>Droit de retirer votre consentement</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mb-6 text-white">6. Conservation des données</h2>
              <div className="mb-8 text-gray-300">
                <p className="mb-4">
                  Nous conservons vos données personnelles uniquement pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, ou conformément aux obligations légales.
                </p>
              </div>

              <h2 className="text-2xl font-semibold mb-6 text-white">7. Contact</h2>
              <div className="text-gray-300">
                <p className="mb-4">
                  Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, contactez-nous à :
                </p>
                <p><strong>Email :</strong> privacy@[votredomaine].com</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer className="hidden md:block" />
      <MobileNavBar className="block md:hidden" activePage="privacy" />
      
      <WelcomeModal
        showWelcomeModal={showWelcomeModal}
        handleCloseWelcomeModal={handleCloseWelcomeModal}
        handleCloseWelcomeModalWithoutCookie={handleCloseWelcomeModalWithoutCookie}
      />
    </div>
  );
}