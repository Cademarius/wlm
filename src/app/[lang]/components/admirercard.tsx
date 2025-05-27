import React from "react";
import { getTranslation } from "@/lib/i18n/getTranslation";
import { type Language } from "@/lib/i18n/setting";

interface AdmirerCard {
  userName?: string;
  isOnline?: boolean;
  params: { lang: Language };
}

const AdmirerCard: React.FC<AdmirerCard> = ({
  userName = "Guest",
  isOnline = false,
  params,
}) => {
  const t = getTranslation(params.lang);

  return (
    <div className="bg-white px-3 sm:px-4 md:px-5 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      {/* User Info */}
      <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-0">
        {/* User Avatar */}
        <img
          src="/images/users/avatar.webp"
          alt={t.crushcard.profile}
          width={40}
          height={40}
          className="object-cover rounded-full w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
        />
        {/* User Name */}
        <div>
          <h3 className="text-gray-900 font-medium text-sm sm:text-base md:text-lg">
            {userName}
          </h3>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Heart Icon */}
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500 hover:text-pink-600 transition-colors"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>

        {/* Crossed Heart Icon */}
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-gray-600 transition-colors relative"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          {/* Heart */}
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
          {/* Oblique Line (cross) */}
          <line
            x1="3"
            y1="3"
            x2="17"
            y2="17"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>

        {/* Online Status Dot */}
        <div
          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
            isOnline ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default AdmirerCard;
