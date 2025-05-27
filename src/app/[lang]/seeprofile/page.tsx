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
    bio: "Loves basketball, coding, and traveling. Always looking for new adventures! 🏀✈️💻",
    avatar: "/images/users/avatar.webp",
    friends: 120,
    crushes: 24,
    matches: 8,
    isOnline: true,
    interests: ["Basketball", "Travel", "Coding", "Photography", "Music"],
    age: 24,
    location: "San Francisco, CA"
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col text-white bg-[#1C1F3F]"
      style={{
        backgroundImage: "url('/images/ui/bg-pattern.webp')",
      }}
    >
      <main className="flex-1 flex flex-col items-center w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col items-center w-full space-y-8">
          
          {/* Main Profile Card */}
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-3xl p-4 sm:p-6 border border-white/20 hover:bg-black/30 hover:shadow-3xl transition-all duration-300 group">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              
              {/* Avatar Section */}
              <div className="relative group/avatar">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full blur-sm opacity-75 group-hover/avatar:opacity-100 transition-all duration-300"></div>
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-3 border-white/50 shadow-xl">
                  <Image
                    src={user.avatar}
                    alt={t.profile?.avatar || "Profile"}
                    width={112}
                    height={112}
                    className="object-cover w-full h-full group-hover/avatar:scale-110 transition-transform duration-500"
                  />
                  {/* Online indicator */}
                  {user.isOnline && (
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg">
                      <div className="w-full h-full bg-green-400 rounded-full animate-ping opacity-75"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* User Info Section */}
              <div className="flex-1 text-center sm:text-left space-y-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    {user.name}
                  </h1>
                  <p className="text-white/70 text-sm flex items-center justify-center sm:justify-start gap-2">
                    <span>📍</span> {user.location} • {user.age} years old
                  </p>
                </div>
                
                <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                  {user.bio}
                </p>

                {/* Interests Tags */}
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {user.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/10 backdrop-blur-sm text-white/90 rounded-full text-xs sm:text-sm font-medium border border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-200 hover:scale-105 cursor-default"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
                <div className="flex justify-center pt-3">
  <div className="grid grid-cols-3 gap-2 sm:gap-3">
    {/* ...stat items */}
  </div>
</div>


                {/* Stats Section */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3">
                  {[
                    { label: t.profile?.friends || "Admirator", value: user.friends, icon: "👥", color: "text-blue-300" },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="text-center p-2 sm:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 hover:scale-105 cursor-default group/stat"
                    >
                      <div className="text-base sm:text-lg mb-1 group-hover/stat:scale-110 transition-transform duration-300">
                        {stat.icon}
                      </div>
                      <div className={`text-sm sm:text-base font-bold ${stat.color} mb-1`}>
                        {stat.value}
                      </div>
                      <div className="text-white/60 text-xs font-medium">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
                
              </div>

            </div>
          </div>

          {/* Action Button */}
          <div className="w-full max-w-xs px-4">
            <Link
              href={`/${resolvedParams.lang}/discover`}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-4 rounded-xl font-bold text-center hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center justify-center gap-2 text-base"
            >
              <span className="text-lg">🔥</span>
              Start Matching
            </Link>
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