"use client";

type TimerProps = {
  secondsRemaining: number;
  totalSeconds?: number;
};

export function Timer({ secondsRemaining, totalSeconds = 60 }: TimerProps) {
  const progress = Math.max(0, Math.min(100, (secondsRemaining / totalSeconds) * 100));

  return (
    <div className="w-full" aria-live="polite">
      <div className="mb-3 flex items-end justify-between">
        <span className="text-sm font-semibold uppercase tracking-wide text-sea">
          Recording timer
        </span>
        <span className="text-4xl font-bold tabular-nums text-ink">
          {secondsRemaining}s
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/80 shadow-inner">
        <div
          className="h-full rounded-full bg-coral transition-all duration-300 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}