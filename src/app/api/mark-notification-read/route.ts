import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { requireSelf } from "@/lib/supabase/serverAuth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId } = body;

    // Auth : on agit uniquement sur les notifications de l'utilisateur connecté
    const { error: authError, authUser } = await requireSelf();
    if (authError) return authError;

    const supabase = createServiceClient();

    if (notificationId) {
      // Marquer une notification spécifique comme lue (si elle m'appartient)
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId)
        .eq("user_id", authUser.id);

      if (error) {
        console.error("Error marking notification as read:", error);
        return NextResponse.json(
          { error: "Erreur lors de la mise à jour de la notification" },
          { status: 500 }
        );
      }
    } else {
      // Marquer toutes mes notifications comme lues
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", authUser.id)
        .eq("is_read", false);

      if (error) {
        console.error("Error marking all notifications as read:", error);
        return NextResponse.json(
          { error: "Erreur lors de la mise à jour des notifications" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in mark-notification-read API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
