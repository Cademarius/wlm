import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

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

    // Compter les notifications non lues
    const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

    return NextResponse.json({
      notifications: notifications || [],
      unreadCount,
      count: notifications?.length || 0,
    });
  } catch (error) {
    console.error("Error in get-notifications API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
