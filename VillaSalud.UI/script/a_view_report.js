// Handle reservation filter change (placeholder behavior)
document.getElementById("reservation-filter").addEventListener("change", function () {
    const placeholder = document.querySelector(".reservation-placeholder");
    placeholder.innerHTML = `Loading total for: ${this.options[this.selectedIndex].text}`;
    setTimeout(() => {
        // Placeholder total update
        document.getElementById("total-reservations").textContent = 0;
        placeholder.innerHTML = "No data yet — chart coming soon.";
    }, 500);
});

document.addEventListener("DOMContentLoaded", function () {
    const inquiryCount = document.getElementById("total-inquiries");
    const inquiryFilter = document.getElementById("inquiry-filter");
    const canvas = document.getElementById("inquiry-sparkline");
    const sparklineCtx = canvas.getContext("2d");

    let sparklineChart;

    function fetchInquiryData(timeRange) {
        fetch("fetch_inquiry_data.php?filter=" + timeRange)
            .then(res => res.json())
            .then(data => {
                inquiryCount.textContent = data.total;

                if (sparklineChart) sparklineChart.destroy();

                // ✨ Set canvas resolution for sharp rendering
                const dpr = window.devicePixelRatio || 1;
                canvas.width = canvas.clientWidth * dpr;
                canvas.height = canvas.clientHeight * dpr;
                sparklineCtx.setTransform(1, 0, 0, 1, 0, 0); // reset any scaling
                sparklineCtx.scale(dpr, dpr);

                // ✨ Render sharp graph
                sparklineChart = new Chart(sparklineCtx, {
                    type: "line",
                    data: {
                        labels: data.labels,
                        datasets: [{
                            label: "Inquiries",
                            data: data.counts,
                            fill: false,
                            borderColor: "#007b3d",
                            tension: 0.3,
                            pointRadius: 3
                        }]
                    },
                    options: {
                        responsive: false,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            x: {
                                display: true,
                                ticks: {
                                    color: "#333",
                                    font: { size: 12 }
                                },
                                grid: { display: false }
                            },
                            y: {
                                display: true,
                                beginAtZero: true,
                                ticks: {
                                    color: "#333",
                                    font: { size: 12 }
                                },
                                grid: { color: "#eee" }
                            }
                        }
                    }
                });
            })
            .catch(err => {
                console.error("Failed to load inquiry data:", err);
            });
    }

    // Initial load
    fetchInquiryData(inquiryFilter.value);

    // Handle filter change
    inquiryFilter.addEventListener("change", () => {
        fetchInquiryData(inquiryFilter.value);
    });
});

const themeCanvas = document.getElementById("theme-barchart");
const themeCtx = themeCanvas.getContext("2d");
let themeChart;

function fetchThemeData(timeRange) {
    fetch("fetch_theme_data.php?filter=" + timeRange)
        .then(res => res.json())
        .then(data => {
            if (themeChart) themeChart.destroy();

            const dpr = window.devicePixelRatio || 1;
            themeCanvas.width = themeCanvas.clientWidth * dpr;
            themeCanvas.height = themeCanvas.clientHeight * dpr;
            themeCtx.setTransform(1, 0, 0, 1, 0, 0);
            themeCtx.scale(dpr, dpr);

            themeChart = new Chart(themeCtx, {
                type: "bar",
                data: {
                    labels: data.themes,
                    datasets: [{
                        label: "Usage",
                        data: data.counts,
                        backgroundColor: "#007b3d"
                    }]
                },
                options: {
                    responsive: false,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: "#333",
                                font: { size: 12 }
                            },
                            grid: { display: false }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: "#333",
                                font: { size: 12 }
                            },
                            grid: { color: "#eee" }
                        }
                    }
                }
            });
        });
}

// Initial load
fetchThemeData(document.getElementById("theme-filter").value);

// Filter change event
document.getElementById("theme-filter").addEventListener("change", function () {
    fetchThemeData(this.value);
});


function loadActivityLog() {
    fetch("fetch_activity_log.php")
        .then(res => res.json())
        .then(logs => {
            const container = document.getElementById("activity-log");
            container.innerHTML = "";

            if (logs.length === 0) {
                container.innerHTML = "<p>No recent admin activity found.</p>";
                return;
            }

            logs.forEach(log => {
                const item = document.createElement("div");
                item.classList.add("activity-item");

                const date = new Date(log.time_created);
                const formattedDate = isNaN(date.getTime())
                    ? "Unknown time"
                    : date.toLocaleString();

                item.innerHTML = `
                    <strong>${log.admin_name}</strong>: ${log.activity_type}
                    <span class="timestamp">${formattedDate}</span>
                `;
                container.appendChild(item);
            });
        })
        .catch(() => {
            document.getElementById("activity-log").innerHTML = "<p>Error loading activity.</p>";
        });
}

// Load activity log on page load
loadActivityLog();
