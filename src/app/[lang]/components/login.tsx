import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
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

  const handleGoogleLogin = async () => {
    try {
      await signIn("google", {
        callbackUrl: `/${params.lang}/feed`,
      });
    } catch (error) {
      console.error("Erreur lors de la connexion Google:", error);
    }
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

        {/* Bouton Google */}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center bg-white text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 cursor-pointer w-full text-sm sm:text-base transition-all duration-200 transform hover:scale-105 active:scale-95 mb-8 shadow-md border border-gray-300"
        >
          <FcGoogle className="mr-3" size={24} />
          <span className="font-medium">{t.loginModal.googleButton}</span>
        </button>

        {/* Texte de confidentialité */}
        <div className="text-center">
          <p className="text-xs text-white/70 leading-relaxed">
            {t.loginModal.privacyText.beforeTerms}{" "}
            <a 
              href="/terms" 
              className="text-[#FF4F81] hover:underline cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.loginModal.privacyText.termsLink}
            </a>
            , {t.loginModal.privacyText.beforePrivacy}{" "}
            <a 
              href="/privacy" 
              className="text-[#FF4F81] hover:underline cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.loginModal.privacyText.privacyLink}
            </a>
            {" "}{t.loginModal.privacyText.beforeCookies}{" "}
            <a 
              href="/cookies" 
              className="text-[#FF4F81] hover:underline cursor-pointer"
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