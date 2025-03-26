document.addEventListener("DOMContentLoaded", function () {
    const venueSelect = document.getElementById("venue");
    const otherVenueInput = document.getElementById("otherVenue");

    const themeMotifSelect = document.getElementById("theme_motif");
    const otherThemeMotifInput = document.getElementById("otherThemeMotif");

    const eventTypeSelect = document.getElementById("event_type");
    const otherEventTypeInput = document.getElementById("otherEventType");

    const form = document.querySelector("form");

    const validEventTypes = [
        "Baptismal Package", "Birthday Package", "Debut Package",
        "Kiddie Package", "Wedding Package", "Standard Package", "Others"
    ];

    const validThemeMotifs = [
        "Floral", "Rustic", "Elegant", "Beach", "Modern", "Others"
    ];

    function toggleOtherVenue() {
        otherVenueInput.style.display = venueSelect.value === "other" ? "block" : "none";
        if (venueSelect.value !== "other") otherVenueInput.value = "";
    }

    function toggleOtherThemeMotif() {
        otherThemeMotifInput.style.display = themeMotifSelect.value === "Others" ? "block" : "none";
        if (themeMotifSelect.value !== "Others") otherThemeMotifInput.value = "";
    }

    function toggleOtherEventType() {
        otherEventTypeInput.style.display = eventTypeSelect.value === "Others" ? "block" : "none";
        if (eventTypeSelect.value !== "Others") otherEventTypeInput.value = "";
    }

    venueSelect.addEventListener("change", toggleOtherVenue);
    themeMotifSelect.addEventListener("change", toggleOtherThemeMotif);
    eventTypeSelect.addEventListener("change", toggleOtherEventType);

    form.addEventListener("submit", function (event) {
        const message = document.getElementById("message").value.trim();
        const date = document.getElementById("date").value.trim();
        const time = document.getElementById("time").value.trim();
        let eventType = eventTypeSelect.value;
        let themeMotif = themeMotifSelect.value;

        if (!validEventTypes.includes(eventType)) {
            eventType = "Others";
        }

        if (!validThemeMotifs.includes(themeMotif)) {
            themeMotif = "Others";
        }

        if (name === "" || email === "" || contact === "") {
            alert("Please fill in all required fields.");
            event.preventDefault();
        } else if (venueSelect.value === "other" && otherVenueInput.value.trim() === "") {
            alert("Please specify the venue.");
            event.preventDefault();
        } else if (themeMotif === "Others" && otherThemeMotifInput.value.trim() === "") {
            alert("Please specify the theme/motif.");
            event.preventDefault();
        } else if (eventType === "Others" && otherEventTypeInput.value.trim() === "") {
            alert("Please specify the event type.");
            event.preventDefault();
        }
    });
});
