<?php
include 'db_connect.php';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Reports - Villa Salud</title>
    <link rel="stylesheet" href="../style/a_view_report.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>

<body>
    <header class="header-image"></header>

    <nav class="navbar">
        <ul>
            <li><a href="../pages/a_homepage.html">Home</a></li>
            <li><a href="../pages/a_inquiries.php">View Inquiries</a></li>
            <li><a href="../pages/a_make_reservation.php">Make Reservation</a></li>
            <li><a href="a_view_report.php" class="active">View Report</a></li>
            <li><a href="../pages/admin_profile.php">Admin Profile</a></li>
        </ul>
    </nav>

    <section id="content">
        <main>
            <div class="head-title">
                <div class="left">
                    <h1>Reports Overview</h1>
                    <p>Track inquiries, bookings, and trends.</p>
                </div>
            </div>

            <!-- Summary Cards -->
            <ul class="box-info">
                <!-- ✅ Total Inquiries with filter + sparkline -->
                <li class="inquiry-card-full">
                    <i class='bx bxs-calendar-check'></i>
                    <span class="text">
                        <h3 id="total-inquiries">0</h3>
                        <p>Total Inquiries</p>

                        <div class="inquiry-extra">
                            <label for="inquiry-filter">Filter:</label>
                            <select id="inquiry-filter">
                                <option value="day">Today</option>
                                <option value="week">This Week</option>
                                <option value="month" selected>This Month</option>
                                <option value="year">This Year</option>
                            </select>
                            <canvas id="inquiry-sparkline" height="180"></canvas>
                        </div>
                    </span>
                </li>

                <li class="reservation-card-full">
                    <i class='bx bxs-group'></i>
                    <span class="text">
                        <h3 id="total-reservations">0</h3>
                        <p>Total Reservations</p>

                        <div class="reservation-extra">
                            <label for="reservation-filter">Filter:</label>
                            <select id="reservation-filter">
                                <option value="day">Today</option>
                                <option value="week">This Week</option>
                                <option value="month" selected>This Month</option>
                                <option value="year">This Year</option>
                            </select>
                            <!-- Placeholder space for future graph -->
                            <div class="reservation-placeholder"></div>
                        </div>
                    </span>
                </li>

            </ul>


            <!-- Placeholder for Activity Log / Other -->
            <div class="table-data">
                <div class="order">
                    <div class="head">
                        <h3>Recent Inquiries & Bookings</h3>
                        <i class='bx bx-filter'></i>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody id="reportTable"></tbody>
                    </table>
                </div>
            </div>
        </main>
    </section>

    <script src="../script/a_view_report.js"></script>
</body>

</html>