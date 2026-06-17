"use client";

import React, { use, useState, useEffect, useRef } from "react";
import { useAuth } from "../components/AuthGuard";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, Save, ArrowLeft, LogOut } from "lucide-react";
import { type Language } from "@/lib/i18n/setting";
import Toast from "../components/Toast";
import { useToast } from "@/hooks/useToast";
import { defaultAvatar } from "@/lib/avatar";
import { useTranslation } from "@/lib/i18n/I18nProvider";

type ProfilePageProps = { params: Promise<{ lang: Language }> };

export default function ProfilePage({ params }: ProfilePageProps) {
  const { lang } = use(params);
  const { t } = useTranslation();
  const GENDERS = [
    { value: "female", label: t.profile.genderFemale },
    { value: "male", label: t.profile.genderMale },
    { value: "other", label: t.profile.genderOther },
  ];
  const { user, refresh, signOut } = useAuth();
  const router = useRouter();
  const { toast, success, error, hideToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ name: "", gender: "", location: "", image: "" });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const res = await fetch(`/api/get-user?userId=${user.id}`);
        const data = await res.json();
        if (res.ok && data.user) {
          setForm({
            name: data.user.name || "",
            gender: ["male", "female", "other"].includes(data.user.gender)
              ? data.user.gender
              : "",
            location: data.user.location || "",
            image: data.user.image || "",
          });
        }
      } catch {
        // ignore
      }
    })();
  }, [user?.id]);

  if (!user) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      error(t.profile.fileTypeError);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      error(t.profile.fileSizeError);
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.gender || !form.location.trim()) {
      error(t.profile.incompleteError);
      return;
    }
    setIsSaving(true);
    try {
      let imageUrl = form.image;
      if (selectedFile) {
        setIsUploading(true);
        const fd = new FormData();
        fd.append("file", selectedFile);
        fd.append("userId", user.id);
        const up = await fetch("/api/upload-avatar", { method: "POST", body: fd });
        const upData = await up.json();
        if (!up.ok) throw new Error(upData.error || "Upload échoué");
        imageUrl = upData.imageUrl;
        setIsUploading(false);
      }
      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          name: form.name.trim(),
          gender: form.gender,
          location: form.location.trim(),
          image: imageUrl,
        }),
      });
      if (!res.ok) throw new Error("Sauvegarde échouée");
      await refresh();
      setPreviewImage(null);
      setSelectedFile(null);
      setForm((p) => ({ ...p, image: imageUrl }));
      success("Profil enregistré 🎉");
    } catch (err) {
      error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
      <div className="min-h-screen flex flex-col text-white">
        <main className="flex-1 w-full max-w-xl mx-auto px-4 sm:px-6 py-8 mb-24 xl:mb-8">
          <button
            onClick={() => router.push(`/${lang}/feed`)}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-6 text-sm transition"
          >
            <ArrowLeft size={18} /> {t.profile.back}
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">{t.profile.title}</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo */}
            <div className="wlm-card p-6 flex items-center gap-5">
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-[#FF5C8A] shrink-0">
                <Image
                  src={previewImage || form.image || user.image || defaultAvatar(form.gender || user.profile?.gender)}
                  alt="Photo de profil"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="wlm-glass px-4 py-2 rounded-full text-sm flex items-center gap-2 hover:bg-white/10 transition"
                >
                  <Camera size={16} /> {t.profile.changePhoto}
                </button>
                {previewImage && (
                  <p className="text-[#FF5C8A] text-xs mt-2">
                    {t.profile.saveHint}
                  </p>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Champs */}
            <div className="wlm-card p-6 space-y-5">
              <div>
                <label className="block text-sm text-white/80 mb-2">{t.profile.firstName}</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  maxLength={40}
                  placeholder={t.profile.firstNamePlaceholder}
                  className="w-full rounded-lg bg-white/10 px-4 py-3 placeholder-white/40 outline-none focus:ring-2 focus:ring-[#FF5C8A]"
                />
              </div>
              <div>
                <label className="block text-sm text-white/80 mb-2">{t.profile.gender}</label>
                <div className="flex gap-2">
                  {GENDERS.map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, gender: g.value }))}
                      className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition ${
                        form.gender === g.value
                          ? "wlm-btn-gradient text-white"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/80 mb-2">{t.profile.city}</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  maxLength={60}
                  placeholder={t.profile.cityPlaceholder}
                  className="w-full rounded-lg bg-white/10 px-4 py-3 placeholder-white/40 outline-none focus:ring-2 focus:ring-[#FF5C8A]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="w-full wlm-btn-gradient wlm-glow rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
            >
              {isUploading ? (
                t.profile.uploading
              ) : isSaving ? (
                t.profile.saving
              ) : (
                <>
                  <Save size={18} /> {t.profile.save}
                </>
              )}
            </button>
          </form>

          {/* Déconnexion */}
          <button
            onClick={async () => {
              await signOut();
              router.push(`/${lang}`);
            }}
            className="w-full mt-4 text-white/50 hover:text-white/80 text-sm py-3 flex items-center justify-center gap-2 transition"
          >
            <LogOut size={16} /> {t.profile.logout}
          </button>
        </main>
      </div>
    </>
  );
}
