import React, { useState, useEffect, useRef } from "react";
import { AiOutlineUser } from "react-icons/ai";

interface AddModalProps {
  showAddModal: boolean;
  handleCloseAddCrushModal: () => void;
}

const AddModal: React.FC<AddModalProps> = ({ 
  showAddModal, 
  handleCloseAddCrushModal 
}) => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:3000/callback&response_type=code&scope=email profile`;

  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus sur l'input quand le modal s'ouvre
  useEffect(() => {
    if (showAddModal && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showAddModal]);

  // Gestion de l'ESC pour fermer + prévention du scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showAddModal) {
        handleCloseAddCrushModal();
      }
    };

    if (showAddModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showAddModal, handleCloseAddCrushModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      inputRef.current?.focus();
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulation d'une requête
      await new Promise(resolve => setTimeout(resolve, 800));
      window.location.href = authUrl;
    } catch (error) {
      console.error('Erreur:', error);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setName("");
      handleCloseAddCrushModal();
    }
  };

  if (!showAddModal) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-40 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      onClick={handleClose}
    >
      <div
        className="bg-[#1C1F3F] p-6 rounded-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-white text-left text-lg sm:text-xl mb-6 border-b-2 border-white pb-4">
          Ajouter un crush
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="relative mb-4 flex items-center border border-gray-300 rounded-lg bg-white">
            <AiOutlineUser className="absolute left-3 text-gray-500" size={20} />
            <input
              ref={inputRef}
              type="text"
              placeholder="John Doe"
              className="w-full pl-10 pr-4 py-2 text-black placeholder-gray-500 bg-transparent focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              maxLength={50}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="flex items-center justify-center bg-[#FF4F81] text-white py-2 px-4 rounded-lg hover:bg-[#e04370] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full text-sm sm:text-base transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                <span>Ajout en cours...</span>
              </>
            ) : (
              <span>Ajouter un crush</span>
            )}
          </button>
        </form>
        
        {/* Note de confidentialité */}
        <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
          <p className="text-xs text-white/70 text-center">
            🔒 Vos informations restent privées jusqu&#39;à ce qu&#39;un match soit confirmé
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddModal;