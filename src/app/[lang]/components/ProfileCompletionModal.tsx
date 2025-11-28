"use client";
// Utilitaire pour afficher les erreurs push traduites
const getPushErrorMessage = (err: string | null, t: { notifications?: { push?: { errors?: Record<string, string> } } }) => {
  if (!err) return null;
  if (t.notifications?.push?.errors && t.notifications.push.errors[err]) return t.notifications.push.errors[err];
  return err;
};

import React, { useState, useEffect, useRef, useMemo } from "react";
// Procédé identique à la page notifications
async function activatePushNotifications() {
  try {
    if (!('serviceWorker' in navigator)) throw new Error('Service Worker non supporté');
    // Enregistrement du Service Worker si non déjà fait
    try {
      await navigator.serviceWorker.register('/sw.js');
    } catch {
      throw new Error('Erreur enregistrement Service Worker');
    }
    // Attente que le SW soit prêt
    let reg;
    try {
      reg = await navigator.serviceWorker.ready;
    } catch {
      throw new Error('Service Worker non prêt');
    }
    // Demande de permission
    let permission;
    try {
      permission = await Notification.requestPermission();
    } catch {
      throw new Error('Erreur permission notification');
    }
    if (permission !== "granted") throw new Error("Permission refusée");
    // Abonnement push
    const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
    const urlBase64ToUint8Array = (base64String: string) => {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
      const rawData = atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    };
    let subscription;
    try {
      subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    } catch {
      throw new Error('Erreur abonnement push');
    }
    // Sérialisation et envoi à l’API
    const subscriptionJson = JSON.parse(JSON.stringify(subscription));
    const userId = window?.localStorage?.getItem('userId') || null;
    if (!userId) throw new Error("Utilisateur non authentifié");
    const res = await fetch('/api/save-push-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, subscription: subscriptionJson }),
    });
    let data = {};
    try {
      data = await res.json();
    } catch {}
    if (!res.ok) {
      const apiError = typeof data === 'object' && 'error' in data ? (data as Record<string, unknown>).error as string : undefined;
      throw new Error(apiError || "Erreur lors de l'enregistrement de l'abonnement");
    }
    return true;
  } catch (e: unknown) {
    throw new Error(e instanceof Error ? e.message : "Erreur d'abonnement push");
  }
}
import { getTranslation } from '@/lib/i18n/getTranslation';
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FaUser, FaMapMarkerAlt, FaHeart, FaStar } from "react-icons/fa";

type ProfileCompletionModalProps = {
  lang: string;
};

export default function ProfileCompletionModal({ lang }: ProfileCompletionModalProps) {
  const { data: session, status } = useSession();
  // Stocke l'userId dans le localStorage dès que la session est authentifiée
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      localStorage.setItem('userId', session.user.id);
    }
  }, [status, session]);
  // Stocke l'userId dans le localStorage dès que la session est authentifiée
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      localStorage.setItem('userId', session.user.id);
    }
  }, [status, session]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Si on modifie la ville, lancer l'autocomplétion
    if (name === "location") {
      if (value.length >= 2) {
        fetchCitySuggestions(value);
      } else {
        setCitySuggestions([]);
        setShowCitySuggestions(false);
      }
    }
  };
  const t = useMemo(() => getTranslation(lang as 'fr' | 'en'), [lang]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    age: "",
    location: "",
    gender: "",
    bio: "",
    interests: [] as string[],
    newInterest: "",
  });
  const [error, setError] = useState("");
  const [wantsPush, setWantsPush] = useState(false);
  const [pushError, setPushError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  // Langue dynamique via pathname (useMemo plus haut)
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const cityInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const hasClosedModal = localStorage.getItem('profileCompletionModalClosed');
    // On considère la page d'accueil et la page profil comme / ou /fr ou /en ou /fr/profile etc.
    const isOnProfilePage = typeof window !== 'undefined' && window.location.pathname.includes('/profile');
    const isHomePage = typeof window !== 'undefined' && (window.location.pathname === '/' || /^\/[a-zA-Z]{2}(-[a-zA-Z]{2})?$/.test(window.location.pathname));
    const shouldShow = 
      status === 'authenticated' &&
      session?.user &&
      !session.user.profileComplete &&
      !isOnProfilePage &&
      !isHomePage &&
      !hasClosedModal;
    setIsOpen(!!shouldShow);
  }, [session, status, lang]);

  // Appel API GeoDB Cities pour suggestions
  const fetchCitySuggestions = async (query: string) => {
    try {
      const res = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=5&namePrefix=${encodeURIComponent(query)}`,
        {
          headers: {
            'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '',
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
          },
        }
      );
      const data = await res.json();
      if (data.data) {
        setCitySuggestions(data.data.map((city: { city: string; country: string }) => `${city.city}, ${city.country}`));
        setShowCitySuggestions(true);
      } else {
        setCitySuggestions([]);
        setShowCitySuggestions(false);
      }
    } catch {
      setCitySuggestions([]);
      setShowCitySuggestions(false);
    }
  };

  const handleInterestInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, newInterest: value }));
    if (value.trim().length > 0) {
      const availableInterests = t.settings.sections.interests.suggestions || [];
      const filtered = availableInterests.filter((interest: string) =>
        interest.toLowerCase().includes(value.toLowerCase()) && !form.interests.includes(interest)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  };

  const handleAddInterest = (interest?: string) => {
    const interestToAdd = interest || form.newInterest.trim();
    if (interestToAdd && form.interests.length < 10 && !form.interests.includes(interestToAdd)) {
      setForm((prev) => ({ ...prev, interests: [...prev.interests, interestToAdd], newInterest: "" }));
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  };

  const handleRemoveInterest = (idx: number) => {
  setForm((prev) => ({ ...prev, interests: prev.interests.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPushError(null);
    if (!form.age || !form.location || !form.gender || !form.bio || form.interests.length < 2) {
      setError(
        t.settings?.messages?.formIncomplete
        || "Merci de remplir tous les champs, de choisir un sexe et d'ajouter au moins 2 centres d'intérêt."
      );
      return;
    }
    // Si l'utilisateur veut les notifications push, on active
    if (wantsPush) {
      const ok = await activatePushNotifications();
      if (!ok) {
        setPushError("Impossible d'activer les notifications push. Vérifiez les permissions ou réessayez plus tard.");
        return;
      }
    }
    // Appel API pour sauvegarder le profil (à adapter selon votre API)
    try {
      const res = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session?.user?.email,
          age: form.age,
          location: form.location,
          gender: form.gender,
          bio: form.bio,
          interests: form.interests,
        }),
      });
      if (!res.ok) throw new Error('Erreur lors de la sauvegarde');
      // Fermer le modal après succès
      setIsOpen(false);
      localStorage.setItem('profileCompletionModalClosed', 'true');
      window.location.reload();
    } catch {
      setError("Erreur lors de la sauvegarde du profil.");
    }
  };

  // Ne rien afficher si l'utilisateur n'est pas authentifié
  if (status === 'loading') {
    return null;
  }

  if (status === 'unauthenticated' || !session?.user || !session.user.email) {
    return null;
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black z-40 p-1 sm:p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", minHeight: '100dvh' }}
    >
      {pushError && (
        <div className="text-red-500 text-sm mb-4 text-center">
          {getPushErrorMessage(pushError, t)}
        </div>
      )}
      <form
        className="bg-[#1C1F3F] w-full max-w-[98vw] sm:max-w-[420px] md:max-w-[520px] lg:max-w-[600px] flex flex-col gap-6 rounded-2xl p-2 sm:p-5 md:p-8 max-h-[92dvh] overflow-y-auto shadow-2xl"
        style={{ maxHeight: '92dvh', minWidth: 0 }}
        onSubmit={handleSubmit}
        onClick={e => e.stopPropagation()}
      >
        {/* Header avec logo */}
        <div className="mb-4 border-b-2 border-white pb-2 flex items-center justify-center">
          <Image 
            src="/images/ui/welcome.png"
            alt="WhoLikeMe Logo" 
            width={211} 
            height={80} 
          />
        </div>

        {/* Titre */}
        <div className="text-center">
          <h2 className="text-white font-bold text-2xl md:text-[36px] leading-[100%] tracking-[1%] font-poppins">
            {t.settings?.title || "Complète ton profil 🎉"}
          </h2>
        </div>

        {/* Inputs du formulaire */}
        <div className="space-y-4">
          <div>
            <label className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
              <FaUser className="text-[#FF4F81] text-lg" /> {t.settings?.sections?.personalInfo?.age?.label || "Ton âge"}
            </label>
            <input
              type="number"
              name="age"
              min="18"
              max="100"
              value={form.age}
              onChange={handleInputChange}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FF4F81]"
              placeholder={t.settings?.sections?.personalInfo?.age?.placeholder || "Ex: 25"}
              required
            />
          </div>
          <div>
            <label className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
              {t.settings?.sections?.personalInfo?.gender?.label || "Sexe"}
            </label>
            <div className="flex gap-2">
              {[
                { value: "male", label: t.settings?.sections?.personalInfo?.gender?.male },
                { value: "female", label: t.settings?.sections?.personalInfo?.gender?.female },
                { value: "other", label: t.settings?.sections?.personalInfo?.gender?.other },
              ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, gender: option.value }))}
                    className={`px-6 py-3 rounded-lg font-medium border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF4F81] focus:ring-opacity-50 cursor-pointer
                      ${form.gender === option.value
                        ? 'bg-[#FF4F81] text-white border-[#FF4F81] shadow-lg scale-105'
                        : 'bg-white/10 text-white/70 border-white/20 hover:bg-[#FF4F81]/20 hover:text-white hover:border-[#FF4F81]'}
                    `}
                    aria-pressed={form.gender === option.value}
                  >
                    {option.label}
                  </button>
                ))}
            </div>
          </div>
          <div>
            <label className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
              <FaMapMarkerAlt className="text-[#FF4F81] text-lg" /> {t.settings?.sections?.personalInfo?.location?.label || "Ta localisation"}
            </label>
            <div className="relative">
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FF4F81]"
                placeholder={t.settings?.sections?.personalInfo?.location?.placeholder || "Ville, Pays"}
                required
                autoComplete="off"
                ref={cityInputRef}
                onFocus={() => { if (citySuggestions.length > 0) setShowCitySuggestions(true); }}
              />
              {showCitySuggestions && citySuggestions.length > 0 && (
                <ul className="absolute left-0 right-0 bg-[#23244a] border border-white/10 rounded-lg mt-1 z-50 max-h-48 overflow-y-auto shadow-lg">
                  {citySuggestions.map((suggestion, idx) => (
                    <li
                      key={suggestion + idx}
                      className="px-4 py-2 cursor-pointer hover:bg-[#FF4F81]/20 text-white"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, location: suggestion }));
                        setShowCitySuggestions(false);
                        setCitySuggestions([]);
                      }}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div>
            <label className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
              <FaHeart className="text-[#FF4F81] text-lg" /> {t.settings?.sections?.about?.title || "Une bio qui te représente"}
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleInputChange}
              rows={3}
              maxLength={500}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FF4F81]"
              placeholder={t.settings?.sections?.about?.placeholder || "Parle-nous de toi..."}
              required
            />
          </div>
          <div>
            <label className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
              <FaStar className="text-[#FF4F81] text-lg" /> {t.settings?.sections?.interests?.title || "Tes centres d'intérêt (min. 2)"}
            </label>
            <div className="flex gap-2 mb-2 interests-input-container relative">
              <input
                type="text"
                name="newInterest"
                value={form.newInterest}
                onChange={handleInterestInputChange}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddInterest();
                  }
                }}
                onFocus={() => {
                  if (form.newInterest.trim().length > 0 && filteredSuggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FF4F81]"
                placeholder={t.settings?.sections?.interests?.placeholder || "Add an interest..."}
                maxLength={50}
                autoComplete="off"
              />
              {/* Dropdown des suggestions */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-[#23244a] border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {filteredSuggestions.slice(0, 10).map((suggestion: string, index: number) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleAddInterest(suggestion)}
                      className="w-full text-left px-4 py-3 text-white hover:bg-[#FF4F81]/20 transition-colors border-b border-white/10 last:border-b-0 cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => handleAddInterest()}
                disabled={form.interests.length >= 10 || !form.newInterest.trim()}
                className="bg-[#FF4F81] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#e04370] transition-colors"
              >
                {t.settings?.sections?.interests?.addButton || "Add"}
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {form.interests.map((interest: string, idx: number) => (
                <span
                  key={interest + idx}
                  className="bg-[#FF4F81]/20 border border-[#FF4F81]/50 text-white px-4 py-2 rounded-full flex items-center gap-2"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(idx)}
                    className="ml-2 text-[#FF4F81] hover:text-[#e04370]"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <p className="text-white/40 text-xs mt-2">
              {form.interests.length}/10 {t.settings?.sections?.interests?.count || "interests"}
            </p>
          </div>
          {/* Checkbox notifications push - juste après le compteur d'intérêts */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="push-notif-checkbox"
                checked={wantsPush}
                onChange={e => setWantsPush(e.target.checked)}
                className="w-5 h-5 accent-[#FF4F81]"
              />
              <label htmlFor="push-notif-checkbox" className="text-white/80 text-sm">
                {t.settings?.sections?.pushOptin?.label}
              </label>
            </div>
            {pushError && <p className="text-red-400 text-xs mt-1">{pushError}</p>}
        </div>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        {/* Bouton Valider */}
         <button
           type="submit"
           className="bg-[#FF4F81] text-white font-semibold py-3 px-6 rounded-lg cursor-pointer hover:bg-[#e04370] transition-colors mt-4"
         >
           {t.settings?.buttons?.save || "Valider"}
         </button>

        {/* Note informative */}
         <p className="text-white/60 text-xs text-center leading-relaxed mt-2">
           {t.settings?.subtitle || "Ces informations nous aident à te proposer de meilleures suggestions"}
         </p>
      </form>
    </div>
  );
}