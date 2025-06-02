<?php
require_once 'db_connect.php'; // Adjust path if needed
header('Content-Type: application/json');

$filter = $_GET['filter'] ?? 'month';

$startDate = '';
$endDate = date('Y-m-d');

switch ($filter) {
    case 'day':
        $startDate = date('Y-m-d');
        break;
    case 'week':
        $startDate = date('Y-m-d', strtotime('-7 days'));
        break;
    case 'month':
        $startDate = date('Y-m-01');
        break;
    case 'year':
        $startDate = date('Y-01-01');
        break;
    default:
        $startDate = date('Y-m-01');
}

// Adjust the column name based on how you categorize inquiries (e.g. "theme" or "inquiry_type")
$sql = "SELECT theme_motif AS category, COUNT(*) AS count 
        FROM inquiry 
        WHERE DATE(time_created) BETWEEN ? AND ?
        GROUP BY category 
        ORDER BY count DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $startDate, $endDate);
$stmt->execute();
$result = $stmt->get_result();

$labels = [];
$data = [];

while ($row = $result->fetch_assoc()) {
    $labels[] = $row['category'];
    $data[] = $row['count'];
}

echo json_encode([
    'labels' => $labels,
    'data' => $data
]);

$stmt->close();
$conn->close();
?>
