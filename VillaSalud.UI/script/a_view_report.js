// =============================================
// PROFESSIONAL DASHBOARD JAVASCRIPT
// =============================================

class DashboardManager {
    constructor() {
        this.charts = {};
        this.isLoading = false;
        this.lastUpdated = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.hideLoadingOverlay();
        this.updateLastUpdatedTime();
        this.loadAllData();
    }

    setupEventListeners() {
        // Filter change events
        document.getElementById("inquiry-filter").addEventListener("change", (e) => {
            this.fetchInquiryData(e.target.value);
        });

        document.getElementById("reservation-filter").addEventListener("change", (e) => {
            this.loadReservationChart(e.target.value);
        });

        document.getElementById("theme-filter").addEventListener("change", (e) => {
            this.fetchThemeData(e.target.value);
        });

        document.getElementById("inquiry-type-chart-filter").addEventListener("change", (e) => {
            this.loadInquiryTypeChart(e.target.value);
        });

        // Auto-refresh every 5 minutes
        setInterval(() => {
            this.refreshDashboard();
        }, 300000);
    }

    hideLoadingOverlay() {
        setTimeout(() => {
            const overlay = document.getElementById("loading-overlay");
            if (overlay) {
                overlay.classList.add("hidden");
                setTimeout(() => overlay.remove(), 300);
            }
        }, 1000);
    }

    updateLastUpdatedTime() {
        const now = new Date();
        const timeString = now.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        const element = document.getElementById("last-updated-time");
        if (element) {
            element.textContent = timeString;
        }
        this.lastUpdated = now;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class='bx bx-${type === 'success' ? 'check-circle' : type === 'error' ? 'error-circle' : 'info-circle'}'></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    async loadAllData() {
        try {
            this.isLoading = true;
            
            // Load all dashboard components
            await Promise.all([
                this.fetchInquiryData('month'),
                this.loadReservationChart('month'),
                this.fetchThemeData('month'),
                this.loadInquiryTypeChart('month'),
                this.loadActivityLog(),
                this.updateMetricsOverview()
            ]);
            
            this.updateLastUpdatedTime();
            this.isLoading = false;
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showNotification('Error loading dashboard data', 'error');
        }
    }

    async updateMetricsOverview() {
        try {
            // Update total inquiries overview
            const inquiryResponse = await fetch("fetch_inquiry_data.php?filter=month");
            const inquiryData = await inquiryResponse.json();
            document.getElementById("total-inquiries-overview").textContent = inquiryData.total || 0;

            // Update total reservations overview
            const reservationResponse = await fetch("../pages/get_reservation_chart.php?filter=month");
            const reservationData = await reservationResponse.json();
            const totalReservations = reservationData.data.reduce((sum, val) => sum + val, 0);
            document.getElementById("total-reservations-overview").textContent = totalReservations || 0;

            // Calculate conversion rate
            const conversionRate = inquiryData.total > 0 ? 
                ((totalReservations / inquiryData.total) * 100).toFixed(1) : 0;
            document.getElementById("conversion-rate").textContent = `${conversionRate}%`;

            // Mock response time (replace with actual data)
            document.getElementById("avg-response-time").textContent = "2.3h";

        } catch (error) {
            console.error('Error updating metrics overview:', error);
        }
    }

    async fetchInquiryData(timeRange) {
        try {
            const response = await fetch(`fetch_inquiry_data.php?filter=${timeRange}`);
            const data = await response.json();
            
            // Update inquiry count
            document.getElementById("total-inquiries").textContent = data.total;
            
            // Destroy existing chart
            if (this.charts.inquiryChart) {
                this.charts.inquiryChart.destroy();
            }

            // Create new chart with professional styling
            const ctx = document.getElementById("inquiry-sparkline").getContext("2d");
            this.charts.inquiryChart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: "Inquiries",
                        data: data.counts,
                        fill: true,
                        backgroundColor: "rgba(0, 123, 61, 0.1)",
                        borderColor: "#007b3d",
                        borderWidth: 3,
                        tension: 0.4,
                        pointRadius: 5,
                        pointHoverRadius: 8,
                        pointBackgroundColor: "#007b3d",
                        pointBorderColor: "#fff",
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: '#007b3d',
                            borderWidth: 1,
                            cornerRadius: 8,
                            displayColors: false
                        }
                    },
                    scales: {
                        x: {
                            grid: { 
                                display: false 
                            },
                            ticks: {
                                color: "#6b7280",
                                font: { size: 12, weight: '500' }
                            }
                        },
                        y: {
                            beginAtZero: true,
                            grid: { 
                                color: "#f1f5f9",
                                drawBorder: false
                            },
                            ticks: {
                                color: "#6b7280",
                                font: { size: 12, weight: '500' }
                            }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    }
                }
            });

            // Update stats
            this.updateInquiryStats(data);

        } catch (error) {
            console.error("Failed to load inquiry data:", error);
            this.showNotification('Failed to load inquiry data', 'error');
        }
    }

    updateInquiryStats(data) {
        // Find peak day
        const maxIndex = data.counts.indexOf(Math.max(...data.counts));
        const peakDay = data.labels[maxIndex] || 'N/A';
        document.getElementById("inquiry-peak-day").textContent = peakDay;

        // Calculate average daily
        const avgDaily = data.counts.length > 0 ? 
            (data.counts.reduce((sum, val) => sum + val, 0) / data.counts.length).toFixed(1) : 0;
        document.getElementById("inquiry-avg-daily").textContent = avgDaily;
    }

    async fetchThemeData(timeRange) {
        try {
            const response = await fetch(`fetch_theme_data.php?filter=${timeRange}`);
            const data = await response.json();

            if (this.charts.themeChart) {
                this.charts.themeChart.destroy();
            }

            const ctx = document.getElementById("theme-barchart").getContext("2d");
            this.charts.themeChart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: data.themes,
                    datasets: [{
                        label: "Usage",
                        data: data.counts,
                        backgroundColor: data.themes.map((_, index) => {
                            const colors = ['#007b3d', '#16a34a', '#22c55e', '#4ade80', '#86efac'];
                            return colors[index % colors.length];
                        }),
                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: '#007b3d',
                            borderWidth: 1,
                            cornerRadius: 8
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: {
                                color: "#6b7280",
                                font: { size: 11, weight: '500' },
                                maxRotation: 45
                            }
                        },
                        y: {
                            beginAtZero: true,
                            grid: { 
                                color: "#f1f5f9",
                                drawBorder: false
                            },
                            ticks: {
                                color: "#6b7280",
                                font: { size: 12, weight: '500' }
                            }
                        }
                    }
                }
            });

            // Update theme stats
            this.updateThemeStats(data);

        } catch (error) {
            console.error("Failed to load theme data:", error);
        }
    }

    updateThemeStats(data) {
        // Find most popular theme
        if (data.themes.length > 0) {
            const maxIndex = data.counts.indexOf(Math.max(...data.counts));
            const mostPopular = data.themes[maxIndex] || 'N/A';
            document.getElementById("most-popular-theme").textContent = mostPopular;
        }
        
        document.getElementById("total-themes").textContent = data.themes.length;
    }

    async loadReservationChart(filter = 'month') {
        try {
            const response = await fetch(`../pages/get_reservation_chart.php?filter=${filter}`);
            const chartData = await response.json();
            
            // Update total reservations
            const total = chartData.data.reduce((sum, val) => sum + val, 0);
            document.getElementById("total-reservations").textContent = total;

            if (this.charts.reservationChart) {
                this.charts.reservationChart.destroy();
            }

            const ctx = document.getElementById("reservation-chart").getContext("2d");
            this.charts.reservationChart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: "Reservations",
                        data: chartData.data,
                        fill: true,
                        backgroundColor: "rgba(37, 99, 235, 0.1)",
                        borderColor: "#2563eb",
                        borderWidth: 3,
                        tension: 0.4,
                        pointRadius: 5,
                        pointHoverRadius: 8,
                        pointBackgroundColor: "#2563eb",
                        pointBorderColor: "#fff",
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: '#2563eb',
                            borderWidth: 1,
                            cornerRadius: 8,
                            displayColors: false
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: {
                                color: "#6b7280",
                                font: { size: 12, weight: '500' }
                            }
                        },
                        y: {
                            beginAtZero: true,
                            grid: { 
                                color: "#f1f5f9",
                                drawBorder: false
                            },
                            ticks: {
                                color: "#6b7280",
                                font: { size: 12, weight: '500' }
                            }
                        }
                    }
                }
            });

            // Update reservation stats
            this.updateReservationStats(chartData);

        } catch (error) {
            console.error("Failed to load reservation chart:", error);
        }
    }

    updateReservationStats(chartData) {
        // Find best month
        const maxIndex = chartData.data.indexOf(Math.max(...chartData.data));
        const bestMonth = chartData.labels[maxIndex] || 'N/A';
        document.getElementById("reservation-best-month").textContent = bestMonth;

        // Mock growth rate (replace with actual calculation)
        document.getElementById("reservation-growth").textContent = "+15%";
    }

    async loadInquiryTypeChart(filter = 'month') {
        try {
            const response = await fetch(`../pages/get_inquiry_type_chart.php?filter=${filter}`);
            const chartData = await response.json();

            if (this.charts.inquiryTypeChart) {
                this.charts.inquiryTypeChart.destroy();
            }

            const ctx = document.getElementById("inquiry-type-chart").getContext("2d");
            this.charts.inquiryTypeChart = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        data: chartData.data,
                        backgroundColor: [
                            '#dc2626', '#ea580c', '#ca8a04', '#16a34a', 
                            '#0891b2', '#2563eb', '#7c3aed', '#be185d'
                        ],
                        borderWidth: 0,
                        hoverBorderWidth: 4,
                        hoverBorderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                font: { size: 12, weight: '500' },
                                color: '#374151'
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            cornerRadius: 8
                        }
                    },
                    cutout: '60%'
                }
            });

            // Update inquiry type stats
            this.updateInquiryTypeStats(chartData);

        } catch (error) {
            console.error("Failed to load inquiry type chart:", error);
        }
    }

    updateInquiryTypeStats(chartData) {
        // Find top category
        if (chartData.labels.length > 0) {
            const maxIndex = chartData.data.indexOf(Math.max(...chartData.data));
            const topCategory = chartData.labels[maxIndex] || 'N/A';
            document.getElementById("top-inquiry-category").textContent = topCategory;
        }

        // Mock response rate (replace with actual data)
        document.getElementById("inquiry-response-rate").textContent = "94%";
    }

    async loadActivityLog() {
        try {
            const response = await fetch("fetch_activity_log.php");
            const logs = await response.json();
            const container = document.getElementById("activity-log");

            if (logs.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class='bx bx-history'></i>
                        <p>No recent activity found</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = "";
            logs.forEach(log => {
                const item = document.createElement("div");
                item.className = "activity-item";

                const date = new Date(log.time_created);
                const formattedDate = isNaN(date.getTime()) 
                    ? "Unknown time" 
                    : date.toLocaleString();

                item.innerHTML = `
                    <div class="activity-icon">
                        <i class='bx bx-user'></i>
                    </div>
                    <div class="activity-details">
                        <strong>${log.admin_name}</strong>: ${log.activity_type}
                        <span class="timestamp">${formattedDate}</span>
                    </div>
                `;
                container.appendChild(item);
            });

        } catch (error) {
            console.error("Error loading activity log:", error);
            document.getElementById("activity-log").innerHTML = `
                <div class="error-state">
                    <i class='bx bx-error'></i>
                    <p>Error loading activity log</p>
                </div>
            `;
        }
    }
}

// Global refresh function
function refreshDashboard() {
    if (window.dashboardManager) {
        window.dashboardManager.updateLastUpdatedTime();
        window.dashboardManager.loadAllData();
        window.dashboardManager.showNotification('Dashboard refreshed successfully', 'success');
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    window.dashboardManager = new DashboardManager();
});

// Add notification styles dynamically
const notificationStyles = `
    <style>
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            min-width: 250px;
        }
        
        .notification.success {
            border-left: 4px solid #16a34a;
            color: #16a34a;
        }
        
        .notification.error {
            border-left: 4px solid #dc2626;
            color: #dc2626;
        }
        
        .notification.info {
            border-left: 4px solid #2563eb;
            color: #2563eb;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .empty-state, .error-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px;
            color: #6b7280;
            text-align: center;
        }
        
        .empty-state i, .error-state i {
            font-size: 48px;
            margin-bottom: 15px;
            opacity: 0.5;
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', notificationStyles);