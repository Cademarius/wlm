// API Next.js pour envoyer une notification push à un utilisateur
import { NextRequest, NextResponse } from 'next/server';
import { sendPushNotification } from '@/lib/sendPushNotification';

export async function POST(req: NextRequest) {
  try {
    const { userId, title, body } = await req.json();
    if (!userId || !title || !body) {
      return NextResponse.json({ error: 'Missing userId, title or body' }, { status: 400 });
    }
    const success = await sendPushNotification(userId, { title, body });
    if (!success) {
      return NextResponse.json({ error: 'Push failed' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
