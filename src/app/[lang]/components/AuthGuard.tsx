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
  // Ping online toutes les 30s si connecté
  const { data: session, status } = useSession();
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const ping = async () => {
      if (status === "authenticated" && session?.user?.id) {
        console.log('[PING-ONLINE] frontend ping for userId:', session.user.id);
        await fetch("/api/ping-online", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.user.id }),
        });
      }
    };
    if (status === "authenticated" && session?.user?.id) {
      ping();
      interval = setInterval(() => ping(), 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
      // Ping offline à l'unmount
      if (status === "authenticated" && session?.user?.id) {
        fetch("/api/set-online", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.user.id, is_online: false }),
        });
      }
    };
  }, [status, session]);

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