'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { FaUser, FaMapMarkerAlt, FaHeart, FaStar } from 'react-icons/fa';

export default function ProfileCompletionModal() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Ne s'affiche que si :
    // 1. L'utilisateur est authentifié
    // 2. Le profil n'est pas complet
    // 3. On n'est pas sur la page /profile
    // 4. L'utilisateur n'a jamais fermé ce modal (permanent via localStorage)
    const hasClosedModal = localStorage.getItem('profileCompletionModalClosed');
    const isOnProfilePage = pathname?.includes('/profile');
    
    const shouldShow = 
      status === 'authenticated' &&
      session?.user &&
      !session.user.profileComplete &&
      !isOnProfilePage &&
      !hasClosedModal;

    setIsOpen(!!shouldShow);
  }, [session, pathname, status]);

  const handleSkip = () => {
    // Marquer que le modal a été fermé (permanent)
    localStorage.setItem('profileCompletionModalClosed', 'true');
    setIsOpen(false);
  };

  const handleComplete = () => {
    // Marquer que le modal a été fermé (permanent)
    localStorage.setItem('profileCompletionModalClosed', 'true');
    setIsOpen(false);
    
    // Rediriger vers la page de profil
    const lang = pathname?.startsWith('/fr') ? 'fr' : 'en';
    router.push(`/${lang}/profile/settings`);
  };

  // Ne rien afficher si l'utilisateur n'est pas authentifié
  if (status === 'loading') {
    return null;
  }

  if (status === 'unauthenticated' || !session?.user || !session.user.email) {
    return null;
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black z-40 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
    >
      <div
        className="bg-[#1C1F3F] p-6 md:p-10 rounded-[12px] w-full max-w-[600px] flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header avec logo */}
        <div className="mb-4 border-b-2 border-white pb-2 flex items-center justify-center">
          <Image 
            src="/images/ui/welcome.png"
            alt="WhoLikeMe Logo" 
            width={211} 
            height={80} 
          />
        </div>

        {/* Titre */}
        <div className="text-center">
          <h2 className="text-white font-bold text-2xl md:text-[36px] leading-[100%] tracking-[1%] font-poppins">
            Complète ton profil 🎉
          </h2>
        </div>

        {/* Contenu */}
        <div className="text-left space-y-6">
          <p className="text-white font-medium text-lg md:text-[20px] leading-[150%] tracking-[1%] font-poppins">
            Quelques infos pour mieux te connecter avec des personnes qui te correspondent !
          </p>

          {/* Liste des informations */}
          <div className="space-y-3">
            <p className="text-white font-semibold text-base md:text-lg mb-3">
              Informations à remplir :
            </p>
            <div className="flex items-center gap-3 bg-[#2A2D4F] rounded-lg p-3">
              <FaUser className="text-[#FF4F81] text-2xl" />
              <span className="text-white font-medium text-base md:text-lg">Ton âge</span>
            </div>
            <div className="flex items-center gap-3 bg-[#2A2D4F] rounded-lg p-3">
              <FaMapMarkerAlt className="text-[#FF4F81] text-2xl" />
              <span className="text-white font-medium text-base md:text-lg">Ta localisation</span>
            </div>
            <div className="flex items-center gap-3 bg-[#2A2D4F] rounded-lg p-3">
              <FaHeart className="text-[#FF4F81] text-2xl" />
              <span className="text-white font-medium text-base md:text-lg">Une bio qui te représente</span>
            </div>
            <div className="flex items-center gap-3 bg-[#2A2D4F] rounded-lg p-3">
              <FaStar className="text-[#FF4F81] text-2xl" />
              <span className="text-white font-medium text-base md:text-lg">Tes centres d&apos;intérêt (min. 3)</span>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-between items-center mt-4 gap-4">
          {/* Bouton Plus tard */}
          <button
            onClick={handleSkip}
            className="bg-white text-black font-semibold py-3 px-6 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors flex-1"
          >
            Plus tard
          </button>

          {/* Bouton Compléter */}
          <button
            onClick={handleComplete}
            className="bg-[#FF4F81] text-white font-semibold py-3 px-6 rounded-lg cursor-pointer hover:bg-[#e04370] transition-colors flex-1"
          >
            Compléter maintenant
          </button>
        </div>

        {/* Note informative */}
        <p className="text-white/60 text-xs text-center leading-relaxed">
          Ces informations nous aident à te proposer de meilleures suggestions
        </p>
      </div>
    </div>
  );
}