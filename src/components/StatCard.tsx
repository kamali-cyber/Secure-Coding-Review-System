import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: 'cyan' | 'red' | 'amber' | 'green' | 'blue';
  trend?: { value: string; direction: 'up' | 'down' | 'flat' };
  sublabel?: string;
  glow?: boolean;
}

const colorMap = {
  cyan: { text: 'text-accent-cyan', bg: 'bg-accent-cyan/10', border: 'border-accent-cyan/20', glow: 'shadow-glow-cyan', raw: '34,211,238' },
  red: { text: 'text-accent-red', bg: 'bg-accent-red/10', border: 'border-accent-red/20', glow: 'shadow-glow-red', raw: '239,68,68' },
  amber: { text: 'text-accent-amber', bg: 'bg-accent-amber/10', border: 'border-accent-amber/20', glow: 'shadow-glow-amber', raw: '245,158,11' },
  green: { text: 'text-accent-green', bg: 'bg-accent-green/10', border: 'border-accent-green/20', glow: 'shadow-glow-green', raw: '34,197,94' },
  blue: { text: 'text-accent-blue', bg: 'bg-accent-blue/10', border: 'border-accent-blue/20', glow: '', raw: '59,130,246' },
};

export default function StatCard({ label, value, icon: Icon, color, trend, sublabel, glow }: StatCardProps) {
  const c = colorMap[color];
  const TrendIcon = trend?.direction === 'up' ? TrendingUp : trend?.direction === 'down' ? TrendingDown : Minus;

  return (
    <div
      className={`relative rounded-xl border ${c.border} bg-soc-card/70 p-5 transition-all hover:border-opacity-50 hover:${c.bg} animate-slide-up ${glow ? c.glow : ''}`}
      style={{ animationDelay: '0ms' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-soc-muted">{label}</p>
          <p className={`mt-2 font-display text-3xl font-extrabold ${c.text} tabular-nums`}>{value}</p>
          {sublabel && <p className="mt-1 text-[11px] text-soc-muted">{sublabel}</p>}
          {trend && (
            <div className="mt-2.5 flex items-center gap-1.5">
              <TrendIcon size={13} className={c.text} />
              <span className={`text-[11px] font-semibold ${c.text}`}>{trend.value}</span>
            </div>
          )}
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${c.bg} border ${c.border}`}>
          <Icon size={20} className={c.text} />
        </div>
      </div>
      {glow && (
        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-30"
          style={{ boxShadow: `0 0 24px rgba(${c.raw}, 0.08)` }}
        />
      )}
    </div>
  );
}
