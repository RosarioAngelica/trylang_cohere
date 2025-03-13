<?php
$host = "127.0.0.1";  // Localhost
$user = "root";       // Your MySQL username
$pass = "marcgasta1902.";           // Your MySQL password (leave empty if no password)
$dbname = "Salud"; // Change this to your actual database name

$conn = new mysqli($host, $user, $pass, $dbname);

// Check for connection errors
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
