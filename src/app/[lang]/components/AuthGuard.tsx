"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/supabase/AuthProvider";

interface AuthGuardProps {
  children: React.ReactNode;
  onUnauthenticated?: () => void;
}

/**
 * Protège l'app et gère la présence "en ligne".
 * S'appuie sur l'auth Supabase (via AuthProvider).
 */
export default function AuthGuard({ children, onUnauthenticated }: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const userId = user?.id;

  // Ping "en ligne" toutes les 30s tant que connecté.
  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    let interval: NodeJS.Timeout | null = null;
    const ping = async () => {
      await fetch("/api/ping-online", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
    };

    ping();
    interval = setInterval(ping, 30000);

    return () => {
      if (interval) clearInterval(interval);
      fetch("/api/set-online", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, is_online: false }),
      });
    };
  }, [isAuthenticated, userId]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && onUnauthenticated) {
      onUnauthenticated();
    }
  }, [isLoading, isAuthenticated, onUnauthenticated]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5C8A]"></div>
      </div>
    );
  }

  return <>{children}</>;
}

// Ré-export pour compatibilité : les composants importent `useAuth` depuis "./AuthGuard".
export { useAuth } from "@/lib/supabase/AuthProvider";
