"use client";

import { use } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import MobileNavBar from "../components/mobile-nav-bar";
import Image from "next/image";
import { getTranslation } from "@/lib/i18n/getTranslation";
import { type Language } from "@/lib/i18n/setting";
import Link from "next/link";

const ProfilePage = ({ params }: { params: Promise<{ lang: Language }> }) => {
  const resolvedParams = use(params);
  const t = getTranslation(resolvedParams.lang);

  // Example user data
  const user = {
    name: "Alex Johnson",
    bio: "Loves basketball, coding, and traveling. Always looking for new adventures!",
    avatar: "/images/users/avatar.webp",
    friends: 120,
    crushes: 24,
    isOnline: true,
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col text-white bg-[#1C1F3F]"
      style={{
        backgroundImage: "url('/images/ui/bg-pattern.webp')",
      }}
    >
      <main className="flex-1 flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center w-full">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
              <Image
                src={user.avatar}
                alt={t.profile?.avatar || "Profile"}
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
            {/* User Info */}
            <div className="flex-1 flex flex-col gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {user.name}
              </h1>
              <p className="text-gray-700 text-sm sm:text-base">
                {user.bio}
              </p>
              {/* Stats */}
              <div className="flex gap-4 mt-4">
                <div className="text-center">
                  <p className="text-gray-900 font-bold text-lg">
                    {user.friends}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {t.profile?.friends || "Friends"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-900 font-bold text-lg">
                    {user.crushes}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {t.profile?.crushes || "Crushes"}
                  </p>
                </div>
                <div className="text-center">
                  <p
                    className={`text-gray-900 font-bold text-lg ${
                      user.isOnline ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {user.isOnline
                      ? t.profile?.online || "Online"
                      : t.profile?.offline || "Offline"}
                  </p>
                </div>
              </div>
            </div>
            {/* Edit Button */}
            <Link
              href={`/${resolvedParams.lang}/profile/edit`}
              className="px-4 py-2 bg-[#23233D] text-white rounded-lg hover:bg-[#2F2F4D] transition-colors duration-200"
            >
              {t.profile?.edit || "Edit Profile"}
            </Link>
          </div>

          {/* Recent Activity or Connections */}
          <div className="w-full max-w-3xl mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              {t.profile?.recent || "Recent Connections"}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {/* Example: You can reuse your AdmirerCard here */}
              {/* <AdmirerCard userName="Kobe Bryant" isOnline={true} params={{ lang: resolvedParams.lang }} /> */}
              {/* <AdmirerCard userName="Michael Jordan" isOnline={true} params={{ lang: resolvedParams.lang }} /> */}
              <div className="bg-white/10 text-center p-4 rounded-lg text-white">
                {t.profile?.noActivity || "No recent activity"}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer className="hidden md:block" lang={resolvedParams.lang} />
      <MobileNavBar
        className="block md:hidden"
        activePage="profile"
        params={{ lang: resolvedParams.lang }}
      />
    </div>
  );
};

export default ProfilePage;
