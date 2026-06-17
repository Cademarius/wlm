import { NextResponse } from 'next/server';
import { getServerAuthUser, isAdminPhone } from '@/lib/supabase/serverAuth';
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(request: Request) {
  try {
    const authUser = await getServerAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    if (!isAdminPhone(authUser.phone)) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const supabase = createServiceClient();

    let query = supabase
      .from('matches')
      .select(`
        *,
        user1:users!matches_user1_id_fkey(id, name, email, image),
        user2:users!matches_user2_id_fkey(id, name, email, image)
      `, { count: 'exact' });

    query = query.order('matched_at', { ascending: false });

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: matches, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      matches: matches || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des matchs:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
