// app/api/needs/insights/route.ts
// Generate personalized scripts based on need gaps

import { NextRequest, NextResponse } from 'next/server';
import { NEED_INSIGHTS_SYSTEM_PROMPT } from '@/lib/constants';
import { NeedGap } from '@/lib/types';

export const runtime = 'edge';

interface InsightsRequest {
  gaps: NeedGap[];
  recent_moods?: string[];
  horsemen_trends?: Record<string, number>;
}

export async function POST(req: NextRequest) {
  try {
    const { gaps, recent_moods, horsemen_trends }: InsightsRequest = await req.json();

    if (!gaps || gaps.length === 0) {
      return NextResponse.json(
        { error: 'Need gaps required' },
        { status: 400 }
      );
    }

    // Sort gaps by absolute value and take top 3
    const topGaps = [...gaps]
      .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap))
      .slice(0, 3);

    // Build context for AI
    const gapsContext = topGaps.map(g => 
      `${g.category}: Your score ${g.self_score.toFixed(1)}, Partner perceived ${g.partner_perceived_score.toFixed(1)}, Gap ${g.gap > 0 ? '+' : ''}${g.gap.toFixed(1)}`
    ).join('\n');

    const moodContext = recent_moods && recent_moods.length > 0
      ? `\nRecent mood patterns: ${recent_moods.join(', ')}`
      : '';

    const horsemenContext = horsemen_trends 
      ? `\nCommunication patterns detected: ${JSON.stringify(horsemen_trends)}`
      : '';

    const userPrompt = `Generate 3 personalized insight cards for these relationship need gaps:

${gapsContext}${moodContext}${horsemenContext}

Focus on practical, specific scripts and micro-experiments. Use warm, non-judgmental language.`;

    // Call AI API
    const aiResponse = await fetch(
      process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: NEED_INSIGHTS_SYSTEM_PROMPT },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.3,
          max_tokens: 800
        })
      }
    );

    if (!aiResponse.ok) {
      console.error('AI API error:', await aiResponse.text());
      return NextResponse.json(
        { error: 'Failed to generate insights' },
        { status: 500 }
      );
    }

    const aiData = await aiResponse.json();
    const resultText = aiData.choices[0].message.content;
    const result = JSON.parse(resultText);

    // Validate that we got insights array
    if (!result.insights || !Array.isArray(result.insights)) {
      return NextResponse.json(
        { error: 'Invalid insights format from AI' },
        { status: 500 }
      );
    }

    return NextResponse.json({ insights: result.insights });

  } catch (error) {
    console.error('Generate insights error:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}
