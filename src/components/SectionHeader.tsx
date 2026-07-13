import type { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  accent?: 'cyan' | 'red' | 'amber' | 'green';
}

const accentMap = {
  cyan: { text: 'text-accent-cyan', border: 'border-accent-cyan/30', bg: 'bg-accent-cyan/10' },
  red: { text: 'text-accent-red', border: 'border-accent-red/30', bg: 'bg-accent-red/10' },
  amber: { text: 'text-accent-amber', border: 'border-accent-amber/30', bg: 'bg-accent-amber/10' },
  green: { text: 'text-accent-green', border: 'border-accent-green/30', bg: 'bg-accent-green/10' },
};

export default function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  accent = 'cyan',
}: SectionHeaderProps) {
  const c = accentMap[accent];
  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
        <span className={`flex h-6 w-6 items-center justify-center rounded ${c.bg} border ${c.border}`}>
          <Icon size={13} className={c.text} />
        </span>
        <span className={c.text}>{eyebrow}</span>
        <span className="text-soc-muted/30">/</span>
        <span className="text-soc-muted">PHP Login Audit</span>
      </div>
      <h2 className="mt-3 font-display text-2xl font-extrabold text-soc-bright sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-soc-muted">
        {description}
      </p>
    </div>
  );
}
