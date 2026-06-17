"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/lib/supabase/AuthProvider";

interface SessionProviderProps {
  children: ReactNode;
}

/**
 * Conserve le nom "SessionProvider" (importé dans le layout) mais s'appuie
 * désormais sur l'auth Supabase par téléphone, plus sur next-auth.
 */
export default function SessionProvider({ children }: SessionProviderProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
