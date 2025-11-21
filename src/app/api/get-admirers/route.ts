import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Récupérer l'email de l'utilisateur actuel
    const { data: currentUser } = await supabase
      .from("users")
      .select("email")
      .eq("id", userId)
      .single();

    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Trouver tous les crushs où crush_name = l'email de l'utilisateur actuel
    // Ce sont les personnes qui ont ajouté l'utilisateur actuel comme crush
    const { data: admirers, error } = await supabase
      .from("crushes")
      .select("id, user_id, status, created_at")
      .eq("crush_name", currentUser.email)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching admirers:", error);
      return NextResponse.json(
        { error: "Failed to fetch admirers" },
        { status: 500 }
      );
    }

    // Pour chaque admirer, récupérer les informations de l'utilisateur
    const admirersWithUserInfo = await Promise.all(
      (admirers || []).map(async (admirer) => {
        const { data: user } = await supabase
          .from("users")
          .select("id, name, email, image, age, location, is_online")
          .eq("id", admirer.user_id)
          .single();

        return {
          id: admirer.id,
          status: admirer.status,
          created_at: admirer.created_at,
          user: user || null,
        };
      })
    );

    return NextResponse.json({ 
      admirers: admirersWithUserInfo,
      count: admirersWithUserInfo.length 
    });
  } catch (error) {
    console.error("Error in get-admirers API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
