"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import MobileNavBar from "../components/mobile-nav-bar";
import AddCrushModal from "../components/AddCrushModal";
import WelcomeModal from "../components/welcome";
import Image from 'next/image';
import LoginModal from "../components/login";
import { useAuth } from "../components/AuthGuard";
import { getTranslation } from '@/lib/i18n/getTranslation';
import { type Language } from '@/lib/i18n/setting';
import { Heart } from "lucide-react";
import { CrushListSkeleton } from "../components/SkeletonLoader";
import Header from "../components/header";
import UserCard from "../components/UserCard";
import PageTransition from "../components/PageTransition";
import LoadingState from "../components/LoadingState";

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
  const [isContentReady, setIsContentReady] = useState(false);

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

  // Gérer l'affichage du contenu après le chargement
  useEffect(() => {
    if (!isAuthLoading && !isLoadingCrushes) {
      // Petit délai pour éviter le flash de contenu
      const timer = setTimeout(() => {
        setIsContentReady(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsContentReady(false);
    }
  }, [isAuthLoading, isLoadingCrushes]);

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
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mb-20 xl:mb-0 overflow-y-auto">
        {/* Afficher le loader pendant que l'authentification se charge */}
        {isAuthLoading ? (
          <LoadingState message="Chargement..." />
        ) : /* Si l'utilisateur est connecté et charge ses crushes */
        isAuthenticated && isLoadingCrushes ? (
          <PageTransition isLoading={isLoadingCrushes}>
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <div className="h-10 bg-gray-700/40 rounded-lg w-64 mx-auto animate-pulse" />
                <div className="h-12 bg-[#FF4F81]/20 rounded-xl w-48 mx-auto animate-pulse" />
              </div>
              <CrushListSkeleton count={6} />
            </div>
          </PageTransition>
        ) : /* Si l'utilisateur n'est pas connecté OU n'a pas de crushes, afficher l'état initial */
        !isAuthenticated || crushes.length === 0 ? (
          <PageTransition>
            <div className="flex flex-col items-center justify-center" style={{ opacity: isContentReady ? 1 : 0, transition: 'opacity 0.3s ease-in' }}>
              <div className="relative w-full aspect-[4/3] max-w-2xl mx-auto mb-12">
                <Image
                  src="/images/ui/illustration.svg"
                  alt={t.addcrush.illustrationAlt}
                  fill
                  className="object-contain animate-float"
                  priority
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 75vw, 50vw"
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
          </PageTransition>
        ) : (
          /* Afficher la liste des crushes uniquement si l'utilisateur est connecté ET a des crushes */
          <PageTransition>
            <div style={{ opacity: isContentReady ? 1 : 0, transition: 'opacity 0.3s ease-in' }}>
              {/* Header Section */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Heart className="text-[#FF4F81]" size={36} />
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                    {t.addcrush.titleWithContent}
                  </h2>
                </div>
                <p className="text-white/60 text-base sm:text-lg mb-6">
                  {crushes.length} {crushes.length > 1 ? 'crushes ajoutés' : 'crush ajouté'}
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

              {/* Crushes List Section */}
              <div className="mt-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {crushes.map((crush, index) => (
                    <UserCard
                      key={crush.id}
                      user={crush.user}
                      status={crush.status}
                      statusLabel={{
                        matched: t.addcrush.status.matched,
                        pending: t.addcrush.status.pending,
                      }}
                      type="crush"
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </div>
          </PageTransition>
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