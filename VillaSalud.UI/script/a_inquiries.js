document.addEventListener("DOMContentLoaded", function () {
  applyStatusColors();
  attachEventListeners();
});

function applyStatusColors() {
  document.querySelectorAll(".status-dropdown").forEach((select) => {
    // Apply initial color based on current value
    updateStatusColor(select);

    // Add change event listener
    select.addEventListener("change", function () {
      updateStatusColor(this);
      saveStatusToDatabase(this, this.value);
    });
  });
}

function updateStatusColor(select) {
  const value = select.value;

  // Reset styles first
  select.style.color = "black";
  select.style.backgroundColor = "white";
  select.style.fontWeight = "normal";

  // Apply colors based on status
  switch (value) {
  case "Pending":
    select.style.backgroundColor = "#ffc107"; // Bootstrap warning yellow
    select.style.color = "black";
    select.style.fontWeight = "bold";
    break;

  case "In Progress":
    select.style.backgroundColor = "#17a2b8"; // Bootstrap info blue
    select.style.color = "white";
    select.style.fontWeight = "bold";
    break;

  case "Completed":
    select.style.backgroundColor = "#28a745"; // Bootstrap success green
    select.style.color = "white";
    select.style.fontWeight = "bold";
    break;

  case "Cancelled":
    select.style.backgroundColor = "#dc3545"; // Bootstrap danger red
    select.style.color = "white";
    select.style.fontWeight = "bold";
    break;

  default:
    select.style.backgroundColor = "#f8f9fa"; // Light gray
    select.style.color = "#6c757d"; // Muted text
    select.style.fontWeight = "normal";
    break;
}
}

function attachEventListeners() {
  document.querySelectorAll(".reply-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      // You can expand this to open a modal or redirect to reply page
      alert("Replying to inquiry #" + (parseInt(index) + 1));
    });
  });
}

// Optional: Function to save status changes to database via AJAX
function saveStatusToDatabase(selectElement, newStatus) {
  const inquiryId = selectElement.closest("tr").getAttribute("data-inquiry-id");

  fetch("update_inquiry_status.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inquiry_id: inquiryId,
      status: newStatus,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log("Status updated and logged successfully.");
      } else {
        console.error("Failed to update status:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
