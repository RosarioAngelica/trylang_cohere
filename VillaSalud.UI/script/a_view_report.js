// Load Report Data
document.addEventListener("DOMContentLoaded", function () {
    const reportTable = document.getElementById("reportTable");

    // Sample Data (Replace with real data later)
    const reports = [
        { name: "John Doe", email: "john@example.com", type: "Inquiry", date: "2025-03-22" },
        { name: "Jane Smith", email: "jane@example.com", type: "Booking", date: "2025-03-21" },
        { name: "Michael Lee", email: "michael@example.com", type: "Inquiry", date: "2025-03-20" }
    ];

    function loadReports() {
        reportTable.innerHTML = ""; // Clear previous data

        reports.forEach(report => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${report.name}</td>
                <td>${report.email}</td>
                <td>${report.type}</td>
                <td>${report.date}</td>
            `;

            reportTable.appendChild(row);
        });

        // Update statistics cards
        document.getElementById("total-inquiries").textContent = reports.filter(r => r.type === "Inquiry").length;
        document.getElementById("total-bookings").textContent = reports.filter(r => r.type === "Booking").length;
        document.getElementById("popular-theme").textContent = "Rustic Elegance"; // Placeholder
    }

    // Load reports on page load
    loadReports();
});
