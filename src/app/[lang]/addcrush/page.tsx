"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Header from "../components/header";
import MobileNavBar from "../components/mobile-nav-bar";
import AddCrushModal from "../components/AddCrushModal";
import WelcomeModal from "../components/welcome";
import Image from 'next/image';
import LoginModal from "../components/login";
import { useAuth } from "../components/AuthGuard";
import { getTranslation } from '@/lib/i18n/getTranslation';
import { type Language } from '@/lib/i18n/setting';
import { Heart, Loader2 } from "lucide-react";

interface CrushUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  age: number | null;
  location: string | null;
}

interface Crush {
  id: string;
  status: string;
  created_at: string;
  user: CrushUser | null;
}

const AddACrush = ({ params }: { params: Promise<{ lang: Language }> }) => {
  const resolvedParams = use(params);
  const t = getTranslation(resolvedParams.lang);
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [showAddCrushModal, setShowAddCrushModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [crushes, setCrushes] = useState<Crush[]>([]);
  const [isLoadingCrushes, setIsLoadingCrushes] = useState(false);

  const handleOpenWelcomeModal = () => {
    setShowWelcomeModal(true);
  };

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
    localStorage.setItem("beginner", "true");
  };

  const handleCloseWelcomeModalWithoutCookie = () => {
    setShowWelcomeModal(false);
  };

  const handleButtonClick = () => {
    if (isAuthenticated && user?.id) {
      setShowAddCrushModal(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const fetchCrushes = async () => {
    if (!user?.id) return;
    
    setIsLoadingCrushes(true);
    try {
      const response = await fetch(`/api/get-crushes?userId=${user.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setCrushes(data.crushes || []);
      } else {
        console.error("Error fetching crushes:", data.error);
      }
    } catch (error) {
      console.error("Error fetching crushes:", error);
    } finally {
      setIsLoadingCrushes(false);
    }
  };

  useEffect(() => {
    const beginner = localStorage.getItem("beginner");
    if (!beginner) {
      handleOpenWelcomeModal();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchCrushes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]);

  return (
    <div
      className="w-full min-h-screen flex flex-col text-white bg-[#1C1F3F]"
      style={{
        backgroundImage: "url('/images/ui/bg-pattern.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      }}
    >
      
    <Header lang={resolvedParams.lang} />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Afficher le loader pendant que l'authentification ou les données se chargent */}
        {isAuthLoading || (isAuthenticated && isLoadingCrushes) ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="text-[#FF4F81] animate-spin mb-4" size={48} />
            <p className="text-white/60">Chargement...</p>
          </div>
        ) : /* Si l'utilisateur n'est pas connecté OU n'a pas de crushes, afficher l'état initial */
        !isAuthenticated || crushes.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-full aspect-[4/3] max-w-3xl mx-auto mb-12">
              <Image
                src="/images/ui/illustration.svg"
                alt={t.addcrush.illustrationAlt}
                fill
                className="object-contain animate-float"
                priority
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 75vw, 60vw"
              />
            </div>
            
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 text-white">
                {!isAuthenticated ? t.addcrush.titleNotAuthenticated : t.addcrush.title}
              </h2>
              
              <p className="text-gray-300 text-base sm:text-lg lg:text-xl mb-8">
                {!isAuthenticated 
                  ? t.addcrush.descriptionNotAuthenticated
                  : t.addcrush.description}
              </p>

              <button
                onClick={handleButtonClick}
                className="inline-flex items-center justify-center gap-2 bg-[#FF4F81] text-white font-medium text-lg px-8 py-4 rounded-xl shadow-lg hover:bg-[#e04370] transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF4F81] focus:ring-opacity-50 cursor-pointer"
                aria-label={t.addcrush.buttonAriaLabel}
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {t.addcrush.buttonText}
              </button>
            </div>
          </div>
        ) : (
          /* Afficher la liste des crushes uniquement si l'utilisateur est connecté ET a des crushes */
          <div>
            {/* Header Section */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 text-white">
                {t.addcrush.titleWithContent}
              </h2>
              
              <button
                onClick={handleButtonClick}
                className="inline-flex items-center justify-center gap-2 bg-[#FF4F81] text-white font-medium text-lg px-8 py-4 rounded-xl shadow-lg hover:bg-[#e04370] transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF4F81] focus:ring-opacity-50 cursor-pointer"
                aria-label={t.addcrush.buttonAriaLabel}
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {t.addcrush.buttonText}
              </button>
            </div>

            {/* Crushes List Section */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Heart className="text-[#FF4F81]" size={28} />
                  {t.addcrush.titleWithContent} ({crushes.length})
                </h3>
              </div>

              {isLoadingCrushes ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="text-[#FF4F81] animate-spin mb-4" size={48} />
                  <p className="text-white/60">Chargement...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {crushes.map((crush) => (
                    <div
                      key={crush.id}
                      className="bg-gradient-to-br from-[#2A2E5A] to-[#1C1F3F] rounded-xl p-6 border border-[#FF4F81]/20 hover:border-[#FF4F81]/50 transition-all duration-300"
                    >
                      {crush.user ? (
                        <>
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#FF4F81]/50 flex-shrink-0">
                              <Image
                                src={crush.user.image || "/images/users/avatar.webp"}
                                alt={crush.user.name || "User"}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-semibold text-lg truncate">
                                {crush.user.name}
                              </h4>
                              {(crush.user.age || crush.user.location) && (
                                <p className="text-white/60 text-sm">
                                  {crush.user.age && `${crush.user.age} ans`}
                                  {crush.user.age && crush.user.location && " • "}
                                  {crush.user.location}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs px-3 py-1 rounded-full ${
                                crush.status === "matched"
                                  ? "bg-green-500/20 text-green-400 border border-green-500/50"
                                  : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                              }`}
                            >
                              {crush.status === "matched" ? `🎉 ${t.addcrush.status.matched}` : `⏳ ${t.addcrush.status.pending}`}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="text-white/40 text-center py-4">
                          Utilisateur non trouvé
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <MobileNavBar className="block xl:hidden" activePage="addcrush" params={{ lang: resolvedParams.lang }} />
      
      {/* Modal de recherche et ajout de crush */}
      {isAuthenticated && user?.id && (
        <AddCrushModal
          showModal={showAddCrushModal}
          handleClose={() => setShowAddCrushModal(false)}
          currentUserId={user.id}
          onCrushAdded={fetchCrushes}
        />
      )}
      
      {/* Modal de connexion */}
      <LoginModal 
        showLoginModal={showLoginModal}
        handleCloseLoginModal={() => setShowLoginModal(false)}
        params={{ lang: resolvedParams.lang }}
      />
      
      {/* Modal de bienvenue */}
      <WelcomeModal
        showWelcomeModal={showWelcomeModal}
        handleCloseWelcomeModal={handleCloseWelcomeModal}
        handleCloseWelcomeModalWithoutCookie={handleCloseWelcomeModalWithoutCookie}
        params={{ lang: resolvedParams.lang }}
      />
    </div>
  );
};

export default AddACrush;