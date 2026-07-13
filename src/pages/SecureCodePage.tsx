import {
  Lock, ShieldCheck, ArrowRight, Code2,
  KeyRound, Database, ShieldOff, EyeOff, Check,
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import CodeBlock from '../components/CodeBlock';
import { secureCode } from '../data/auditData';

const remediationMap = [
  {
    line: 7, icon: ShieldOff, title: 'Server-Side Input Validation', color: 'text-accent-green',
    desc: 'Username checked against ^[A-Za-z0-9_]{3,32}$; password min length enforced. Rejects invalid input early with HTTP 400.',
  },
  {
    line: 15, icon: Database, title: 'Prepared Statement', color: 'text-accent-green',
    desc: 'bind_param("s", $username) sends the value as data, not SQL. Injection is structurally impossible.',
  },
  {
    line: 21, icon: KeyRound, title: 'password_verify()', color: 'text-accent-green',
    desc: 'Constant-time comparison against the stored Bcrypt hash. Plaintext is never stored or compared.',
  },
  {
    line: 27, icon: EyeOff, title: 'Generic Error Message', color: 'text-accent-green',
    desc: 'Returns "Authentication failed" with HTTP 401. No schema, query, or implementation details leaked.',
  },
];

export default function SecureCodePage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Lock}
        eyebrow="Remediated Version"
        title="Secure PHP Login — Hardened Implementation"
        description="The fully remediated authentication module. All four vulnerabilities have been fixed: prepared statements replace string concatenation, input is validated server-side, passwords are hashed with password_hash()/password_verify(), and error messages are generic."
        accent="green"
      />

      {/* Success banner */}
      <div className="flex items-start gap-3 rounded-lg border border-accent-green/30 bg-accent-green/5 p-4">
        <ShieldCheck size={20} className="mt-0.5 shrink-0 text-accent-green" />
        <div>
          <p className="text-sm font-semibold text-accent-green">All Findings Resolved</p>
          <p className="mt-1 text-xs leading-relaxed text-soc-muted">
            This implementation resolves SCRV-001 (SQL Injection → prepared statements),
            SCRV-002 (No Input Validation → whitelist validation), SCRV-003 (Plain Text Passwords →
            password hashing), and the error disclosure issue (→ generic error messages).
          </p>
        </div>
      </div>

      {/* Code + annotations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <CodeBlock
            code={secureCode}
            variant="secure"
            filename="login.php (remediated)"
            highlightedLines={[7, 15, 21, 27]}
          />
        </div>

        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-display text-sm font-bold text-soc-bright">Security Controls Applied</h3>
          {remediationMap.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.line}
                className="group flex gap-3 rounded-lg border border-soc-border bg-soc-card/60 p-3 transition-colors hover:border-accent-green/30"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent-green/20 bg-accent-green/5">
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

      {/* Before / After comparison */}
      <div className="rounded-xl border border-soc-border bg-soc-card/70 p-5">
        <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-bold text-soc-bright">
          <Code2 size={16} className="text-accent-cyan" />
          Vulnerable vs. Secure — Key Transformations
        </h3>
        <div className="space-y-3">
          {[
            {
              vuln: '$query = "SELECT * FROM users WHERE username=\'$username\'..."',
              secure: '$stmt = $conn->prepare("SELECT ... WHERE username = ?");\n$stmt->bind_param("s", $username);',
              label: 'SQL Query',
            },
            {
              vuln: "$username = $_POST['username'];  // no validation",
              secure: "if (!preg_match('/^[A-Za-z0-9_]{3,32}$/', $username)) exit('Invalid');",
              label: 'Input Handling',
            },
            {
              vuln: "if (\$row['password'] === \$password)",
              secure: "if (password_verify($password, $row['password_hash']))",
              label: 'Password Check',
            },
            {
              vuln: "echo 'Database error: ' . \$conn->error;",
              secure: "http_response_code(401); exit('Authentication failed');",
              label: 'Error Output',
            },
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-1 items-center gap-2 md:grid-cols-[1fr_auto_1fr]">
              <div className="rounded-lg border border-accent-red/20 bg-accent-red/5 p-3">
                <p className="mb-1 text-[10px] uppercase tracking-wider text-accent-red">{row.label} — Before</p>
                <pre className="overflow-x-auto font-mono text-[11px] text-accent-red/90"><code>{row.vuln}</code></pre>
              </div>
              <ArrowRight size={18} className="mx-auto hidden text-soc-muted md:block" />
              <div className="rounded-lg border border-accent-green/20 bg-accent-green/5 p-3">
                <p className="mb-1 text-[10px] uppercase tracking-wider text-accent-green">{row.label} — After</p>
                <pre className="overflow-x-auto font-mono text-[11px] text-accent-green/90"><code>{row.secure}</code></pre>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Remediation summary */}
      <div className="rounded-xl border border-accent-green/20 bg-soc-card/70 p-5">
        <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-bold text-soc-bright">
          <Check size={16} className="text-accent-green" />
          Remediation Status Summary
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { issue: 'SQL Injection', fix: 'Fixed using prepared statements' },
            { issue: 'Input Validation', fix: 'Fixed using whitelist validation and sanitization' },
            { issue: 'Password Handling', fix: 'Fixed using password hashing (password_hash / password_verify)' },
            { issue: 'Error Information Disclosure', fix: 'Fixed using generic error messages' },
          ].map((r) => (
            <div key={r.issue} className="flex items-start gap-3 rounded-lg border border-soc-border bg-soc-panel/40 p-3">
              <Check size={16} className="mt-0.5 shrink-0 text-accent-green" />
              <div>
                <p className="text-sm font-semibold text-soc-text">{r.issue}</p>
                <p className="mt-0.5 text-[11px] text-accent-green/80">{r.fix}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
