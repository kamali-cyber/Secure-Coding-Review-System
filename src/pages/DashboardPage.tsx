import {
  ShieldCheck, Bug, AlertTriangle, Activity,
  Gauge, FileCode, Lock, CircleDot,
  Database, CheckCircle2, EyeOff, KeyRound, ShieldCheck as ShieldCheckIcon,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import SectionHeader from '../components/SectionHeader';
import { SeverityBadge, StatusBadge } from '../components/Badges';
import {
  dashboardStats, severityDistribution, statusDistribution,
  findings, auditMeta, remediationActions,
} from '../data/auditData';

const remediationIcons: Record<string, typeof Database> = {
  Database, ShieldCheck: ShieldCheckIcon, KeyRound, EyeOff,
};

export default function DashboardPage() {
  const topFindings = [...findings].sort((a, b) => b.cvss - a.cvss);

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Activity}
        eyebrow="Overview"
        title="Security Posture Dashboard"
        description="Summary of vulnerabilities discovered during the secure coding review of the PHP Login System. All three findings have been remediated. Metrics reflect manual inspection and PHP CodeSniffer static analysis."
        accent="green"
      />

      {/* Hero banner — audit complete */}
      <div className="scanline relative overflow-hidden rounded-xl border border-accent-green/20 bg-gradient-to-br from-soc-card via-soc-panel to-soc-bg p-6">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-accent-green/40 bg-accent-green/10">
              <ShieldCheck size={28} className="text-accent-green" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent-green animate-pulse-slow" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-accent-green">
                  Audit Complete — All Findings Resolved
                </span>
              </div>
              <h3 className="mt-1 font-display text-xl font-bold text-soc-bright">
                {auditMeta.subtitle}
              </h3>
              <p className="mt-1 text-xs text-soc-muted">
                {auditMeta.scope}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="rounded-lg border border-soc-border bg-soc-bg/60 px-4 py-3 text-center">
              <p className="font-display text-2xl font-extrabold text-accent-green">{dashboardStats.riskScore}</p>
              <p className="text-[10px] uppercase tracking-wider text-soc-muted">Risk Score</p>
            </div>
            <div className="rounded-lg border border-soc-border bg-soc-bg/60 px-4 py-3 text-center">
              <p className="font-display text-2xl font-extrabold text-accent-cyan">{dashboardStats.avgCvss}</p>
              <p className="text-[10px] uppercase tracking-wider text-soc-muted">Avg CVSS</p>
            </div>
            <div className="rounded-lg border border-soc-border bg-soc-bg/60 px-4 py-3 text-center">
              <p className="font-display text-2xl font-extrabold text-soc-bright">{auditMeta.linesScanned}</p>
              <p className="text-[10px] uppercase tracking-wider text-soc-muted">Lines Scanned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards — exact dashboard metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Findings" value={dashboardStats.totalFindings} icon={Bug} color="cyan" sublabel="across 3 files" glow />
        <StatCard label="High Severity" value={dashboardStats.high} icon={AlertTriangle} color="red" sublabel="SQL Injection" glow />
        <StatCard label="Medium Severity" value={dashboardStats.medium} icon={AlertTriangle} color="amber" sublabel="validation + passwords" glow />
        <StatCard label="Resolved" value={dashboardStats.resolved} icon={ShieldCheck} color="green" sublabel="all findings fixed" glow />
      </div>

      {/* Secondary metrics row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-soc-border bg-soc-card/60 p-4">
          <div className="flex items-center gap-2 text-accent-cyan">
            <CircleDot size={15} />
            <span className="text-[11px] font-bold uppercase tracking-wider">Low Severity</span>
          </div>
          <p className="mt-2 font-display text-2xl font-extrabold text-soc-bright">{dashboardStats.low}</p>
        </div>
        <div className="rounded-xl border border-accent-green/20 bg-accent-green/5 p-4">
          <div className="flex items-center gap-2 text-accent-green">
            <CheckCircle2 size={15} />
            <span className="text-[11px] font-bold uppercase tracking-wider">Resolved</span>
          </div>
          <p className="mt-2 font-display text-2xl font-extrabold text-accent-green">{dashboardStats.resolved}</p>
        </div>
        <div className="rounded-xl border border-soc-border bg-soc-card/60 p-4">
          <div className="flex items-center gap-2 text-soc-muted">
            <AlertTriangle size={15} />
            <span className="text-[11px] font-bold uppercase tracking-wider">Open</span>
          </div>
          <p className="mt-2 font-display text-2xl font-extrabold text-soc-muted">{dashboardStats.open}</p>
        </div>
        <div className="rounded-xl border border-soc-border bg-soc-card/60 p-4">
          <div className="flex items-center gap-2 text-accent-cyan">
            <Gauge size={15} />
            <span className="text-[11px] font-bold uppercase tracking-wider">Files Scanned</span>
          </div>
          <p className="mt-2 font-display text-2xl font-extrabold text-soc-bright">{auditMeta.filesScanned}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Severity distribution */}
        <div className="rounded-xl border border-soc-border bg-soc-card/70 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Gauge size={16} className="text-accent-cyan" />
            <h3 className="font-display text-sm font-bold text-soc-bright">Severity Distribution</h3>
          </div>
          <div className="space-y-3">
            {severityDistribution.map((s) => {
              const pct = dashboardStats.totalFindings > 0 ? (s.count / dashboardStats.totalFindings) * 100 : 0;
              const colorBar = s.color === 'red' ? 'bg-accent-red' : s.color === 'amber' ? 'bg-accent-amber' : 'bg-accent-cyan';
              const colorText = s.color === 'red' ? 'text-accent-red' : s.color === 'amber' ? 'text-accent-amber' : 'text-accent-cyan';
              return (
                <div key={s.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-semibold text-soc-text">{s.label}</span>
                    <span className={`tabular-nums font-bold ${colorText}`}>{s.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-soc-border">
                    <div
                      className={`h-full rounded-full ${colorBar} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Remediation status */}
        <div className="rounded-xl border border-soc-border bg-soc-card/70 p-5">
          <div className="mb-4 flex items-center gap-2">
            <CircleDot size={16} className="text-accent-green" />
            <h3 className="font-display text-sm font-bold text-soc-bright">Remediation Status</h3>
          </div>
          <div className="space-y-3">
            {statusDistribution.map((s) => {
              const pct = dashboardStats.totalFindings > 0 ? (s.count / dashboardStats.totalFindings) * 100 : 0;
              const colorBar = s.color === 'red' ? 'bg-accent-red' : 'bg-accent-green';
              const colorText = s.color === 'red' ? 'text-accent-red' : 'text-accent-green';
              return (
                <div key={s.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-semibold text-soc-text">{s.label}</span>
                    <span className={`tabular-nums font-bold ${colorText}`}>{s.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-soc-border">
                    <div
                      className={`h-full rounded-full ${colorBar} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 border-t border-soc-border pt-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-soc-muted">Progress</span>
              <span className="font-bold text-accent-green">100%</span>
            </div>
          </div>
        </div>

        {/* Remediation actions */}
        <div className="rounded-xl border border-soc-border bg-soc-card/70 p-5">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-accent-green" />
            <h3 className="font-display text-sm font-bold text-soc-bright">Remediation Actions</h3>
          </div>
          <div className="space-y-2.5">
            {remediationActions.map((a, i) => {
              const Icon = remediationIcons[a.icon] || CheckCircle2;
              return (
                <div key={i} className="flex items-start gap-2.5 rounded-lg border border-soc-border bg-soc-panel/40 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-accent-green/20 bg-accent-green/5">
                    <Icon size={14} className="text-accent-green" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-soc-text">{a.title}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-accent-green/80">{a.action}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Findings summary + engagement meta */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-soc-border bg-soc-card/70 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug size={16} className="text-accent-cyan" />
              <h3 className="font-display text-sm font-bold text-soc-bright">All Findings</h3>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-soc-muted">by CVSS</span>
          </div>
          <div className="space-y-2.5">
            {topFindings.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-3 rounded-lg border border-soc-border bg-soc-panel/50 p-3 transition-colors hover:border-soc-border-light"
              >
                <div className="flex h-10 w-12 shrink-0 flex-col items-center justify-center rounded border border-soc-border bg-soc-panel">
                  <span className="font-display text-sm font-extrabold leading-none text-soc-bright">{f.cvss}</span>
                  <span className="text-[8px] uppercase text-soc-muted">cvss</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-soc-muted">{f.id}</span>
                    <SeverityBadge severity={f.severity} size="xs" />
                  </div>
                  <p className="mt-0.5 truncate text-sm font-semibold text-soc-text">{f.title}</p>
                  <p className="truncate text-[11px] text-soc-muted">{f.location} · {f.cwe}</p>
                </div>
                <StatusBadge status={f.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Engagement meta */}
        <div className="rounded-xl border border-soc-border bg-soc-card/70 p-5">
          <div className="mb-4 flex items-center gap-2">
            <FileCode size={16} className="text-accent-cyan" />
            <h3 className="font-display text-sm font-bold text-soc-bright">Engagement Details</h3>
          </div>
          <dl className="space-y-3 text-xs">
            {[
              { k: 'Task', v: auditMeta.engagement },
              { k: 'Target', v: auditMeta.target },
              { k: 'Scope', v: auditMeta.scope },
              { k: 'Version', v: `v${auditMeta.version}` },
              { k: 'Date', v: auditMeta.date },
              { k: 'Files Scanned', v: String(auditMeta.filesScanned) },
              { k: 'Lines Scanned', v: String(auditMeta.linesScanned) },
            ].map((row) => (
              <div key={row.k} className="flex justify-between gap-3 border-b border-soc-border/50 pb-2">
                <dt className="shrink-0 text-soc-muted">{row.k}</dt>
                <dd className="text-right font-semibold text-soc-text">{row.v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-accent-green/20 bg-accent-green/5 p-3">
            <Lock size={14} className="text-accent-green" />
            <p className="text-[11px] text-accent-green/90">
              All 3 findings resolved. Secure remediation code provided.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
