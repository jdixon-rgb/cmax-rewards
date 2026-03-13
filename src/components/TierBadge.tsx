import { getTier } from '@/lib/utils';

export default function TierBadge({
  points,
  size = 'md',
}: {
  points: number;
  size?: 'sm' | 'md' | 'lg';
}) {
  const tier = getTier(points);

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-4 py-1.5',
  };

  return (
    <span
      className={`font-heading font-bold tracking-widest uppercase border ${sizeClasses[size]}`}
      style={{
        color: tier.color,
        borderColor: tier.color,
        backgroundColor: `${tier.color}15`,
      }}
    >
      {tier.name}
    </span>
  );
}
