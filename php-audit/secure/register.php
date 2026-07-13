<?php
/**
 * register.php — SECURE registration handler (remediated)
 * CodeAlpha Task 3 — Secure Coding Review
 *
 * Resolves: SCRV-002 (No input validation → whitelist validation),
 *           SCRV-003 (Plain text password → password_hash)
 */

ini_set('display_errors', '0');
ini_set('log_errors', '1');

require 'db.php';

// FIX: Server-side input validation
$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';
if (!preg_match('/^[A-Za-z0-9_]{3,32}$/', $username) || strlen($password) < 8) {
    http_response_code(400);
    exit('Invalid input. Username must be 3-32 alphanumeric characters.');
}

// FIX: Hash password with Bcrypt before storing
$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

// FIX: Prepared statement
$stmt = $conn->prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
$stmt->bind_param('ss', $username, $hash);

if ($stmt->execute()) {
    http_response_code(201);
    echo 'Registration successful';
} else {
    error_log('Registration failed: ' . $stmt->error);
    http_response_code(409);
    echo 'Registration failed';
}
