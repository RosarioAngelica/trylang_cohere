// Admin Profile JavaScript with Enhanced History System
document.addEventListener("DOMContentLoaded", function () {
  // Get modal elements
  const editModal = document.getElementById("edit-modal");
  const passwordModal = document.getElementById("password-modal");
  const successModal = document.getElementById("success-modal");
  const confirmModal = document.getElementById("confirm-modal");

  // Get button elements
  const editBtn = document.getElementById("edit-profile-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const changePasswordLink = document.getElementById("change-password-link");
  const changePicBtn = document.getElementById("change-pic-btn");
  const profilePicInput = document.getElementById("profile-pic-input");
  const successOkBtn = document.getElementById("success-ok-btn");
  const clearHistoryBtn = document.getElementById("clear-history-btn");
  const loadMoreBtn = document.getElementById("load-more-btn");

  // Get close buttons
  const closeModal = document.getElementById("close-modal");
  const closePasswordModal = document.getElementById("close-password-modal");
  const cancelEdit = document.getElementById("cancel-edit");
  const cancelPassword = document.getElementById("cancel-password");
  const confirmCancel = document.getElementById("confirm-cancel");
  const confirmOk = document.getElementById("confirm-ok");

  // Get forms
  const editForm = document.getElementById("edit-form");
  const passwordForm = document.getElementById("password-form");

  // Profile data elements
  const adminName = document.getElementById("admin-name");
  const adminEmail = document.getElementById("admin-email");
  const adminPhone = document.getElementById("admin-phone");
  const adminUsername = document.getElementById("admin-username");
  const profilePic = document.getElementById("profile-pic");

  // Form input elements
  const editName = document.getElementById("edit-name");
  const editEmail = document.getElementById("edit-email");
  const editPhone = document.getElementById("edit-phone");
  const editUsername = document.getElementById("edit-username");

  // History elements
  const historyList = document.getElementById("history-list");
  const historyEmpty = document.getElementById("history-empty");
  const historyFilter = document.getElementById("history-filter");
  const totalActivitiesCount = document.getElementById("total-activities");
  const todayActivitiesCount = document.getElementById("today-activities");
  const thisWeekActivitiesCount = document.getElementById(
    "this-week-activities"
  );

  // History system variables
  let adminHistory = [];
  let displayedHistoryCount = 0;
  const ITEMS_PER_PAGE = 10;
  let currentFilter = "all";
  let confirmCallback = null;

  // Initialize history system
  initializeHistory();

  // History Management Functions
  async function initializeHistory() {
    try {
      const res = await fetch(
        `../api/get_admin_activity.php?type=${currentFilter}`
      );
      const data = await res.json();

      if (Array.isArray(data)) {
        adminHistory = data.map((entry) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
          date: new Date(entry.timestamp).toLocaleDateString(),
          time: new Date(entry.timestamp).toLocaleTimeString(),
        }));
        displayedHistoryCount = 0;
        displayHistory();
        updateHistoryStats();
      } else {
        console.error("Error fetching admin history:", data.error || data);
      }
    } catch (error) {
      console.error("Failed to fetch admin history", error);
    }
  }

  function addToHistory(type, action, details = "") {
    const historyEntry = {
      id: generateId(),
      type: type, // login, profile, system, security
      action: action,
      details: details,
      timestamp: new Date(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    adminHistory.unshift(historyEntry);

    // Keep only last 100 entries to prevent memory issues
    if (adminHistory.length > 100) {
      adminHistory = adminHistory.slice(0, 100);
    }

    displayHistory();
    updateHistoryStats();
  }

  function generateId() {
    return "hist_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  function getHistoryIcon(type) {
    const icons = {
      login: "🔐",
      profile: "👤",
      system: "⚙️",
      security: "🛡️",
    };
    return icons[type] || "📝";
  }

  function displayHistory() {
    const filteredHistory = filterHistory();
    const historyToShow = filteredHistory.slice(
      0,
      displayedHistoryCount + ITEMS_PER_PAGE
    );

    historyList.innerHTML = "";

    if (historyToShow.length === 0) {
      historyEmpty.style.display = "block";
      loadMoreBtn.style.display = "none";
      return;
    }

    historyEmpty.style.display = "none";

    historyToShow.forEach((entry) => {
      const li = document.createElement("li");
      li.innerHTML = `
                <div class="history-icon ${entry.type}">
                    ${getHistoryIcon(entry.type)}
                </div>
                <div class="history-content">
                    <div class="history-action">${entry.action}</div>
                    <div class="history-details">${entry.details}</div>
                </div>
                <div class="history-time">
                    <div>${entry.date}</div>
                    <div>${entry.time}</div>
                </div>
            `;
      historyList.appendChild(li);
    });

    displayedHistoryCount = historyToShow.length;

    // Show/hide load more button
    if (filteredHistory.length > displayedHistoryCount) {
      loadMoreBtn.style.display = "block";
    } else {
      loadMoreBtn.style.display = "none";
    }
  }

  function filterHistory() {
    if (currentFilter === "all") {
      return adminHistory;
    }
    return adminHistory.filter((entry) => entry.type === currentFilter);
  }

  function updateHistoryStats() {
    const total = adminHistory.length;
    const today = adminHistory.filter((entry) => {
      const entryDate = new Date(entry.timestamp).toDateString();
      const todayDate = new Date().toDateString();
      return entryDate === todayDate;
    }).length;

    const thisWeek = adminHistory.filter((entry) => {
      const entryDate = new Date(entry.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    }).length;

    totalActivitiesCount.textContent = total;
    todayActivitiesCount.textContent = today;
    thisWeekActivitiesCount.textContent = thisWeek;
  }

  function clearHistory() {
    showConfirmModal(
      "Clear History",
      "Are you sure you want to clear all history? This action cannot be undone.",
      () => {
        adminHistory = [];
        displayedHistoryCount = 0;
        displayHistory();
        updateHistoryStats();
        showSuccessModal("History cleared successfully!");
        addToHistory(
          "system",
          "History cleared",
          "All admin history entries were deleted"
        );
      }
    );
  }

  // Event Listeners
  historyFilter.addEventListener('change', function() {
    currentFilter = this.value;
    initializeHistory(); // re-fetch from server
});


  clearHistoryBtn.addEventListener("click", clearHistory);

  loadMoreBtn.addEventListener("click", function () {
    displayHistory();
  });

  // Profile Picture Change
  changePicBtn.addEventListener("click", function () {
    profilePicInput.click();
  });

  profilePicInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profilePic.src = e.target.result;
        addToHistory(
          "profile",
          "Profile picture updated",
          "Changed admin profile picture"
        );
        showSuccessModal("Profile picture updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  });

  // Edit Profile Button Click
  editBtn.addEventListener("click", function () {
    // Pre-fill form with current data
    editName.value = adminName.textContent;
    editEmail.value = adminEmail.textContent;
    editPhone.value = adminPhone.textContent;
    editUsername.value = adminUsername.textContent;

    editModal.style.display = "block";
    addToHistory(
      "system",
      "Edit profile form opened",
      "Started editing admin profile information"
    );
  });

  // Change Password Link Click
  changePasswordLink.addEventListener("click", function (e) {
    e.preventDefault();
    passwordModal.style.display = "block";
    addToHistory(
      "security",
      "Password change initiated",
      "Opened password change form"
    );
  });

  // Close Modal Functions
  closeModal.addEventListener("click", function () {
    editModal.style.display = "none";
  });

  closePasswordModal.addEventListener("click", function () {
    passwordModal.style.display = "none";
  });

  cancelEdit.addEventListener("click", function () {
    editModal.style.display = "none";
    addToHistory(
      "system",
      "Profile edit cancelled",
      "Cancelled profile editing without saving"
    );
  });

  cancelPassword.addEventListener("click", function () {
    passwordModal.style.display = "none";
    addToHistory(
      "security",
      "Password change cancelled",
      "Cancelled password change without saving"
    );
  });

  successOkBtn.addEventListener("click", function () {
    successModal.style.display = "none";
  });

  confirmCancel.addEventListener("click", function () {
    confirmModal.style.display = "none";
    confirmCallback = null;
  });

  confirmOk.addEventListener("click", function () {
    if (confirmCallback) {
      confirmCallback();
    }
    confirmModal.style.display = "none";
    confirmCallback = null;
  });

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target === editModal) {
      editModal.style.display = "none";
    }
    if (event.target === passwordModal) {
      passwordModal.style.display = "none";
    }
    if (event.target === successModal) {
      successModal.style.display = "none";
    }
    if (event.target === confirmModal) {
      confirmModal.style.display = "none";
      confirmCallback = null;
    }
  });

  // Edit Profile Form Submit
  editForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Store old values for comparison
    const oldName = adminName.textContent;
    const oldEmail = adminEmail.textContent;
    const oldPhone = adminPhone.textContent;
    const oldUsername = adminUsername.textContent;

    // Update profile information
    adminName.textContent = editName.value;
    adminEmail.textContent = editEmail.value;
    adminPhone.textContent = editPhone.value;
    adminUsername.textContent = editUsername.value;

    // Close modal
    editModal.style.display = "none";

    // Track specific changes
    let changes = [];
    let changeDetails = [];

    if (oldName !== editName.value) {
      changes.push("name");
      changeDetails.push(`Name: "${oldName}" → "${editName.value}"`);
    }
    if (oldEmail !== editEmail.value) {
      changes.push("email");
      changeDetails.push(`Email: "${oldEmail}" → "${editEmail.value}"`);
    }
    if (oldPhone !== editPhone.value) {
      changes.push("phone");
      changeDetails.push(`Phone: "${oldPhone}" → "${editPhone.value}"`);
    }
    if (oldUsername !== editUsername.value) {
      changes.push("username");
      changeDetails.push(
        `Username: "${oldUsername}" → "${editUsername.value}"`
      );
    }

    // Add specific activity
    if (changes.length > 0) {
      const changeText = `Profile updated: ${changes.join(", ")}`;
      const detailText = changeDetails.join("; ");
      addToHistory("profile", changeText, detailText);
    } else {
      addToHistory(
        "profile",
        "Profile form submitted",
        "No changes were made to profile information"
      );
    }

    // Show success modal
    showSuccessModal("Profile updated successfully!");
  });

  // Change Password Form Submit
  passwordForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const currentPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Basic validation
    if (newPassword !== confirmPassword) {
      showErrorMessage("New passwords do not match!", passwordModal);
      addToHistory(
        "security",
        "Password change failed",
        "Password confirmation mismatch"
      );
      return;
    }

    if (newPassword.length < 6) {
      showErrorMessage(
        "Password must be at least 6 characters long!",
        passwordModal
      );
      addToHistory(
        "security",
        "Password change failed",
        "Password too short (minimum 6 characters)"
      );
      return;
    }

    if (currentPassword === "") {
      showErrorMessage("Please enter your current password!", passwordModal);
      addToHistory(
        "security",
        "Password change failed",
        "Current password not provided"
      );
      return;
    }

    // Close modal and clear form
    passwordModal.style.display = "none";
    passwordForm.reset();

    // Add activity
    addToHistory(
      "security",
      "Password changed successfully",
      "Admin account password updated"
    );

    // Show success modal
    showSuccessModal("Password changed successfully!");
  });

  // Enhanced Logout Button Click with proper functionality
  logoutBtn.addEventListener("click", function () {
    // Show confirmation dialog
    showConfirmModal(
      "Confirm Logout",
      "Are you sure you want to logout? You will be redirected to the login page.",
      () => {
        // Add logout activity
        addToHistory(
          "login",
          "Admin logged out",
          "Logged out from admin dashboard"
        );

        // Show logout success message
        showLogoutModal();

        // Clear any stored session data (if you're using any)
        clearSessionData();

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          // Change this path to your actual login page
          window.location.href = "../pages/login.php"; // or '../index.html' or wherever your login page is
        }, 2000);
      }
    );
  });

  // Function to show logout modal with countdown
  function showLogoutModal() {
    const successMessageText = document.getElementById("success-message-text");
    let countdown = 2;

    successMessageText.textContent = `Logging out... Redirecting to login page in ${countdown} seconds`;
    successModal.style.display = "block";

    const countdownInterval = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        successMessageText.textContent = `Logging out... Redirecting to login page in ${countdown} seconds`;
      } else {
        successMessageText.textContent = "Redirecting now...";
        clearInterval(countdownInterval);
      }
    }, 1000);
  }

  // Function to clear session data
  function clearSessionData() {
    // Clear any session-related data you might have stored
    // Since we can't use localStorage in this environment, this would be where you'd clear it
    // Example: localStorage.removeItem('adminSession');
    // Example: sessionStorage.clear();

    // For now, we'll just log the action
    console.log("Session data cleared");

    // If you're using cookies, you could clear them here:
    // document.cookie = "adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  // Helper function to show success modal
  function showSuccessModal(message) {
    const successMessageText = document.getElementById("success-message-text");
    successMessageText.textContent = message;
    successModal.style.display = "block";
  }

  // Helper function to show confirm modal
  function showConfirmModal(title, message, callback) {
    const confirmTitle = confirmModal.querySelector("h3");
    const confirmMessage = document.getElementById("confirm-message");

    confirmTitle.textContent = title;
    confirmMessage.textContent = message;
    confirmCallback = callback;
    confirmModal.style.display = "block";
  }

  // Helper function to show error message
  function showErrorMessage(message, modal) {
    // Remove existing error messages
    const existingError = modal.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    // Create error message element
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    errorDiv.style.display = "block";

    // Insert in modal
    const modalContent = modal.querySelector(".modal-content");
    const firstChild = modalContent.querySelector("h3");
    modalContent.insertBefore(errorDiv, firstChild.nextSibling);

    // Remove message after 5 seconds
    setTimeout(function () {
      errorDiv.remove();
    }, 5000);
  }

  // Phone number formatting - Fixed to allow editing of all digits
  const phoneInput = document.getElementById("edit-phone");
  phoneInput.addEventListener("input", function () {
    let value = this.value.replace(/\D/g, ""); // Remove non-digits

    // Limit to 11 digits (like 09123456789)
    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    // Format based on length
    if (value.length >= 4 && value.length <= 7) {
      value = value.replace(/(\d{4})(\d{0,3})/, "$1-$2");
    } else if (value.length > 7) {
      value = value.replace(/(\d{4})(\d{3})(\d{0,4})/, "$1-$2-$3");
    }

    this.value = value;
  });

  // Form validation for real-time feedback
  const inputs = document.querySelectorAll(
    'input[type="text"], input[type="email"], input[type="password"]'
  );
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateInput(this);
    });
  });

  function validateInput(input) {
    const value = input.value.trim();

    // Remove existing error styling
    input.style.borderColor = "#ccc";

    // Validate based on input type
    if (input.type === "email" && value !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        input.style.borderColor = "#dc3545";
        addToHistory(
          "system",
          "Validation error",
          `Invalid email format entered: ${value}`
        );
      }
    }

    if (input.name === "phone" && value !== "") {
      const phoneRegex = /^\d{4}-\d{3}-\d{4}$/;
      if (!phoneRegex.test(value) && value.replace(/\D/g, "").length > 0) {
        input.style.borderColor = "#dc3545";
        addToHistory(
          "system",
          "Validation error",
          `Invalid phone format entered: ${value}`
        );
      }
    }

    if (input.type === "password" && value !== "" && value.length < 6) {
      input.style.borderColor = "#dc3545";
      addToHistory(
        "security",
        "Validation error",
        "Password too short during input"
      );
    }
  }

  // Update history timestamps every minute
  setInterval(function () {
    // Update relative timestamps
    adminHistory.forEach((entry) => {
      const now = new Date();
      const entryTime = new Date(entry.timestamp);
      const diffMs = now - entryTime;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) {
        entry.relativeTime = "Just now";
      } else if (diffMins < 60) {
        entry.relativeTime = `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
      } else if (diffHours < 24) {
        entry.relativeTime = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      } else {
        entry.relativeTime = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
      }
    });

    // Re-display history with updated timestamps if needed
    if (adminHistory.length > 0) {
      displayHistory();
    }
  }, 60000); // Update every minute

  // Export history functionality (for future use)
  function exportHistory() {
    const historyData = {
      exportDate: new Date().toISOString(),
      totalEntries: adminHistory.length,
      entries: adminHistory,
    };

    const dataStr = JSON.stringify(historyData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `admin_history_${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    addToHistory(
      "system",
      "History exported",
      `Exported ${adminHistory.length} history entries to JSON file`
    );
  }

  // Add export button dynamically (optional)
  const exportBtn = document.createElement("button");
  exportBtn.textContent = "Export";
  exportBtn.className = "export-btn";
  exportBtn.style.cssText = `
        background: #28a745;
        color: white;
        padding: 8px 12px;
        border: none;
        border-radius: 5px;
        font-size: 12px;
        cursor: pointer;
        margin-left: 5px;
    `;
  exportBtn.addEventListener("click", exportHistory);

  // Add export button to history controls
  const historyControls = document.querySelector(".history-controls");
  if (historyControls) {
    historyControls.appendChild(exportBtn);
  }

  console.log(
    "Admin Profile with Enhanced History System loaded successfully!"
  );
});
