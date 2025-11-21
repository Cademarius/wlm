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

    // Récupérer tous les crushs de l'utilisateur
    const { data: crushes, error } = await supabase
      .from("crushes")
      .select("id, crush_name, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching crushes:", error);
      return NextResponse.json(
        { error: "Failed to fetch crushes" },
        { status: 500 }
      );
    }

    // Pour chaque crush, récupérer les informations de l'utilisateur correspondant
    const crushesWithUserInfo = await Promise.all(
      (crushes || []).map(async (crush) => {
        const { data: user } = await supabase
          .from("users")
          .select("id, name, email, image, age, location, is_online, last_seen")
          .eq("email", crush.crush_name)
          .single();

        return {
          id: crush.id,
          status: crush.status,
          created_at: crush.created_at,
          user: user || null,
        };
      })
    );

    return NextResponse.json({ 
      crushes: crushesWithUserInfo,
      count: crushesWithUserInfo.length 
    });
  } catch (error) {
    console.error("Error in get-crushes API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
