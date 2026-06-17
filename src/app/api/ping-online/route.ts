import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireSelf } from '@/lib/supabase/serverAuth';

export async function POST(request: Request) {
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const { error: authError } = await requireSelf(userId);
  if (authError) return authError;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const now = new Date();
  const { error } = await supabase
    .from('users')
    .update({ last_seen: now, is_online: true })
    .eq('id', userId);

  if (error) {
    console.log('[PING-ONLINE] update error:', error);
    return NextResponse.json({ error: 'Failed to update last_seen' }, { status: 500 });
  }

  console.log('[PING-ONLINE] success for userId:', userId, 'at', now.toISOString());
  return NextResponse.json({ success: true });
}
