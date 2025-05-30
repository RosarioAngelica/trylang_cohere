<?php
session_start();
header('Content-Type: application/json'); // Ensure JSON response

require_once 'db_connect.php'; // Make sure this sets up $conn as a MySQLi connection

if (!isset($_SESSION["admin_id"])) {
    http_response_code(403);
    echo json_encode(["error" => "Not authorized"]);
    exit;
}

$admin_id = $_SESSION["admin_id"];
$typeFilter = $_GET['activity_type'] ?? 'all';

// Start building SQL
$sql = "SELECT 
    activity_type AS type, 
    activity_type AS action, 
    description AS details, 
    time_created AS timestamp 
FROM activity_log 
WHERE admin_id = ?";

$params = [$admin_id];
$types = "i"; // admin_id is an integer

if ($typeFilter !== 'all') {
    $sql .= " AND activity_type = ?";
    $params[] = $typeFilter;
    $types .= "s"; // activity_type is a string
}

$sql .= " ORDER BY timestamp DESC LIMIT 100";

// Prepare and execute the statement
$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Statement preparation failed", "details" => $conn->error]);
    exit;
}

$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

$stmt->close();
$conn->close();
?>
