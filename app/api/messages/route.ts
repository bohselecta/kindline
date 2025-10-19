// app/api/messages/route.ts
// GET: Fetch messages for a pair
// POST: Save a new message

import { NextRequest, NextResponse } from 'next/server';
import { Message } from '@/lib/types';

export const runtime = 'edge';

// GET /api/messages?pair_id=123456
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pair_id = searchParams.get('pair_id');

    if (!pair_id) {
      return NextResponse.json(
        { error: 'pair_id required' },
        { status: 400 }
      );
    }

    // TODO: Fetch from database
    // Example with Vercel KV or Postgres:
    // const messages = await kv.lrange(`messages:${pair_id}`, 0, -1);
    // 
    // Or with SQL:
    // const messages = await db.query(
    //   'SELECT * FROM messages WHERE pair_id = $1 ORDER BY timestamp DESC LIMIT 50',
    //   [pair_id]
    // );

    // For now, return empty array
    const messages: Message[] = [];

    return NextResponse.json({ messages });

  } catch (error) {
    console.error('Fetch messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/messages
export async function POST(req: NextRequest) {
  try {
    const message: Omit<Message, 'id'> = await req.json();

    // Validate required fields
    if (!message.pair_id || !message.sender_id || !message.aligned_text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const messageWithId: Message = {
      ...message,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    // TODO: Save to database
    // Example with Vercel KV:
    // await kv.rpush(`messages:${message.pair_id}`, JSON.stringify(messageWithId));
    // 
    // Or with SQL:
    // await db.query(
    //   'INSERT INTO messages (id, pair_id, sender_id, raw_text, aligned_text, mood, intensity, flags, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
    //   [messageWithId.id, message.pair_id, message.sender_id, message.raw_text, message.aligned_text, message.mood, message.intensity, JSON.stringify(message.flags), message.timestamp]
    // );

    return NextResponse.json(messageWithId);

  } catch (error) {
    console.error('Save message error:', error);
    return NextResponse.json(
      { error: 'Failed to save message' },
      { status: 500 }
    );
  }
}
