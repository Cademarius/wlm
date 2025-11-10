import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Créer le client Supabase avec la clé de service
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur actuel
    const { data: user, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("profile_completion_skips")
      .eq("email", email)
      .single();

    if (fetchError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const currentSkips = user.profile_completion_skips || 0;

    // Limite à 3 reports maximum
    if (currentSkips >= 3) {
      return NextResponse.json(
        { 
          error: "Maximum skip limit reached. Profile completion is now mandatory.",
          skips: currentSkips,
          canSkip: false
        },
        { status: 403 }
      );
    }

    // Incrémenter le compteur de skips
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from("users")
      .update({ 
        profile_completion_skips: currentSkips + 1,
        updated_at: new Date().toISOString()
      })
      .eq("email", email)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating skip count:", updateError);
      return NextResponse.json(
        { error: "Failed to update skip count" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      skips: updatedUser.profile_completion_skips,
      canSkip: updatedUser.profile_completion_skips < 3,
      remainingSkips: 3 - updatedUser.profile_completion_skips
    }, { status: 200 });
  } catch (error) {
    console.error("Error in skip-profile-completion route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
