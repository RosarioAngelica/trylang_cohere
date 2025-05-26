document.addEventListener("DOMContentLoaded", function () {
    applyStatusColors();
    attachEventListeners();
});

function applyStatusColors() {
    document.querySelectorAll(".status-dropdown").forEach(select => {
        updateStatusColor(select);
        select.addEventListener("change", function () {
            updateStatusColor(this);
        });
    });
}

function updateStatusColor(select) {
    const value = select.value;
    select.style.color = "white";
    switch (value) {
        case "Pending":
            select.style.backgroundColor = "yellow";
            select.style.color = "black";
            break;
        case "Reserved":
            select.style.backgroundColor = "green";
            break;
        case "Cancelled":
            select.style.backgroundColor = "red";
            break;
        default:
            select.style.backgroundColor = "white";
            select.style.color = "black";
    }
}

function attachEventListeners() {
    document.querySelectorAll(".reply-btn").forEach(button => {
        button.addEventListener("click", function () {
            const index = this.getAttribute("data-index");
            alert("Replying to inquiry #" + index);
        });
    });
}
