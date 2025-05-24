"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import MobileNavBar from "../components/mobile-nav-bar";
import WelcomeModal from "../components/welcome";
import Image from 'next/image';
import { getTranslation } from '@/lib/i18n/getTranslation';
import { type Language } from '@/lib/i18n/setting';

const Privacy = ({ params }: { params: Promise<{ lang: Language }> }) => {
  const resolvedParams = use(params);
  const t = getTranslation(resolvedParams.lang);
  
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
      <Header lang={resolvedParams.lang} />
      
      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col w-full max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <Image
                src="/images/ui/privacy-icon.svg"
                alt={t.privacy.iconAlt}
                fill
                className="object-contain"
                priority
              />
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">
              {t.privacy.title}
            </h1>
            
            <p className="text-gray-300 text-lg">
              {t.privacy.subtitle}
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 sm:p-12 shadow-xl">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-semibold mb-6 text-white">{t.privacy.sections.dataCollection.title}</h2>
              <div className="mb-8 text-gray-300">
                <p className="mb-4">
                  {t.privacy.sections.dataCollection.intro}
                </p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  {t.privacy.sections.dataCollection.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mb-6 text-white">{t.privacy.sections.dataUsage.title}</h2>
              <div className="mb-8 text-gray-300">
                <p className="mb-4">{t.privacy.sections.dataUsage.intro}</p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  {t.privacy.sections.dataUsage.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mb-6 text-white">{t.privacy.sections.dataSharing.title}</h2>
              <div className="mb-8 text-gray-300">
                <p className="mb-4">
                  {t.privacy.sections.dataSharing.intro}
                </p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  {t.privacy.sections.dataSharing.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mb-6 text-white">{t.privacy.sections.dataSecurity.title}</h2>
              <div className="mb-8 text-gray-300">
                <p className="mb-4">
                  {t.privacy.sections.dataSecurity.intro}
                </p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  {t.privacy.sections.dataSecurity.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mb-6 text-white">{t.privacy.sections.userRights.title}</h2>
              <div className="mb-8 text-gray-300">
                <p className="mb-4">{t.privacy.sections.userRights.intro}</p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  {t.privacy.sections.userRights.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mb-6 text-white">{t.privacy.sections.dataRetention.title}</h2>
              <div className="mb-8 text-gray-300">
                <p className="mb-4">
                  {t.privacy.sections.dataRetention.content}
                </p>
              </div>

              <h2 className="text-2xl font-semibold mb-6 text-white">{t.privacy.sections.contact.title}</h2>
              <div className="text-gray-300">
                <p className="mb-4">
                  {t.privacy.sections.contact.intro}
                </p>
                <p><strong>{t.privacy.sections.contact.emailLabel}:</strong> {t.privacy.sections.contact.email}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer className="hidden md:block" lang={resolvedParams.lang} />
      <MobileNavBar className="block md:hidden" activePage="privacy" params={{ lang: resolvedParams.lang }} />
      
      <WelcomeModal
        showWelcomeModal={showWelcomeModal}
        handleCloseWelcomeModal={handleCloseWelcomeModal}
        handleCloseWelcomeModalWithoutCookie={handleCloseWelcomeModalWithoutCookie}
        params={{ lang: resolvedParams.lang }}
      />
    </div>
  );
};

export default Privacy;