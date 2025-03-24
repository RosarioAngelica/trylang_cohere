// Load Inquiry Data
document.addEventListener("DOMContentLoaded", function () {
    const inquiriesTable = document.getElementById("inquiriesTable");

    // Sample Data (Replace with actual backend data later)
    const inquiries = [
        { name: "John Doe", email: "john@example.com", message: "I want to book an event.", date: "2025-03-22" },
        { name: "Jane Smith", email: "jane@example.com", message: "Do you have catering options?", date: "2025-03-21" },
        { name: "Michael Lee", email: "michael@example.com", message: "Can I get a custom menu?", date: "2025-03-20" }
    ];

    function loadInquiries() {
        inquiriesTable.innerHTML = ""; // Clear previous data

        inquiries.forEach(inquiry => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${inquiry.name}</td>
                <td>${inquiry.email}</td>
                <td>${inquiry.message}</td>
                <td>${inquiry.date}</td>
                <td><button class="reply-btn">Reply</button></td>
            `;

            inquiriesTable.appendChild(row);
        });
    }

    // Load inquiries on page load
    loadInquiries();
});
