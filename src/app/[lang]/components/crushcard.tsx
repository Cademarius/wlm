import React from "react";
import { getTranslation } from "@/lib/i18n/getTranslation";
import { type Language } from "@/lib/i18n/setting";

interface CrushCard {
  userName?: string;
  isOnline?: boolean;
  status?: boolean;
  params: { lang: Language };
}

const UserHeader: React.FC<CrushCard> = ({
  userName = "Guest",
  isOnline = false,
  status = false,
  params,
}) => {
  const t = getTranslation(params.lang);

  return (
    <div className="bg-white px-3 sm:px-4 md:px-5 py-2 sm:py-3 flex flex-col sm:flex-row items-center justify-between w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      {/* User Info */}
      <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-0">
        {/* User Avatar */}
        <img
          src="/images/users/avatar.webp"
          alt={t.crushcard.profile}
          width={40}
          height={40}
          className="object-cover rounded-full w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9"
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
        {/* Status Badge with Hover Animation */}
        <span
          className={`
            px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-200
            ${
              status === true
                ? "bg-green-500 text-white hover:bg-green-600 hover:shadow-md"
                : "bg-yellow-500 text-yellow-900 hover:bg-yellow-600 hover:shadow-md hover:text-white"
            }
          `}
        >
          {status === true ? t.crushcard.accept : t.crushcard.pending}
        </span>

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

export default UserHeader;
