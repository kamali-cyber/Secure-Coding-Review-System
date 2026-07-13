// Central audit data for the Secure Coding Review of a PHP Login System.
// CodeAlpha Task 3 — Secure Coding Review
//
// Scope: 3 findings — SQL Injection (High), No Input Validation (Medium),
// Plain Text Password Handling (Medium). All resolved.

export type Severity = 'High' | 'Medium' | 'Low';
export type Status = 'Resolved' | 'Open';

export interface Finding {
  id: string;
  title: string;
  category: string;
  severity: Severity;
  cvss: number;
  cwe: string;
  owasp: string;
  location: string;
  description: string;
  impact: string;
  evidence: string;
  remediation: string;
  remediationAction: string;
  status: Status;
  references: string[];
}

export interface Recommendation {
  id: string;
  title: string;
  category: string;
  priority: 'Critical' | 'High' | 'Medium';
  description: string;
  example?: string;
  standards: string[];
}

export interface AnalysisItem {
  tool: 'Manual Inspection' | 'PHP CodeSniffer';
  file: string;
  line: number;
  rule: string;
  severity: Severity;
  message: string;
  code: string;
  standard: string;
}

export const auditMeta = {
  title: 'Secure Coding Review',
  subtitle: 'PHP Login System — Security Audit',
  engagement: 'CodeAlpha Task 3 — Secure Coding Review',
  auditor: 'Security Engineering',
  version: '1.0',
  date: '2026-07-13',
  scope: 'PHP Login System — authentication, input handling, credential storage',
  target: 'PHP 8.x · MySQL 8.0',
  linesScanned: 64,
  filesScanned: 3,
};

export const severityColor: Record<Severity, string> = {
  High: 'red',
  Medium: 'amber',
  Low: 'cyan',
};

export const statusColor: Record<Status, string> = {
  Resolved: 'green',
  Open: 'red',
};

export const findings: Finding[] = [
  {
    id: 'SCRV-001',
    title: 'SQL Injection via Direct String Concatenation',
    category: 'Injection',
    severity: 'High',
    cvss: 8.6,
    cwe: 'CWE-89',
    owasp: 'A03:2021 — Injection',
    location: 'login.php:18',
    description:
      'User input from the username and password fields is concatenated directly into the SQL query string without any sanitization or parameterization. An attacker can terminate the intended query and inject arbitrary SQL using a single quote, bypassing authentication entirely.',
    impact:
      'Complete authentication bypass and full database read/write access. An attacker can extract, modify, or delete every stored user record, potentially achieving remote code execution depending on the database configuration.',
    evidence:
      "$query = \"SELECT * FROM users WHERE username='$username' AND password='$password'\";  —  payload admin' -- logs in with no password.",
    remediation:
      'Replace string concatenation with prepared statements and parameterized queries using PDO or MySQLi. Bind all user-supplied values as parameters so the database engine treats them strictly as data, not executable SQL.',
    remediationAction: 'Fixed using prepared statements with bound parameters.',
    status: 'Resolved',
    references: [
      'OWASP SQL Injection Prevention Cheat Sheet',
      'CWE-89: Improper Neutralization of Special Elements used in an SQL Command',
      'PHP Manual — PDO::prepare / mysqli::prepare',
    ],
  },
  {
    id: 'SCRV-002',
    title: 'No Input Validation on Login Fields',
    category: 'Input Validation',
    severity: 'Medium',
    cvss: 6.5,
    cwe: 'CWE-20',
    owasp: 'A03:2021 — Injection',
    location: 'login.php:9-12, register.php:8-18',
    description:
      'The username and password fields accept unsanitized input directly from $_POST with no server-side validation. There are no length checks, format validation, character whitelisting, or empty-field rejection. Any payload — regardless of content or size — reaches the database layer.',
    impact:
      'Enables injection attacks by allowing malicious payloads to reach the query unfiltered. Oversized inputs can trigger memory or regex denial-of-service. Malformed data may corrupt records or trigger secondary vulnerabilities downstream.',
    evidence:
      "$username = $_POST['username'];  $password = $_POST['password'];  — no filter_input(), preg_match(), or strlen() guard present.",
    remediation:
      'Implement server-side input validation using a whitelist approach. Enforce required fields, maximum length (e.g. 32 for username), and a username character pattern (^[A-Za-z0-9_]{3,32}$). Reject invalid input early with a 400 response. Never rely on client-side checks alone.',
    remediationAction: 'Fixed using whitelist validation and sanitization.',
    status: 'Resolved',
    references: [
      'OWASP Input Validation Cheat Sheet',
      'CWE-20: Improper Input Validation',
    ],
  },
  {
    id: 'SCRV-003',
    title: 'Plain Text Password Handling',
    category: 'Cryptographic Failure',
    severity: 'Medium',
    cvss: 6.5,
    cwe: 'CWE-256',
    owasp: 'A02:2021 — Cryptographic Failures',
    location: 'login.php:14, register.php:22',
    description:
      'Passwords are compared and stored without any hashing. The login handler checks the submitted password against the database value using direct string equality (===), and the registration handler inserts the raw password into the database. No salt, no hashing algorithm, and no key derivation function is applied.',
    impact:
      'A single database dump exposes every user credential in cleartext. Because users reuse passwords across services, plaintext storage causes cascading account takeovers and violates GDPR, PCI-DSS, and NIST password storage requirements.',
    evidence:
      "login.php:14 — if ($row['password'] === $password).  register.php:22 — INSERT INTO users (username, password) VALUES ('$username', '$password').",
    remediation:
      'Hash passwords at registration using password_hash($pwd, PASSWORD_BCRYPT) and verify at login using password_verify($input, $storedHash). These functions handle salt generation and use a computationally expensive algorithm resistant to brute-force attacks.',
    remediationAction: 'Fixed using password hashing (password_hash / password_verify).',
    status: 'Resolved',
    references: [
      'OWASP Password Storage Cheat Sheet',
      'CWE-256: Plaintext Storage of a Password',
      'PHP Manual — password_hash / password_verify',
    ],
  },
];

export const recommendations: Recommendation[] = [
  {
    id: 'REC-001',
    title: 'Use Prepared Statements and Parameterized Queries',
    category: 'Injection Defense',
    priority: 'High',
    description:
      'Every database query that incorporates external input must use bound parameters. The database driver then guarantees the input is treated as data, structurally eliminating SQL injection. This is the single highest-impact change for this codebase.',
    example:
      "$stmt = $conn->prepare('SELECT id, password_hash FROM users WHERE username = ?');\n$stmt->bind_param('s', $username);\n$stmt->execute();\n$row = $stmt->get_result()->fetch_assoc();",
    standards: ['OWASP SQL Injection Prevention', 'CWE-89', 'PCI-DSS 6.2.4'],
  },
  {
    id: 'REC-002',
    title: 'Implement Server-Side Input Validation',
    category: 'Input Handling',
    priority: 'High',
    description:
      'Define the expected format, length, and character set for every field. Reject anything outside the whitelist with a 400 response before it reaches the database or business logic. Validation must be server-side; client checks are UX only.',
    example:
      "if (!preg_match('/^[A-Za-z0-9_]{3,32}$/', $username) || strlen($password) < 8) {\n    http_response_code(400);\n    exit('Invalid input');\n}",
    standards: ['OWASP Input Validation', 'CWE-20'],
  },
  {
    id: 'REC-003',
    title: 'Use password_hash() and password_verify()',
    category: 'Password Storage',
    priority: 'High',
    description:
      'Store only salted, slow-hashed password digests. PHP password_hash() with PASSWORD_BCRYPT handles salt generation and cost factor automatically. Verify with password_verify() — never compare plaintext or use MD5/SHA1.',
    example:
      "// At registration:\n$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);\n// Store $hash in the database.\n\n// At login:\nif (password_verify($inputPassword, $storedHash)) {\n    // Valid credentials\n}",
    standards: ['OWASP Password Storage', 'CWE-256', 'NIST SP 800-63B'],
  },
  {
    id: 'REC-004',
    title: 'Apply Secure Error Handling',
    category: 'Error Handling',
    priority: 'Medium',
    description:
      'Suppress detailed errors in production (display_errors = Off). Log errors server-side to a protected file. Return only generic messages to the user — never echo database error text, stack traces, or query fragments that reveal implementation details.',
    example:
      "ini_set('display_errors', '0');\nini_set('log_errors', '1');\n// On failure:\nerror_log('Login failed for user: ' . $username);\nhttp_response_code(401);\nexit('Authentication failed');",
    standards: ['CWE-209', 'OWASP Security Misconfiguration'],
  },
  {
    id: 'REC-005',
    title: 'Enforce Least Privilege for Database Accounts',
    category: 'Access Control',
    priority: 'Medium',
    description:
      'The application database account should have only the minimum permissions needed — typically SELECT, INSERT, and UPDATE on the users table. Never use root or an admin-level account for the application connection. Granting DROP, ALTER, or GRANT enables catastrophic damage if SQL injection occurs.',
    example:
      "-- Create a restricted application user:\nCREATE USER 'appuser'@'localhost' IDENTIFIED BY 'strongpass';\nGRANT SELECT, INSERT, UPDATE ON appdb.users TO 'appuser'@'localhost';\n-- Never: GRANT ALL PRIVILEGES ON *.* TO 'appuser'@'%';",
    standards: ['OWASP Access Control', 'CWE-250', 'PCI-DSS 7.2.1'],
  },
  {
    id: 'REC-006',
    title: 'Conduct Regular Security Audits and Code Reviews',
    category: 'Process',
    priority: 'Medium',
    description:
      'Schedule periodic secure coding reviews and run automated SAST tools (PHP CodeSniffer, PHPStan) on every commit. Track findings to closure. Security is not a one-time audit — new code introduces new risk, and continuous review catches regressions early.',
    example:
      "# CI pipeline example:\nphpcs --standard=PSR-12,Security src/\nphpstan analyse src/ --level=5\n# Block merge on Critical/High findings",
    standards: ['OWASP SAMM', 'CWE-1357', 'NIST SP 800-53 RA-5'],
  },
];

export const analysisItems: AnalysisItem[] = [
  {
    tool: 'Manual Inspection',
    file: 'login.php',
    line: 18,
    rule: 'MANUAL-INJECTION',
    severity: 'High',
    message:
      'SQL query assembled via string concatenation of $_POST data. Direct injection vector.',
    code: "$query = \"SELECT * FROM users WHERE username='$username' AND password='$password'\"",
    standard: 'OWASP Top 10 A03:2021',
  },
  {
    tool: 'Manual Inspection',
    file: 'login.php',
    line: 9,
    rule: 'MANUAL-NOVALIDATE',
    severity: 'Medium',
    message: '$_POST values assigned to variables with no validation, sanitization, or length check.',
    code: "$username = $_POST['username'];  $password = $_POST['password'];",
    standard: 'OWASP Top 10 A03:2021',
  },
  {
    tool: 'Manual Inspection',
    file: 'login.php',
    line: 14,
    rule: 'MANUAL-PLAINTEXT',
    severity: 'Medium',
    message: 'Password compared in plaintext using strict equality. No hash function used.',
    code: "if ($row['password'] === $password) { /* login ok */ }",
    standard: 'OWASP Top 10 A02:2021',
  },
  {
    tool: 'Manual Inspection',
    file: 'register.php',
    line: 22,
    rule: 'MANUAL-PLAINTEXT-STORE',
    severity: 'Medium',
    message: 'Password inserted into database as plaintext — no hashing applied.',
    code: "INSERT INTO users (username, password) VALUES ('$username', '$password')",
    standard: 'OWASP Top 10 A02:2021',
  },
  {
    tool: 'Manual Inspection',
    file: 'login.php',
    line: 25,
    rule: 'MANUAL-ERRLEAK',
    severity: 'Medium',
    message: 'Raw database error echoed to user, revealing table and column names.',
    code: "echo 'Database error: ' . $conn->error;",
    standard: 'OWASP Top 10 A05:2021',
  },
  {
    tool: 'PHP CodeSniffer',
    file: 'login.php',
    line: 18,
    rule: 'Security.SQLInjection.StringConcatenation',
    severity: 'High',
    message: 'User input concatenated into SQL string. Use prepared statements with bound parameters.',
    code: "\"SELECT * FROM users WHERE username='$username'...\"",
    standard: 'Custom Security Sniff',
  },
  {
    tool: 'PHP CodeSniffer',
    file: 'login.php',
    line: 9,
    rule: 'Security.InputValidation.Missing',
    severity: 'Medium',
    message: 'Direct use of $_POST without filter_input() or validation function.',
    code: "$username = $_POST['username'];",
    standard: 'Custom Security Sniff',
  },
  {
    tool: 'PHP CodeSniffer',
    file: 'login.php',
    line: 14,
    rule: 'Security.BestPractices.PlaintextPassword',
    severity: 'Medium',
    message: 'Password handled as plaintext. Expected password_hash()/password_verify() usage.',
    code: "if ($row['password'] === $password)",
    standard: 'Custom Security Sniff',
  },
  {
    tool: 'PHP CodeSniffer',
    file: 'register.php',
    line: 22,
    rule: 'Security.BestPractices.PlaintextPassword',
    severity: 'Medium',
    message: 'Password inserted into database without hashing.',
    code: "INSERT INTO users (username, password) VALUES ('$username', '$password')",
    standard: 'Custom Security Sniff',
  },
  {
    tool: 'PHP CodeSniffer',
    file: 'login.php',
    line: 25,
    rule: 'Security.InfoLeak.ErrorOutput',
    severity: 'Medium',
    message: 'Raw database error message output to user. Use generic error messages.',
    code: "echo 'Database error: ' . $conn->error;",
    standard: 'Custom Security Sniff',
  },
];

export const phpCodeSnifferSummary = {
  command: 'phpcs --standard=PSR-12,Security login.php register.php',
  totalErrors: 5,
  totalWarnings: 2,
  filesChecked: 2,
  bySeverity: { High: 1, Medium: 4, Low: 2 } as Record<string, number>,
  reportText: `FILE: login.php
--------------------------------------------------------------------------------
FOUND 4 ERRORS AND 1 WARNING AFFECTING 4 LINES
--------------------------------------------------------------------------------
  9 | WARNING | Direct use of \$_POST without filter_input()
  9 | ERROR   | Security.InputValidation.Missing — no validation on \$_POST
 14 | ERROR   | Security.BestPractices.PlaintextPassword — plaintext comparison
 18 | ERROR   | Security.SQLInjection.StringConcatenation — query concatenation
 25 | ERROR   | Security.InfoLeak.ErrorOutput — raw DB error echoed to user
--------------------------------------------------------------------------------

FILE: register.php
--------------------------------------------------------------------------------
FOUND 1 ERROR AND 1 WARNING AFFECTING 2 LINES
--------------------------------------------------------------------------------
 18 | WARNING | Security.InputValidation.Missing — no validation on \$_POST
 22 | ERROR   | Security.BestPractices.PlaintextPassword — INSERT without hash
--------------------------------------------------------------------------------

PHPCBF CAN FIX 2 OF THE 7 SNIFF VIOLATIONS AUTOMATICALLY`,
};

export const vulnerableCode = `<?php
// login.php — VULNERABLE VERSION (for audit demonstration only)
session_start();
require 'db.php';

// No input validation: username and password fields accept unsanitized input
$username = $_POST['username'];
$password = $_POST['password'];

// SQL Injection: user input concatenated directly into the SQL query
$query = "SELECT * FROM users WHERE username='$username' AND password='$password'";
$result = $conn->query($query);

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    // Plain text password handling: compared without hashing
    if ($row['password'] === $password) {
        $_SESSION['user'] = $username;
        header('Location: dashboard.php');
        exit;
    }
} else {
    // Error information disclosure: reveals implementation details
    echo 'Database error: ' . $conn->error;
}`;

export const secureCode = `<?php
// login.php — SECURE VERSION (remediated)
session_start();
require 'db.php';

// FIX: Server-side input validation with whitelist
$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';
if (!preg_match('/^[A-Za-z0-9_]{3,32}$/', $username) || strlen($password) < 8) {
    http_response_code(400);
    exit('Invalid input');
}

// FIX: Prepared statement — SQL injection impossible
$stmt = $conn->prepare('SELECT id, password_hash FROM users WHERE username = ?');
$stmt->bind_param('s', $username);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();

// FIX: password_verify() against stored hash — no plaintext comparison
if ($row && password_verify($password, $row['password_hash'])) {
    $_SESSION['user_id'] = (int) $row['id'];
    header('Location: dashboard.php');
    exit;
}

// FIX: Generic error message — no implementation details leaked
http_response_code(401);
exit('Authentication failed');`;

export const dashboardStats = {
  totalFindings: 3,
  high: 1,
  medium: 2,
  low: 0,
  resolved: 3,
  open: 0,
  avgCvss:
    Math.round(
      (findings.reduce((s, f) => s + f.cvss, 0) / findings.length) * 10
    ) / 10,
  riskScore: 24,
};

export const severityDistribution = [
  { label: 'High', count: 1, color: 'red' },
  { label: 'Medium', count: 2, color: 'amber' },
  { label: 'Low', count: 0, color: 'cyan' },
];

export const statusDistribution = [
  { label: 'Resolved', count: 3, color: 'green' },
  { label: 'Open', count: 0, color: 'red' },
];

export const remediationActions = [
  {
    findingId: 'SCRV-001',
    title: 'SQL Injection',
    action: 'Fixed using prepared statements',
    icon: 'Database',
  },
  {
    findingId: 'SCRV-002',
    title: 'Input Validation',
    action: 'Fixed using whitelist validation and sanitization',
    icon: 'ShieldCheck',
  },
  {
    findingId: 'SCRV-003',
    title: 'Password Handling',
    action: 'Fixed using password hashing (password_hash / password_verify)',
    icon: 'KeyRound',
  },
  {
    findingId: 'SCRV-001',
    title: 'Error Information Disclosure',
    action: 'Fixed using generic error messages',
    icon: 'EyeOff',
  },
];

export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'vulnerable', label: 'Vulnerable Code', icon: 'Bug' },
  { id: 'findings', label: 'Findings', icon: 'ListChecks' },
  { id: 'recommendations', label: 'Recommendations', icon: 'ShieldCheck' },
  { id: 'secure', label: 'Secure Code', icon: 'Lock' },
  { id: 'analysis', label: 'Static Analysis', icon: 'ScanSearch' },
] as const;
