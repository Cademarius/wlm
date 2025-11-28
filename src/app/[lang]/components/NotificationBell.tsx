"use client";

import { useEffect, useState } from "react";
import { createClient } from '@/lib/supabase/client';
import { Bell } from "lucide-react";
import { useAuth } from "./AuthGuard";
import { useRouter, usePathname } from "next/navigation";

export default function NotificationBell() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Extraire la langue du pathname
  const lang = pathname?.split('/')[1] || 'fr';

  const fetchUnreadCount = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/get-notifications?userId=${user.id}`);
      const data = await response.json();

      if (response.ok) {
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchUnreadCount();

      // Rafraîchir les notifications toutes les 30 secondes (fallback)
      const interval = setInterval(fetchUnreadCount, 30000);

      // Écouter les événements de nouveau crush/match
      const handleRefresh = () => fetchUnreadCount();
      window.addEventListener("refreshNotifications", handleRefresh);

      // --- Supabase Realtime ---
      const supabase = createClient();
      const channel = supabase.channel('notifications-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, () => {
          // Rafraîchir à chaque changement sur la table notifications de l'utilisateur
          fetchUnreadCount();
        })
        .subscribe();

      return () => {
        clearInterval(interval);
        window.removeEventListener("refreshNotifications", handleRefresh);
        supabase.removeChannel(channel);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]);

  const handleClick = () => {
    router.push(`/${lang}/notifications`);
  };

  if (!isAuthenticated) return null;

  return (
    <button
      onClick={handleClick}
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
  );
}