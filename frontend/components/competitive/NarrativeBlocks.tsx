'use client';

/**
 * Renders a battle-card narrative as readable, spaced blocks instead of a
 * single dense paragraph. Pass `points` for already-structured narratives
 * (static battle cards) or `text` for AI prose — the latter is split into
 * ~2-sentence paragraphs at render time.
 */
interface NarrativeBlocksProps {
  points?: string[];
  text?: string;
  compact?: boolean;
}

// Split prose into ~2-sentence paragraphs. Splits only at a period/!/? followed
// by whitespace + a capital letter — so "R80K–R150K", "4–8 weeks" and
// "ISO 27001" stay intact.
function splitToParagraphs(text: string): string[] {
  const sentences = text
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map(s => s.trim())
    .filter(Boolean);

  const paras: string[] = [];
  for (let i = 0; i < sentences.length; i += 2) {
    paras.push(sentences.slice(i, i + 2).join(' '));
  }
  return paras;
}

export default function NarrativeBlocks({ points, text, compact = false }: NarrativeBlocksProps) {
  const blocks = points && points.length > 0
    ? points
    : text
    ? splitToParagraphs(text)
    : [];

  if (blocks.length === 0) return null;

  const textSize = compact ? 'text-xs' : 'text-sm';

  return (
    <div className={compact ? 'space-y-2' : 'space-y-2.5'}>
      {blocks.map((block, i) => (
        <div key={i} className="flex gap-2.5">
          <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full bg-blue-400" />
          <p className={`${textSize} text-slate-700 leading-relaxed`}>{block}</p>
        </div>
      ))}
    </div>
  );
}
