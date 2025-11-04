"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import OnboardingModal from "./onboarding";
import { type Language } from '@/lib/i18n/setting';

interface OnboardingWrapperProps {
  lang: Language;
}

export default function OnboardingWrapper({ lang }: OnboardingWrapperProps) {
  const { data: session, status } = useSession();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || status !== "authenticated" || !session?.user) {
      return;
    }

    // Vérifier si l'utilisateur a complété l'onboarding
    const onboardingCompleted = localStorage.getItem("onboarding_completed");
    
    // Si l'utilisateur n'a pas de nom ou pas complété l'onboarding
    if (!onboardingCompleted && (!session.user.name || session.user.name === session.user.email)) {
      // Attendre un peu pour que l'utilisateur s'installe
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [mounted, status, session]);

  const handleClose = () => {
    setShowOnboarding(false);
    localStorage.setItem("onboarding_completed", "true");
  };

  if (!mounted || status !== "authenticated" || !session?.user) {
    return null;
  }

  return (
    <OnboardingModal
      showModal={showOnboarding}
      handleClose={handleClose}
      params={{ lang }}
      userEmail={session.user.email || ""}
      userId={session.user.id || ""}
      currentImage={session.user.image || ""}
    />
  );
}
