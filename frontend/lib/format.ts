export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) return `R${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}bn`;
  if (value >= 1_000_000)     return `R${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
  if (value >= 1_000)         return `R${(value / 1_000).toFixed(0)}k`;
  return `R${value.toLocaleString()}`;
}

export function parseARRInput(input: string): number {
  const clean = input.trim().toUpperCase().replace(/^R/, '');
  if (clean.endsWith('M')) return parseFloat(clean.slice(0, -1)) * 1_000_000;
  if (clean.endsWith('K')) return parseFloat(clean.slice(0, -1)) * 1_000;
  return parseFloat(clean.replace(/[^\d.-]/g, '')) || 0;
}
