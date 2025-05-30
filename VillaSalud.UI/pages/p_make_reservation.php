<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    include 'db_connect.php';

    // Get form values
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

    // NEW: Get created_by_type or default to 'patron'
    $createdByType = $_POST['created_by_type'] ?? 'patron';

    // (Validation logic remains the same...)

    $patronQuery = "INSERT INTO patron (name, email, contact_number) VALUES (?, ?, ?)";
    $patronStmt = $conn->prepare($patronQuery);
    $patronStmt->bind_param("sss", $name, $email, $contact);

    if ($patronStmt->execute()) {
        $lastPatronId = $conn->insert_id;

        // NEW: Add created_by_type to the insert
        $query = "INSERT INTO inquiry (
                    patron_id, venue, other_venue, event_type, other_event_type,
                    theme_motif, other_theme_motif, message, date, time, created_by_type
                  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("issssssssss", 
            $lastPatronId, 
            $venue, 
            $otherVenue, 
            $eventType, 
            $otherEventType, 
            $themeMotif, 
            $otherThemeMotif, 
            $message, 
            $date, 
            $time,
            $createdByType
        );

        if ($stmt->execute()) {
            echo "<script>alert('Reservation successfully made!');</script>";
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
    <title>Make Inquiry</title>
    <link rel="stylesheet" href="../style/p_make_reservation.css">
</head>
<body>
    <header class="header-image"></header>
    <nav class="navbar">
        <ul>
            <li><a href="../pages/p_homepage.html">Home</a></li>
            <li><a href="#" class="active">Make Reservation</a></li>
            <li><a href="../pages/p_view_reservation.html">View Reservation</a></li>
            <li><a href="../pages/payment_order.html" >Payment Order</a></li>
            <li><a href="../pages/faqs.html">FAQs</a></li>
            <li><a href="../pages/feedback.php">Feedback</a></li>
        </ul>
    </nav>
    <div class="container"> 
        <div class="reservation-container">
        <h2>Let's bring your vision to life—just fill out the form.</h2>
            <form method="POST" action="p_make_reservation.php">
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
    <script src="../script/p_make_reservation.js"></script>
</body>
</html>