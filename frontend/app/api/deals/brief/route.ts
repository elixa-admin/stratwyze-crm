import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface BriefResponse {
  openingStatement: string;
  winStatement: string;
  platformRisks: string[];
  siRisks: string[];
  cioAngle: string;
  itManagerAngle: string;
}

const BRIEF_PROMPT = (title: string, accountContext: string, incumbentPlatform?: string, saPartner?: string) => `You are a sales strategist. Generate a competitive brief for a deal. Return ONLY valid JSON (no markdown, no code blocks).

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

async function generateBriefWithClaude(prompt: string, model: string): Promise<{ brief: BriefResponse; tokens: number }> {
  const message = await anthropic.messages.create({
    model,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

  let brief: BriefResponse;
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    brief = JSON.parse(jsonMatch[0]);
  } else {
    brief = JSON.parse(responseText);
  }

  return {
    brief,
    tokens: message.usage.input_tokens + message.usage.output_tokens,
  };
}

async function generateBriefWithRetry(prompt: string): Promise<{ brief: BriefResponse; aiTier: string; tokens: number }> {
  const models = [
    { name: 'claude-opus-4-8', tier: 'Opus (High Quality)' },
    { name: 'claude-sonnet-4-6', tier: 'Sonnet (Balanced)' },
    { name: 'claude-haiku-4-5-20251001', tier: 'Haiku (Fast)' },
  ];

  let lastError: any;

  for (const { name, tier } of models) {
    try {
      console.log(`Attempting brief generation with ${tier}...`);
      const result = await generateBriefWithClaude(prompt, name);
      console.log(`✓ Brief generated successfully with ${tier}`);
      return { ...result, aiTier: tier };
    } catch (err: any) {
      lastError = err;
      console.warn(`✗ ${tier} failed:`, err?.message);

      // Continue to next model on any error (rate limit, overload, etc.)
      if (models.indexOf({ name, tier }) < models.length - 1) {
        // Wait a bit before retrying with next model
        await new Promise(r => setTimeout(r, 500));
      }
    }
  }

  throw new Error(`All AI models failed. Last error: ${lastError?.message}`);
}

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

    const prompt = BRIEF_PROMPT(title, accountContext, incumbentPlatform, saPartner);
    const startTime = Date.now();

    const { brief, aiTier, tokens } = await generateBriefWithRetry(prompt);

    const duration = Date.now() - startTime;

    return NextResponse.json({
      brief,
      duration,
      aiTier,
      tokensUsed: tokens,
      fallbackChain: 'Opus → Sonnet → Haiku',
    });
  } catch (err: any) {
    console.error('Brief generation error:', err);
    return NextResponse.json(
      { error: err?.message || 'All AI models failed. Please try again.' },
      { status: 503 }
    );
  }
}
