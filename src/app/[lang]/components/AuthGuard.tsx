"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  onUnauthenticated?: () => void;
}

/**
 * Composant pour protéger les routes et gérer l'authentification
 * Utilisez ce composant pour wrapper les pages qui nécessitent une authentification
 */
export default function AuthGuard({ children, onUnauthenticated }: AuthGuardProps) {
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated" && onUnauthenticated) {
      onUnauthenticated();
    }
  }, [status, onUnauthenticated]);

  // Afficher un loader pendant la vérification
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4F81]"></div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Hook personnalisé pour obtenir l'utilisateur connecté
 */
export function useAuth() {
  const { data: session, status } = useSession();
  
  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}