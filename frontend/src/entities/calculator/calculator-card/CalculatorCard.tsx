'use client';

import { cn } from '../../../shared/lib/utils';

interface CalculatorCardProps {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
  negative?: boolean;
  delay?: number;
  className?: string;
}

export function CalculatorCard({
  className,
  label,
  value,
  sub,
  highlight,
  negative,
  delay = 0,
}: CalculatorCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border p-5 transition-all duration-300 animate-fade-up',
        className,
        highlight
          ? 'border-gold-500/40 bg-gradient-to-br from-obsidian-800 to-obsidian-900'
          : 'border-obsidian-700/50 bg-obsidian-900/40',
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
        opacity: 0,
      }}
    >
      <p className="text-xs font-medium tracking-widest text-obsidian-400 uppercase mb-3">
        {label}
      </p>
      <p
        className={cn(
          'text-xl font-bold leading-none mb-1',
          highlight
            ? 'text-gold-400'
            : negative
              ? 'text-red-400'
              : 'text-obsidian-50',
        )}
      >
        {value}
      </p>
      {sub && <p className="text-xs text-obsidian-500 mt-1">{sub}</p>}
    </div>
  );
}
