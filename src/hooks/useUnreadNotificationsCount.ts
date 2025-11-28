import { useEffect, useState } from "react";
import { createClient } from '@/lib/supabase/client';
import { useAuth } from "@/app/[lang]/components/AuthGuard";

export function useUnreadNotificationsCount() {
  const { user, isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`/api/get-notifications?userId=${user.id}`);
      const data = await response.json();
      if (response.ok) {
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // silent
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      const supabase = createClient();
      const channel = supabase.channel('notifications-badge')
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
        clearInterval(interval);
        supabase.removeChannel(channel);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]);

  return unreadCount;
}
