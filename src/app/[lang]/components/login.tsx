"use client";

import React, { useEffect, useRef } from "react";
import { type Language } from "@/lib/i18n/setting";
import PhoneLogin from "./PhoneLogin";

interface LoginModalProps {
  showLoginModal: boolean;
  handleCloseLoginModal: () => void;
  params: { lang: Language };
}

/**
 * Modale de connexion : enveloppe le flux d'auth par téléphone (PhoneLogin).
 * Garde la même interface qu'avant pour rester compatible avec le header.
 */
const LoginModal: React.FC<LoginModalProps> = ({
  showLoginModal,
  handleCloseLoginModal,
  params,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showLoginModal) {
        handleCloseLoginModal();
      }
    };

    if (showLoginModal) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showLoginModal, handleCloseLoginModal]);

  if (!showLoginModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleCloseLoginModal}
    >
      <div ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <PhoneLogin params={params} onClose={handleCloseLoginModal} />
      </div>
    </div>
  );
};

export default LoginModal;
