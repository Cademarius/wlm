import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { email, name, image, google_id } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Créer un client Supabase côté serveur avec la clé SERVICE_ROLE
    // Cette clé contourne les politiques RLS pour les opérations serveur
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Vérifier si l'utilisateur existe déjà
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching user:', fetchError);
      throw fetchError;
    }

    let userData;

    if (!existingUser) {
      // Créer un nouvel utilisateur
      const { data, error: insertError } = await supabase
        .from('users')
        .insert({
          email,
          name: name || null,
          image: image || null,
          google_id: google_id || null,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting user:', insertError);
        throw insertError;
      }

      userData = data;
    } else {
      // Mettre à jour les infos de l'utilisateur existant
      // ⚠️ NE PAS écraser les données personnalisées de l'utilisateur
      const updateData: { google_id: string | null; name?: string | null; image?: string | null } = {
        google_id: google_id || null,
      };

      // ⚠️ PROTECTION DU NOM : Ne mettre à jour que si l'utilisateur n'a pas encore de nom
      // ou si son nom actuel est égal à son email (nom par défaut lors de la première connexion)
      if (!existingUser.name || existingUser.name === existingUser.email) {
        updateData.name = name || null;
      }

      // ⚠️ PROTECTION DE L'IMAGE : Seulement mettre à jour l'image si :
      // - L'utilisateur n'a pas d'image du tout
      // - OU l'utilisateur a encore son image Google (pas une custom Supabase)
      if (!existingUser.image || existingUser.image?.includes('googleusercontent.com')) {
        updateData.image = image || null;
      }

      const { data, error: updateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('email', email)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating user:', updateError);
        throw updateError;
      }

      userData = data;
    }

    return NextResponse.json({
      success: true,
      user: userData,
    });

  } catch (error) {
    console.error('Error in sync-user API:', error);
    return NextResponse.json(
      { error: 'Failed to sync user', details: error },
      { status: 500 }
    );
  }
}
