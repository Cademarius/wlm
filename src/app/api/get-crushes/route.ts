import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { requireSelf } from "@/lib/supabase/serverAuth";

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

    const { error: authError } = await requireSelf(userId);
    if (authError) return authError;

    const supabase = createServiceClient();

    // Récupérer tous les secrets de l'utilisateur (par numéro)
    const { data: crushes, error } = await supabase
      .from("crushes")
      .select("id, crush_phone, crush_name, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching crushes:", error);
      return NextResponse.json(
        { error: "Failed to fetch crushes" },
        { status: 500 }
      );
    }

    // Pour chaque secret, retrouver l'utilisateur correspondant via son NUMÉRO (s'il est inscrit)
    const crushesWithUserInfo = await Promise.all(
      (crushes || []).map(async (crush) => {
        const { data: user } = await supabase
          .from("users")
          .select("id, name, email, image, age, location, is_online, last_seen")
          .eq("phone", crush.crush_phone)
          .maybeSingle();

        return {
          id: crush.id,
          status: crush.status,
          created_at: crush.created_at,
          crush_phone: crush.crush_phone,
          label: crush.crush_name,
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
