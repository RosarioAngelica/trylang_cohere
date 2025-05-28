<?php
include 'db_connect.php';

$filter = $_GET['filter'] ?? 'month';

$whereClause = "";
$dateFormat = "";
$labels = [];
$counts = [];

switch ($filter) {
    case 'day':
        $whereClause = "DATE(date) = CURDATE()";
        $dateFormat = "%H"; // Hour
        break;
    case 'week':
        $whereClause = "YEARWEEK(date, 1) = YEARWEEK(CURDATE(), 1)";
        $dateFormat = "%Y-%m-%d";
        break;
    case 'month':
        $whereClause = "MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE())";
        $dateFormat = "%Y-%m-%d";
        break;
    case 'year':
    default:
        $whereClause = "YEAR(date) = YEAR(CURDATE())";
        $dateFormat = "%Y-%m";
        break;
}

$sql = "
    SELECT DATE_FORMAT(date, '$dateFormat') as label, COUNT(*) as count
    FROM inquiry
    WHERE $whereClause
    GROUP BY label
    ORDER BY label ASC
";

$result = $conn->query($sql);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $labels[] = $row['label'];
        $counts[] = (int)$row['count'];
    }
}

$total = array_sum($counts);

echo json_encode([
    'labels' => $labels,
    'counts' => $counts,
    'total' => $total
]);
