"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useAuth } from "./AuthGuard";
import { useRouter, usePathname } from "next/navigation";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  from_user_id: string | null;
  is_read: boolean;
  created_at: string;
}

export default function NotificationBell() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Extraire la langue du pathname
  const lang = pathname?.split('/')[1] || 'fr';

  const fetchNotifications = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/get-notifications?userId=${user.id}`);
      const data = await response.json();

      if (response.ok) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
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
      
      // Rafraîchir les notifications toutes les 30 secondes
      const interval = setInterval(fetchNotifications, 30000);
      
      // Écouter les événements de nouveau crush/match
      const handleRefresh = () => fetchNotifications();
      window.addEventListener("refreshNotifications", handleRefresh);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener("refreshNotifications", handleRefresh);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch("/api/mark-notification-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });
      
      // Mettre à jour localement
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
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
      
      // Mettre à jour localement
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
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
    return date.toLocaleDateString("fr-FR");
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-[#FF4F81] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Overlay pour fermer */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel de notifications */}
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#1C1F3F] rounded-xl shadow-2xl border border-white/10 z-50 max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[#FF4F81] text-sm hover:underline cursor-pointer"
                  >
                    Tout marquer comme lu
                  </button>
                )}
              </div>
            </div>

            {/* Liste des notifications */}
            <div className="overflow-y-auto flex-1">
              {isLoading ? (
                <div className="p-8 text-center text-white/60">
                  Chargement...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-white/60">
                  Aucune notification
                </div>
              ) : (
                <>
                  <div className="divide-y divide-white/5">
                    {notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => !notification.is_read && markAsRead(notification.id)}
                      className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                        !notification.is_read ? "bg-[#FF4F81]/10" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            !notification.is_read
                              ? "bg-[#FF4F81]"
                              : "bg-transparent"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-sm font-semibold ${
                                !notification.is_read
                                  ? "text-white"
                                  : "text-white/70"
                              }`}
                            >
                              {notification.title}
                            </span>
                          </div>
                          <p
                            className={`text-sm mb-1 ${
                              !notification.is_read
                                ? "text-white/90"
                                : "text-white/60"
                            }`}
                          >
                            {notification.message}
                          </p>
                          <span className="text-xs text-white/40">
                            {formatTime(notification.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  </div>
                  
                  {/* Bouton "Voir tout" */}
                  {notifications.length > 5 && (
                    <div className="p-4 border-t border-white/10">
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          router.push(`/${lang}/notifications`);
                        }}
                        className="w-full text-center text-[#FF4F81] hover:text-[#e04370] font-medium cursor-pointer"
                      >
                        Voir toutes les notifications ({notifications.length})
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
