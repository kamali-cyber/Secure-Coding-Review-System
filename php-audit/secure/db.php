<?php
/**
 * db.php — Database connection (remediated)
 * CodeAlpha Task 3 — Secure Coding Review
 *
 * FIX: Least-privilege database account (REC-005).
 * The application connects as 'appuser' with only SELECT/INSERT/UPDATE
 * on the users table — never root or admin.
 */

$conn = new mysqli(
    getenv('DB_HOST') ?: 'localhost',
    getenv('DB_USER') ?: 'appuser',
    getenv('DB_PASS') ?: '',
    getenv('DB_NAME') ?: 'appdb'
);

if ($conn->connect_error) {
    error_log('Database connection failed: ' . $conn->connect_error);
    http_response_code(500);
    exit('Service temporarily unavailable');
}
