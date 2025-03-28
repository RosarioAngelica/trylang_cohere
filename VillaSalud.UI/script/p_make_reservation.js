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
});