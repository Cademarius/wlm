import React, { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaInstagram } from "react-icons/fa";

interface AddModalProps {
  showAddModal: boolean;
  handleCloseAddCrushModal: () => void;
}

const AddModal: React.FC<AddModalProps> = ({ showAddModal, handleCloseAddCrushModal }) => {
  // URLs d'authentification
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:3000/callback&response_type=code&scope=email profile`;
  const instagramAuthUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/instagram`;

  const [name, setName] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("Instagram");
  const [showDropdown, setShowDropdown] = useState(false);
  const [authProvider, setAuthProvider] = useState("instagram"); // instagram ou google

  const networks = [
    { name: "Instagram", logo: "/assets/networks/instagram.svg" },
    { name: "Facebook", logo: "/assets/networks/facebook.png" },
    { name: "Snapchat", logo: "/assets/networks/snapchat.svg" },
    { name: "Twitter", logo: "/assets/networks/twitter.png" },
    { name: "TikTok", logo: "/assets/networks/tiktok.svg" },
  ];

  // Fonction pour obtenir l'URL d'authentification en fonction du fournisseur sélectionné
  const getAuthUrl = () => {
    return authProvider === "google" ? googleAuthUrl : instagramAuthUrl;
  };

  if (!showAddModal) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-40 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      onClick={handleCloseAddCrushModal}
    >
      <div
        className="bg-[#1C1F3F] p-6 rounded-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-left text-lg sm:text-xl mb-6 border-b-2 border-white pb-4">Ajouter un crush</h2>
        <form>
          <div className="relative mb-4 flex items-center border border-gray-300 rounded-lg bg-white">
            <AiOutlineUser className="absolute left-3 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="John Doe"
              className="w-full pl-10 pr-32 py-2 text-black placeholder-gray-500 bg-transparent focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="relative">
              <button
                type="button"
                className="flex items-center px-4 py-2 bg-[#e04370] text-white rounded-r-lg"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <Image
                  src={networks.find((n) => n.name === selectedNetwork)?.logo || ""}
                  alt={selectedNetwork}
                  width={24}
                  height={24}
                  className="mr-2"
                />
                <span className="hidden sm:inline">{selectedNetwork}</span>
                <BsChevronDown className="ml-2" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 bg-[#e04370] border border-gray-300 rounded-lg shadow-lg w-40 z-50">
                  {networks.map((network) => (
                    <div
                      key={network.name}
                      className="flex items-center px-4 py-2 cursor-pointer hover:bg-white hover:text-black"
                      onClick={() => {
                        setSelectedNetwork(network.name);
                        setShowDropdown(false);
                      }}
                    >
                      <Image src={network.logo} alt={network.name} width={24} height={24} className="mr-2" />
                      {network.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sélecteur d'authentification */}
          <div className="flex gap-2 mb-4 justify-center">
            <button
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${authProvider === 'instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent' : 'border-gray-300 text-white'}`}
              onClick={() => setAuthProvider("instagram")}
            >
              <FaInstagram className="text-xl" />
              <span>Instagram</span>
            </button>
            
            <button
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${authProvider === 'google' ? 'bg-white text-black border-transparent' : 'border-gray-300 text-white'}`}
              onClick={() => setAuthProvider("google")}
            >
              <FcGoogle className="text-xl" />
              <span>Google</span>
            </button>
          </div>

          <a
            href={getAuthUrl()}
            className="flex items-center justify-center bg-[#FF4F81] text-white py-2 px-4 rounded-lg hover:bg-[#e04370] cursor-pointer w-full text-sm sm:text-base"
          >
            <span>Ajouter un crush via {authProvider === "google" ? "Google" : "Instagram"}</span>
          </a>
        </form>
      </div>
    </div>
  );
};

export default AddModal;
