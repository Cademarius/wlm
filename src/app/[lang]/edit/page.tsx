"use client";

import { use, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import MobileNavBar from "../components/mobile-nav-bar";
import Image from "next/image";
import { getTranslation } from "@/lib/i18n/getTranslation";
import { type Language } from "@/lib/i18n/setting";
import Link from "next/link";

const EditProfilePage = ({ params }: { params: Promise<{ lang: Language }> }) => {
  const resolvedParams = use(params);
  const t = getTranslation(resolvedParams.lang);

  // Example user data - in a real app this would come from your backend
  const [user, setUser] = useState({
    name: "Alex Johnson", // Not editable
    avatar: "/images/users/avatar.webp", // Not editable in this form
    birthday: "1999-03-15",
    location: "San Francisco, CA",
    bio: "Loves basketball, coding, and traveling. Always looking for new adventures! 🏀✈️💻",
    interests: ["Basketball", "Travel", "Coding", "Photography", "Music"],
  });

  const [newInterest, setNewInterest] = useState("");

  const availableInterests = [
    "Basketball", "Football", "Tennis", "Swimming", "Running",
    "Travel", "Photography", "Music", "Movies", "Reading",
    "Coding", "Gaming", "Art", "Cooking", "Dancing",
    "Hiking", "Yoga", "Gym", "Fashion", "Netflix"
  ];

  const handleAddInterest = () => {
    if (newInterest.trim() && !user.interests.includes(newInterest.trim()) && user.interests.length < 8) {
      setUser(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setUser(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  const handleQuickAddInterest = (interest: string) => {
    if (!user.interests.includes(interest) && user.interests.length < 8) {
      setUser(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
  };

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log("Saving profile:", user);
    // Navigate back to profile page
    window.location.href = `/${resolvedParams.lang}/profile`;
  };

  const calculateAge = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col text-white bg-[#1C1F3F]"
      style={{
        backgroundImage: "url('/images/ui/bg-pattern.webp')",
      }}
    >
      <main className="flex-1 flex flex-col items-center w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col items-center w-full space-y-6">
          
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              ✏️ Edit Profile
            </h1>
            <p className="text-white/70 text-sm sm:text-base">
              Update your information to attract the right matches
            </p>
          </div>

          {/* Edit Form Card */}
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-3xl p-4 sm:p-6 border border-white/20 hover:bg-black/30 transition-all duration-300">
            
            {/* Non-editable Profile Header */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 pb-6 border-b border-white/20">
              <div className="relative group/avatar">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full blur-sm opacity-75 transition-all duration-300"></div>
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 border-white/50 shadow-xl">
                  <Image
                    src={user.avatar}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  {user.name}
                </h2>
                <p className="text-white/70 text-sm">
                  {calculateAge(user.birthday)} years old • {user.location}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              
              {/* Birthday Field */}
              <div className="space-y-2">
                <label className="block text-white font-semibold text-sm sm:text-base">
                  🎂 Birthday
                </label>
                <input
                  type="date"
                  value={user.birthday}
                  onChange={(e) => setUser(prev => ({ ...prev, birthday: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-white/60 text-xs sm:text-sm">
                  Current age: {calculateAge(user.birthday)} years old
                </p>
              </div>

              {/* Location Field */}
              <div className="space-y-2">
                <label className="block text-white font-semibold text-sm sm:text-base">
                  📍 Location
                </label>
                <input
                  type="text"
                  value={user.location}
                  onChange={(e) => setUser(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter your city, state"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Bio/Description Field */}
              <div className="space-y-2">
                <label className="block text-white font-semibold text-sm sm:text-base">
                  📝 About You
                </label>
                <textarea
                  value={user.bio}
                  onChange={(e) => setUser(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell people about yourself, your hobbies, what you're looking for..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 resize-none"
                />
                <p className="text-white/60 text-xs sm:text-sm text-right">
                  {user.bio.length}/500 characters
                </p>
              </div>

              {/* Interests Section */}
              <div className="space-y-4">
                <label className="block text-white font-semibold text-sm sm:text-base">
                  ❤️ Interests (Max 8)
                </label>
                
                {/* Current Interests */}
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white/90 rounded-full text-xs sm:text-sm font-medium border border-white/30 flex items-center gap-2 group hover:bg-white/20 transition-all duration-200"
                    >
                      {interest}
                      <button
                        onClick={() => handleRemoveInterest(interest)}
                        className="text-white/60 hover:text-red-400 transition-colors duration-200 group-hover:scale-110"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Interest Input */}
                {user.interests.length < 5 && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                      placeholder="Add an interest..."
                      className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-sm"
                    />
                    <button
                      onClick={handleAddInterest}
                      disabled={!newInterest.trim() || user.interests.includes(newInterest.trim())}
                      className="px-4 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-white/10 disabled:text-white/50 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 text-sm"
                    >
                      Add
                    </button>
                  </div>
                )}

                {/* Quick Add Interests */}
                {user.interests.length < 8 && (
                  <div className="space-y-2">
                    <p className="text-white/70 text-xs sm:text-sm">Quick add popular interests:</p>
                    <div className="flex flex-wrap gap-2">
                      {availableInterests
                        .filter(interest => !user.interests.includes(interest))
                        .slice(0, 8)
                        .map((interest, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickAddInterest(interest)}
                          className="px-3 py-1 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white rounded-full text-xs font-medium border border-white/20 hover:border-white/40 transition-all duration-200 hover:scale-105"
                        >
                          + {interest}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Link
              href={`/${resolvedParams.lang}/profile`}
              className="flex-1 bg-white/10 backdrop-blur-sm text-white py-3 px-4 rounded-xl font-semibold text-center border border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
            >
              Cancel
            </Link>
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-4 rounded-xl font-bold text-center hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
            >
              💾 Save Changes
            </button>
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

export default EditProfilePage;