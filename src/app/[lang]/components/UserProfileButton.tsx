"use client";

import { signOut } from "next-auth/react";
import { useAuth } from "./AuthGuard";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

interface UserProfileButtonProps {
  onProfileClick?: () => void;
  onLoginClick?: () => void;
  userImage?: string | null;
  userName?: string | null;
}

/**
 * Composant pour afficher le bouton de profil utilisateur avec l'avatar
 * Gère automatiquement l'affichage selon l'état d'authentification
 * Sur desktop: clic pour aller au profil (si connecté) ou ouvrir modal de connexion (si non connecté)
 * Sur mobile: affiche un menu déroulant
 */
export default function UserProfileButton({ onProfileClick, onLoginClick, userImage, userName }: UserProfileButtonProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Utiliser les props si disponibles, sinon fallback sur user de AuthGuard
  const displayImage = userImage || user?.image;
  const displayName = userName || user?.name;
  const router = useRouter();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse" />
    );
  }

  // Extraire la langue de l'URL
  const lang = pathname.split('/')[1] || 'fr';

  const handleClick = () => {
    if (!isAuthenticated) {
      // Si l'utilisateur n'est pas connecté, ouvrir le modal de connexion
      if (onLoginClick) {
        onLoginClick();
      }
    } else if (onProfileClick) {
      onProfileClick();
    } else {
      // Sur desktop, naviguer vers le profil
      router.push(`/${lang}/profile`);
    }
  };

  return (
    <div className="relative group">
      <button
        className="w-12 h-12 rounded-full overflow-hidden transition-all duration-300 hover:scale-110 cursor-pointer border-2 border-transparent hover:border-[#FF4F81] shadow-lg hover:shadow-[#FF4F81]/50"
        onClick={handleClick}
        aria-label="Profil utilisateur"
      >
        <Image
          src={displayImage || "/images/users/avatar.webp"}
          alt={displayName || "Avatar utilisateur"}
          width={50}
          height={50}
          className="object-cover"
        />
      </button>

      {/* Menu déroulant uniquement sur mobile */}
      {isAuthenticated && (
        <div className="lg:hidden absolute right-0 mt-2 w-48 bg-[#1C1F3F] rounded-lg shadow-xl border border-[#FF4F81]/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="p-3 border-b border-white/10">
            <p className="text-white font-medium truncate">{displayName}</p>
            <p className="text-white/60 text-sm truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => router.push(`/${lang}/profile`)}
            className="w-full px-4 py-2 text-left text-white hover:bg-[#FF4F81]/20 transition-colors duration-200 cursor-pointer"
          >
            Mon profil
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full px-4 py-2 text-left text-white hover:bg-[#FF4F81]/20 transition-colors duration-200 cursor-pointer"
          >
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}
