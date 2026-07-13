import { useState } from 'react';
import {
  ShieldCheck, Lock, Code2, KeyRound, Database,
  EyeOff, BookOpen, Copy, Check, GitPullRequest,
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { recommendations } from '../data/auditData';
import { Pill } from '../components/Badges';

const categoryIcons: Record<string, typeof Lock> = {
  'Injection Defense': Database,
  'Input Handling': ShieldCheck,
  'Password Storage': KeyRound,
  'Error Handling': EyeOff,
  'Access Control': Lock,
  Process: GitPullRequest,
};

const priorityColor: Record<string, string> = {
  Critical: 'red',
  High: 'amber',
  Medium: 'cyan',
};

export default function RecommendationsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (id: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      /* noop */
    }
  };

  const grouped = recommendations.reduce<Record<string, typeof recommendations>>((acc, r) => {
    (acc[r.priority] ||= []).push(r);
    return acc;
  }, {});

  const priorityOrder: Array<keyof typeof grouped> = ['High', 'Medium'];

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={ShieldCheck}
        eyebrow="Remediation Guidance"
        title="Secure Coding Recommendations"
        description="Six prioritized best practices to remediate every finding and harden the PHP login system against future vulnerabilities. Each recommendation maps to industry standards and includes a concrete PHP implementation example."
        accent="green"
      />

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-lg border border-accent-green/20 bg-accent-green/5 p-4">
        <BookOpen size={20} className="mt-0.5 shrink-0 text-accent-green" />
        <div>
          <p className="text-sm font-semibold text-accent-green">Defense in Depth</p>
          <p className="mt-1 text-xs leading-relaxed text-soc-muted">
            No single control is sufficient. Prepared statements, input validation, password hashing,
            and secure error handling reinforce each other. Least-privilege database accounts and
            regular audits provide ongoing protection against new threats.
          </p>
        </div>
      </div>

      {/* Recommendations grouped by priority */}
      {priorityOrder.map((priority) => {
        const items = grouped[priority];
        if (!items?.length) return null;
        const color = priorityColor[priority];
        return (
          <div key={priority}>
            <div className="mb-3 flex items-center gap-2">
              <Pill color={color as 'red' | 'amber' | 'cyan'}>{priority.toUpperCase()} PRIORITY</Pill>
              <span className="text-xs text-soc-muted">{items.length} recommendations</span>
              <div className="h-px flex-1 bg-soc-border" />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {items.map((r) => {
                const Icon = categoryIcons[r.category] || Code2;
                return (
                  <div
                    key={r.id}
                    className="flex flex-col rounded-xl border border-soc-border bg-soc-card/60 p-5 transition-colors hover:border-soc-border-light"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-accent-green/20 bg-accent-green/5">
                        <Icon size={18} className="text-accent-green" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-soc-muted">{r.id}</span>
                          <span className="text-[10px] uppercase tracking-wider text-soc-muted">{r.category}</span>
                        </div>
                        <h3 className="mt-0.5 text-sm font-bold text-soc-bright">{r.title}</h3>
                      </div>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-soc-muted">{r.description}</p>

                    {r.example && (
                      <div className="mt-3 overflow-hidden rounded-lg border border-soc-border bg-soc-bg/70">
                        <div className="flex items-center justify-between border-b border-soc-border bg-soc-panel/60 px-3 py-1.5">
                          <span className="text-[10px] uppercase tracking-widest text-accent-green">Secure Pattern</span>
                          <button
                            onClick={() => handleCopy(r.id, r.example!)}
                            className="flex items-center gap-1 text-[10px] text-soc-muted hover:text-accent-cyan"
                          >
                            {copiedId === r.id ? <Check size={11} className="text-accent-green" /> : <Copy size={11} />}
                            {copiedId === r.id ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <pre className="overflow-x-auto p-3 text-[12px] leading-relaxed font-mono text-soc-text">
                          <code>{r.example}</code>
                        </pre>
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {r.standards.map((s) => (
                        <span key={s} className="rounded border border-soc-border bg-soc-panel/50 px-2 py-0.5 text-[10px] text-soc-muted">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
