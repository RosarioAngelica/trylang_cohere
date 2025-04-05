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
        const message = document.getElementById("message")?.value.trim();
        const date = document.getElementById("date")?.value.trim();
        const time = document.getElementById("time")?.value.trim();

        if (!eventTypeSelect.value || (eventTypeSelect.value === "Others" && !otherEventTypeInput.value.trim())) {
            alert("Please specify the event type.");
            event.preventDefault();
        }

        if (!themeMotifSelect.value || (themeMotifSelect.value === "Others" && !otherThemeMotifInput.value.trim())) {
            alert("Please specify the theme/motif.");
            event.preventDefault();
        }

        if (!message || !date || !time) {
            alert("Please fill in all required fields.");
            event.preventDefault();
        }
    });

    // ---------------------------- //
    //       CALENDAR FUNCTION      //
    // ---------------------------- //
    const calendar = document.getElementById("calendar");
    const monthYear = document.getElementById("month-year");
    const prevMonthBtn = document.getElementById("prevMonth");
    const nextMonthBtn = document.getElementById("nextMonth");
    
    let currentDate = new Date();
    let dateStatuses = {}; // This would ideally be populated from a database

    // Function to fetch date statuses from the server
    // For now, we'll simulate with some sample data
    function fetchDateStatuses() {
        // In a real implementation, this would be an AJAX call to the server
        // For demonstration, we're adding some sample data
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        
        // Sample data - in production this would come from your database
        dateStatuses[`${year}-${month}-10`] = "free";
        dateStatuses[`${year}-${month}-15`] = "full";
        dateStatuses[`${year}-${month}-20`] = "closed";
        dateStatuses[`${year}-${month}-25`] = "free";
    }

    function renderCalendar() {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        monthYear.textContent = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(currentDate);

        const firstDay = new Date(year, month, 1).getDay(); 
        const lastDate = new Date(year, month + 1, 0).getDate(); 

        calendar.innerHTML = "";
        
        // Add day headers (Sun, Mon, etc.)
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        dayNames.forEach(day => {
            const dayHeader = document.createElement("div");
            dayHeader.classList.add("day-header");
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

            // Apply saved status if exists
            if (dateStatuses[dateKey]) {
                dayCell.setAttribute("data-status", dateStatuses[dateKey]);
            }

            // When a date is clicked, update the date input
            dayCell.addEventListener("click", function() {
                const selectedDate = new Date(year, month, day);
                const formattedDate = selectedDate.toISOString().split('T')[0];
                document.getElementById("date").value = formattedDate;
            });

            calendar.appendChild(dayCell);
        }
    }

    // Initialize calendar
    fetchDateStatuses();
    renderCalendar();

    // Event listeners for month navigation
    prevMonthBtn.addEventListener("click", function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener("click", function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
});