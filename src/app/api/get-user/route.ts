import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');

    if (!email && !userId) {
      return NextResponse.json(
        { error: 'Email or userId is required' },
        { status: 400 }
      );
    }

    // Créer un client Supabase côté serveur avec la clé SERVICE_ROLE
    // Cette clé contourne les politiques RLS pour les opérations serveur
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Récupérer l'utilisateur par email ou par userId
    let query = supabase
      .from('users')
      .select('id, email, name, age, image, bio, interests, location, gender, created_at, is_online');
    
    if (userId) {
      query = query.eq('id', userId);
    } else if (email) {
      query = query.eq('email', email);
    }
    
    const { data: user, error } = await query.maybeSingle();

    if (error) {
      console.error('Error fetching user:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user' },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Error in get-user API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
