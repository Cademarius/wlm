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

    // Récupérer le numéro de l'utilisateur actuel
    const { data: currentUser } = await supabase
      .from("users")
      .select("phone")
      .eq("id", userId)
      .single();

    if (!currentUser || !currentUser.phone) {
      return NextResponse.json({ admirers: [], count: 0 });
    }

    // Trouver tous les secrets pointant vers MON numéro
    // = les personnes qui m'aiment en secret
    const { data: admirers, error } = await supabase
      .from("crushes")
      .select("id, user_id, status, created_at")
      .eq("crush_phone", currentUser.phone)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching admirers:", error);
      return NextResponse.json(
        { error: "Failed to fetch admirers" },
        { status: 500 }
      );
    }

    // Indices déjà débloqués (payés) par l'utilisateur courant, par admirateur
    const { data: unlocked } = await supabase
      .from("unlocked_hints")
      .select("crush_id, hint_type")
      .eq("user_id", userId);
    const unlockedByCrush = new Map<string, Set<string>>();
    (unlocked || []).forEach((h: { crush_id: string; hint_type: string }) => {
      const set = unlockedByCrush.get(h.crush_id) ?? new Set<string>();
      set.add(h.hint_type);
      unlockedByCrush.set(h.crush_id, set);
    });

    // Pour chaque admirer, récupérer les infos + ne révéler que les indices payés
    // (ou tout si le match est fait).
    const admirersWithUserInfo = await Promise.all(
      (admirers || []).map(async (admirer) => {
        const { data: user } = await supabase
          .from("users")
          .select("id, name, email, image, age, location, gender, is_online")
          .eq("id", admirer.user_id)
          .single();

        const unlockedSet = unlockedByCrush.get(admirer.id) ?? new Set<string>();
        const isMatched = admirer.status === "matched";
        const hints: {
          gender?: string | null;
          initial?: string | null;
          city?: string | null;
        } = {};
        if (user) {
          if (isMatched || unlockedSet.has("gender")) hints.gender = user.gender ?? null;
          if (isMatched || unlockedSet.has("initial"))
            hints.initial = user.name ? user.name.charAt(0).toUpperCase() : null;
          if (isMatched || unlockedSet.has("city")) hints.city = user.location ?? null;
        }

        return {
          id: admirer.id,
          status: admirer.status,
          created_at: admirer.created_at,
          unlocked: Array.from(unlockedSet),
          hints,
          // Tant qu'il n'y a pas match, on ne renvoie PAS l'identité complète
          user: isMatched ? user || null : null,
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
