import type { Severity, Status } from '../data/auditData';

const colorMap: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  red: { bg: 'bg-accent-red/10', text: 'text-accent-red', border: 'border-accent-red/30', dot: 'bg-accent-red' },
  amber: { bg: 'bg-accent-amber/10', text: 'text-accent-amber', border: 'border-accent-amber/30', dot: 'bg-accent-amber' },
  green: { bg: 'bg-accent-green/10', text: 'text-accent-green', border: 'border-accent-green/30', dot: 'bg-accent-green' },
  cyan: { bg: 'bg-accent-cyan/10', text: 'text-accent-cyan', border: 'border-accent-cyan/30', dot: 'bg-accent-cyan' },
  blue: { bg: 'bg-accent-blue/10', text: 'text-accent-blue', border: 'border-accent-blue/30', dot: 'bg-accent-blue' },
};

const severityToColor: Record<Severity, string> = {
  High: 'red',
  Medium: 'amber',
  Low: 'cyan',
};

const statusToColor: Record<Status, string> = {
  Resolved: 'green',
  Open: 'red',
};

export function SeverityBadge({ severity, size = 'sm' }: { severity: Severity; size?: 'sm' | 'xs' }) {
  const c = colorMap[severityToColor[severity]];
  const sizing = size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-0.5';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded border font-bold tracking-wider ${c.bg} ${c.text} ${c.border} ${sizing}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {severity.toUpperCase()}
    </span>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  const c = colorMap[statusToColor[status]];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded border font-semibold tracking-wide ${c.bg} ${c.text} ${c.border} text-[11px] px-2 py-0.5`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot} ${status === 'Open' ? 'animate-blink' : ''}`} />
      {status}
    </span>
  );
}

export function Pill({
  color = 'cyan',
  children,
}: {
  color?: keyof typeof colorMap;
  children: React.ReactNode;
}) {
  const c = colorMap[color];
  return (
    <span className={`inline-flex items-center gap-1 rounded border ${c.bg} ${c.text} ${c.border} text-[10px] font-semibold tracking-wider px-2 py-0.5`}>
      {children}
    </span>
  );
}
