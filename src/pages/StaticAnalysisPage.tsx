import { useState } from 'react';
import {
  ScanSearch, Terminal, Eye, FileCode, ChevronRight,
  AlertCircle, XCircle, Info, CheckCircle2,
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { SeverityBadge } from '../components/Badges';
import {
  analysisItems, phpCodeSnifferSummary, type AnalysisItem,
} from '../data/auditData';

type ToolFilter = 'All' | AnalysisItem['tool'];

const toolFilters: ToolFilter[] = ['All', 'Manual Inspection', 'PHP CodeSniffer'];

export default function StaticAnalysisPage() {
  const [tool, setTool] = useState<ToolFilter>('All');
  const [showFullReport, setShowFullReport] = useState(false);

  const filtered = tool === 'All' ? analysisItems : analysisItems.filter((i) => i.tool === tool);
  const manualCount = analysisItems.filter((i) => i.tool === 'Manual Inspection').length;
  const sniffCount = analysisItems.filter((i) => i.tool === 'PHP CodeSniffer').length;

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={ScanSearch}
        eyebrow="SAST Results"
        title="Static Analysis Report"
        description="Findings from manual source code inspection and automated scanning with PHP CodeSniffer. Manual review identified logic-level security flaws while the automated tooling enforced coding standards and detected insecure patterns."
        accent="cyan"
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-soc-border bg-soc-card/60 p-4">
          <div className="flex items-center gap-2 text-accent-cyan">
            <Eye size={16} />
            <span className="text-[11px] font-bold uppercase tracking-wider">Manual</span>
          </div>
          <p className="mt-2 font-display text-2xl font-extrabold text-soc-bright">{manualCount}</p>
          <p className="text-[11px] text-soc-muted">inspection items</p>
        </div>
        <div className="rounded-xl border border-soc-border bg-soc-card/60 p-4">
          <div className="flex items-center gap-2 text-accent-amber">
            <Terminal size={16} />
            <span className="text-[11px] font-bold uppercase tracking-wider">CodeSniffer</span>
          </div>
          <p className="mt-2 font-display text-2xl font-extrabold text-soc-bright">{sniffCount}</p>
          <p className="text-[11px] text-soc-muted">automated findings</p>
        </div>
        <div className="rounded-xl border border-accent-red/20 bg-accent-red/5 p-4">
          <div className="flex items-center gap-2 text-accent-red">
            <XCircle size={16} />
            <span className="text-[11px] font-bold uppercase tracking-wider">Errors</span>
          </div>
          <p className="mt-2 font-display text-2xl font-extrabold text-accent-red">{phpCodeSnifferSummary.totalErrors}</p>
          <p className="text-[11px] text-soc-muted">from phpcs</p>
        </div>
        <div className="rounded-xl border border-accent-amber/20 bg-accent-amber/5 p-4">
          <div className="flex items-center gap-2 text-accent-amber">
            <AlertCircle size={16} />
            <span className="text-[11px] font-bold uppercase tracking-wider">Warnings</span>
          </div>
          <p className="mt-2 font-display text-2xl font-extrabold text-accent-amber">{phpCodeSnifferSummary.totalWarnings}</p>
          <p className="text-[11px] text-soc-muted">from phpcs</p>
        </div>
      </div>

      {/* Tool filter */}
      <div className="flex flex-wrap gap-2">
        {toolFilters.map((t) => (
          <button
            key={t}
            onClick={() => setTool(t)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
              tool === t
                ? 'border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan'
                : 'border-soc-border bg-soc-card/40 text-soc-muted hover:text-soc-text hover:border-soc-border-light'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Findings table */}
      <div className="overflow-hidden rounded-xl border border-soc-border bg-soc-card/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-soc-border bg-soc-panel/60 text-[10px] uppercase tracking-wider text-soc-muted">
              <tr>
                <th className="px-4 py-3 font-bold">Tool</th>
                <th className="px-4 py-3 font-bold">File</th>
                <th className="px-4 py-3 font-bold">Line</th>
                <th className="px-4 py-3 font-bold">Rule</th>
                <th className="px-4 py-3 font-bold">Severity</th>
                <th className="px-4 py-3 font-bold">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soc-border/50">
              {filtered.map((item, idx) => (
                <tr key={idx} className="hover:bg-soc-panel/30 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`flex items-center gap-1.5 ${item.tool === 'Manual Inspection' ? 'text-accent-cyan' : 'text-accent-amber'}`}>
                      {item.tool === 'Manual Inspection' ? <Eye size={12} /> : <Terminal size={12} />}
                      <span className="font-semibold">{item.tool === 'Manual Inspection' ? 'Manual' : 'PHPCS'}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono text-soc-text">{item.file}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono text-soc-muted">{item.line}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-soc-muted">{item.rule}</td>
                  <td className="px-4 py-3 whitespace-nowrap"><SeverityBadge severity={item.severity} size="xs" /></td>
                  <td className="px-4 py-3 text-soc-text">{item.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code snippets for selected findings */}
      <div className="rounded-xl border border-soc-border bg-soc-card/70 p-5">
        <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-bold text-soc-bright">
          <FileCode size={16} className="text-accent-cyan" />
          Flagged Code Snippets
        </h3>
        <div className="space-y-2.5">
          {filtered.map((item, idx) => (
            <div key={idx} className="rounded-lg border border-soc-border bg-soc-panel/40 p-3">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono text-[10px] text-soc-muted">{item.file}:{item.line}</span>
                <span className="font-mono text-[10px] text-soc-muted/70">{item.rule}</span>
                <SeverityBadge severity={item.severity} size="xs" />
              </div>
              <pre className="overflow-x-auto rounded bg-soc-bg/70 px-3 py-2 font-mono text-[12px] text-soc-text">
                <code>{item.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* PHP CodeSniffer CLI report */}
      <div className="overflow-hidden rounded-xl border border-soc-border bg-soc-bg/80">
        <div className="flex items-center justify-between border-b border-soc-border bg-soc-panel/60 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-accent-green" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-accent-green">PHP CodeSniffer Report</span>
          </div>
          <button
            onClick={() => setShowFullReport(!showFullReport)}
            className="flex items-center gap-1 text-[11px] text-soc-muted hover:text-accent-cyan"
          >
            {showFullReport ? 'Collapse' : 'Expand'}
            <ChevronRight size={12} className={`transition-transform ${showFullReport ? 'rotate-90' : ''}`} />
          </button>
        </div>
        <div className="px-4 py-3 border-b border-soc-border">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-soc-muted">$</span>
            <code className="font-mono text-accent-green">{phpCodeSnifferSummary.command}</code>
          </div>
        </div>
        <pre className={`overflow-x-auto p-4 font-mono text-[12px] leading-relaxed text-soc-text transition-all ${showFullReport ? '' : 'max-h-48'}`}>
          <code>{phpCodeSnifferSummary.reportText}</code>
        </pre>
        {!showFullReport && (
          <div className="border-t border-soc-border bg-gradient-to-t from-soc-bg to-transparent px-4 py-2 text-center">
            <button
              onClick={() => setShowFullReport(true)}
              className="text-[11px] text-soc-muted hover:text-accent-cyan"
            >
              Show full report...
            </button>
          </div>
        )}
      </div>

      {/* Standards compliance */}
      <div className="rounded-xl border border-soc-border bg-soc-card/70 p-5">
        <h3 className="mb-4 font-display text-sm font-bold text-soc-bright">Standards Compliance Summary</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg border border-soc-border bg-soc-panel/40 p-3">
            <XCircle size={18} className="text-accent-red" />
            <div>
              <p className="text-sm font-semibold text-soc-text">PSR-12</p>
              <p className="text-[11px] text-soc-muted">2 violations</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-soc-border bg-soc-panel/40 p-3">
            <XCircle size={18} className="text-accent-red" />
            <div>
              <p className="text-sm font-semibold text-soc-text">OWASP A03:2021</p>
              <p className="text-[11px] text-soc-muted">Injection — fail</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-soc-border bg-soc-panel/40 p-3">
            <CheckCircle2 size={18} className="text-accent-green" />
            <div>
              <p className="text-sm font-semibold text-soc-text">Post-Remediation</p>
              <p className="text-[11px] text-soc-muted">All criticals pass</p>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-accent-cyan/20 bg-accent-cyan/5 p-3">
          <Info size={14} className="mt-0.5 shrink-0 text-accent-cyan" />
          <p className="text-[11px] leading-relaxed text-soc-muted">
            PHP CodeSniffer was extended with custom security sniffs
            (<code className="text-accent-cyan">Security.SQLInjection</code>,{' '}
            <code className="text-accent-cyan">Security.BestPractices.PlaintextPassword</code>,{' '}
            <code className="text-accent-cyan">Security.InputValidation.Missing</code>) to detect
            insecure patterns beyond the default PSR-12 style rules. PHPCBF can auto-fix 2 of the 7 violations.
          </p>
        </div>
      </div>
    </div>
  );
}
