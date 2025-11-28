import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Table à créer dans Supabase : push_subscriptions (id, user_id, subscription, created_at)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[API] save-push-subscription body:', body);
    const { userId, subscription } = body;
    if (!userId || !subscription || !subscription.endpoint) {
      console.log('[API] Missing userId or subscription.endpoint', { userId, subscription });
      return NextResponse.json({ error: 'Missing userId or subscription.endpoint' }, { status: 400 });
    }
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    console.log('[API] Upsert data:', { user_id: userId, endpoint: subscription.endpoint, subscription });
    const { error, data } = await supabase
      .from('push_subscriptions')
      .upsert({ user_id: userId, endpoint: subscription.endpoint, subscription }, { onConflict: 'endpoint' });
    console.log('[API] Upsert result:', { error, data });
    if (error) {
      console.log('[API] Upsert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.log('[API] Exception:', e);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
