document.addEventListener("DOMContentLoaded", function () {
    const venueSelect = document.getElementById("venue");
    const otherVenueInput = document.getElementById("otherVenue");

    const themeMotifSelect = document.getElementById("theme_motif");
    const otherThemeMotifInput = document.getElementById("otherThemeMotif");

    const eventTypeSelect = document.getElementById("event_type");
    const otherEventTypeInput = document.getElementById("otherEventType");

    const form = document.querySelector("form");

    // Function to toggle visibility of "Other" input fields
    function toggleOtherInput(selectElement, otherInput, otherValue) {
        if (selectElement && otherInput) {
            otherInput.style.display = selectElement.value === otherValue ? "block" : "none";
            otherInput.required = selectElement.value === otherValue;
            if (selectElement.value !== otherValue) {
                otherInput.value = "";
            }
        }
    }

    // Attach event listeners
    if (venueSelect) venueSelect.addEventListener("change", () => toggleOtherInput(venueSelect, otherVenueInput, "Others"));
    if (themeMotifSelect) themeMotifSelect.addEventListener("change", () => toggleOtherInput(themeMotifSelect, otherThemeMotifInput, "Others"));
    if (eventTypeSelect) eventTypeSelect.addEventListener("change", () => toggleOtherInput(eventTypeSelect, otherEventTypeInput, "Others"));

    // Ensure correct fields are visible when page loads
    toggleOtherInput(venueSelect, otherVenueInput, "Others");
    toggleOtherInput(themeMotifSelect, otherThemeMotifInput, "Others");
    toggleOtherInput(eventTypeSelect, otherEventTypeInput, "Others");

    // Form validation before submission
    form.addEventListener("submit", function (event) {
        const name = document.getElementById("name")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const contact = document.getElementById("contact")?.value.trim();
        const message = document.getElementById("message")?.value.trim();
        const date = document.getElementById("date")?.value.trim();
        const time = document.getElementById("time")?.value.trim();
        
        if (!name || !email || !contact || !message || !date || !time) {
            alert("Please fill in all required fields.");
            event.preventDefault();
            return;
        }

        if (!venueSelect.value || (venueSelect.value === "Others" && !otherVenueInput.value.trim())) {
            alert("Please specify the venue.");
            event.preventDefault();
            return;
        }

        if (!eventTypeSelect.value || (eventTypeSelect.value === "Others" && !otherEventTypeInput.value.trim())) {
            alert("Please specify the event type.");
            event.preventDefault();
            return;
        }

        if (!themeMotifSelect.value || (themeMotifSelect.value === "Others" && !otherThemeMotifInput.value.trim())) {
            alert("Please specify the theme/motif.");
            event.preventDefault();
            return;
        }
    });

    // ---------------------------- //
    //       CALENDAR FUNCTION       //
    // ---------------------------- //
    const calendar = document.getElementById("calendar");
    const monthYear = document.getElementById("month-year");
    const prevMonthBtn = document.getElementById("prevMonth");
    const nextMonthBtn = document.getElementById("nextMonth");
    const modal = document.getElementById("statusModal");
    const saveStatusBtn = document.getElementById("saveStatus");
    const closeModalBtn = document.getElementById("closeModal");
    const statusSelect = document.getElementById("statusSelect");

    let currentDate = new Date();
    let selectedDate = null;
    let dateStatuses = {};  // Stores the date statuses in memory

    function renderCalendar() {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        monthYear.textContent = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(currentDate);

        const firstDay = new Date(year, month, 1).getDay(); 
        const lastDate = new Date(year, month + 1, 0).getDate(); 

        calendar.innerHTML = "";
        
        // Add day of week headers
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement("div");
            dayHeader.classList.add("calendar-day", "day-header");
            dayHeader.textContent = day;
            calendar.appendChild(dayHeader);
        });
        
        // Fill empty days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.classList.add("calendar-day", "empty");
            calendar.appendChild(emptyCell);
        }

        // Fill actual days of the month
        for (let day = 1; day <= lastDate; day++) {
            const dayCell = document.createElement("div");
            dayCell.classList.add("calendar-day");
            dayCell.textContent = day;
            const dateKey = `${year}-${month + 1}-${day}`;
            dayCell.setAttribute("data-date", dateKey);

            // Apply saved status
            if (dateStatuses[dateKey]) {
                dayCell.setAttribute("data-status", dateStatuses[dateKey]);
                applyStatusStyle(dayCell, dateStatuses[dateKey]);
            }

            dayCell.addEventListener("click", function () {
                selectedDate = dateKey;
                modal.style.display = "block";
            });

            calendar.appendChild(dayCell);
        }
    }

    function applyStatusStyle(cell, status) {
        cell.classList.remove("free", "closed", "full");
        if (status === "free") {
            cell.style.background = "green";
            cell.style.color = "white";
        } else if (status === "unavailable") {
            cell.style.background = "gray";
            cell.style.color = "white";
        } else if (status === "full") {
            cell.style.background = "red";
            cell.style.color = "black";
        } else if (status === "pending confirmation") {
            cell.style.background = "blue";
            cell.style.color = "white";
        } else if (status === "reserved") {
            cell.style.background = "yellow";
            cell.style.color = "white";
        }
    }

    saveStatusBtn.addEventListener("click", function () {
        if (selectedDate) {
            const selectedStatus = statusSelect.value;
            dateStatuses[selectedDate] = selectedStatus; // Save status in memory

            // Update UI
            const dayCells = document.querySelectorAll(".calendar-day");
            dayCells.forEach((cell) => {
                if (cell.getAttribute("data-date") === selectedDate) {
                    applyStatusStyle(cell, selectedStatus);
                }
            });

            modal.style.display = "none";
        }
    });

    closeModalBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    prevMonthBtn.addEventListener("click", function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener("click", function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar();
});