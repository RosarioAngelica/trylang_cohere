<?php
include 'db_connect.php';

$filter = $_GET['filter'] ?? 'month';
$timeClause = "";

switch ($filter) {
    case 'day':
        $timeClause = "AND DATE(i.date) = CURDATE()";
        break;
    case 'week':
        $timeClause = "AND YEARWEEK(i.date, 1) = YEARWEEK(CURDATE(), 1)";
        break;
    case 'month':
        $timeClause = "AND MONTH(i.date) = MONTH(CURDATE()) AND YEAR(i.date) = YEAR(CURDATE())";
        break;
    case 'year':
        $timeClause = "AND YEAR(i.date) = YEAR(CURDATE())";
        break;
}

$query = "
    SELECT theme_motif, COUNT(*) AS count 
    FROM inquiry i
    WHERE theme_motif IS NOT NULL AND theme_motif != '' $timeClause
    GROUP BY theme_motif
    ORDER BY count DESC
    LIMIT 10
";

$result = $conn->query($query);

$themes = [];
$counts = [];

while ($row = $result->fetch_assoc()) {
    $themes[] = $row['theme_motif'];
    $counts[] = (int)$row['count'];
}

echo json_encode([
    'themes' => $themes,
    'counts' => $counts
]);
?>
