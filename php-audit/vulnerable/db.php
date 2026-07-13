<?php
/**
 * db.php — Database connection
 * CodeAlpha Task 3 — Secure Coding Review
 */

$conn = new mysqli('localhost', 'appuser', 'app_password', 'appdb');

if ($conn->connect_error) {
    error_log('Database connection failed: ' . $conn->connect_error);
    http_response_code(500);
    exit('Service temporarily unavailable');
}
