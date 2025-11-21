import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const { userId, is_online } = await request.json();

  if (!userId || typeof is_online !== 'boolean') {
    return NextResponse.json({ error: 'userId and is_online are required' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase
    .from('users')
    .update({ is_online })
    .eq('id', userId);

  if (error) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
