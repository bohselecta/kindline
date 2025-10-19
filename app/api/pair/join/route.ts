// app/api/pair/join/route.ts
// Join an existing pair with code

import { NextRequest, NextResponse } from 'next/server';
import { isValidPairCode } from '@/lib/utils';

export const runtime = 'edge';

interface JoinPairRequest {
  pair_id: string;
  joiner_id: string;
  joiner_name: string;
}

export async function POST(req: NextRequest) {
  try {
    const { pair_id, joiner_id, joiner_name }: JoinPairRequest = await req.json();

    if (!pair_id || !joiner_id || !joiner_name) {
      return NextResponse.json(
        { error: 'Pair ID, joiner ID, and name required' },
        { status: 400 }
      );
    }

    if (!isValidPairCode(pair_id)) {
      return NextResponse.json(
        { error: 'Invalid pair code format' },
        { status: 400 }
      );
    }

    // TODO: Fetch from database and validate
    // Example with Vercel KV:
    // const pair = await kv.get(`pair:${pair_id}`);
    // 
    // if (!pair) {
    //   return NextResponse.json(
    //     { error: 'Pair not found or expired' },
    //     { status: 404 }
    //   );
    // }
    // 
    // if (pair.status === 'active') {
    //   return NextResponse.json(
    //     { error: 'Pair already has two members' },
    //     { status: 400 }
    //   );
    // }
    //
    // Update pair to active
    // const updatedPair = {
    //   ...pair,
    //   joiner_id,
    //   joiner_name,
    //   status: 'active',
    //   joined_at: new Date().toISOString()
    // };
    //
    // await kv.set(`pair:${pair_id}`, updatedPair);

    // For now, mock successful join
    const pairData = {
      pair_id,
      joiner_id,
      joiner_name,
      status: 'active',
      joined_at: new Date().toISOString()
    };

    return NextResponse.json(pairData);

  } catch (error) {
    console.error('Join pair error:', error);
    return NextResponse.json(
      { error: 'Failed to join pair' },
      { status: 500 }
    );
  }
}
