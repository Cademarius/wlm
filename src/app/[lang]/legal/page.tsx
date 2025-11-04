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

const Legal = ({ params }: { params: Promise<{ lang: Language }> }) => {
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
      className="w-full min-h-screen flex flex-col text-white bg-[#0F1128]"
      style={{
        backgroundImage: "url('/images/ui/bg-pattern.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      }}
    >
      <Header lang={resolvedParams.lang} />
      
      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col w-full max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <Image
                src="/images/ui/legal-icon.svg"
                alt={t.legal.iconAlt}
                fill
                className="object-contain"
                priority
              />
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">
              {t.legal.title}
            </h1>
            
            <p className="text-gray-300 text-lg">
              {t.legal.subtitle}
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 sm:p-12 shadow-xl">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-semibold mb-6 text-white">{t.legal.sections.publisher.title}</h2>
              <div className="mb-8 text-gray-300">
                <p className="mb-2"><strong>{t.legal.sections.publisher.fields.company}:</strong> {t.legal.sections.publisher.values.company}</p>
                <p className="mb-2"><strong>{t.legal.sections.publisher.fields.legalForm}:</strong> {t.legal.sections.publisher.values.legalForm}</p>
                <p className="mb-2"><strong>{t.legal.sections.publisher.fields.address}:</strong> {t.legal.sections.publisher.values.address}</p>
                <p className="mb-2"><strong>{t.legal.sections.publisher.fields.phone}:</strong> {t.legal.sections.publisher.values.phone}</p>
                <p className="mb-2"><strong>{t.legal.sections.publisher.fields.email}:</strong> {t.legal.sections.publisher.values.email}</p>
                <p className="mb-2"><strong>{t.legal.sections.publisher.fields.siret}:</strong> {t.legal.sections.publisher.values.siret}</p>
                <p className="mb-2"><strong>{t.legal.sections.publisher.fields.vat}:</strong> {t.legal.sections.publisher.values.vat}</p>
              </div>

              <h2 className="text-2xl font-semibold mb-6 text-white">{t.legal.sections.director.title}</h2>
              <div className="mb-8 text-gray-300">
                <p className="mb-2"><strong>{t.legal.sections.director.fields.name}:</strong> {t.legal.sections.director.values.name}</p>
                <p className="mb-2"><strong>{t.legal.sections.director.fields.email}:</strong> {t.legal.sections.director.values.email}</p>
              </div>

              <h2 className="text-2xl font-semibold mb-6 text-white">{t.legal.sections.hosting.title}</h2>
              <div className="mb-8 text-gray-300">
                <p className="mb-2"><strong>{t.legal.sections.hosting.fields.host}:</strong> {t.legal.sections.hosting.values.host}</p>
                <p className="mb-2"><strong>{t.legal.sections.hosting.fields.address}:</strong> {t.legal.sections.hosting.values.address}</p>
                <p className="mb-2"><strong>{t.legal.sections.hosting.fields.phone}:</strong> {t.legal.sections.hosting.values.phone}</p>
              </div>

              <h2 className="text-2xl font-semibold mb-6 text-white">{t.legal.sections.intellectualProperty.title}</h2>
              <div className="mb-8 text-gray-300">
                <p className="mb-4">
                  {t.legal.sections.intellectualProperty.paragraph1}
                </p>
                <p>
                  {t.legal.sections.intellectualProperty.paragraph2}
                </p>
              </div>

              <h2 className="text-2xl font-semibold mb-6 text-white">{t.legal.sections.responsibility.title}</h2>
              <div className="text-gray-300">
                <p className="mb-4">
                  {t.legal.sections.responsibility.paragraph1}
                </p>
                <p>
                  {t.legal.sections.responsibility.paragraph2}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer className="hidden xl:block" lang={resolvedParams.lang} />
      <MobileNavBar className="block xl:hidden" activePage="legal" params={{ lang: resolvedParams.lang }} />
      
      <WelcomeModal
        showWelcomeModal={showWelcomeModal}
        handleCloseWelcomeModal={handleCloseWelcomeModal}
        handleCloseWelcomeModalWithoutCookie={handleCloseWelcomeModalWithoutCookie}
        params={{ lang: resolvedParams.lang }}
      />
    </div>
  );
};

export default Legal;