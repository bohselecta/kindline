// app/api/align/route.ts
// Message alignment endpoint using DeepSeek AI

import { NextRequest, NextResponse } from 'next/server';
import { ALIGNMENT_SYSTEM_PROMPT } from '@/lib/constants';

export const runtime = 'edge';

interface AlignRequest {
  text: string;
  mood: string;
  intensity: number;
}

interface AlignmentResponse {
  aligned: string;
  flags: {
    criticism: boolean;
    defensiveness: boolean;
    contempt: boolean;
    stonewalling: boolean;
    anger_level: number;
  };
  suggestion?: string | null;
  repair_tag?: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const { text, mood, intensity }: AlignRequest = await req.json();

    if (!text || !mood || intensity === undefined) {
      return NextResponse.json(
        { error: 'Text, mood, and intensity are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'DeepSeek API key not configured' },
        { status: 500 }
      );
    }

    const userPrompt = `Original message: "${text}"\nMood: ${mood}\nIntensity: ${intensity}/5`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: ALIGNMENT_SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('DeepSeek API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to align message' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const alignedText = data.choices?.[0]?.message?.content;

    if (!alignedText) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      );
    }

    // Parse the JSON response from the AI
    let alignmentResult: AlignmentResponse;
    try {
      alignmentResult = JSON.parse(alignedText);
    } catch (parseError) {
      // Fallback if AI doesn't return valid JSON
      alignmentResult = {
        aligned: alignedText.replace(/^```json\s*|\s*```$/g, '').trim(),
        flags: {
          criticism: false,
          defensiveness: false,
          contempt: false,
          stonewalling: false,
          anger_level: intensity
        },
        suggestion: null,
        repair_tag: null
      };
    }

    return NextResponse.json(alignmentResult);

  } catch (error) {
    console.error('Alignment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
