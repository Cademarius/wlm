import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    
    console.log('[API] Saving subscription for user:', userId);
    console.log('[API] Endpoint:', subscription.endpoint);
    
    // Insérer ou mettre à jour l'abonnement
    // La table a des contraintes UNIQUE sur user_id et endpoint
    const { error, data } = await supabase
      .from('push_subscriptions')
      .insert(
        { 
          user_id: userId, 
          endpoint: subscription.endpoint, 
          subscription: subscription
        }
      )
      .select();
    
    // Si l'insertion échoue à cause d'un doublon sur user_id, supprimer l'ancien et réinsérer
    if (error && error.code === '23505') {
      console.log('[API] Subscription already exists for user, updating...');
      
      // Supprimer l'ancien abonnement
      const { error: deleteError } = await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', userId);
      
      if (deleteError) {
        console.error('[API] Delete error:', deleteError);
        return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
      }
      
      // Insérer le nouveau
      const { error: insertError, data: insertData } = await supabase
        .from('push_subscriptions')
        .insert(
          { 
            user_id: userId, 
            endpoint: subscription.endpoint, 
            subscription: subscription
          }
        )
        .select();
      
      if (insertError) {
        console.error('[API] Insert error after delete:', insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
      
      console.log('[API] Subscription updated successfully');
      return NextResponse.json({ success: true, data: insertData });
    }
    
    if (error) {
      console.error('[API] Insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    console.log('[API] Subscription saved successfully');
    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error('[API] Exception:', e);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
