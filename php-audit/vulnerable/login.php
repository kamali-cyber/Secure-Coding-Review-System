<?php
/**
 * login.php — VULNERABLE login handler
 * CodeAlpha Task 3 — Secure Coding Review
 *
 * This file is INTENTIONALLY INSECURE for audit demonstration.
 * Do NOT deploy in production.
 *
 * Findings: SCRV-001 (SQL Injection — High),
 *           SCRV-002 (No Input Validation — Medium),
 *           SCRV-003 (Plain Text Password Handling — Medium),
 *           plus Error Information Disclosure
 */
session_start();
require 'db.php';

// --- SCRV-002: No input validation — fields accept unsanitized input ---
$username = $_POST['username'];
$password = $_POST['password'];

// --- SCRV-001: SQL Injection — user input concatenated into query ---
$query = "SELECT * FROM users WHERE username='$username' AND password='$password'";
$result = $conn->query($query);

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    // --- SCRV-003: Plain text password comparison — no hashing ---
    if ($row['password'] === $password) {
        $_SESSION['user'] = $username;
        header('Location: dashboard.php');
        exit;
    }
} else {
    // --- Error Information Disclosure: reveals implementation details ---
    echo 'Database error: ' . $conn->error;
}
