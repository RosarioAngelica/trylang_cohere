document.addEventListener("DOMContentLoaded", () => {
  // Package data simulation (could be fetched from server)
  const packagesData = {
    "Baptism Package": {
      description: "Celebrate your little one's special day with our Baptism package.",
      price: "₱5000",
      images: [
        "../assets/baptismal1.jpg",
        "../assets/baptismal2.jpg",
        "../assets/baptismal3.jpg",
      ],
    },
    "Debut Package": {
      description: "Make the debut unforgettable with our complete Debut package.",
      price: "₱10000",
      images: [
        "../assets/debut1.jpg",
        "../assets/debut2.jpg",
        "../assets/debut3.jpg",
      ],
    },
    "Wedding Package": {
      description: "A perfect wedding package for your dream day.",
      price: "₱25000",
      images: [
        "../assets/wedding1.jpg",
        "../assets/wedding2.jpg",
        "../assets/wedding3.jpg",
      ],
    },
    "Kiddie Package": {
      description: "Fun and exciting package for kids' parties.",
      price: "₱7000",
      images: [
        "../assets/kiddie1.jpg",
        "../assets/kiddie2.jpg",
        "../assets/kiddie3.jpg",
      ],
    },
  };

  // Elements
  const packageModal = document.getElementById("packageModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const modalPrice = document.getElementById("modalPrice");
  const modalImg1 = document.getElementById("modalImg1");
  const modalImg2 = document.getElementById("modalImg2");
  const modalImg3 = document.getElementById("modalImg3");
  const successModal = document.getElementById("successModal");
  const successMessage = document.getElementById("successMessage");
  const successOkBtn = document.getElementById("successOkBtn");

  // Add/Edit modals
  const addPackageModal = document.getElementById("addPackageModal");
  const editPackageModal = document.getElementById("editPackageModal");

  // Buttons
  const addPackageBtn = document.getElementById("addPackageBtn");
  const closeAddModal = document.getElementById("closeAddModal");
  const cancelAddPackage = document.getElementById("cancelAddPackage");
  const closeEditModal = document.getElementById("closeEditModal");
  const cancelEditPackage = document.getElementById("cancelEditPackage");

  // Forms
  const addPackageForm = document.getElementById("addPackageForm");
  const editPackageForm = document.getElementById("editPackageForm");

  // Helper to open modal
  function openModal(modal) {
    modal.style.display = "flex";
  }

  // Helper to close modal
  function closeModal(modal) {
    modal.style.display = "none";
  }

  // View Package modal handlers
  document.querySelectorAll(".view-package").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const packageCard = e.target.closest(".package-card");
      const packageName = packageCard.getAttribute("data-package");
      const data = packagesData[packageName];
      if (!data) return;

      modalTitle.textContent = packageName;
      modalDescription.textContent = data.description;
      modalPrice.textContent = data.price;

      modalImg1.src = data.images[0] || "";
      modalImg2.src = data.images[1] || "";
      modalImg3.src = data.images[2] || "";

      openModal(packageModal);
    });
  });

  // Close View Package modal on clicking X or outside
  packageModal.querySelector(".close").addEventListener("click", () => closeModal(packageModal));
  packageModal.addEventListener("click", (e) => {
    if (e.target === packageModal) closeModal(packageModal);
  });

  // Open Add Package Modal
  addPackageBtn.addEventListener("click", () => openModal(addPackageModal));
  closeAddModal.addEventListener("click", () => closeModal(addPackageModal));
  cancelAddPackage.addEventListener("click", () => closeModal(addPackageModal));
  addPackageModal.addEventListener("click", (e) => {
    if (e.target === addPackageModal) closeModal(addPackageModal);
  });

  // Handle Add Package form submission
  addPackageForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Just simulate adding package here
    closeModal(addPackageModal);

    successMessage.textContent = "Package added successfully!";
    openModal(successModal);

    // Clear form inputs (optional)
    addPackageForm.reset();
  });

  // Open Edit Package Modal
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const packageCard = e.target.closest(".package-card");
      const packageName = packageCard.getAttribute("data-package");
      const data = packagesData[packageName];
      if (!data) return;

      document.getElementById("editPackageId").value = packageName;
      document.getElementById("editPackageName").value = packageName;
      // Strip ₱ sign and convert price to number
      document.getElementById("editPackagePrice").value = parseFloat(data.price.replace(/[^\d.]/g, ""));

      document.getElementById("currentMainImage").src = data.images[0] || "";

      // Clear file inputs
      ["editPackageImage", "editPackageImage1", "editPackageImage2", "editPackageImage3"].forEach(id => {
        document.getElementById(id).value = "";
      });

      openModal(editPackageModal);
    });
  });

  closeEditModal.addEventListener("click", () => closeModal(editPackageModal));
  cancelEditPackage.addEventListener("click", () => closeModal(editPackageModal));
  editPackageModal.addEventListener("click", (e) => {
    if (e.target === editPackageModal) closeModal(editPackageModal);
  });

  // Handle Edit Package form submission
  editPackageForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // For now just simulate update success
    closeModal(editPackageModal);

    successMessage.textContent = "Package updated successfully!";
    openModal(successModal);
  });

  // Delete package handler
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const packageCard = e.target.closest(".package-card");
      const packageName = packageCard.getAttribute("data-package");
      if (confirm(`Are you sure you want to delete the "${packageName}"?`)) {
        packageCard.remove();
      }
    });
  });

  // Success modal OK button
  successOkBtn.addEventListener("click", () => {
    closeModal(successModal);
  });

  // Optional: close success modal on clicking outside
  successModal.addEventListener("click", (e) => {
    if (e.target === successModal) closeModal(successModal);
  });
});
