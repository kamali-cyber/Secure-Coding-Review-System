#Secure Coding Review System

##Overview

This project was developed as part of CodeAlpha Task 3 – Secure Coding Review.

The objective of this project is to perform a security audit on a PHP Login Application, identify vulnerabilities, analyze security risks, and provide remediation recommendations following secure coding best practices.

A cybersecurity-themed dashboard was created to visualize findings, vulnerability severity, remediation status, and static analysis results.

---

##Objectives

- Select and audit a web application.
- Identify security vulnerabilities through manual inspection and static analysis.
- Document findings and associated risks.
- Provide remediation recommendations.
- Demonstrate secure coding practices through corrected code examples.

---

##Application Audited

PHP Login System

The application was reviewed for common web security vulnerabilities affecting authentication mechanisms and user input handling.

---

##Vulnerabilities Identified

1. SQL Injection (High Severity)

Description:
User input was directly concatenated into SQL queries without parameterization.

Impact:
Attackers could manipulate database queries, bypass authentication, or access sensitive data.

Remediation:
Use prepared statements and parameterized queries.

---

2. No Input Validation (Medium Severity)

Description:
User inputs were accepted without validation or sanitization.

Impact:
Could lead to malformed data, injection attacks, and application instability.

Remediation:
Implement server-side input validation and sanitization.

---

3. Plain Text Password Handling (Medium Severity)

Description:
Passwords were stored and compared in plain text.

Impact:
Compromised credentials could expose all user accounts.

Remediation:
Use secure password hashing mechanisms such as password_hash() and password_verify().

---

##Static Analysis

Static code analysis was performed to identify insecure coding patterns and enforce coding standards.

Analysis Methods

- Manual Source Code Inspection
- PHP CodeSniffer (PHPCS)
- Security Best Practice Review

---

##Security Recommendations

- Implement Prepared Statements
- Validate and Sanitize User Input
- Use Password Hashing
- Improve Error Handling
- Apply Least Privilege Principles
- Conduct Regular Security Audits
- Use Secure Session Management
- Implement CSRF Protection

---

##Remediation Status

Vulnerability| Severity| Status
SQL Injection| High| Resolved
No Input Validation| Medium| Resolved
Plain Text Password Handling| Medium| Resolved

---

##Dashboard Features

- Security Posture Dashboard
- Vulnerable Code Analysis
- Secure Code Demonstration
- Findings Management
- Recommendations Section
- Static Analysis Report
- Severity Classification
- Remediation Tracking

---

##Technologies Used

- HTML5
- CSS3
- JavaScript
- PHP
- Static Analysis Techniques

---

## 🌐 Live Demo

🔗 **Live Demo:** [Secure Coding Review System](https://secure-coding-review-s3dj.bolt.host)

##Project Outcome

This project demonstrates the process of identifying, documenting, and remediating security vulnerabilities in a web application while promoting secure coding practices and application security awareness.

---

Author

Kamali Diyyala

B.Tech Cyber Security

CodeAlpha Internship – Task 3 Secure Coding Review


