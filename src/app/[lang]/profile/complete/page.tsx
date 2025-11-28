'use client';

import { useParams } from 'next/navigation';
import { getTranslation } from '@/lib/i18n/getTranslation';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Check, User, MapPin, Heart, Sparkles } from 'lucide-react';

const popularInterests = [
  'Sport', 'Musique', 'Cinéma', 'Voyages', 'Cuisine', 'Lecture',
  'Gaming', 'Art', 'Danse', 'Photographie', 'Mode', 'Technologie',
  'Nature', 'Fitness', 'Animaux', 'Séries TV'
];

export default function CompleteProfilePage() {
  const params = useParams();
  const lang = typeof params?.lang === 'string' ? params.lang : 'fr';
  const t = getTranslation(lang as 'fr' | 'en');
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    age: '',
    location: '',
    bio: '',
    interests: [] as string[],
  });

  // Vérifier si c'est obligatoire (3 reports ou plus)
  const isMandatory = (session?.user?.profileCompletionSkips || 0) >= 3;
  const skipsCount = session?.user?.profileCompletionSkips || 0;

  // Rediriger si déjà connecté et profil complet
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.profileComplete) {
      router.push('/fr/feed');
    }
  }, [status, session, router]);

  // Rediriger si non authentifié
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/fr');
    }
  }, [status, router]);

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.age || parseInt(formData.age) < 13 || parseInt(formData.age) > 100) {
      setError(t.profile.errors.age);
      return;
    }

    if (!formData.location.trim()) {
      setError(t.profile.errors.location);
      return;
    }

    if (!formData.bio.trim() || formData.bio.trim().length < 10) {
      setError(t.profile.errors.bio);
      return;
    }

    if (formData.interests.length < 3) {
      setError(t.profile.errors.interests);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session?.user?.email,
          age: parseInt(formData.age),
          location: formData.location.trim(),
          bio: formData.bio.trim(),
          interests: formData.interests,
        }),
      });

      if (!response.ok) {
        throw new Error(t.profile.errors.update);
      }

      // Mettre à jour la session
      await update();
      
      // Rediriger vers le feed
      router.push('/fr/feed');
    } catch (err) {
  setError(err instanceof Error ? err.message : t.profile.errors.unknown);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#1a1d3f] via-[#2a2d5f] to-[#1a1d3f]" />
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background avec le même style que l'application */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#1a1d3f] via-[#2a2d5f] to-[#1a1d3f]">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
      </div>

      <div className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
            Complète ton profil 🎉
          </h1>
          <p className="text-white/90 text-lg leading-relaxed max-w-xl mx-auto">
            {isMandatory 
              ? `Tu as reporté ${skipsCount} fois. C'est maintenant obligatoire pour continuer !`
              : 'Une dernière étape pour commencer à découvrir tes crushs !'
            }
          </p>
          {isMandatory && (
            <div className="mt-4 inline-flex items-center bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 text-amber-300 px-5 py-2.5 rounded-full text-sm font-bold shadow-lg">
              ⚠️ Complétion obligatoire
            </div>
          )}
        </div>

        {/* Formulaire avec design glassmorphism */}
        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Gradient overlay subtil */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 pointer-events-none" />
          
          <div className="relative p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Âge */}
              <div>
                <label className="flex items-center text-sm font-semibold text-white mb-2">
                  <User className="w-4 h-4 mr-2 text-pink-400" />
                  Ton âge *
                </label>
                <input
                  type="number"
                  min="13"
                  max="100"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition text-white placeholder-white/40"
                  placeholder="Ex: 25"
                  required
                />
              </div>

              {/* Localisation */}
              <div>
                <label className="flex items-center text-sm font-semibold text-white mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-pink-400" />
                  Ta localisation *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition text-white placeholder-white/40"
                  placeholder="Ex: Paris, France"
                  required
                />
              </div>

              {/* Bio */}
              <div>
                <label className="flex items-center text-sm font-semibold text-white mb-2">
                  <Heart className="w-4 h-4 mr-2 text-pink-400" />
                  Parle-nous de toi *
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition resize-none text-white placeholder-white/40"
                  placeholder="Décris-toi en quelques mots... (min. 10 caractères)"
                  rows={4}
                  required
                  minLength={10}
                />
                <p className="text-xs text-white/60 mt-2">
                  {formData.bio.length} caractères
                </p>
              </div>

              {/* Centres d'intérêt */}
              <div>
                <label className="flex items-center text-sm font-semibold text-white mb-3">
                  <Sparkles className="w-4 h-4 mr-2 text-pink-400" />
                  Tes centres d&apos;intérêt * (minimum 3)
                </label>
                <div className="flex flex-wrap gap-2">
                  {popularInterests.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                        formData.interests.includes(interest)
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105'
                          : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20'
                      }`}
                    >
                      {formData.interests.includes(interest) && (
                        <Check className="w-4 h-4 inline mr-1" />
                      )}
                      {interest}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-white/60 mt-3">
                  {formData.interests.length} sélectionné{formData.interests.length > 1 ? 's' : ''}
                </p>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Bouton de soumission */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transform"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Enregistrement...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <span>Valider mon profil</span>
                    <span className="text-xl">🚀</span>
                  </span>
                )}
              </button>
            </form>

            {/* Footer info */}
            <p className="text-xs text-white/60 text-center mt-6 leading-relaxed">
              Ces informations nous permettent de mieux t&apos;aider à trouver des personnes compatibles
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
