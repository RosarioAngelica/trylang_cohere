<?php
session_start();
include 'db_connect.php';

// Optional: move this to 'activity_logger.php' and just include it here
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

// Handle JSON request
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['inquiry_id'], $data['status'])) {
    $inquiry_id = (int)$data['inquiry_id'];
    $new_status = $data['status'];
    $admin_id = $_SESSION['admin_id'] ?? null;
    $admin_name = $_SESSION['admin_name'] ?? 'Unknown Admin';

    // Update inquiry status
    $stmt = $conn->prepare("UPDATE inquiry SET status = ? WHERE inquiry_id = ?");
    $stmt->bind_param("si", $new_status, $inquiry_id);

    if (!$stmt->execute()) {
        echo json_encode(['success' => false, 'message' => 'Update failed: ' . $stmt->error]);
        exit;
    }

    // Log the status change
    $activity_type = 'update_status';
    $description = "Admin '{$admin_name}' changed inquiry #{$inquiry_id} status to '{$new_status}'";

    if (!logActivity($conn, $admin_id, $activity_type, $description, $inquiry_id)) {
        echo json_encode(['success' => false, 'message' => 'Status updated but log failed.']);
        exit;
    }

    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Missing data']);
}
?>
