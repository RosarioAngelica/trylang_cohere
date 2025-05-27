<?php
session_start();
include 'db_connect.php';

// Function to generate unique log ID
function generateLogId() {
    return uniqid('LOG_', true);
}

// Function to log activity
function logActivity($conn, $admin_id, $activity_type, $description = null, $inquiry_id = null, $reserve_id = null) {
    $log_id = generateLogId();
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? null;
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? null;
    
    $stmt = $conn->prepare("INSERT INTO activity_log (log_id, admin_id, activity_type, description, inquiry_id, reserve_id, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sissiiis", $log_id, $admin_id, $activity_type, $description, $inquiry_id, $reserve_id, $ip_address, $user_agent);
    
    return $stmt->execute();
}

// Check if admin is logged in and log the logout activity
if (isset($_SESSION["admin_id"])) {
    $admin_id = $_SESSION["admin_id"];
    $admin_name = $_SESSION["admin_name"] ?? 'Unknown Admin';
    $login_time = $_SESSION["login_time"] ?? time();
    $logout_time = time();
    
    // Calculate session duration
    $session_duration = $logout_time - $login_time;
    $duration_formatted = gmdate("H:i:s", $session_duration);
    
    // Log logout activity
    $description = "Admin '{$admin_name}' logged out. Session duration: {$duration_formatted}";
    logActivity($conn, $admin_id, 'logout', $description);
}

// Destroy all session data
session_unset();
session_destroy();

// Redirect to login page with your preferred alert style
echo "<script>
    alert('You have been logged out successfully!');
    window.location.href = 'login.php';
</script>";
exit;
?>