<?php
session_start();
require_once '../config/db.php'; // adjust path

if (!isset($_SESSION["admin_id"])) {
    http_response_code(403);
    echo json_encode(["error" => "Not authorized"]);
    exit;
}

$admin_id = $_SESSION["admin_id"];

$typeFilter = $_GET['type'] ?? 'all';

$sql = "SELECT type, action, details, timestamp FROM activity_log WHERE admin_id = ? ";
$params = [$admin_id];

if ($typeFilter !== 'all') {
    $sql .= "AND type = ? ";
    $params[] = $typeFilter;
}

$sql .= "ORDER BY timestamp DESC LIMIT 100";

$stmt = $conn->prepare($sql);
$stmt->execute($params);
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($results);
?>
