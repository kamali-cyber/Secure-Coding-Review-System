import { useState } from 'react';
import {
  ListChecks, Search, ChevronDown, ChevronUp, Target,
  Wrench, FileWarning, MapPin, ExternalLink, CheckCircle2,
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { SeverityBadge, StatusBadge } from '../components/Badges';
import { findings, type Severity, type Status } from '../data/auditData';

type Filter = 'All' | Severity | Status;

const filterChips: Filter[] = ['All', 'High', 'Medium', 'Low', 'Resolved', 'Open'];

function matchesFilter(sev: Severity, status: Status, filter: Filter): boolean {
  if (filter === 'All') return true;
  if (['High', 'Medium', 'Low'].includes(filter)) return sev === filter;
  return status === filter;
}

export default function FindingsPage() {
  const [filter, setFilter] = useState<Filter>('All');
  const [expanded, setExpanded] = useState<string | null>(findings[0].id);
  const [search, setSearch] = useState('');

  const filtered = findings.filter((f) => {
    const matchesSearch =
      !search ||
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.id.toLowerCase().includes(search.toLowerCase()) ||
      f.cwe.toLowerCase().includes(search.toLowerCase());
    return matchesFilter(f.severity, f.status, filter) && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={ListChecks}
        eyebrow="Audit Report"
        title="Security Findings"
        description="Detailed record of every vulnerability discovered during the review. Each finding includes CVSS score, CWE reference, OWASP category, business impact, remediation guidance, and the specific remediation action applied."
        accent="red"
      />

      {/* Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-soc-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search findings, CWE, ID..."
            className="w-full rounded-lg border border-soc-border bg-soc-card/60 py-2 pl-9 pr-3 text-sm text-soc-text placeholder:text-soc-muted/60 focus:border-accent-cyan/50 focus:outline-none focus:ring-1 focus:ring-accent-cyan/30"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filterChips.map((chip) => (
            <button
              key={chip}
              onClick={() => setFilter(chip)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                filter === chip
                  ? 'border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan'
                  : 'border-soc-border bg-soc-card/40 text-soc-muted hover:text-soc-text hover:border-soc-border-light'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-soc-muted">
        Showing <span className="font-bold text-soc-text">{filtered.length}</span> of {findings.length} findings
      </p>

      {/* Findings list */}
      <div className="space-y-3">
        {filtered.map((f) => {
          const isOpen = expanded === f.id;
          const sevBorder =
            f.severity === 'High' ? 'border-l-accent-red'
            : f.severity === 'Medium' ? 'border-l-accent-amber'
            : 'border-l-accent-cyan';
          return (
            <div
              key={f.id}
              className={`rounded-xl border border-soc-border border-l-4 ${sevBorder} bg-soc-card/60 overflow-hidden transition-colors hover:bg-soc-card/80`}
            >
              {/* Header row */}
              <button
                onClick={() => setExpanded(isOpen ? null : f.id)}
                className="flex w-full items-center gap-3 p-4 text-left"
              >
                <div className="flex h-10 w-14 shrink-0 flex-col items-center justify-center rounded border border-soc-border bg-soc-panel">
                  <span className="font-display text-sm font-extrabold leading-none text-soc-bright">{f.cvss}</span>
                  <span className="text-[8px] uppercase text-soc-muted">cvss</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] text-soc-muted">{f.id}</span>
                    <SeverityBadge severity={f.severity} size="xs" />
                    <span className="rounded border border-soc-border bg-soc-panel px-1.5 py-0.5 text-[10px] text-soc-muted">{f.cwe}</span>
                  </div>
                  <p className="mt-1 truncate text-sm font-semibold text-soc-text">{f.title}</p>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-soc-muted">
                    <MapPin size={10} /> {f.location}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StatusBadge status={f.status} />
                  {isOpen ? <ChevronUp size={18} className="text-soc-muted" /> : <ChevronDown size={18} className="text-soc-muted" />}
                </div>
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="border-t border-soc-border px-4 pb-4 pt-4 animate-fade-in">
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Description */}
                    <div className="lg:col-span-2 space-y-4">
                      <div>
                        <h4 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-soc-muted">
                          <FileWarning size={12} /> Description
                        </h4>
                        <p className="text-sm leading-relaxed text-soc-text">{f.description}</p>
                      </div>
                      <div>
                        <h4 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-accent-red">
                          <Target size={12} /> Impact
                        </h4>
                        <p className="text-sm leading-relaxed text-soc-text">{f.impact}</p>
                      </div>
                      <div>
                        <h4 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-accent-green">
                          <Wrench size={12} /> Remediation
                        </h4>
                        <p className="text-sm leading-relaxed text-soc-text">{f.remediation}</p>
                      </div>
                      {/* Remediation action callout */}
                      <div className="flex items-start gap-2.5 rounded-lg border border-accent-green/20 bg-accent-green/5 p-3">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent-green" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-accent-green">Remediation Action</p>
                          <p className="mt-0.5 text-sm font-semibold text-accent-green/90">{f.remediationAction}</p>
                        </div>
                      </div>
                    </div>

                    {/* Side panel */}
                    <div className="space-y-3">
                      <div className="rounded-lg border border-soc-border bg-soc-panel/50 p-3">
                        <p className="text-[10px] uppercase tracking-widest text-soc-muted">Evidence</p>
                        <p className="mt-1.5 font-mono text-[11px] leading-relaxed text-soc-text">{f.evidence}</p>
                      </div>
                      <div className="rounded-lg border border-soc-border bg-soc-panel/50 p-3">
                        <p className="text-[10px] uppercase tracking-widest text-soc-muted">Classification</p>
                        <dl className="mt-2 space-y-1.5 text-[11px]">
                          <div className="flex justify-between"><dt className="text-soc-muted">Category</dt><dd className="text-soc-text">{f.category}</dd></div>
                          <div className="flex justify-between"><dt className="text-soc-muted">OWASP</dt><dd className="text-right text-soc-text">{f.owasp}</dd></div>
                          <div className="flex justify-between"><dt className="text-soc-muted">CVSS</dt><dd className="text-soc-text">{f.cvss}</dd></div>
                        </dl>
                      </div>
                      <div className="rounded-lg border border-soc-border bg-soc-panel/50 p-3">
                        <p className="text-[10px] uppercase tracking-widest text-soc-muted">References</p>
                        <ul className="mt-2 space-y-1.5">
                          {f.references.map((r) => (
                            <li key={r} className="flex items-start gap-1.5 text-[11px] text-soc-text">
                              <ExternalLink size={11} className="mt-0.5 shrink-0 text-accent-cyan" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-lg border border-soc-border bg-soc-card/60 p-8 text-center text-sm text-soc-muted">
          No findings match the current filter.
        </div>
      )}
    </div>
  );
}
