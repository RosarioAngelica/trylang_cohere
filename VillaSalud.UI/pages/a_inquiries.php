<?php
include 'db_connect.php';

$sqli = "SELECT 
            IFNULL(p.name, 'Admin') AS full_name,
            IFNULL(p.email, '-') AS email,
            IFNULL(p.contact_number, '-') AS contact_number,
            i.inquiry_id,
            i.time,
            i.date,
            i.venue,
            i.event_type,
            i.theme_motif,
            i.other_event_type,
            i.other_theme_motif,
            i.other_venue,
            i.status,
            i.created_by_type
        FROM inquiry i
        LEFT JOIN patron p ON i.patron_id = p.patron_id
        ORDER BY i.inquiry_id DESC";

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
            <li><a href="../pages/a_view_report.php">View Report</a></li>
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
                                <th>Submitted By</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($inquiries as $index => $inquiry): ?>
                                <tr data-inquiry-id="<?= $inquiry['inquiry_id'] ?>">
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
                                            <option value="In Progress" <?= $inquiry['status'] === 'In Progress' ? 'selected' : '' ?>>In Progress</option>
                                            <option value="Completed" <?= $inquiry['status'] === 'Completed' ? 'selected' : '' ?>>Completed</option>
                                            <option value="Cancelled" <?= $inquiry['status'] === 'Cancelled' ? 'selected' : '' ?>>Cancelled</option>
                                        </select>
                                    </td>
                                    <td><?= htmlspecialchars($inquiry['created_by_type'] ?? 'unknown') ?></td>
                                    <td>
                                        <button class="reply-btn" data-index="<?= $index ?>">Reply</button>
                                        <?php if ($inquiry['status'] === 'Completed'): ?>
                                            <button class="undo-btn" data-inquiry-id="<?= $inquiry['inquiry_id'] ?>">Undo</button>
                                        <?php endif; ?>
                                    </td>
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
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
            </select>
            <button id="saveStatusBtn">Save</button>
            <button id="closeModalBtn">Close</button>
        </div>
    </div>

    <script src="../script/a_inquiries.js"></script>
</body>
</html>