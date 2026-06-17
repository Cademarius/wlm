import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { requireSelf } from '@/lib/supabase/serverAuth';

export async function POST(request: Request) {
  const { userId, is_online } = await request.json();

  if (!userId || typeof is_online !== 'boolean') {
    return NextResponse.json({ error: 'userId and is_online are required' }, { status: 400 });
  }

  const { error: authError } = await requireSelf(userId);
  if (authError) return authError;

  const supabase = createServiceClient();

  const { error } = await supabase
    .from('users')
    .update({ is_online })
    .eq('id', userId);

  if (error) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
