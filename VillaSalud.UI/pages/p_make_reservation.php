<?php

include_once "db_connect.php"; // Ensure this file correctly initializes $conn

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = trim($_POST["name"]);
    $email = trim($_POST["email"]);
    $contact = trim($_POST["contact"]);
    $message = trim($_POST["message"]);
    $date = trim($_POST["date"]);
    $time = trim($_POST["time"]);
    $venue = trim($_POST["venue"]);
    $event_type = trim($_POST["event_type"]);
    $theme_motif = trim($_POST["theme_motif"]);

    // Define valid ENUM values
    $valid_event_types = ["Baptismal Package", "Birthday Package", "Debut Package", "Kiddie Package", "Wedding Package", "Standard Package", "Others"];
    $valid_theme_motifs = ["Floral", "Rustic", "Elegant", "Beach", "Modern", "Others"];

    // Validate event_type
    if (!in_array($event_type, $valid_event_types)) {
        $event_type = "Others"; // Default to Others if invalid
    }

    // Validate theme_motif
    if (!in_array($theme_motif, $valid_theme_motifs)) {
        $theme_motif = "Others";
    }

    // Step 1: Insert patron details if not already registered
    $checkPatron = "SELECT patron_id FROM patron WHERE email = ?";
    $stmt = $conn->prepare($checkPatron);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        // Patron already exists, get their patron_id
        $stmt->bind_result($patron_id);
        $stmt->fetch();
    } else {
        // Insert new patron record
        $insertPatron = "INSERT INTO patron (name, email, contact_number) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($insertPatron);
        $stmt->bind_param("sss", $name, $email, $contact);
        $stmt->execute();
        $patron_id = $stmt->insert_id; // Get the newly inserted patron's ID
    }
    $stmt->close();

    // Step 2: Insert the inquiry with the retrieved or new patron_id
    $insertInquiry = "INSERT INTO inquiry (patron_id, message, date, time, venue, event_type, theme_motif) 
                      VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($insertInquiry);
    $stmt->bind_param("issssss", $patron_id, $message, $date, $time, $venue, $event_type, $theme_motif);
    
    if ($stmt->execute()) {
        echo "<script>alert('Inquiry submitted successfully!');</script>";
    } else {
        echo "<script>alert('Error submitting inquiry: " . $stmt->error . "');</script>";
    }
    
    $stmt->close();
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
            <li><a href="../pages/faqs.html">FAQs</a></li>
            <li><a href="../pages/feedback.html">Feedback</a></li>
        </ul>
    </nav>
    <div class="container"> 
        <div class="reservation-container">
            <h2>Submit Your Inquiry</h2>
            <form method="POST" action="p_make_reservation.php">
                <div class="form-group">
                    <label for="name">Name:<span>*</span></label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email:<span>*</span></label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="contact">Contact Number:<span>*</span></label>
                    <input type="tel" id="contact" name="contact" required>
                </div>
                <div class="form-group">
                    <label for="message">Message:<span>*</span></label>
                    <textarea id="message" name="message" required></textarea>
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
                        <select id="venue" name="venue" onchange="toggleOtherVenue()">
                            <option value="" selected disabled>Select a venue</option>
                            <option value="option1">Villa I</option>
                            <option value="option2">Villa II</option>
                            <option value="option3">Elizabeth Hall</option>
                            <option value="option4">Private Pool</option>
                            <option value="other">Other</option>
                        </select>
                    <input type="text" id="otherVenue" name="otherVenue" placeholder="Enter venue" style="display: none;">
                </div>
                <div class="form-group">
                    <label for="event_type">Event Type:<span>*</span></label>
                    <select id="event_type" name="event_type" required>
                        <option value="Baptismal Package">Baptismal Package</option>
                        <option value="Birthday Package">Birthday Package</option>
                        <option value="Debut Package">Debut Package</option>
                        <option value="Kiddie Package">Kiddie Package</option>
                        <option value="Wedding Package">Wedding Package</option>
                        <option value="Standard Package">Standard Package</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="theme_motif">Theme/Motif:<span>*</span></label>
                    <select id="theme_motif" name="theme_motif" required>
                        <option value="Floral">Floral</option>
                        <option value="Rustic">Rustic</option>
                        <option value="Elegant">Elegant</option>
                        <option value="Beach">Beach</option>
                        <option value="Modern">Modern</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
                <div class="form-group">
                    <button type="submit">Submit Inquiry</button>
                </div>
            </form>
        </div>
    </div>
    <script src="../script/p_make_reservation.js"></script>
</body>
</html>
