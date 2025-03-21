// Sidebar Menu Active State
const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item => {
    const li = item.parentElement;

    item.addEventListener('click', function () {
        allSideMenu.forEach(i => {
            i.parentElement.classList.remove('active');
        });
        li.classList.add('active');
    });
});

// Sidebar Toggle
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
    sidebar.classList.toggle('hide');
});

// Search Toggle (for small screens)
const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
    if (window.innerWidth < 576) {
        e.preventDefault();
        searchForm.classList.toggle('show');
        if (searchForm.classList.contains('show')) {
            searchButtonIcon.classList.replace('bx-search', 'bx-x');
        } else {
            searchButtonIcon.classList.replace('bx-x', 'bx-search');
        }
    }
});

// Handle Dark Mode
const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
});

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
