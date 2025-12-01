"use client";

import { use, useEffect, useState } from "react";
import React from "react";
// Modal component for push notification prompt
function PushPromptModal({ open, onEnable, onLater }: { open: boolean; onEnable: () => void; onLater: () => void }) {
  const t = getTranslation(typeof window !== 'undefined' && window.__NEXT_DATA__?.props?.pageProps?.lang || 'fr');
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in">
      <div className="bg-[#23255A]/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-[#FF4F81]/30 relative">
        <div className="flex flex-col items-center mb-4">
          <div className="w-16 h-16 rounded-full bg-[#FF4F81]/20 flex items-center justify-center mb-2 shadow-lg">
            <Heart className="text-[#FF4F81]" size={36} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{t.notifications.push.modal.title}</h2>
        </div>
        <p className="text-white/80 mb-6 text-base leading-relaxed">{t.notifications.push.modal.description}</p>
        <div className="flex flex-col gap-3 mt-2">
          <button
            className="bg-[#FF4F81] hover:bg-[#e04370] text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 text-lg shadow-md transition-all duration-150 cursor-pointer"
            onClick={onEnable}
          >
            <ArrowRight className="text-white" size={20} />
            {t.notifications.push.modal.enableNow}
          </button>
          <button
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 text-lg shadow-md transition-all duration-150 cursor-pointer"
            onClick={onLater}
          >
            <Clock className="text-[#FF4F81]" size={20} />
            {t.notifications.push.modal.later}
          </button>
        </div>
      </div>
      <style jsx>{`
        .animate-fade-in {
          animation: fadeInModal 0.4s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeInModal {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
import { createClient } from '@/lib/supabase/client';
import HeaderComponent from "../components/header";
import MobileNavBar from "../components/mobile-nav-bar";
import { useAuth } from "../components/AuthGuard";
import { getTranslation } from '@/lib/i18n/getTranslation';
import { type Language } from '@/lib/i18n/setting';
import { Bell, Check, CheckCheck, Loader2, Heart, Sparkles, ArrowRight, Clock } from "lucide-react";
import Image from "next/image";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  from_user_id: string | null;
  is_read: boolean;
  created_at: string;
}

interface FromUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

const NotificationsPage = ({ params }: { params: Promise<{ lang: Language }> }) => {
  // Utilitaire pour afficher les erreurs push traduites
  const getPushErrorMessage = (err: string | null, t: unknown) => {
  if (!err) return null;
  const tt = t as { notifications?: { push?: { errors?: Record<string, string> } } };
  if (tt.notifications?.push?.errors && tt.notifications.push.errors[err]) return tt.notifications.push.errors[err];
  return err;
  };
  const resolvedParams = use(params);
  const t = getTranslation(resolvedParams.lang);
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  // Remplace par ta vraie clé publique VAPID (générée côté serveur)
  const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [fromUsers, setFromUsers] = useState<Record<string, FromUser>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const fetchNotifications = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const lang = resolvedParams.lang || 'fr';
      const response = await fetch(`/api/get-notifications?userId=${user.id}&lang=${lang}`);
      const data = await response.json();

      if (response.ok) {
        setNotifications(data.notifications || []);
        // Récupérer les informations des utilisateurs qui ont envoyé les notifications
        const userIds = [...new Set(data.notifications
          .map((n: Notification) => n.from_user_id)
          .filter(Boolean)
        )];
        if (userIds.length > 0) {
          const usersData: Record<string, FromUser> = {};
          await Promise.all(
            userIds.map(async (userId) => {
              const userResponse = await fetch(`/api/get-user?userId=${userId}`);
              if (userResponse.ok) {
                const userData = await userResponse.json();
                usersData[userId as string] = userData.user;
              }
            })
          );
          setFromUsers(usersData);
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const [pushEnabled, setPushEnabled] = useState(false);
  // Check if push is already enabled on mount
  useEffect(() => {
    async function checkPushSubscription() {
      if (!('serviceWorker' in navigator)) return;
      try {
        const reg = await navigator.serviceWorker.ready;
        const subscription = await reg.pushManager.getSubscription();
        if (subscription) {
          setPushEnabled(true);
        } else {
          setPushEnabled(false);
        }
      } catch {
        setPushEnabled(false);
      }
    }
    checkPushSubscription();
  }, []);
  const [pushLoading, setPushLoading] = useState(false);
  const [pushError, setPushError] = useState<string | null>(null);
  const [showPushModal, setShowPushModal] = useState(false);
  // Track if user chose "later" for push prompt
  useEffect(() => {
    if (isAuthenticated && notifications.length === 1 && !pushEnabled) {
      const laterFlag = localStorage.getItem("pushPromptLater");
      if (!laterFlag) {
        setShowPushModal(true);
      }
    } else {
      setShowPushModal(false);
    }
  }, [isAuthenticated, notifications.length, pushEnabled]);
  function handleEnablePush() {
    setShowPushModal(false);
    subscribePush();
    localStorage.removeItem("pushPromptLater");
  }

  function handleLaterPush() {
    setShowPushModal(false);
    localStorage.setItem("pushPromptLater", "1");
  }

  async function subscribePush() {
    console.log('subscribePush déclenché');
    setPushLoading(true);
    setPushError(null);
    try {
      if (!('serviceWorker' in navigator)) {
        setPushError('Service Worker non supporté');
        setPushLoading(false);
        return;
      }
      // Enregistrement du Service Worker si non déjà fait
      try {
        await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker enregistré');
      } catch (err) {
        console.error('Erreur enregistrement Service Worker:', err);
        setPushError('Erreur enregistrement Service Worker');
        setPushLoading(false);
        return;
      }
      // Attente que le SW soit prêt
      let reg;
      try {
        reg = await navigator.serviceWorker.ready;
        console.log('Service Worker prêt');
      } catch (err) {
        console.error('Erreur Service Worker ready:', err);
        setPushError('Service Worker non prêt');
        setPushLoading(false);
        return;
      }
      // Demande de permission
      let permission;
      try {
        permission = await Notification.requestPermission();
        console.log('Permission notification:', permission);
      } catch (err) {
        console.error('Erreur permission notification:', err);
        setPushError('Erreur permission notification');
        setPushLoading(false);
        return;
      }
      if (permission !== "granted") {
        setPushError("Permission refusée");
        setPushLoading(false);
        return;
      }
      // Abonnement push
      let subscription;
      try {
        subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
        console.log('Abonnement push généré');
      } catch (err) {
        console.error('Erreur abonnement push:', err);
        setPushError('Erreur abonnement push');
        setPushLoading(false);
        return;
      }
      // Sérialisation et envoi à l'API
      const subscriptionJson = JSON.parse(JSON.stringify(subscription));
      const userId = user?.id;
      if (!userId) {
        setPushError("Utilisateur non authentifié");
        setPushLoading(false);
        return;
      }
      console.log("Envoi a l'API /api/save-push-subscription");
      const res = await fetch('/api/save-push-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, subscription: subscriptionJson }),
      });
      console.log('Réponse API status:', res.status);
      let data = {};
      try {
        data = await res.json();
      } catch (err) {
        console.error('Erreur parsing JSON API:', err);
      }
      console.log('Données API:', data);
      if (!res.ok) {
        const apiError = typeof data === 'object' && 'error' in data ? (data as Record<string, unknown>).error as string : undefined;
        console.error('Erreur API save-push-subscription:', apiError);
        setPushError(apiError || "Erreur lors de l'enregistrement de l'abonnement");
        setPushLoading(false);
        return;
      }
      setPushEnabled(true);
      setPushError(null);
    } catch (e: unknown) {
      console.error('Erreur globale subscribePush:', e);
      setPushError((e instanceof Error ? e.message : "Erreur d'abonnement push"));
    } finally {
      setPushLoading(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchNotifications();

      // --- Supabase Realtime ---
      const supabase = createClient();
      const channel = supabase.channel('notifications-changes-page')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, () => {
          fetchNotifications();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]);

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch("/api/mark-notification-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });
      
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;

    try {
      await fetch("/api/mark-notification-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_match":
        return <Sparkles className="text-green-400" size={24} />;
      case "new_crush":
        return <Heart className="text-[#FF4F81]" size={24} />;
      default:
        return <Bell className="text-blue-400" size={24} />;
    }
  };

  const filteredNotifications = notifications.filter((n) =>
    filter === "all" ? true : !n.is_read
  );

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div 
      className="w-full min-h-screen flex flex-col text-white bg-[#1C1F3F]"
      style={{ 
        backgroundImage: "url('/images/ui/bg-pattern.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      }}
    >
      <HeaderComponent lang={resolvedParams.lang} />
      <PushPromptModal open={showPushModal} onEnable={handleEnablePush} onLater={handleLaterPush} />

  <main className="flex-1 w-full max-w-5xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-10 mb-20 xl:mb-0 overflow-y-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={subscribePush}
            disabled={pushEnabled || pushLoading}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-semibold min-w-11 min-h-11 flex items-center gap-2
              ${pushEnabled ? "bg-green-600 text-white cursor-default" : "bg-[#FF4F81] hover:bg-[#e04370] text-white"}
              ${pushLoading ? "opacity-60 cursor-wait" : ""}
            `}
            style={{ touchAction: 'manipulation' }}
          >
            {pushEnabled ? (
              <>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M9.29 16.29a1 1 0 0 0 1.42 1.42l3-3a1 1 0 0 0-1.42-1.42l-1.3 1.3V7a1 1 0 1 0-2 0v7.17l-1.3-1.3a1 1 0 1 0-1.42 1.42l3 3Z"/></svg>
                {t.notifications.push.enabled}
              </>
            ) : pushLoading ? (
              <>
                <svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".2"/><path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="4"/></svg>
                {t.notifications.push.loading}
              </>
            ) : (
              <>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7v4.28l-.95 2.85A2 2 0 0 0 6 19h12a2 2 0 0 0 1.95-2.87l-.95-2.85V9a7 7 0 0 0-7-7Zm0 18a3 3 0 0 1-3-3h6a3 3 0 0 1-3 3Z"/></svg>
                {t.notifications.push.label}
              </>
            )}
          </button>
        </div>
  {pushError && <div className="text-red-500 text-sm mb-4 text-center">{getPushErrorMessage(pushError, t)}</div>}
        {/* Afficher le loader pendant que l'authentification se charge */}
        {isAuthLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="text-[#FF4F81] animate-spin mb-4" size={48} />
            <p className="text-white/60">Chargement...</p>
          </div>
        ) : !isAuthenticated ? (
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-full aspect-4/3 max-w-3xl mx-auto mb-12">
              <Image
                src="/images/ui/illustration.svg"
                alt="Notifications"
                fill
                className="object-contain animate-float"
                priority
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 75vw, 60vw"
              />
            </div>
            
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 text-white">
                {t.notifications.title}
              </h2>
              
              <p className="text-gray-300 text-base sm:text-lg lg:text-xl">
                {t.notifications.loginRequired}
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* Header de la page */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                    {t.notifications.title}
                  </h1>
                  <p className="text-white/60 text-sm sm:text-base">
                    {unreadCount > 0
                      ? unreadCount === 1 
                        ? t.notifications.unreadCount.replace('{{count}}', unreadCount.toString())
                        : t.notifications.unreadCountPlural.replace('{{count}}', unreadCount.toString())
                      : t.notifications.empty.unreadTitle}
                  </p>
                </div>
                
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-[#FF4F81] hover:bg-[#e04370] text-white rounded-lg transition-colors cursor-pointer text-sm sm:text-base min-w-11 min-h-11"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <CheckCheck size={18} />
                    <span className="hidden sm:inline">{t.notifications.markAllAsRead}</span>
                  </button>
                )}
              </div>

              {/* Filtres */}
              <div className="flex gap-2 mt-4 sm:mt-0 flex-wrap">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors cursor-pointer text-sm sm:text-base min-w-11 min-h-11 ${
                    filter === "all"
                      ? "bg-[#FF4F81] text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                  style={{ touchAction: 'manipulation' }}
                >
                  {t.notifications.filters.all} ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors cursor-pointer text-sm sm:text-base min-w-11 min-h-11 ${
                    filter === "unread"
                      ? "bg-[#FF4F81] text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                  style={{ touchAction: 'manipulation' }}
                >
                  {t.notifications.filters.unread} ({unreadCount})
                </button>
              </div>
            </div>

            {/* Liste des notifications */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="text-[#FF4F81] animate-spin mb-4" size={48} />
                <p className="text-white/60">{t.notifications.loading}</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/10">
                <Bell className="text-white/20 mx-auto mb-4" size={64} />
                <p className="text-white/60 text-lg mb-2">
                  {filter === "unread"
                    ? t.notifications.empty.unreadTitle
                    : t.notifications.empty.title}
                </p>
                <p className="text-white/40 text-sm">
                  {filter === "unread"
                    ? t.notifications.empty.unreadDescription
                    : t.notifications.empty.description}
                </p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {filteredNotifications.map((notification) => {
                  const fromUser = notification.from_user_id
                    ? fromUsers[notification.from_user_id]
                    : null;

                  return (
                    <div
                      key={notification.id}
                      onClick={() => !notification.is_read && markAsRead(notification.id)}
                      className={`bg-linear-to-br from-[#2A2E5A] to-[#1C1F3F] rounded-xl p-4 sm:p-6 border transition-all duration-300 cursor-pointer ${
                        !notification.is_read
                          ? "border-[#FF4F81]/50 hover:border-[#FF4F81] shadow-lg shadow-[#FF4F81]/10"
                          : "border-white/10 hover:border-white/20"
                      } min-h-16 sm:min-h-20 flex items-center`}
                      style={{ touchAction: 'manipulation' }}
                    >
                      <div className="flex items-start gap-3 sm:gap-4 w-full">
                        {/* Icône de notification */}
                        <div className="shrink-0 flex items-center justify-center">
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                              notification.type === "new_match"
                                ? "bg-green-500/20"
                                : "bg-[#FF4F81]/20"
                            }`}
                          >
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>

                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 sm:mb-2">
                            <h3
                              className={`font-semibold text-base sm:text-lg ${
                                !notification.is_read ? "text-white" : "text-white/80"
                              }`}
                            >
                              {notification.title}
                            </h3>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-[#FF4F81] rounded-full animate-pulse" />
                            )}
                          </div>

                          {/* Avatar et nom de l'utilisateur si disponible */}
                          {fromUser && notification.type !== "new_crush" && (
                            <div className="flex items-center gap-2 mb-2 sm:mb-3">
                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-[#FF4F81]/30">
                                <Image
                                  src={fromUser.image || "/images/users/avatar.webp"}
                                  alt={fromUser.name}
                                  width={32}
                                  height={32}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="text-white/70 text-xs sm:text-sm font-medium">
                                {fromUser.name}
                              </span>
                            </div>
                          )}

                          <p
                            className={`text-sm sm:text-base mb-2 sm:mb-3 ${
                              !notification.is_read ? "text-white/90" : "text-white/60"
                            }`}
                          >
                            {notification.message}
                          </p>

                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs sm:text-sm text-white/40">
                              {formatTime(notification.created_at)}
                            </span>
                            {!notification.is_read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="flex items-center gap-1 text-[#FF4F81] hover:text-[#e04370] text-xs sm:text-sm cursor-pointer min-w-9 min-h-9"
                                style={{ touchAction: 'manipulation' }}
                              >
                                <Check size={16} />
                                <span className="hidden sm:inline">{t.notifications.markAsRead}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      <MobileNavBar className="block xl:hidden" activePage="notifications" params={{ lang: resolvedParams.lang }} />
    </div>
  );
};

export default NotificationsPage;
