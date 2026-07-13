import { Bug, AlertTriangle, ArrowRight, Database, KeyRound, ShieldOff, EyeOff } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import CodeBlock from '../components/CodeBlock';
import { SeverityBadge } from '../components/Badges';
import { vulnerableCode, findings } from '../data/auditData';

const vulnerabilityMarkers = [
  { line: 9, icon: ShieldOff, title: 'No Input Validation', color: 'text-accent-amber', desc: 'Username and password fields accept unsanitized input directly from $_POST — no length, format, or character checks.' },
  { line: 14, icon: KeyRound, title: 'Plain Text Password Handling', color: 'text-accent-amber', desc: 'Password compared with === against a stored plaintext value. No hashing algorithm applied at any point.' },
  { line: 18, icon: Database, title: 'SQL Injection', color: 'text-accent-red', desc: 'User input concatenated directly into the SQL query string. Authentication bypass via admin\' -- is trivial.' },
  { line: 25, icon: EyeOff, title: 'Error Information Disclosure', color: 'text-accent-amber', desc: 'Raw mysqli error message echoed to the user, revealing table names and implementation details.' },
];

export default function VulnerableCodePage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Bug}
        eyebrow="Original Source"
        title="Vulnerable PHP Login System"
        description="The original authentication module before remediation. This code contains four security flaws: SQL injection via string concatenation, no input validation, plain text password handling, and error messages that reveal implementation details. Each flagged line is annotated below."
        accent="red"
      />

      {/* Warning banner */}
      <div className="flex items-start gap-3 rounded-lg border border-accent-red/30 bg-accent-red/5 p-4">
        <AlertTriangle size={20} className="mt-0.5 shrink-0 text-accent-red" />
        <div>
          <p className="text-sm font-semibold text-accent-red">Do NOT deploy this code</p>
          <p className="mt-1 text-xs leading-relaxed text-soc-muted">
            This listing is preserved as audit evidence for CodeAlpha Task 3. It is intentionally vulnerable
            and exists only for analysis and comparison against the remediated version on the Secure Code page.
          </p>
        </div>
      </div>

      {/* Code + annotations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <CodeBlock
            code={vulnerableCode}
            variant="vulnerable"
            filename="login.php"
            highlightedLines={[9, 14, 18, 25]}
          />
        </div>

        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-display text-sm font-bold text-soc-bright">Flagged Lines</h3>
          {vulnerabilityMarkers.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.line}
                className="group flex gap-3 rounded-lg border border-soc-border bg-soc-card/60 p-3 transition-colors hover:border-soc-border-light"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-soc-border bg-soc-panel">
                  <Icon size={16} className={m.color} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-soc-muted">L{m.line}</span>
                    <span className="text-sm font-semibold text-soc-text">{m.title}</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-soc-muted">{m.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Attack vector demonstration */}
      <div className="rounded-xl border border-accent-red/20 bg-soc-card/70 p-5">
        <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-bold text-soc-bright">
          <Database size={16} className="text-accent-red" />
          SQL Injection — Proof of Concept
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-soc-border bg-soc-bg/60 p-4">
            <p className="text-[10px] uppercase tracking-widest text-soc-muted">Payload (username field)</p>
            <p className="mt-2 font-mono text-sm text-accent-red break-all">admin' --</p>
          </div>
          <div className="flex items-center justify-center">
            <ArrowRight size={24} className="text-soc-muted" />
          </div>
          <div className="rounded-lg border border-accent-red/20 bg-accent-red/5 p-4">
            <p className="text-[10px] uppercase tracking-widest text-accent-red">Resulting Query</p>
            <p className="mt-2 font-mono text-xs text-soc-text break-all">
              SELECT * FROM users WHERE username='admin' --' AND password=''
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-soc-muted">
          The <code className="text-accent-red">'</code> terminates the username string literal and
          <code className="text-accent-red"> --</code> comments out the password check. Authentication is
          granted for the admin account with no password required.
        </p>
      </div>

      {/* Related findings */}
      <div className="rounded-xl border border-soc-border bg-soc-card/70 p-5">
        <h3 className="mb-4 font-display text-sm font-bold text-soc-bright">Vulnerabilities Identified in This File</h3>
        <div className="space-y-2.5">
          {findings.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-3 rounded-lg border border-soc-border bg-soc-panel/40 p-3"
            >
              <span className="font-mono text-[10px] text-soc-muted">{f.id}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-soc-text">{f.title}</p>
                <p className="truncate text-[11px] text-soc-muted">{f.location}</p>
              </div>
              <SeverityBadge severity={f.severity} size="xs" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
