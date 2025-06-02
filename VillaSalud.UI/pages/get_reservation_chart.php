<?php
require_once 'db_connect.php'; // Adjust path if needed
header('Content-Type: application/json');

$filter = $_GET['filter'] ?? 'month';

$startDate = '';
$endDate = date('Y-m-d');

switch ($filter) {
    case 'day':
        $startDate = date('Y-m-d');
        $groupFormat = '%H:00';
        break;
    case 'week':
        $startDate = date('Y-m-d', strtotime('-7 days'));
        $groupFormat = '%Y-%m-%d';
        break;
    case 'month':
        $startDate = date('Y-m-01');
        $groupFormat = '%Y-%m-%d';
        break;
    case 'year':
        $startDate = date('Y-01-01');
        $groupFormat = '%Y-%m';
        break;
    default:
        $startDate = date('Y-m-01');
        $groupFormat = '%Y-%m-%d';
}

// Query using time_created
$sql = "SELECT DATE_FORMAT(time_created, ?) AS label, COUNT(*) AS count
        FROM reservation
        WHERE DATE(time_created) BETWEEN ? AND ?
        GROUP BY label
        ORDER BY label ASC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $groupFormat, $startDate, $endDate);
$stmt->execute();
$result = $stmt->get_result();

$labels = [];
$data = [];

while ($row = $result->fetch_assoc()) {
    $labels[] = $row['label'];
    $data[] = $row['count'];
}

echo json_encode([
    'labels' => $labels,
    'data' => $data
]);

$stmt->close();
$conn->close();
?>
