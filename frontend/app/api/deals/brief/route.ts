import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, incumbentPlatform, saPartner, accountInfo } = body;

    if (!title) {
      return NextResponse.json({ error: 'Deal title required' }, { status: 400 });
    }

    const accountContext = accountInfo
      ? `Account: ${accountInfo.name} (${accountInfo.industry || 'unknown industry'}, ${accountInfo.annualRevenue ? `~${accountInfo.annualRevenue.toLocaleString()}` : 'revenue unknown'})`
      : '';

    const prompt = `You are a sales strategist. Generate a competitive brief for a deal. Return ONLY valid JSON (no markdown, no code blocks).

Deal: "${title}"
${accountContext}
${incumbentPlatform ? `Current Platform: ${incumbentPlatform}` : ''}
${saPartner ? `Current SI Partner: ${saPartner}` : ''}

Return this exact JSON structure (all fields required, use empty string if N/A):
{
  "openingStatement": "Hook that resonates with the prospect's current pain",
  "winStatement": "Your specific value proposition vs incumbent",
  "platformRisks": ["risk1", "risk2", "risk3"],
  "siRisks": ["risk1", "risk2"],
  "cioAngle": "CIO's perspective and pain points",
  "itManagerAngle": "IT Manager's concerns and quick wins"
}`;

    const startTime = Date.now();

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const duration = Date.now() - startTime;
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse JSON from response (handle potential markdown wrapping)
    let brief;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      brief = JSON.parse(jsonMatch[0]);
    } else {
      brief = JSON.parse(responseText);
    }

    const costPerMTok = 0.003; // claude-3-5-sonnet input
    const estimatedCost = (message.usage.input_tokens / 1_000_000) * costPerMTok;

    return NextResponse.json({
      brief,
      duration,
      costEstimate: estimatedCost,
      aiTier: 'Sonnet 3.5',
      tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
    });
  } catch (err: any) {
    console.error('Brief generation error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to generate brief' },
      { status: 500 }
    );
  }
}
