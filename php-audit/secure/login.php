<?php
/**
 * login.php — SECURE login handler (remediated)
 * CodeAlpha Task 3 — Secure Coding Review
 *
 * Resolves: SCRV-001 (SQL Injection → prepared statements),
 *           SCRV-002 (No Input Validation → whitelist validation),
 *           SCRV-003 (Plain Text Password → password_hash/verify),
 *           Error Information Disclosure → generic error messages
 */

// FIX: Secure error handling — no details to user
ini_set('display_errors', '0');
ini_set('log_errors', '1');

session_start();
require 'db.php';

// FIX: Server-side input validation with whitelist (SCRV-002)
$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';
if (!preg_match('/^[A-Za-z0-9_]{3,32}$/', $username) || strlen($password) < 8) {
    http_response_code(400);
    exit('Invalid input');
}

// FIX: Prepared statement — SQL injection impossible (SCRV-001)
$stmt = $conn->prepare('SELECT id, password_hash FROM users WHERE username = ?');
$stmt->bind_param('s', $username);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();

// FIX: password_verify() against stored hash — no plaintext (SCRV-003)
if ($row && password_verify($password, $row['password_hash'])) {
    $_SESSION['user_id'] = (int) $row['id'];
    header('Location: dashboard.php');
    exit;
}

// FIX: Generic error message — no implementation details leaked
http_response_code(401);
exit('Authentication failed');
