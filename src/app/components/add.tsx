import React, { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import Image from "next/image";
import googleLogo from "../../../public/assets/login/google.png";

interface AddModalProps {
  showAddModal: boolean;
  handleCloseAddCrushModal: () => void;
}

const AddModal: React.FC<AddModalProps> = ({ showAddModal, handleCloseAddCrushModal }) => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:3000/callback&response_type=code&scope=email profile`;
  console.log(process.env.GOOGLE_CLIENT_ID);  // Vérifie que la valeur du client_id est bien lue


  const [name, setName] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("Instagram");
  const [showDropdown, setShowDropdown] = useState(false);

  const networks = [
    { name: "Instagram", logo: "/assets/networks/instagram.svg" },
    { name: "Facebook", logo: "/assets/networks/facebook.png" },
    { name: "Snapchat", logo: "/assets/networks/snapchat.svg" },
    { name: "Twitter", logo: "/assets/networks/twitter.png" },
    { name: "TikTok", logo: "/assets/networks/tiktok.svg" },
  ];

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
                <div className="absolute right-0 mt-2 bg-[#e04370] border border-gray-300 rounded-lg shadow-lg w-40">
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
          <a
            href={authUrl}
            className="flex items-center justify-center bg-[#FF4F81] text-white py-2 px-4 rounded-lg hover:bg-[#e04370] cursor-pointer w-full text-sm sm:text-base"
          >
            <span>Ajouter un crush</span>
            <Image src={googleLogo} alt="Google" width={24} height={24} className="ml-3" />
          </a>
        </form>
      </div>
    </div>
  );
};

export default AddModal;
