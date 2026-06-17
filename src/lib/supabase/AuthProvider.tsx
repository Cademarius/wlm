"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User as AuthUser } from "@supabase/supabase-js";
import { createClient } from "./client";
import type { User as Profile } from "@/types/database";

/**
 * Utilisateur "fusionné" exposé à l'app : identité auth Supabase + profil public.users.
 * Garde une forme proche de l'ancienne `session.user` pour limiter les changements.
 */
export interface MergedUser {
  id: string;
  phone: string | null;
  name: string | null;
  image: string | null;
  profileComplete: boolean;
  profileCompletionSkips: number;
  profile: Profile | null;
}

interface AuthContextValue {
  authUser: AuthUser | null;
  profile: Profile | null;
  user: MergedUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function computeProfileComplete(p: Profile | null): boolean {
  // Modèle "aime en secret par numéro" : seuls prénom + genre + ville comptent
  // (servent à la révélation au match et aux indices payants).
  return !!(p && p.name && p.gender && p.location);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async (uid: string) => {
    try {
      // On passe par la route API (service_role) → contourne la RLS pour lire SON profil.
      const res = await fetch(`/api/get-user?userId=${uid}`);
      if (res.ok) {
        const { user } = await res.json();
        setProfile((user as Profile) ?? null);
      } else {
        setProfile(null);
      }
    } catch (e) {
      console.error("[Auth] loadProfile error", e);
      setProfile(null);
    }
  }, []);

  const refresh = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setAuthUser(user);
    if (user) await loadProfile(user.id);
    else setProfile(null);
  }, [supabase, loadProfile]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!mounted) return;
        setAuthUser(session?.user ?? null);
        // Charge le profil EN ARRIÈRE-PLAN : on ne bloque jamais l'affichage de l'app.
        if (session?.user) loadProfile(session.user.id);
      } catch (e) {
        console.error("[Auth] getSession error", e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else setProfile(null);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, loadProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setAuthUser(null);
    setProfile(null);
  }, [supabase]);

  const user: MergedUser | null = authUser
    ? {
        id: authUser.id,
        phone: authUser.phone ?? profile?.phone ?? null,
        name: profile?.name ?? null,
        image: profile?.image ?? null,
        profileComplete: computeProfileComplete(profile),
        profileCompletionSkips: profile?.profile_completion_skips ?? 0,
        profile,
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        authUser,
        profile,
        user,
        isLoading,
        isAuthenticated: !!authUser,
        refresh,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'<AuthProvider>");
  }
  return ctx;
}
