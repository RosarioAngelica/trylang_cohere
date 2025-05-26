<?php
include 'db_connect.php';

// ✅ Corrected SQL: removed trailing comma and added status
$sqli = "SELECT 
            p.name AS full_name,
            p.email,
            p.contact_number,
            i.time,
            i.date,
            i.venue,
            i.event_type,
            i.theme_motif,
            i.other_event_type,
            i.other_theme_motif,
            i.other_venue,
            i.status
        FROM inquiry i
        JOIN patron p ON i.patron_id = p.patron_id
        ORDER BY i.date DESC, i.time DESC";

$result = $conn->query($sqli);
$inquiries = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $inquiries[] = $row;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>View Inquiries - Villa Salud</title>
    <link rel="stylesheet" href="../style/a_inquiries.css">
</head>
<body>
    <header class="header-image"></header>

    <nav class="navbar">
        <ul>
            <li><a href="../pages/a_homepage.html">Home</a></li>
            <li><a href="a_inquiries.php" class="active">View Inquiries</a></li>
            <li><a href="../pages/a_make_reservation.php">Make Reservation</a></li>
            <li><a href="../pages/a_view_report.html">View Report</a></li>
            <li><a href="../pages/admin_profile.php">Admin Profile</a></li>
        </ul>
    </nav>

    <section id="content">
        <nav>
            <h2>View Inquiries</h2>
        </nav>

        <main>
            <div class="head-title">
                <div class="left">
                    <h1>Customer Inquiries</h1>
                    <p>View and manage customer inquiries.</p>
                </div>
            </div>

            <div class="table-data">
                <div class="order">
                    <div class="head">
                        <h3>Recent Inquiries</h3>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Contact Number</th>
                                <th>Time</th>
                                <th>Date</th>
                                <th>Venue</th>
                                <th>Event Type</th>
                                <th>Theme and Motif</th>
                                <th>Other Event Type</th>
                                <th>Other Theme Motif</th>
                                <th>Other Venue</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($inquiries as $index => $inquiry): ?>
                                <tr>
                                    <td><?= htmlspecialchars($inquiry['full_name']) ?></td>
                                    <td><?= htmlspecialchars($inquiry['email']) ?></td>
                                    <td><?= htmlspecialchars($inquiry['contact_number']) ?></td>
                                    <td><?= htmlspecialchars($inquiry['time']) ?></td>
                                    <td><?= htmlspecialchars($inquiry['date']) ?></td>
                                    <td><?= htmlspecialchars($inquiry['venue']) ?></td>
                                    <td><?= htmlspecialchars($inquiry['event_type']) ?></td>
                                    <td><?= htmlspecialchars($inquiry['theme_motif']) ?></td>
                                    <td><?= htmlspecialchars($inquiry['other_event_type']) ?></td>
                                    <td><?= htmlspecialchars($inquiry['other_theme_motif']) ?></td>
                                    <td><?= htmlspecialchars($inquiry['other_venue']) ?></td>
                                    <td>
                                        <select class="status-dropdown" data-index="<?= $index ?>">
                                            <option value="" <?= empty($inquiry['status']) ? 'selected hidden' : 'hidden' ?>>Set Status</option>
                                            <option value="Pending" <?= $inquiry['status'] === 'Pending' ? 'selected' : '' ?>>Pending</option>
                                            <option value="Reserved" <?= $inquiry['status'] === 'Reserved' ? 'selected' : '' ?>>Reserved</option>
                                            <option value="Cancelled" <?= $inquiry['status'] === 'Cancelled' ? 'selected' : '' ?>>Cancelled</option>
                                        </select>
                                    </td>
                                    <td><button class="reply-btn" data-index="<?= $index ?>">Reply</button></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </section>

    <!-- Modal for setting status -->
    <div id="statusModal" class="modal">
        <div class="modal-content">
            <h2>Set Inquiry Status</h2>
            <select id="statusSelect">
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Rejected">Rejected</option>
                <option value="Cancelled">Cancelled</option>
            </select>
            <button id="saveStatusBtn">Save</button>
            <button id="closeModalBtn">Close</button>
        </div>
    </div>

    <script src="../script/a_inquiries.js"></script>
</body>
</html>
