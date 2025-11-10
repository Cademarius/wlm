import { useState, useEffect, useMemo } from "react";

interface User {
  id: string;
  email: string;
  name: string | null;
  age: number | null;
  location: string | null;
  bio: string | null;
  interests: string[] | null;
  image: string | null;
}

interface MissingFields {
  age: boolean;
  location: boolean;
  bio: boolean;
  interests: boolean;
}

interface ProfileCompletionResult {
  isComplete: boolean;
  missingFields: MissingFields;
  shouldShowModal: boolean;
  isSecondVisit: boolean; // Nouveau : indique si c'est la 2ème+ visite
  currentData: {
    age: string;
    location: string;
    bio: string;
    interests: string[];
  };
}

/**
 * Hook pour vérifier la complétion du profil utilisateur
 * Vérifie si l'âge, la localisation, la bio et les intérêts sont renseignés
 */
export function useProfileCompletion(
  user: User | null,
  isAuthenticated: boolean
): ProfileCompletionResult {
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [isSecondVisit, setIsSecondVisit] = useState(false);

  // Vérifier les champs manquants (utiliser useMemo pour éviter les re-renders)
  const missingFields: MissingFields = useMemo(
    () => ({
      age: !user?.age || user.age === null,
      location: !user?.location || user.location.trim() === "",
      bio: !user?.bio || user.bio.trim() === "",
      interests: !user?.interests || user.interests.length === 0,
    }),
    [user]
  );

  // Vérifier si au moins un champ est manquant
  const hasMissingFields =
    missingFields.age ||
    missingFields.location ||
    missingFields.bio ||
    missingFields.interests;

  // Le profil est complet si aucun champ n'est manquant
  const isComplete = !hasMissingFields;

  // Données actuelles (pour pré-remplir le formulaire)
  const currentData = {
    age: user?.age?.toString() || "",
    location: user?.location || "",
    bio: user?.bio || "",
    interests: user?.interests || [],
  };

  // Déterminer si c'est la 2ème+ visite (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSecondVisit(Boolean(localStorage.getItem("profile_completion_postponed")));
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setShouldShowModal(false);
      return;
    }

    // Vérifier si l'utilisateur a déjà complété
    const hasCompleted = localStorage.getItem("profile_completion_shown");
    
    // Vérifier si l'onboarding initial a été complété
    const onboardingCompleted = localStorage.getItem("onboarding_completed");

    // Afficher le modal seulement si :
    // 1. L'utilisateur a des champs manquants
    // 2. Il n'a pas complété le profil
    // 3. L'onboarding initial est complété (ou n'était pas nécessaire)
    if (
      hasMissingFields &&
      !hasCompleted &&
      (onboardingCompleted || user.name !== user.email)
    ) {
      // Attendre un peu pour que l'utilisateur s'installe après la connexion
      const timer = setTimeout(() => {
        setShouldShowModal(true);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      setShouldShowModal(false);
    }
  }, [isAuthenticated, user, missingFields, hasMissingFields]);

  return {
    isComplete,
    missingFields,
    shouldShowModal,
    isSecondVisit,
    currentData,
  };
}