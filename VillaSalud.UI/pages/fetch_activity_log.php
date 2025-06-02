<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db_connect.php';

$query = "
    SELECT CONCAT(a.f_name, ' ', a.l_name) AS admin_name, l.activity_type, l.time_created
    FROM activity_log l
    JOIN admin a ON l.admin_id = a.admin_id
    ORDER BY l.time_created DESC
    LIMIT 50
";

$result = $conn->query($query);

if (!$result) {
    echo json_encode(['error' => $conn->error]);
    exit;
}

$logs = [];
while ($row = $result->fetch_assoc()) {
    $logs[] = $row;
}

header('Content-Type: application/json');
echo json_encode($logs);
?>
