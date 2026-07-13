# Secure Coding Review — PHP Login System
**CodeAlpha Task 3 — Secure Coding Review**

## Overview
This directory contains the audited PHP login system in two versions:

- `vulnerable/` — Original code with security flaws (audit target)
- `secure/`     — Remediated code after applying the review findings

## Application Audited
**PHP Login System** — authentication, input handling, and credential storage.

## Identified Vulnerabilities

| # | Vulnerability                  | Severity | Status   |
|---|--------------------------------|----------|----------|
| 1 | SQL Injection                  | High     | Resolved |
| 2 | No Input Validation            | Medium   | Resolved |
| 3 | Plain Text Password Handling   | Medium   | Resolved |

## Findings
- User input concatenated directly into SQL queries.
- Username and password fields accept unsanitized input.
- Passwords are compared/stored without hashing.
- Error messages reveal implementation details.

## Recommendations
1. Use Prepared Statements and Parameterized Queries.
2. Implement Server-Side Input Validation.
3. Use `password_hash()` and `password_verify()`.
4. Apply Secure Error Handling.
5. Enforce Least Privilege for database accounts.
6. Conduct Regular Security Audits and Code Reviews.

## Remediation Status
| Issue                          | Fix Applied                                        |
|--------------------------------|----------------------------------------------------|
| SQL Injection                  | Fixed using prepared statements                    |
| Input Validation               | Fixed using whitelist validation and sanitization  |
| Password Handling              | Fixed using password hashing                       |
| Error Information Disclosure   | Fixed using generic error messages                 |

## Dashboard Metrics
| Metric            | Count |
|-------------------|-------|
| High Severity     | 1     |
| Medium Severity   | 2     |
| Low Severity      | 0     |
| Total Findings    | 3     |
| Resolved Findings | 3     |
| Open Findings     | 0     |

## Files

### vulnerable/
| File           | Purpose                          |
|----------------|----------------------------------|
| `db.php`       | Database connection              |
| `login.php`    | Login with SQLi + plaintext auth |
| `register.php` | Registration storing plaintext   |

### secure/
| File           | Purpose                                  |
|----------------|------------------------------------------|
| `db.php`       | Env-var credentials, least-privilege     |
| `login.php`    | Prepared statements + password_verify    |
| `register.php` | Bcrypt hashing + input validation        |

## Static Analysis

Run PHP CodeSniffer against the vulnerable code:

```bash
phpcs --standard=PSR-12,Security vulnerable/login.php vulnerable/register.php
```

Custom security sniffs detect:
- `Security.SQLInjection.StringConcatenation`
- `Security.BestPractices.PlaintextPassword`
- `Security.InputValidation.Missing`
- `Security.InfoLeak.ErrorOutput`

## Running the Secure Version

1. Set environment variables:
```bash
export DB_HOST=localhost
export DB_USER=appuser
export DB_PASS=strong_password
export DB_NAME=appdb
```

2. Create the schema:
```sql
CREATE TABLE users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(32) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);
```

3. Create a least-privilege database user:
```sql
CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE ON appdb.users TO 'appuser'@'localhost';
```
