document.addEventListener("DOMContentLoaded", function () {
    loadInquiries();
});

function loadInquiries() {
    let tableBody = document.getElementById("inquiries-table-body");
    if (!tableBody) {
        console.error("Error: Table body with ID 'inquiries-table-body' not found.");
        return;
    }

    let inquiries = [
        {
            name: "John Doe",
            email: "johndoe@example.com",
            contact: "123-456-7890",
            time: "10:00 AM",
            date: "2025-04-10",
            venue: "Grand Hall",
            event: "Wedding",
            theme: "Elegant White",
            extra: "No dietary restrictions",
            status: ""
        },
        {
            name: "Jane Smith",
            email: "janesmith@example.com",
            contact: "987-654-3210",
            time: "2:00 PM",
            date: "2025-05-15",
            venue: "Garden Pavilion",
            event: "Birthday",
            theme: "Floral Pastels",
            extra: "Vegetarian options needed",
            status: "Pending"
        },
        {
            name: "Mike Johnson",
            email: "mikejohnson@example.com",
            contact: "555-789-1234",
            time: "6:00 PM",
            date: "2025-06-20",
            venue: "Ballroom A",
            event: "Corporate Gala",
            theme: "Black & Gold",
            extra: "Projector required",
            status: "Reserved"
        }
    ];
    
    tableBody.innerHTML = "";
    
    inquiries.forEach((inquiry, index) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${inquiry.name}</td>
            <td>${inquiry.email}</td>
            <td>${inquiry.contact}</td>
            <td>${inquiry.time}</td>
            <td>${inquiry.date}</td>
            <td>${inquiry.venue}</td>
            <td>${inquiry.event}</td>
            <td>${inquiry.theme}</td>
            <td>${inquiry.extra}</td>
            <td>
                <select class="status-dropdown" data-index="${index}">
                    <option value="" ${!inquiry.status ? "selected" : ""} hidden>Set Status</option>
                    <option value="Pending" ${inquiry.status === "Pending" ? "selected" : ""}>Pending</option>
                    <option value="Reserved" ${inquiry.status === "Reserved" ? "selected" : ""}>Reserved</option>
                    <option value="Cancelled" ${inquiry.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
                </select>
            </td>
            <td><button class="reply-btn" data-index="${index}">Reply</button></td>
        `;
        tableBody.appendChild(row);
    });

    applyStatusColors();
    attachEventListeners();
}

function applyStatusColors() {
    document.querySelectorAll(".status-dropdown").forEach(select => {
        updateStatusColor(select);
        select.addEventListener("change", function () {
            updateStatusColor(this);
        });
    });
}

function updateStatusColor(select) {
    let selectedValue = select.value;
    if (selectedValue === "Pending") {
        select.style.backgroundColor = "yellow";
        select.style.color = "black";
    } else if (selectedValue === "Reserved") {
        select.style.backgroundColor = "green";
        select.style.color = "white";
    } else if (selectedValue === "Cancelled") {
        select.style.backgroundColor = "red";
        select.style.color = "white";
    } else {
        select.style.backgroundColor = "white";
        select.style.color = "black";
    }
}

function attachEventListeners() {
    document.querySelectorAll(".reply-btn").forEach(button => {
        button.addEventListener("click", function () {
            let index = this.getAttribute("data-index");
            alert("Replying to: " + index);
        });
    });
}