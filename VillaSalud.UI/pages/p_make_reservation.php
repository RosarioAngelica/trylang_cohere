<?php

include_once "db_connect.php"; // Ensure this file correctly initializes $conn

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $contact = $_POST["contact"];
    $message = $_POST["message"];
    $date = $_POST["date"];
    $time = $_POST["time"];
    $venue = $_POST["venue"];
    $event_type = $_POST["event_type"];
    $theme_motif = $_POST["theme_motif"];

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
            <li><a href="p_homepage.php">Home</a></li>
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
                    <select id="venue" name="venue">
                        <option value="" selected disabled>Select a venue</option>
                        <option value="Venue A">Venue A</option>
                        <option value="Venue B">Venue B</option>
                        <option value="Venue C">Venue C</option>
                        <option value="other">Other</option>
                    </select>
                    <input type="text" id="otherVenue" name="otherVenue" placeholder="Enter venue" style="display: none;">
                </div>

                <div class="form-group">
                    <label for="event_type">Event Type:<span>*</span></label>
                    <input type="text" id="event_type" name="event_type" required>
                </div>

                <div class="form-group">
                    <label for="theme_motif">Theme/Motif:<span>*</span></label>
                    <input type="text" id="theme_motif" name="theme_motif" required>
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
