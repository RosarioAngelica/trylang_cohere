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
