<?php
session_start();
include 'db_connect.php';

header('Content-Type: application/json');

// Utility functions
function generateLogId() {
    return uniqid('LOG_', true);
}

function logActivity($conn, $admin_id, $activity_type, $description = null, $inquiry_id = null, $reserve_id = null) {
    $log_id = generateLogId();
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? null;
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? null;

    $stmt = $conn->prepare("INSERT INTO activity_log (log_id, admin_id, activity_type, description, inquiry_id, reserve_id, ip_address, user_agent) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sissiiis", $log_id, $admin_id, $activity_type, $description, $inquiry_id, $reserve_id, $ip_address, $user_agent);
    
    return $stmt->execute();
}

// Get request payload
$data = json_decode(file_get_contents("php://input"), true);

$inquiry_id = $data['inquiry_id'] ?? null;
$admin_id = $_SESSION['admin_id'] ?? null;
$admin_name = $_SESSION['admin_name'] ?? 'Unknown Admin';

if (!$inquiry_id || !$admin_id) {
    echo json_encode(['success' => false, 'message' => 'Missing inquiry ID or admin session']);
    exit;
}

// Step 1: Get reservation ID
$stmt = $conn->prepare("SELECT reserve_id FROM reservation WHERE inquiry_id = ?");
$stmt->bind_param("i", $inquiry_id);
$stmt->execute();
$result = $stmt->get_result();
$reservation = $result->fetch_assoc();
$stmt->close();

if (!$reservation) {
    echo json_encode(['success' => false, 'message' => 'No reservation found for this inquiry']);
    exit;
}

$reserve_id = $reservation['reserve_id'];

// Step 2: Delete reservation
$stmt = $conn->prepare("DELETE FROM reservation WHERE reserve_id = ?");
$stmt->bind_param("i", $reserve_id);
if (!$stmt->execute()) {
    echo json_encode(['success' => false, 'message' => 'Failed to delete reservation']);
    exit;
}
$stmt->close();

// Step 3: Revert inquiry status to 'In Progress'
$stmt = $conn->prepare("UPDATE inquiry SET status = 'In Progress' WHERE inquiry_id = ?");
$stmt->bind_param("i", $inquiry_id);
if (!$stmt->execute()) {
    echo json_encode(['success' => false, 'message' => 'Failed to revert inquiry status']);
    exit;
}
$stmt->close();

// Step 4: Log the undo action
$desc = "Admin '{$admin_name}' reverted inquiry #{$inquiry_id} (deleted reservation #{$reserve_id})";
logActivity($conn, $admin_id, 'undo_reservation', $desc, $inquiry_id, $reserve_id);

echo json_encode(['success' => true]);
