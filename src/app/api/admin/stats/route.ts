import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // TODO: Vérifier que l'utilisateur est admin
    // Pour l'instant, vous pouvez ajouter une liste d'emails admin
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    if (!adminEmails.includes(session.user.email)) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const supabase = await createServerSupabaseClient();

    // Statistiques totales
    const [
      { count: totalUsers },
      { count: totalCrushes },
      { count: totalMatches },
      { count: usersOnline }
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('crushes').select('*', { count: 'exact', head: true }),
      supabase.from('matches').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('is_online', true)
    ]);

    // Nouvelles inscriptions (derniers 7 jours)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const { count: newUsersLastWeek } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString());

    // Nouveaux matchs (derniers 7 jours)
    const { count: newMatchesLastWeek } = await supabase
      .from('matches')
      .select('*', { count: 'exact', head: true })
      .gte('matched_at', sevenDaysAgo.toISOString());

    // Statistiques par jour (derniers 30 jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: dailyUsers } = await supabase
      .from('users')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    const { data: dailyMatches } = await supabase
      .from('matches')
      .select('matched_at')
      .gte('matched_at', thirtyDaysAgo.toISOString())
      .order('matched_at', { ascending: true });

    // Agréger par jour
    const dailyStats = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const dateStr = date.toISOString().split('T')[0];
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const usersCount = dailyUsers?.filter((u: any) => 
        u.created_at.startsWith(dateStr)
      ).length || 0;
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const matchesCount = dailyMatches?.filter((m: any) => 
        m.matched_at.startsWith(dateStr)
      ).length || 0;

      return {
        date: dateStr,
        users: usersCount,
        matches: matchesCount
      };
    });

    // Statistiques par genre
    const { data: genderStats } = await supabase
      .from('users')
      .select('gender');

    const genderDistribution = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      male: genderStats?.filter((u: any) => u.gender === 'male').length || 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      female: genderStats?.filter((u: any) => u.gender === 'female').length || 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      other: genderStats?.filter((u: any) => u.gender === 'other').length || 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      unspecified: genderStats?.filter((u: any) => !u.gender).length || 0
    };

    // Statistiques des crushs
    const { data: crushStats } = await supabase
      .from('crushes')
      .select('status');

    const crushDistribution = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pending: crushStats?.filter((c: any) => c.status === 'pending').length || 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      matched: crushStats?.filter((c: any) => c.status === 'matched').length || 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      revealed: crushStats?.filter((c: any) => c.status === 'revealed').length || 0
    };

    return NextResponse.json({
      overview: {
        totalUsers: totalUsers || 0,
        totalCrushes: totalCrushes || 0,
        totalMatches: totalMatches || 0,
        usersOnline: usersOnline || 0,
        newUsersLastWeek: newUsersLastWeek || 0,
        newMatchesLastWeek: newMatchesLastWeek || 0
      },
      dailyStats,
      genderDistribution,
      crushDistribution
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
