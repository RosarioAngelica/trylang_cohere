document.addEventListener("DOMContentLoaded", () => {
    const packagesContainer = document.getElementById("packages");
    const addPackageBtn = document.getElementById("addPackageBtn");

    // Function to delete a package
    function deletePackage(event) {
        if (event.target.classList.contains("delete-btn")) {
            event.target.closest(".package-card").remove();
        }
    }

    // Function to edit a package name
    function editPackage(event) {
        if (event.target.classList.contains("edit-btn")) {
            const packageTitle = event.target.closest(".package-card").querySelector("h3");
            const newTitle = prompt("Enter new package name:", packageTitle.textContent);
            if (newTitle) {
                packageTitle.textContent = newTitle;
            }
        }
    }

    // Function to change package image and hide file input
    function changePackageImage(event) {
        if (event.target.classList.contains("image-input")) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const packageCard = event.target.closest(".package-card");
                    packageCard.querySelector("img").src = e.target.result;
                    event.target.style.display = "none"; // Hide the file input after selecting an image
                };
                reader.readAsDataURL(file);
            }
        }
    }

    // Function to view package details
    function viewPackageDetails(event) {
        if (event.target.classList.contains("view-btn")) {
            const packageCard = event.target.closest(".package-card");
            const packageTitle = packageCard.querySelector("h3").textContent;
            const packageImage = packageCard.querySelector("img").src;

            alert(`Package: ${packageTitle}\nImage: ${packageImage}`);
        }
    }

    // Function to add a new package
    function addPackage() {
        const packageCard = document.createElement("div");
        packageCard.classList.add("package-card");
        packageCard.innerHTML = `
            <img src="./picture/default_package.jpg" alt="New Package">
            <h3 contenteditable="true">New Package</h3>
            <div class="buttons">
                <button class="btn view-btn">View Details</button>
                <button class="btn edit-btn">Edit</button>
                <button class="btn delete-btn">Delete</button>
            </div>
            <input type="file" class="image-input" accept="image/*">
        `;
        packagesContainer.appendChild(packageCard);
    }

    // Event Listeners
    packagesContainer.addEventListener("click", deletePackage);
    packagesContainer.addEventListener("click", editPackage);
    packagesContainer.addEventListener("change", changePackageImage);
    packagesContainer.addEventListener("click", viewPackageDetails);
    addPackageBtn.addEventListener("click", addPackage);
});
