<?php
$booked_dates = [
    "2025-04-15" => "full",
    "2025-04-18" => "close",
    "2025-04-20" => "free"
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Make Reservation</title>
    <link rel="stylesheet" href="../style/a_make_reservation.css">
</head>
<body>
    <header class="header-image"></header>

    <nav class="navbar">
        <ul>
            <li><a href="../pages/a_homepage.html">Home</a></li>
            <li><a href="../pages/a_inquiries.html">View Reservation</a></li>
            <li><a href="#" class="active">Make Reservation</a></li>
            <li><a href="../pages/a_view_report.html">View Report</a></li>
        </ul>
    </nav>

    <div class="container"> 
        <div class="reservation-container">
            <h2>Let's bring your vision to life—just fill out the form.</h2>
            <form action="#" method="post">
                <div class="form-group">
                    <label for="name">Name:<span>*</span></label>
                    <input type="text" id="name" name="name" required />
                </div>

                <div class="form-group">
                    <label for="email">Email:<span>*</span></label>
                    <input type="email" id="email" name="email" required />
                </div>

                <div class="form-group">
                    <label for="contact">Contact Number:<span>*</span></label>
                    <input type="tel" id="contact" name="contact" required />
                </div>

                <div class="form-group">
                    <label for="time">Time:</label>
                    <input type="time" id="time" name="time" />
                </div>

                <div class="form-group">
                    <label for="date">Date:</label>
                    <input type="date" id="date" name="date" />
                </div>

                <div class="form-group">
                    <label for="venue">Venue:</label>
                    <select id="venue" name="venue" onchange="toggleOtherVenue()">
                        <option value="" selected disabled>Select a venue</option>
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                        <option value="other">Other</option>
                    </select>
                
                    <input type="text" id="otherVenue" name="otherVenue" placeholder="Enter venue" 
                        style="display: none;">
                </div>

                <div class="form-group">
                    <label for="event_type">Event Type:</label>
                    <select id="event_type" name="event_type">
                        <option value="">Select an Event Type</option>
                        <option value="baptismal">Baptismal Package</option>
                        <option value="debut">Debut Package</option>
                        <option value="birthday">Birthday Party Package</option>
                        <option value="kiddie">Kiddie Party Package</option>
                        <option value="other">Other</option>
                    </select>
                    <input type="text" id="otherEventType" name="other_event_type" placeholder="Specify Event Type"
                         style="display: none;">
                </div>
                
                <div class="form-group">
                    <label for="theme_motif">Event Theme & Motif:</label>
                    <select id="theme_motif" name="theme_motif" onchange="toggleOtherThemeMotif()">
                        <option value="" selected disabled>Select a theme/motif</option>
                        <option value="floral">Floral</option>
                        <option value="rustic">Rustic</option>
                        <option value="elegant">Elegant</option>
                        <option value="beach">Beach</option>
                        <option value="modern">Modern</option>
                        <option value="other">Other</option>
                    </select>
                
                    <input type="text" id="otherThemeMotif" name="otherThemeMotif" placeholder="Enter theme/motif"
                        style="display: none;">
                </div>

                <div class="form-group">
                    <button type="submit">Confirm Details</button>
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

<!-- Admin Status Selection Modal -->
<div id="statusModal" class="modal">
    <div class="modal-content">
        <h3>Select Status</h3>
        <select id="statusSelect">
            <option value="free">Free (Green)</option>
            <option value="full">Fully Booked (Yellow)</option>
            <option value="closed">Closed (Red)</option>
        </select>
        <button id="saveStatus">Save</button>
        <button id="closeModal">Cancel</button>
    </div>
</div>

    <script src="../script/a_make_reservation.js"></script>
</body>
</html>
