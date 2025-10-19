// app/api/moods/route.ts
// GET: Fetch mood pings for a pair
// POST: Save a new mood ping

import { NextRequest, NextResponse } from 'next/server';
import { MoodPing } from '@/lib/types';

export const runtime = 'edge';

// GET /api/moods?pair_id=123456&days=7
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pair_id = searchParams.get('pair_id');
    const days = parseInt(searchParams.get('days') || '7', 10);

    if (!pair_id) {
      return NextResponse.json(
        { error: 'pair_id required' },
        { status: 400 }
      );
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // TODO: Fetch from database
    // Example with SQL:
    // const moods = await db.query(
    //   'SELECT * FROM mood_pings WHERE pair_id = $1 AND timestamp >= $2 AND timestamp <= $3 ORDER BY timestamp ASC',
    //   [pair_id, startDate.toISOString(), endDate.toISOString()]
    // );

    // For now, return empty array
    const moods: MoodPing[] = [];

    return NextResponse.json({ moods });

  } catch (error) {
    console.error('Fetch moods error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch moods' },
      { status: 500 }
    );
  }
}

// POST /api/moods
export async function POST(req: NextRequest) {
  try {
    const mood: Omit<MoodPing, 'id'> = await req.json();

    // Validate required fields
    if (!mood.pair_id || !mood.user_id || !mood.mood || !mood.intensity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate intensity range
    if (mood.intensity < 1 || mood.intensity > 5) {
      return NextResponse.json(
        { error: 'Intensity must be between 1 and 5' },
        { status: 400 }
      );
    }

    const moodWithId: MoodPing = {
      ...mood,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    // TODO: Save to database
    // Example with SQL:
    // await db.query(
    //   'INSERT INTO mood_pings (id, pair_id, user_id, mood, mood_value, intensity, tag, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    //   [moodWithId.id, mood.pair_id, mood.user_id, mood.mood, mood.mood_value, mood.intensity, mood.tag, mood.timestamp]
    // );

    return NextResponse.json(moodWithId);

  } catch (error) {
    console.error('Save mood error:', error);
    return NextResponse.json(
      { error: 'Failed to save mood' },
      { status: 500 }
    );
  }
}
