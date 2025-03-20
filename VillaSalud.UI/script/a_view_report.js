document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("total-inquiries").innerText = "50";
    document.getElementById("total-reservations").innerText = "30";
    document.getElementById("popular-theme").innerText = "Rustic";

    let ctx1 = document.getElementById("inquiryChart").getContext("2d");
    let inquiryChart = new Chart(ctx1, {
        type: "bar",
        data: {
            labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            datasets: [{
                label: "Inquiries",
                data: [12, 19, 3, 5, 2, 3, 9],
                backgroundColor: "#ff6384"
            }]
        }
    });

    let ctx2 = document.getElementById("bookingChart").getContext("2d");
    let bookingChart = new Chart(ctx2, {
        type: "line",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May"],
            datasets: [{
                label: "Bookings",
                data: [3, 15, 9, 6, 20],
                borderColor: "#36a2eb",
                fill: false
            }]
        }
    });
});
