import { createOpenAI } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { generateText, LanguageModel } from 'ai';

export type AITier = 'serpapi' | 'deepseek' | 'gemini' | 'anthropic';

interface TierConfig {
  name: AITier;
  getModel: () => LanguageModel;
  costPerMTok: number;
  maxRetries: number;
  timeoutMs: number;
}

interface FallbackChainResult {
  text: string;
  tier: AITier;
  costEstimate: number;
}

interface FallbackChainError {
  tier: AITier;
  error: string;
  code?: string;
}

const tiers: TierConfig[] = [];

function initTiers(): void {
  if (tiers.length > 0) return;

  const deepseekProvider = createOpenAI({
    baseURL: process.env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com/v1',
    apiKey: process.env.DEEPSEEK_API_KEY ?? '',
  });

  const geminiProvider = createOpenAI({
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    apiKey: process.env.GEMINI_API_KEY ?? '',
  });

  tiers.push(
    {
      name: 'deepseek',
      getModel: () => deepseekProvider('deepseek-chat'),
      costPerMTok: 0.003,
      maxRetries: 2,
      timeoutMs: 15000,
    },
    {
      name: 'gemini',
      getModel: () => geminiProvider('gemini-2.0-flash'),
      costPerMTok: 0.15,
      maxRetries: 2,
      timeoutMs: 20000,
    },
    {
      name: 'anthropic',
      getModel: () => anthropic('claude-haiku-4-5'),
      costPerMTok: 0.08,
      maxRetries: 1,
      timeoutMs: 25000,
    }
  );
}

function isRetryableError(err: any): boolean {
  if (!err) return false;
  const msg = (err.message || '').toLowerCase();
  const code = err.code || err.status;
  return msg.includes('timeout') ||
    msg.includes('econnrefused') ||
    msg.includes('enotfound') ||
    code === 408 ||
    code === 429 ||
    code === 500 ||
    code === 502 ||
    code === 503 ||
    code === 504;
}

export async function generateWithFallback(
  prompt: string,
  options: {
    temperature?: number;
    maxOutputTokens?: number;
    costBudget?: number;
  } = {}
): Promise<FallbackChainResult> {
  initTiers();

  const { temperature = 0.4, maxOutputTokens = 1800, costBudget = 10 } = options;
  const errors: FallbackChainError[] = [];
  let cumulativeCost = 0;

  for (let tierIdx = 0; tierIdx < tiers.length; tierIdx++) {
    const tier = tiers[tierIdx];

    try {
      const tierEstimatedCost = (cumulativeCost + (maxOutputTokens / 1000) * tier.costPerMTok);
      if (tierEstimatedCost > costBudget) {
        errors.push({
          tier: tier.name,
          error: `Cost limit exceeded: estimated R${tierEstimatedCost.toFixed(2)} exceeds budget of R${costBudget}`,
          code: 'COST_LIMIT',
        });
        continue;
      }

      const controller = new AbortController();
      const timeoutHandle = setTimeout(() => controller.abort(), tier.timeoutMs);

      try {
        const { text, usage } = await generateText({
          model: tier.getModel(),
          prompt,
          temperature,
          maxOutputTokens,
          abortSignal: controller.signal as any,
        });

        clearTimeout(timeoutHandle);

        const actualCost = ((usage?.outputTokens ?? maxOutputTokens) / 1000) * tier.costPerMTok;
        cumulativeCost += actualCost;

        return {
          text,
          tier: tier.name,
          costEstimate: cumulativeCost,
        };
      } catch (tierErr: any) {
        clearTimeout(timeoutHandle);

        if (tierErr?.name === 'AbortError') {
          errors.push({
            tier: tier.name,
            error: `Timeout after ${tier.timeoutMs}ms`,
            code: 'TIMEOUT',
          });
        } else if (isRetryableError(tierErr)) {
          errors.push({
            tier: tier.name,
            error: tierErr.message,
            code: tierErr.status || 'NETWORK_ERROR',
          });
        } else {
          errors.push({
            tier: tier.name,
            error: tierErr.message || 'Unknown error',
            code: tierErr.status || 'UNKNOWN',
          });
        }
      }
    } catch (err: any) {
      errors.push({
        tier: tier.name,
        error: err.message || 'Unexpected error',
        code: 'UNEXPECTED',
      });
    }
  }

  const lastError = errors[errors.length - 1];
  throw new Error(
    `All AI tiers exhausted. Last error (${lastError?.tier}): ${lastError?.error}`
  );
}
