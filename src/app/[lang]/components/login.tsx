import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { AiOutlineInstagram } from "react-icons/ai";
import { getTranslation } from '@/lib/i18n/getTranslation';
import { type Language } from '@/lib/i18n/setting';

interface LoginModalProps {
  showLoginModal: boolean;
  handleCloseLoginModal: () => void;
  params: { lang: Language };
}

const LoginModal: React.FC<LoginModalProps> = ({ 
  showLoginModal, 
  handleCloseLoginModal,
  params
}) => {
  const t = getTranslation(params.lang);
  const modalRef = useRef<HTMLDivElement>(null);

  // Gestion de l'ESC pour fermer + prévention du scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showLoginModal) {
        handleCloseLoginModal();
      }
    };

    if (showLoginModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showLoginModal, handleCloseLoginModal]);

  const handleInstagramLogin = () => {
    // Remplacez par votre logique de connexion Instagram
    console.log("Connexion Instagram");
    // window.location.href = "votre_url_instagram_oauth";
  };

  if (!showLoginModal) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-40 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      onClick={handleCloseLoginModal}
    >
      <div
        ref={modalRef}
        className="bg-[#1C1F3F] p-6 rounded-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/images/branding/wholikeme-desktop-logo.webp"
            alt={t.loginModal.logoAlt}
            width={158}
            height={60}
            className="cursor-pointer"
          />
        </div>

        {/* Bouton Instagram */}
        <button
          onClick={handleInstagramLogin}
          className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-600 cursor-pointer w-full text-sm sm:text-base transition-all duration-200 transform hover:scale-105 active:scale-95 mb-8"
        >
          <AiOutlineInstagram className="mr-3" size={24} />
          <span>{t.loginModal.instagramButton}</span>
        </button>

        {/* Texte de confidentialité */}
        <div className="text-center">
          <p className="text-xs text-white/70 leading-relaxed">
            {t.loginModal.privacyText.beforeTerms}{" "}
            <a 
              href="/terms" 
              className="text-[#FF4F81] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.loginModal.privacyText.termsLink}
            </a>
            , {t.loginModal.privacyText.beforePrivacy}{" "}
            <a 
              href="/privacy" 
              className="text-[#FF4F81] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.loginModal.privacyText.privacyLink}
            </a>
            {" "}{t.loginModal.privacyText.beforeCookies}{" "}
            <a 
              href="/cookies" 
              className="text-[#FF4F81] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.loginModal.privacyText.cookiesLink}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;