import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { requireSelf } from "@/lib/supabase/serverAuth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const lang = searchParams.get("lang") || "fr";

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const { error: authError } = await requireSelf(userId);
    if (authError) return authError;

    const supabase = createServiceClient();

    // Récupérer toutes les notifications de l'utilisateur
    const { data: notifications, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error);
      return NextResponse.json(
        { error: "Erreur lors de la récupération des notifications" },
        { status: 500 }
      );
    }

    // Traduction des titres/messages si champs multilingues présents
    let translatedNotifications = notifications || [];
    if (translatedNotifications.length > 0 && translatedNotifications[0].title_en) {
      translatedNotifications = translatedNotifications.map((n) => ({
        ...n,
        title: lang === "en" && n.title_en ? n.title_en : n.title,
        message: lang === "en" && n.message_en ? n.message_en : n.message,
      }));
    }

    // Compter les notifications non lues
    const unreadCount = translatedNotifications.filter((n) => !n.is_read).length || 0;

    return NextResponse.json({
      notifications: translatedNotifications,
      unreadCount,
      count: translatedNotifications.length,
    });
  } catch (error) {
    console.error("Error in get-notifications API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
