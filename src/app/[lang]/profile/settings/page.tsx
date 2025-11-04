"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../components/AuthGuard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, MapPin, Heart, Save, ArrowLeft } from "lucide-react";
import { getTranslation } from '@/lib/i18n/getTranslation';
import { type Language } from '@/lib/i18n/setting';
import Header from "../../components/header";
import MobileNavBar from "../../components/mobile-nav-bar";
import Toast from "../../components/Toast";
import { useToast } from "@/hooks/useToast";

type SettingsPageProps = {
  params: Promise<{ lang: Language }>;
};

export default function ProfileSettingsPage({ params }: SettingsPageProps) {
  const { user } = useAuth();
  const { update: updateSession } = useSession();
  const router = useRouter();
  const [lang, setLang] = useState<Language>('fr');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast, success, error, hideToast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    bio: "",
    location: "",
    interests: [] as string[],
    image: "",
  });

  const [newInterest, setNewInterest] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    params.then(p => setLang(p.lang));
  }, [params]);

  const t = getTranslation(lang);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.email) {
        try {
          const response = await fetch(`/api/get-user?email=${encodeURIComponent(user.email)}`);
          const data = await response.json();
          
          if (response.ok && data.user) {
            setFormData({
              name: data.user.name || "",
              age: data.user.age?.toString() || "",
              bio: data.user.bio || "",
              location: data.user.location || "",
              interests: data.user.interests || [],
              image: data.user.image || "",
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  if (!user) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addInterest = () => {
    if (newInterest.trim() && formData.interests.length < 10) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest("");
    }
  };

  const removeInterest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      error("Seules les images JPEG, PNG et WebP sont autorisées");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      error("La taille du fichier ne doit pas dépasser 5 MB");
      return;
    }

    // Sauvegarder le fichier pour l'upload lors de l'enregistrement
    setSelectedFile(file);

    // Preview uniquement
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let imageUrl = formData.image; // Image actuelle par défaut

      // 1. Upload de la nouvelle photo si sélectionnée
      if (selectedFile && user?.id) {
        setIsUploading(true);
        const formDataToSend = new FormData();
        formDataToSend.append("file", selectedFile);
        formDataToSend.append("userId", user.id);

        const uploadResponse = await fetch("/api/upload-avatar", {
          method: "POST",
          body: formDataToSend,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadData.error || "Failed to upload image");
        }

        imageUrl = uploadData.imageUrl; // Nouvelle URL de l'image
        setIsUploading(false);
      }

      // 2. Mise à jour du profil (avec la nouvelle image si uploadée)
      const response = await fetch("/api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          name: formData.name,
          age: formData.age || null,
          bio: formData.bio,
          interests: formData.interests,
          location: formData.location,
          image: imageUrl, // Inclure l'image (nouvelle ou existante)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      // 3. Mettre à jour la session NextAuth
      await updateSession();
      
      // 4. Rafraîchir les données côté serveur (force le re-fetch)
      router.refresh();
      
      // 5. Reset du preview et du fichier sélectionné
      setPreviewImage(null);
      setSelectedFile(null);
      
      // 6. Mettre à jour le formData localement
      setFormData(prev => ({ 
        ...prev, 
        image: imageUrl,
        name: formData.name 
      }));
      
      success(`${t.settings.messages.success} 🎉`);
      
      // 7. Navigation fluide vers la page profil (pas de page blanche)
      setTimeout(() => {
        router.push(`/${lang}/profile`);
      }, 1500);
    } catch (err) {
      console.error("Error saving profile:", err);
      error(t.settings.messages.error);
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

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
        className="min-h-screen bg-[#1C1F3F] flex flex-col"
        style={{
          backgroundImage: "url('/images/ui/bg-pattern.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed"
        }}
      >
        <Header lang={lang} />
      
      <main className="flex-1 py-6 sm:py-8 xl:py-12 px-4 sm:px-6 xl:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200 mb-6 cursor-pointer"
          >
            <ArrowLeft size={20} />
            <span>{t.settings.backButton}</span>
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {t.settings.title}
            </h1>
            <p className="text-white/60">
              {t.settings.subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo de profil */}
            <div className="bg-gradient-to-r from-[#2A2E5A] to-[#1C1F3F] rounded-2xl p-6 border border-[#FF4F81]/30">
              <h2 className="text-xl font-bold text-white mb-4">{t.settings.sections.profilePhoto.title}</h2>
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#FF4F81]">
                    <Image
                      src={previewImage || formData.image || user.image || "/images/users/avatar.webp"}
                      alt={user.name || "User"}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleImageClick}
                    disabled={isUploading}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isUploading ? (
                      <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Camera className="text-white" size={32} />
                    )}
                  </button>
                </div>
                <div className="flex-1">
                  <p className="text-white/80 text-sm mb-2">
                    {previewImage ? t.settings.sections.profilePhoto.newPhoto : 
                     formData.image && formData.image !== user.image ? t.settings.sections.profilePhoto.customPhoto : 
                     t.settings.sections.profilePhoto.googlePhoto}
                  </p>
                  <button
                    type="button"
                    onClick={handleImageClick}
                    className="text-[#FF4F81] hover:text-[#FF3D6D] text-sm font-medium cursor-pointer"
                  >
                    {t.settings.sections.profilePhoto.changePhoto}
                  </button>
                  {previewImage && (
                    <p className="text-yellow-400 text-xs mt-1">
                      ⚠️ {t.settings.sections.profilePhoto.saveWarning}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Input caché */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Informations personnelles */}
            <div className="bg-gradient-to-r from-[#2A2E5A] to-[#1C1F3F] rounded-2xl p-6 border border-[#FF4F81]/30">
              <h2 className="text-xl font-bold text-white mb-4">{t.settings.sections.personalInfo.title}</h2>
              
              <div className="space-y-4">
                {/* Nom */}
                <div>
                  <label htmlFor="name" className="block text-white/80 text-sm font-medium mb-2">
                    {t.settings.sections.personalInfo.name.label}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FF4F81] transition-colors"
                    placeholder={t.settings.sections.personalInfo.name.placeholder}
                  />
                </div>

                {/* Âge */}
                <div>
                  <label htmlFor="age" className="block text-white/80 text-sm font-medium mb-2">
                    {t.settings.sections.personalInfo.age.label}
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="18"
                    max="100"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FF4F81] transition-colors"
                    placeholder={t.settings.sections.personalInfo.age.placeholder}
                  />
                </div>

                {/* Localisation */}
                <div>
                  <label htmlFor="location" className="flex items-center gap-2 text-white/80 text-sm font-medium mb-2">
                    <MapPin size={16} />
                    {t.settings.sections.personalInfo.location.label}
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FF4F81] transition-colors"
                    placeholder={t.settings.sections.personalInfo.location.placeholder}
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-gradient-to-r from-[#2A2E5A] to-[#1C1F3F] rounded-2xl p-6 border border-[#FF4F81]/30">
              <h2 className="text-xl font-bold text-white mb-4">{t.settings.sections.about.title}</h2>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                maxLength={500}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FF4F81] transition-colors resize-none"
                placeholder={t.settings.sections.about.placeholder}
              />
              <p className="text-white/40 text-xs mt-2">
                {formData.bio.length}/500 {t.settings.sections.about.charactersCount}
              </p>
            </div>

            {/* Passions / Intérêts */}
            <div className="bg-gradient-to-r from-[#2A2E5A] to-[#1C1F3F] rounded-2xl p-6 border border-[#FF4F81]/30">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Heart size={20} className="text-[#FF4F81]" />
                {t.settings.sections.interests.title}
              </h2>
              
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FF4F81] transition-colors"
                    placeholder={t.settings.sections.interests.placeholder}
                    maxLength={30}
                  />
                  <button
                    type="button"
                    onClick={addInterest}
                    disabled={formData.interests.length >= 10}
                    className="bg-[#FF4F81] hover:bg-[#FF3D6D] text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {t.settings.sections.interests.addButton}
                  </button>
                </div>
                <p className="text-white/40 text-xs mt-2">
                  {formData.interests.length}/10 {t.settings.sections.interests.count}
                </p>
              </div>

              {/* Liste des intérêts */}
              {formData.interests.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest, index) => (
                    <div
                      key={index}
                      className="bg-[#FF4F81]/20 border border-[#FF4F81]/50 text-white px-4 py-2 rounded-full flex items-center gap-2"
                    >
                      <span>{interest}</span>
                      <button
                        type="button"
                        onClick={() => removeInterest(index)}
                        className="text-white/70 hover:text-white transition-colors cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-xl font-medium transition-colors cursor-pointer"
              >
                {t.settings.buttons.cancel}
              </button>
              <button
                type="submit"
                disabled={isSaving || isUploading}
                className="flex-1 bg-[#FF4F81] hover:bg-[#FF3D6D] text-white px-6 py-4 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t.settings.buttons.uploading}
                  </>
                ) : isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t.settings.buttons.saving}
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    {t.settings.buttons.save}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
      
      <MobileNavBar className="block xl:hidden" activePage="profile" params={{ lang }} />
      </div>
    </>
  );
}
