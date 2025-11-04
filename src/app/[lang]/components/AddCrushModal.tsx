"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, X, Heart, Loader2 } from "lucide-react";
import Toast from "./Toast";
import { useToast } from "@/hooks/useToast";

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  age: number | null;
  location: string | null;
  bio: string | null;
}

interface AddCrushModalProps {
  showModal: boolean;
  handleClose: () => void;
  currentUserId: string;
  onCrushAdded?: () => void;
}

const AddCrushModal: React.FC<AddCrushModalProps> = ({ 
  showModal, 
  handleClose,
  currentUserId,
  onCrushAdded
}) => {
  const { toast, success, error: showError, hideToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/search-users?query=${encodeURIComponent(searchQuery)}&currentUserId=${currentUserId}`);
      const data = await response.json();

      if (response.ok) {
        setSearchResults(data.users || []);
      } else {
        console.error("Error searching users:", data.error);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Gestion de l'ESC pour fermer + prévention du scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        handleClose();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showModal, handleClose]);

  const handleAddCrush = async (crushUserId: string) => {
    setIsAdding(crushUserId);

    try {
      const response = await fetch("/api/add-crush", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUserId,
          crushUserId: crushUserId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.match) {
          success("🎉 C'est un match ! Vous vous êtes mutuellement ajoutés !");
        } else {
          success("✨ Crush ajouté avec succès ! Vous serez notifié s'il vous ajoute aussi.");
        }
        // Retirer l'utilisateur des résultats
        setSearchResults(prev => prev.filter(user => user.id !== crushUserId));
        
        // Notifier le parent pour rafraîchir la liste
        if (onCrushAdded) {
          onCrushAdded();
        }
        
        // Déclencher le rafraîchissement des notifications
        window.dispatchEvent(new Event("refreshNotifications"));
      } else {
        showError(data.error || "Erreur lors de l'ajout du crush");
      }
    } catch (error) {
      console.error("Error adding crush:", error);
      showError("Erreur lors de l'ajout du crush");
    } finally {
      setIsAdding(null);
    }
  };

  if (!showModal) return null;

  return (
    <>
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
      
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4"
        onClick={handleClose}
      >
      <div
        className="bg-[#1C1F3F] rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-white font-bold text-2xl flex items-center gap-2">
            <Heart className="text-[#FF4F81]" size={28} />
            Ajouter un crush
          </h2>
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X size={28} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom ou email..."
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FF4F81] transition-colors"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {isSearching ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="text-[#FF4F81] animate-spin mb-4" size={48} />
              <p className="text-white/60">Recherche en cours...</p>
            </div>
          ) : !hasSearched ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="text-white/20 mb-4" size={64} />
              <p className="text-white/60 text-lg">
                Recherchez un utilisateur par nom ou email
              </p>
              <p className="text-white/40 text-sm mt-2">
                Commencez à taper pour voir les résultats
              </p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-white/20 text-6xl mb-4">🔍</div>
              <p className="text-white/60 text-lg">
                Aucun utilisateur trouvé
              </p>
              <p className="text-white/40 text-sm mt-2">
                Essayez une autre recherche
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#FF4F81]/50 flex-shrink-0">
                      <Image
                        src={user.image || "/images/users/avatar.webp"}
                        alt={user.name || "User"}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-lg truncate">
                        {user.name}
                      </h3>
                      <p className="text-white/60 text-sm truncate">
                        {user.email}
                      </p>
                      {(user.age || user.location) && (
                        <p className="text-white/40 text-xs mt-1">
                          {user.age && `${user.age} ans`}
                          {user.age && user.location && " • "}
                          {user.location}
                        </p>
                      )}
                    </div>

                    {/* Add Button */}
                    <button
                      onClick={() => handleAddCrush(user.id)}
                      disabled={isAdding === user.id}
                      className="bg-[#FF4F81] hover:bg-[#FF3D6D] text-white px-6 py-2 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2 flex-shrink-0"
                    >
                      {isAdding === user.id ? (
                        <>
                          <Loader2 className="animate-spin" size={16} />
                          <span className="hidden sm:inline">Ajout...</span>
                        </>
                      ) : (
                        <>
                          <Heart size={16} />
                          <span className="hidden sm:inline">Ajouter</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Bio */}
                  {user.bio && (
                    <p className="text-white/50 text-sm mt-3 line-clamp-2">
                      {user.bio}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10">
          <p className="text-white/40 text-xs text-center">
            💡 Astuce : Vous serez notifié si votre crush vous ajoute aussi !
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default AddCrushModal;
