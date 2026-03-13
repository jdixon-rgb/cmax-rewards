export interface Tier {
  name: string;
  rank: string;
  color: string;
  min: number;
}

export const TIERS: Tier[] = [
  { name: 'SUMMIT ELITE', rank: 'summit', color: '#b8b455', min: 10000 },
  { name: 'CRAG CRUSHER', rank: 'crag', color: '#ffffff', min: 5000 },
  { name: 'WALL WALKER', rank: 'wall', color: '#999999', min: 1000 },
  { name: 'FRESH CHALK', rank: 'chalk', color: '#555555', min: 0 },
];

export function getTier(points: number): Tier {
  return TIERS.find((t) => points >= t.min) || TIERS[TIERS.length - 1];
}

export function getPercentile(rank: number, total: number): number {
  return Math.round(((total - rank + 1) / total) * 100);
}

export function formatPoints(points: number): string {
  return points.toLocaleString();
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getTierForPercentile(
  rank: number,
  total: number
): 'top' | 'middle' | 'bottom' {
  const topCutoff = Math.max(2, Math.ceil(total * 0.05));
  const bottomCutoff = total - Math.max(2, Math.ceil(total * 0.05));

  if (rank <= topCutoff) return 'top';
  if (rank > bottomCutoff) return 'bottom';
  return 'middle';
}
