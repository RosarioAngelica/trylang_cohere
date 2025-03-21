document.addEventListener("DOMContentLoaded", function () {
    const venueSelect = document.getElementById("venue");
    const otherVenueInput = document.getElementById("otherVenue");

    const themeMotifSelect = document.getElementById("theme_motif");
    const otherThemeMotifInput = document.getElementById("otherThemeMotif");

    const eventTypeSelect = document.getElementById("event_type");
    const otherEventTypeInput = document.getElementById("otherEventType");

    const form = document.querySelector("form");

    function toggleOtherVenue() {
        otherVenueInput.style.display = venueSelect.value === "other" ? "block" : "none";
        if (venueSelect.value !== "other") otherVenueInput.value = "";
    }

    function toggleOtherThemeMotif() {
        otherThemeMotifInput.style.display = themeMotifSelect.value === "other" ? "block" : "none";
        if (themeMotifSelect.value !== "other") otherThemeMotifInput.value = "";
    }

    function toggleOtherEventType() {
        otherEventTypeInput.style.display = eventTypeSelect.value === "other" ? "block" : "none";
        if (eventTypeSelect.value !== "other") otherEventTypeInput.value = "";
    }

    venueSelect.addEventListener("change", toggleOtherVenue);
    themeMotifSelect.addEventListener("change", toggleOtherThemeMotif);
    eventTypeSelect.addEventListener("change", toggleOtherEventType);

    form.addEventListener("submit", function (event) {
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const contact = document.getElementById("contact").value.trim();
        const venue = venueSelect.value;
        const themeMotif = themeMotifSelect.value;
        const eventType = eventTypeSelect.value;

        if (name === "" || email === "" || contact === "") {
            alert("Please fill in all required fields.");
            event.preventDefault();
        } else if (venue === "other" && otherVenueInput.value.trim() === "") {
            alert("Please specify the venue.");
            event.preventDefault();
        } else if (themeMotif === "other" && otherThemeMotifInput.value.trim() === "") {
            alert("Please specify the theme/motif.");
            event.preventDefault();
        } else if (eventType === "other" && otherEventTypeInput.value.trim() === "") {
            alert("Please specify the event type.");
            event.preventDefault();
        }
    });
});
