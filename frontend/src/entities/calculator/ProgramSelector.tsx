'use client';

import { cn } from '@/lib/utils';
import type { MortgageProgram, ProgramKey } from '@/types/mortgage';

interface ProgramSelectorProps {
  programs: MortgageProgram[];
  selected: ProgramKey;
  onSelect: (key: ProgramKey) => void;
  isLoading: boolean;
  keyRate: number | null;
  isFallback: boolean;
}

const PROGRAM_COLORS: Record<ProgramKey, string> = {
  family:   'from-rose-500/15 to-rose-500/5 border-rose-500/30 hover:border-rose-500/60',
  it:       'from-blue-500/15 to-blue-500/5 border-blue-500/30 hover:border-blue-500/60',
  льготная: 'from-emerald-500/15 to-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/60',
  fareast:  'from-violet-500/15 to-violet-500/5 border-violet-500/30 hover:border-violet-500/60',
  rural:    'from-amber-500/15 to-amber-500/5 border-amber-500/30 hover:border-amber-500/60',
  market:   'from-obsidian-700/40 to-obsidian-700/10 border-obsidian-600/40 hover:border-obsidian-500/60',
};

const PROGRAM_BADGE_COLORS: Record<ProgramKey, string> = {
  family:   'bg-rose-500/20 text-rose-300',
  it:       'bg-blue-500/20 text-blue-300',
  льготная: 'bg-emerald-500/20 text-emerald-300',
  fareast:  'bg-violet-500/20 text-violet-300',
  rural:    'bg-amber-500/20 text-amber-300',
  market:   'bg-obsidian-600/40 text-obsidian-300',
};

export function ProgramSelector({
  programs,
  selected,
  onSelect,
  isLoading,
  keyRate,
  isFallback,
}: ProgramSelectorProps) {
  return (
    <div className="space-y-4">
      {/* Key rate banner */}
      <div className="flex items-center justify-between rounded-xl border border-obsidian-700/50 bg-obsidian-900/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-obsidian-400 tracking-wide">Ключевая ставка ЦБ РФ</span>
          {isFallback && (
            <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/20 rounded px-1.5 py-0.5">
              статичные данные
            </span>
          )}
        </div>
        {isLoading ? (
          <div className="h-5 w-16 rounded bg-obsidian-700 animate-pulse" />
        ) : (
          <span className="text-gold-400 font-bold text-sm">
            {keyRate !== null ? `${keyRate}%` : '—'}
          </span>
        )}
      </div>

      {/* Programs grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-obsidian-800/50 animate-pulse" />
            ))
          : programs.map((program) => {
              const isSelected = program.key === selected;
              return (
                <button
                  key={program.key}
                  onClick={() => onSelect(program.key)}
                  className={cn(
                    'relative text-left rounded-xl border bg-gradient-to-br p-4 transition-all duration-200',
                    PROGRAM_COLORS[program.key],
                    isSelected
                      ? 'ring-2 ring-gold-500/50 ring-offset-1 ring-offset-obsidian-950 scale-[1.01]'
                      : 'opacity-80 hover:opacity-100'
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-sm font-semibold text-obsidian-100 leading-tight">
                      {program.label}
                    </span>
                    {isSelected && (
                      <span className="shrink-0 w-4 h-4 rounded-full bg-gold-400 flex items-center justify-center">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4L3.5 6L6.5 2" stroke="#0A0908" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    {program.liveRate !== null ? (
                      <span className={cn('text-xs px-2 py-0.5 rounded font-medium', PROGRAM_BADGE_COLORS[program.key])}>
                        от {program.liveRate}%
                      </span>
                    ) : (
                      <span className={cn('text-xs px-2 py-0.5 rounded font-medium', PROGRAM_BADGE_COLORS[program.key])}>
                        до {program.maxRate}%
                      </span>
                    )}
                    <span className="text-[10px] text-obsidian-500">
                      {program.source === 'banki.ru' ? '● banki.ru' : program.source === 'статичные данные' ? '○ статично' : `● ${program.source}`}
                    </span>
                  </div>

                  <p className="text-[11px] text-obsidian-500 mt-1.5 leading-relaxed line-clamp-2">
                    {program.description}
                  </p>
                </button>
              );
            })}
      </div>
    </div>
  );
}
