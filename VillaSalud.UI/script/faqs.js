document.addEventListener("DOMContentLoaded", () => {
    const faqButtons = document.querySelectorAll(".faq-question");

    faqButtons.forEach(button => {
        button.addEventListener("click", () => {
            const faqItem = button.parentElement;
            faqItem.classList.toggle("active");
        });
    });
});
