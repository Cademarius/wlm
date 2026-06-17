import { NextResponse } from 'next/server';
import { getServerAuthUser, isAdminPhone } from '@/lib/supabase/serverAuth';
import { createClient } from "@supabase/supabase-js";

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
    const status = searchParams.get('status') || '';

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

    let query = supabase
      .from('crushes')
      .select(`
        *,
        user:users!crushes_user_id_fkey(id, name, email, image)
      `, { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }

    query = query.order('created_at', { ascending: false });

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: crushes, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      crushes: crushes || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des crushs:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
