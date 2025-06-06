<?php
include 'db_connect.php';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Report - Villa Salud</title>
    <link rel="stylesheet" href="../style/a_view_report.css">
    <link href="https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns/dist/chartjs-adapter-date-fns.bundle.min.js"></script>
</head>

<body>
    <!-- Loading Overlay -->
    <div id="loading-overlay" class="loading-overlay">
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading Dashboard...</p>
        </div>
    </div>

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
            <!-- Dashboard Header -->
            <div class="dashboard-header">
                <div class="header-content">
                    <div class="header-text">
                        <h1>Report Dashboard</h1>
                    </div>
                    <div class="header-actions">
                        <button class="refresh-btn" onclick="refreshDashboard()">
                            <i class='bx bx-refresh'></i>
                            Refresh Data
                        </button>
                        <div class="last-updated">
                            <span>Last updated: <span id="last-updated-time">--</span></span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Key Metrics Overview -->
            <div class="metrics-overview">
                <div class="metric-card primary">
                    <div class="metric-icon">
                        <i class='bx bxs-message-dots'></i>
                    </div>
                    <div class="metric-content">
                        <div class="metric-value" id="total-inquiries-overview">0</div>
                        <div class="metric-label">Total Inquiries</div>
                        <div class="metric-change positive" id="inquiry-change">
                            <i class='bx bx-trending-up'></i>
                            <span>+12% vs last period</span>
                        </div>
                    </div>
                </div>

                <div class="metric-card secondary">
                    <div class="metric-icon">
                        <i class='bx bxs-calendar-check'></i>
                    </div>
                    <div class="metric-content">
                        <div class="metric-value" id="total-reservations-overview">0</div>
                        <div class="metric-label">Total Reservations</div>
                        <div class="metric-change positive" id="reservation-change">
                            <i class='bx bx-trending-up'></i>
                            <span>+8% vs last period</span>
                        </div>
                    </div>
                </div>

                <div class="metric-card accent">
                    <div class="metric-icon">
                        <i class='bx bxs-star'></i>
                    </div>
                    <div class="metric-content">
                        <div class="metric-value" id="conversion-rate">0%</div>
                        <div class="metric-label">Conversion Rate</div>
                        <div class="metric-change neutral" id="conversion-change">
                            <i class='bx bx-minus'></i>
                            <span>No change</span>
                        </div>
                    </div>
                </div>

                <div class="metric-card warning">
                    <div class="metric-icon">
                        <i class='bx bxs-time'></i>
                    </div>
                    <div class="metric-content">
                        <div class="metric-value" id="avg-response-time">0h</div>
                        <div class="metric-label">Avg Response Time</div>
                        <div class="metric-change negative" id="response-change">
                            <i class='bx bx-trending-down'></i>
                            <span>-15% improvement</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Chart Panels -->
            <div class="chart-grid">
                <!-- Inquiries Trend Chart -->
                <div class="chart-panel">
                    <div class="panel-header">
                        <div class="panel-title">
                            <h3>Inquiries Trend</h3>
                            <p>Track inquiry patterns over time</p>
                        </div>
                        <div class="panel-controls">
                            <select id="inquiry-filter" class="filter-select">
                                <option value="day">Last 7 Days</option>
                                <option value="week">Last 4 Weeks</option>
                                <option value="month" selected>Last 6 Months</option>
                                <option value="year">Last 2 Years</option>
                            </select>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="inquiry-sparkline"></canvas>
                    </div>
                    <div class="chart-footer">
                        <div class="chart-stats">
                            <div class="stat-item">
                                <span class="stat-label">Peak Day:</span>
                                <span class="stat-value" id="inquiry-peak-day">Monday</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Average Daily:</span>
                                <span class="stat-value" id="inquiry-avg-daily">12</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Reservations Chart -->
                <div class="chart-panel">
                    <div class="panel-header">
                        <div class="panel-title">
                            <h3>Reservation Analytics</h3>
                            <p>Monitor booking performance</p>
                        </div>
                        <div class="panel-controls">
                            <select id="reservation-filter" class="filter-select">
                                <option value="day">Last 7 Days</option>
                                <option value="week">Last 4 Weeks</option>
                                <option value="month" selected>Last 6 Months</option>
                                <option value="year">Last 2 Years</option>
                            </select>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="reservation-chart"></canvas>
                    </div>
                    <div class="chart-footer">
                        <div class="chart-stats">
                            <div class="stat-item">
                                <span class="stat-label">Best Month:</span>
                                <span class="stat-value" id="reservation-best-month">December</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Growth Rate:</span>
                                <span class="stat-value positive" id="reservation-growth">+15%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Theme Popularity Chart -->
                <div class="chart-panel">
                    <div class="panel-header">
                        <div class="panel-title">
                            <h3>Theme Popularity</h3>
                            <p>Most requested themes and packages</p>
                        </div>
                        <div class="panel-controls">
                            <select id="theme-filter" class="filter-select">
                                <option value="day">Today</option>
                                <option value="week">This Week</option>
                                <option value="month" selected>This Month</option>
                                <option value="year">This Year</option>
                            </select>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="theme-barchart"></canvas>
                    </div>
                    <div class="chart-footer">
                        <div class="chart-stats">
                            <div class="stat-item">
                                <span class="stat-label">Most Popular:</span>
                                <span class="stat-value" id="most-popular-theme">Garden Party</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Total Themes:</span>
                                <span class="stat-value" id="total-themes">8</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Inquiry Categories Chart -->
                <div class="chart-panel">
                    <div class="panel-header">
                        <div class="panel-title">
                            <h3>Inquiry Categories</h3>
                            <p>Breakdown by inquiry type</p>
                        </div>
                        <div class="panel-controls">
                            <select id="inquiry-type-chart-filter" class="filter-select">
                                <option value="day">Today</option>
                                <option value="week">This Week</option>
                                <option value="month" selected>This Month</option>
                                <option value="year">This Year</option>
                            </select>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="inquiry-type-chart"></canvas>
                    </div>
                    <div class="chart-footer">
                        <div class="chart-stats">
                            <div class="stat-item">
                                <span class="stat-label">Top Category:</span>
                                <span class="stat-value" id="top-inquiry-category">General Info</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Response Rate:</span>
                                <span class="stat-value positive" id="inquiry-response-rate">94%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Activity Feed Section -->
            <div class="activity-section">
                <div class="activity-panel">
                    <div class="panel-header">
                        <div class="panel-title">
                            <h3>Recent Activity</h3>
                            <p>Latest administrative actions and system events</p>
                        </div>
                        <div class="panel-controls">
                            <button class="icon-btn" onclick="loadActivityLog()" title="Refresh Activity">
                                <i class='bx bx-refresh'></i>
                            </button>
                        </div>
                    </div>
                    <div class="activity-content" id="activity-log">
                        <div class="activity-loading">
                            <div class="loading-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <p>Loading recent activity...</p>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    </section>

    <!-- Fix: Hidden elements to match JS expectations -->
    <span id="total-inquiries" style="display:none;"></span>
    <span id="total-reservations" style="display:none;"></span>

    <script src="../script/a_view_report.js"></script>
</body>

</html>