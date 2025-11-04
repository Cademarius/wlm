"use client";

import { use, useEffect, useState } from "react";
import Header from "../components/header";
import MobileNavBar from "../components/mobile-nav-bar";
import { useAuth } from "../components/AuthGuard";
import { getTranslation } from '@/lib/i18n/getTranslation';
import { type Language } from '@/lib/i18n/setting';
import { Bell, Check, CheckCheck, Loader2, Heart, Sparkles } from "lucide-react";
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
  const resolvedParams = use(params);
  const t = getTranslation(resolvedParams.lang);
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [fromUsers, setFromUsers] = useState<Record<string, FromUser>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const fetchNotifications = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/get-notifications?userId=${user.id}`);
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

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchNotifications();
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
      <Header lang={resolvedParams.lang} />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Afficher le loader pendant que l'authentification se charge */}
        {isAuthLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="text-[#FF4F81] animate-spin mb-4" size={48} />
            <p className="text-white/60">Chargement...</p>
          </div>
        ) : !isAuthenticated ? (
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-full aspect-[4/3] max-w-3xl mx-auto mb-12">
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
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    {t.notifications.title}
                  </h1>
                  <p className="text-white/60">
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
                    className="flex items-center gap-2 px-4 py-2 bg-[#FF4F81] hover:bg-[#e04370] text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <CheckCheck size={18} />
                    <span className="hidden sm:inline">{t.notifications.markAllAsRead}</span>
                  </button>
                )}
              </div>

              {/* Filtres */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                    filter === "all"
                      ? "bg-[#FF4F81] text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  {t.notifications.filters.all} ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                    filter === "unread"
                      ? "bg-[#FF4F81] text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
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
              <div className="space-y-3">
                {filteredNotifications.map((notification) => {
                  const fromUser = notification.from_user_id
                    ? fromUsers[notification.from_user_id]
                    : null;

                  return (
                    <div
                      key={notification.id}
                      onClick={() => !notification.is_read && markAsRead(notification.id)}
                      className={`bg-gradient-to-br from-[#2A2E5A] to-[#1C1F3F] rounded-xl p-6 border transition-all duration-300 cursor-pointer ${
                        !notification.is_read
                          ? "border-[#FF4F81]/50 hover:border-[#FF4F81] shadow-lg shadow-[#FF4F81]/10"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icône de notification */}
                        <div className="flex-shrink-0">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
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
                          <div className="flex items-center gap-2 mb-2">
                            <h3
                              className={`font-semibold text-lg ${
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
                          {fromUser && (
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#FF4F81]/30">
                                <Image
                                  src={fromUser.image || "/images/users/avatar.webp"}
                                  alt={fromUser.name}
                                  width={32}
                                  height={32}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="text-white/70 text-sm font-medium">
                                {fromUser.name}
                              </span>
                            </div>
                          )}

                          <p
                            className={`text-base mb-3 ${
                              !notification.is_read ? "text-white/90" : "text-white/60"
                            }`}
                          >
                            {notification.message}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-white/40">
                              {formatTime(notification.created_at)}
                            </span>
                            
                            {!notification.is_read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="flex items-center gap-1 text-[#FF4F81] hover:text-[#e04370] text-sm cursor-pointer"
                              >
                                <Check size={16} />
                                {t.notifications.markAsRead}
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
