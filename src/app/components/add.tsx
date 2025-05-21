import React, { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";

interface AddModalProps {
  showAddModal: boolean;
  handleCloseAddCrushModal: () => void;
}

const AddModal: React.FC<AddModalProps> = ({ showAddModal, handleCloseAddCrushModal }) => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:3000/callback&response_type=code&scope=email profile`;
  console.log(process.env.GOOGLE_CLIENT_ID);

  const [name, setName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Simplified network selection without images for now
  const [selectedNetwork] = useState("Instagram");

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
        <h2 className="text-left text-lg sm:text-xl mb-6 border-b-2 border-white pb-4">
          Ajouter un crush
        </h2>
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
                <span className="hidden sm:inline">{selectedNetwork}</span>
                <BsChevronDown className="ml-2" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 bg-[#e04370] border border-gray-300 rounded-lg shadow-lg w-40">
                  {/* Network dropdown content will be added later */}
                </div>
              )}
            </div>
          </div>
          <a
            href={authUrl}
            className="flex items-center justify-center bg-[#FF4F81] text-white py-2 px-4 rounded-lg hover:bg-[#e04370] cursor-pointer w-full text-sm sm:text-base"
          >
            <span>Ajouter un crush</span>
          </a>
        </form>
      </div>
    </div>
  );
};

export default AddModal;