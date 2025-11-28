import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");
    const currentUserId = searchParams.get("currentUserId");

    if (!query || !currentUserId) {
      return NextResponse.json(
        { error: "Query and currentUserId are required" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Rechercher les utilisateurs uniquement par nom (excluant l'utilisateur actuel)
    const { data: users, error } = await supabase
      .from("users")
      .select("id, name, email, image, age, location, bio")
      .neq("id", currentUserId)
      .ilike("name", `%${query}%`)
      .limit(20);

    if (error) {
      console.error("Error searching users:", error);
      return NextResponse.json(
        { error: "Failed to search users" },
        { status: 500 }
      );
    }

    return NextResponse.json({ users: users || [] });
  } catch (error) {
    console.error("Error in search-users API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
