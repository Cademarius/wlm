import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { requireSelf } from '@/lib/supabase/serverAuth';

export async function POST(request: Request) {
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const { error: authError } = await requireSelf(userId);
  if (authError) return authError;

  const supabase = createServiceClient();

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
