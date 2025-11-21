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
  const { email, name, age, bio, interests, location, image, gender } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validation de l'âge
    if (age !== null && age !== undefined) {
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 13 || ageNum > 100) {
        return NextResponse.json(
          { error: "Age must be between 13 and 100" },
          { status: 400 }
        );
      }
    }

    // Validation de la bio
    if (bio && bio.length > 500) {
      return NextResponse.json(
        { error: "Bio must not exceed 500 characters" },
        { status: 400 }
      );
    }

    // Validation des intérêts
    if (interests && (!Array.isArray(interests) || interests.length > 10)) {
      return NextResponse.json(
        { error: "Interests must be an array with maximum 10 items" },
        { status: 400 }
      );
    }

    // Mettre à jour l'utilisateur
    const updateData: {
      name: string;
      age: number | null;
      bio: string | null;
      interests: string[] | null;
      location: string | null;
      gender?: 'male' | 'female' | 'other' | null;
      updated_at: string;
      image?: string;
    } = {
      name,
      age: age ? parseInt(age) : null,
      bio: bio || null,
      interests: interests || null,
      location: location || null,
      gender: gender || null,
      updated_at: new Date().toISOString(),
    };

    // Ajouter l'image seulement si fournie
    if (image) {
      updateData.image = image;
    }

    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from("users")
      .update(updateData)
      .eq("email", email)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating user:", updateError);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error in update-profile route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
