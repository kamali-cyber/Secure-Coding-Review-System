<?php
/**
 * register.php — VULNERABLE registration handler
 * CodeAlpha Task 3 — Secure Coding Review
 *
 * Findings: SCRV-002 (No input validation),
 *           SCRV-003 (Plain text password storage)
 */
require 'db.php';

// --- SCRV-002: No validation on username or password ---
$username = $_POST['username'];
$password = $_POST['password'];

// --- SCRV-003: Password stored as plain text ---
$query = "INSERT INTO users (username, password) VALUES ('$username', '$password')";

if ($conn->query($query)) {
    echo 'Registration successful';
} else {
    echo 'Error: ' . $conn->error;
}
