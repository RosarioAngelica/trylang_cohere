<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    include 'db_connect.php';

    $eventType = $_POST['event_type'];
    $otherEventType = !empty($_POST['other_event_type']) ? $_POST['other_event_type'] : null;

    $name = $_POST['name'];
    $email = $_POST['email'];
    $contact = $_POST['contact_number']; 
    $venue = $_POST['venue'];
    $otherVenue = !empty($_POST['other_venue']) ? $_POST['other_venue'] : null;
    $themeMotif = $_POST['theme_motif'];
    $otherThemeMotif = !empty($_POST['other_theme_motif']) ? $_POST['other_theme_motif'] : null;
    $message = $_POST['message'];
    $date = $_POST['date'];
    $time = $_POST['time'];
    $createdByType = "admin";
    $defaultStatus = "Pending";

    // VALIDATIONS
    $allowedVenues = ['Villa I', 'Villa II', 'Elizabeth Hall', 'Private Pool'];
    $allowedEventTypes = ['Baptismal Package', 'Birthday Package', 'Debut Package', 'Kiddie Package', 'Wedding Package', 'Standard Package'];
    $allowedThemeMotifs = ['Floral', 'Rustic', 'Elegant', 'Beach', 'Modern'];

    if ($venue === 'Others') {
        if (empty($otherVenue)) die("Please specify the venue in the 'Other Venue' field.");
        $venue = $allowedVenues[0];
    } else {
        if (!in_array($venue, $allowedVenues)) die("Invalid venue selection.");
    }

    if ($eventType === 'Others') {
        if (empty($otherEventType)) die("Please specify the event type.");
        $eventType = $allowedEventTypes[0];
    } else {
        if (!in_array($eventType, $allowedEventTypes)) die("Invalid event type.");
    }

    if ($themeMotif === 'Others') {
        if (empty($otherThemeMotif)) die("Please specify the theme/motif.");
        $themeMotif = $allowedThemeMotifs[0];
    } else {
        if (!in_array($themeMotif, $allowedThemeMotifs)) die("Invalid theme/motif.");
    }

    // INSERT into patron
    $patronQuery = "INSERT INTO patron (name, email, contact_number) VALUES (?, ?, ?)";
    $patronStmt = $conn->prepare($patronQuery);
    $patronStmt->bind_param("sss", $name, $email, $contact);

    if ($patronStmt->execute()) {
        $lastPatronId = $conn->insert_id;

        // INSERT into inquiry
        $inquiryQuery = "INSERT INTO inquiry (
            patron_id, venue, other_venue, event_type, other_event_type, theme_motif, other_theme_motif,
            message, date, time, status, created_by_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $conn->prepare($inquiryQuery);
        $stmt->bind_param("isssssssssss",
            $lastPatronId, $venue, $otherVenue, $eventType, $otherEventType,
            $themeMotif, $otherThemeMotif, $message, $date, $time, $defaultStatus, $createdByType
        );

        if ($stmt->execute()) {
            echo "<script>alert('Reservation successfully made!'); window.location.href = 'a_make_reservation.php';</script>";
        } else {
            echo "<script>alert('Error: " . $stmt->error . "');</script>";
        }

        $stmt->close();
    } else {
        echo "<script>alert('Error: " . $patronStmt->error . "');</script>";
    }

    $patronStmt->close();
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Make Reservation - Villa Salud</title>
    <link rel="stylesheet" href="../style/a_make_reservation.css">
</head>
<body>
    <header class="header-image"></header>

    <nav class="navbar">
        <ul>
            <li><a href="../pages/a_homepage.html">Home</a></li>
            <li><a href="../pages/a_inquiries.php">View Inquiries</a></li>
            <li><a href="../pages/a_make_reservation.php" class="active">Make Reservation</a></li>
            <li><a href="../pages/a_view_report.php">View Report</a></li>
            <li><a href="../pages/admin_profile.php">Admin Profile</a></li>
        </ul>
    </nav>

    <div class="container"> 
        <div class="reservation-container">
        <h2>Let's bring your vision to life—just fill out the form.</h2>
                <form method="POST" action="">                
                    <input type="hidden" name="created_by_type" value="admin">
                <div class="form-group">
                    <label for="name">Name:<span>*</span></label>
                    <input type="text" id="name" name="name" placeholder="First Name, Last Name"required>
                </div>
                <div class="form-group">
                    <label for="email">Email:<span>*</span></label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="contact">Contact Number:<span>*</span></label>
                    <input type="tel" id="contact" name="contact_number" required>
                </div>
                <div class="form-group">
                    <label for="date">Date:<span>*</span></label>
                    <input type="date" id="date" name="date" required>
                </div>
                <div class="form-group">
                    <label for="time">Time:<span>*</span></label>
                    <input type="time" id="time" name="time" required>
                </div>
                <div class="form-group">
                    <label for="venue">Venue:<span>*</span></label>
                    <select id="venue" name="venue">
                        <option value="Villa I">Villa I</option>
                        <option value="Villa II">Villa II</option>
                        <option value="Elizabeth Hall">Elizabeth Hall</option>
                        <option value="Private Pool">Private Pool</option>
                        <option value="Others">Others</option>
                    </select>
                    <input type="text" id="otherVenue" name="other_venue" style="display: none;" placeholder="Please specify">
                </div>
                <div class="form-group">
                    <label for="event_type">Event Type:<span>*</span></label>
                    <select id="event_type" name="event_type">
                        <option value="Baptismal Package">Baptismal Package</option>
                        <option value="Birthday Package">Birthday Package</option>
                        <option value="Debut Package">Debut Package</option>
                        <option value="Kiddie Package">Kiddie Package</option>
                        <option value="Wedding Package">Wedding Package</option>
                        <option value="Standard Package">Standard Package</option>
                        <option value="Others">Others</option>
                    </select>
                    <input type="text" id="otherEventType" name="other_event_type" style="display: none;" placeholder="Please specify">
                </div>
                <div class="form-group">
                    <label for="theme_motif">Theme/Motif:<span>*</span></label>
                    <select id="theme_motif" name="theme_motif">
                        <option value="Floral">Floral</option>
                        <option value="Rustic">Rustic</option>
                        <option value="Elegant">Elegant</option>
                        <option value="Beach">Beach</option>
                        <option value="Modern">Modern</option>
                        <option value="Others">Others</option>
                    </select>
                    <input type="text" id="otherThemeMotif" name="other_theme_motif" style="display: none;" placeholder="Please specify">
                </div>
                <div class="form-group">
                    <label for="message">Other Request:<span>*</span></label>
                    <textarea id="message" name="message" required></textarea>
                </div>
                <div class="form-group">
                    <button type="submit">Submit Inquiry</button>
                </div>
            </form>
        </div>
        
        <div class="calendar-container">
            <div class="calendar-header">
                <button id="prevMonth">◀</button>
                <span id="month-year"></span>
                <button id="nextMonth">▶</button>
            </div>
            <div id="calendar"></div>
        </div>
    </div>

        <!-- Admin Status Selection Modal -->
        <div id="statusModal" class="modal">
            <div class="modal-content">
                <h3>Select Status</h3>
                <select id="statusSelect">
                    <option value="free">Free (Green)</option>
                    <option value="full">Fully Booked (Red)</option>
                    <option value="reserved">Reserved (Yellow)</option>
                    <option value="pending confirmation">Pending (Blue)</option>
                    <option value="closed">Closed (Black)</option>
                </select>
                <button id="saveStatus">Save</button>
                <button id="closeModal">Cancel</button>
            </div>
        </div>
    </div>
    <script src="../script/a_make_reservation.js"></script>
</body>
</html>