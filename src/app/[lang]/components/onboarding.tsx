"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Camera, MapPin, Heart, ArrowRight, ArrowLeft } from "lucide-react";
import { type Language } from '@/lib/i18n/setting';

interface OnboardingModalProps {
  showModal: boolean;
  handleClose: () => void;
  params: { lang: Language };
  userEmail: string;
  userId: string;
  currentImage?: string;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ 
  showModal, 
  handleClose,
  userEmail,
  userId,
  currentImage
}) => {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // États du formulaire
  const [formData, setFormData] = useState({
    image: currentImage || "",
    name: "",
    age: "",
    location: "",
    bio: "",
    interests: [] as string[],
  });

  const [newInterest, setNewInterest] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (!showModal) return null;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Seules les images JPEG, PNG et WebP sont autorisées");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("La taille du fichier ne doit pas dépasser 5 MB");
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setIsUploading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);
      formDataToSend.append("userId", userId);

      const response = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      setFormData(prev => ({ ...prev, image: data.imageUrl }));
      alert("Photo téléchargée avec succès !");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Erreur lors du téléchargement de l'image");
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
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

  const handleFinish = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          name: formData.name,
          age: formData.age || null,
          bio: formData.bio,
          interests: formData.interests,
          location: formData.location,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      // Marquer l'onboarding comme complété
      localStorage.setItem("onboarding_completed", "true");
      handleClose();
      
      // Recharger la page pour mettre à jour les données
      window.location.reload();
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.image || previewImage;
      case 2:
        return formData.name.trim().length > 0;
      case 3:
        return formData.bio.trim().length > 0;
      case 4:
        return formData.interests.length > 0;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-white font-bold text-2xl md:text-3xl mb-4 text-center">
              Photo de profil
            </h2>
            <p className="text-white/70 text-center mb-8">
              Ajoutez une photo pour personnaliser votre profil
            </p>

            <div className="relative group mb-6">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#FF4F81] shadow-xl">
                <Image
                  src={previewImage || formData.image || "/images/users/avatar.webp"}
                  alt="Profile"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={handleImageClick}
                disabled={isUploading}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              >
                {isUploading ? (
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Camera className="text-white" size={40} />
                )}
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={handleImageClick}
              disabled={isUploading}
              className="bg-[#FF4F81] hover:bg-[#FF3D6D] text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isUploading ? "Téléchargement..." : "Choisir une photo"}
            </button>
          </div>
        );

      case 2:
        return (
          <div className="w-full">
            <h2 className="text-white font-bold text-2xl md:text-3xl mb-4 text-center">
              Informations personnelles
            </h2>
            <p className="text-white/70 text-center mb-8">
              Parlez-nous un peu de vous
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FF4F81] transition-colors"
                  placeholder="Votre nom"
                  required
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Âge
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="18"
                  max="100"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FF4F81] transition-colors"
                  placeholder="25"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-white/80 text-sm font-medium mb-2">
                  <MapPin size={16} />
                  Localisation
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FF4F81] transition-colors"
                  placeholder="Paris, France"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="w-full">
            <h2 className="text-white font-bold text-2xl md:text-3xl mb-4 text-center">
              À propos de vous
            </h2>
            <p className="text-white/70 text-center mb-8">
              Écrivez quelques mots pour vous présenter *
            </p>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={6}
              maxLength={500}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FF4F81] transition-colors resize-none"
              placeholder="Parlez-nous de vous, vos passions, ce que vous aimez..."
              required
            />
            <p className="text-white/40 text-xs mt-2">
              {formData.bio.length}/500 caractères
            </p>
          </div>
        );

      case 4:
        return (
          <div className="w-full">
            <h2 className="text-white font-bold text-2xl md:text-3xl mb-4 text-center flex items-center justify-center gap-2">
              <Heart size={28} className="text-[#FF4F81]" />
              Vos passions
            </h2>
            <p className="text-white/70 text-center mb-8">
              Ajoutez au moins un intérêt pour continuer *
            </p>

            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FF4F81] transition-colors"
                  placeholder="Ajouter un intérêt..."
                  maxLength={30}
                />
                <button
                  type="button"
                  onClick={addInterest}
                  disabled={formData.interests.length >= 10}
                  className="bg-[#FF4F81] hover:bg-[#FF3D6D] text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Ajouter
                </button>
              </div>
              <p className="text-white/40 text-xs mt-2">
                {formData.interests.length}/10 intérêts
              </p>
            </div>

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
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="bg-[#1C1F3F] p-6 md:p-10 rounded-2xl w-full max-w-2xl flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                s <= step ? "bg-[#FF4F81]" : "bg-white/20"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-4 pt-4 border-t border-white/10">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowLeft size={20} />
            Précédent
          </button>

          <div className="text-white/60 text-sm">
            Étape {step} sur 4
          </div>

          {step < 4 ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#FF4F81] hover:bg-[#FF3D6D] text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Suivant
              <ArrowRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!canProceed() || isSaving}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#FF4F81] hover:bg-[#FF3D6D] text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  Terminer
                  <Heart size={20} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
