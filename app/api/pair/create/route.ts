// app/api/pair/create/route.ts
// Create a new pair and return pair code

import { NextRequest, NextResponse } from 'next/server';
import { generatePairCode } from '@/lib/utils';

export const runtime = 'edge';

// In production, use Vercel KV or similar
// For MVP, you can use a simple in-memory store or database
// This is a template - you'll need to implement actual storage

interface CreatePairRequest {
  creator_id: string;
  creator_name: string;
}

export async function POST(req: NextRequest) {
  try {
    const { creator_id, creator_name }: CreatePairRequest = await req.json();

    if (!creator_id || !creator_name) {
      return NextResponse.json(
        { error: 'Creator ID and name required' },
        { status: 400 }
      );
    }

    const pair_id = generatePairCode();
    const created_at = new Date().toISOString();

    // TODO: Store in database
    // Example with Vercel KV:
    // await kv.set(`pair:${pair_id}`, {
    //   pair_id,
    //   creator_id,
    //   creator_name,
    //   status: 'pending',
    //   created_at
    // }, { ex: 86400 }); // Expire after 24h if not joined

    // For now, return the pair data
    const pairData = {
      pair_id,
      creator_id,
      creator_name,
      status: 'pending',
      created_at
    };

    return NextResponse.json(pairData);

  } catch (error) {
    console.error('Create pair error:', error);
    return NextResponse.json(
      { error: 'Failed to create pair' },
      { status: 500 }
    );
  }
}
