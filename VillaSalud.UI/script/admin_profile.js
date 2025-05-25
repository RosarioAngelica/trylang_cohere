// Admin Profile JavaScript Functions
document.addEventListener('DOMContentLoaded', function() {
    
    // Get modal elements
    const editModal = document.getElementById('edit-modal');
    const passwordModal = document.getElementById('password-modal');
    const successModal = document.getElementById('success-modal');
    
    // Get button elements
    const editBtn = document.getElementById('edit-profile-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const changePasswordLink = document.getElementById('change-password-link');
    const changePicBtn = document.getElementById('change-pic-btn');
    const profilePicInput = document.getElementById('profile-pic-input');
    const successOkBtn = document.getElementById('success-ok-btn');
    
    // Get close buttons
    const closeModal = document.getElementById('close-modal');
    const closePasswordModal = document.getElementById('close-password-modal');
    const cancelEdit = document.getElementById('cancel-edit');
    const cancelPassword = document.getElementById('cancel-password');
    
    // Get forms
    const editForm = document.getElementById('edit-form');
    const passwordForm = document.getElementById('password-form');
    
    // Profile data elements
    const adminName = document.getElementById('admin-name');
    const adminEmail = document.getElementById('admin-email');
    const adminPhone = document.getElementById('admin-phone');
    const adminUsername = document.getElementById('admin-username');
    const profilePic = document.getElementById('profile-pic');
    
    // Form input elements
    const editName = document.getElementById('edit-name');
    const editEmail = document.getElementById('edit-email');
    const editPhone = document.getElementById('edit-phone');
    const editUsername = document.getElementById('edit-username');
    
    // Activity list element
    const activityList = document.getElementById('activity-list');
    
    // System activities storage
    let systemActivities = [];
    
    // Profile Picture Change
    changePicBtn.addEventListener('click', function() {
        profilePicInput.click();
    });
    
    profilePicInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePic.src = e.target.result;
                addActivity('Changed profile picture');
                showSuccessModal('Profile picture updated successfully!');
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Edit Profile Button Click
    editBtn.addEventListener('click', function() {
        // Pre-fill form with current data
        editName.value = adminName.textContent;
        editEmail.value = adminEmail.textContent;
        editPhone.value = adminPhone.textContent;
        editUsername.value = adminUsername.textContent;
        
        editModal.style.display = 'block';
        addActivity('Opened profile edit form');
    });
    
    // Change Password Link Click
    changePasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        passwordModal.style.display = 'block';
        addActivity('Opened change password form');
    });
    
    // Close Modal Functions
    closeModal.addEventListener('click', function() {
        editModal.style.display = 'none';
    });
    
    closePasswordModal.addEventListener('click', function() {
        passwordModal.style.display = 'none';
    });
    
    cancelEdit.addEventListener('click', function() {
        editModal.style.display = 'none';
    });
    
    cancelPassword.addEventListener('click', function() {
        passwordModal.style.display = 'none';
    });
    
    successOkBtn.addEventListener('click', function() {
        successModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
        if (event.target === passwordModal) {
            passwordModal.style.display = 'none';
        }
        if (event.target === successModal) {
            successModal.style.display = 'none';
        }
    });
    
    // Edit Profile Form Submit
    editForm.addEventListener('submit', function(e) {
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
        editModal.style.display = 'none';
        
        // Track specific changes
        let changes = [];
        if (oldName !== editName.value) changes.push('name');
        if (oldEmail !== editEmail.value) changes.push('email');
        if (oldPhone !== editPhone.value) changes.push('phone');
        if (oldUsername !== editUsername.value) changes.push('username');
        
        // Add specific activity
        if (changes.length > 0) {
            addActivity(`Updated profile: ${changes.join(', ')}`);
        }
        
        // Show success modal
        showSuccessModal('Profile updated successfully!');
    });
    
    // Change Password Form Submit
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Basic validation
        if (newPassword !== confirmPassword) {
            showErrorMessage('New passwords do not match!', passwordModal);
            return;
        }
        
        if (newPassword.length < 6) {
            showErrorMessage('Password must be at least 6 characters long!', passwordModal);
            return;
        }
        
        if (currentPassword === '') {
            showErrorMessage('Please enter your current password!', passwordModal);
            return;
        }
        
        // Close modal and clear form
        passwordModal.style.display = 'none';
        passwordForm.reset();
        
        // Add activity
        addActivity('Changed account password');
        
        // Show success modal
        showSuccessModal('Password changed successfully!');
    });
    
    // Enhanced Logout Button Click with proper functionality
    logoutBtn.addEventListener('click', function() {
        // Show confirmation dialog
        if (confirm('Are you sure you want to logout? You will be redirected to the login page.')) {
            // Add logout activity
            addActivity('Admin logged out');
            
            // Show logout success message
            showLogoutModal();
            
            // Clear any stored session data (if you're using any)
            clearSessionData();
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                // Change this path to your actual login page
                window.location.href = '../pages/login.php'; // or '../index.html' or wherever your login page is
            }, 2000);
        }
    });
    
    // Function to show logout modal with countdown
    function showLogoutModal() {
        const successMessageText = document.getElementById('success-message-text');
        let countdown = 2;
        
        successMessageText.textContent = `Logging out... Redirecting to login page in ${countdown} seconds`;
        successModal.style.display = 'block';
        
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                successMessageText.textContent = `Logging out... Redirecting to login page in ${countdown} seconds`;
            } else {
                successMessageText.textContent = 'Redirecting now...';
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
        console.log('Session data cleared');
        
        // If you're using cookies, you could clear them here:
        // document.cookie = "adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    
    // Helper function to show success modal
    function showSuccessModal(message) {
        const successMessageText = document.getElementById('success-message-text');
        successMessageText.textContent = message;
        successModal.style.display = 'block';
    }
    
    // Helper function to show error message
    function showErrorMessage(message, modal) {
        // Remove existing error messages
        const existingError = modal.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Insert in modal
        const modalContent = modal.querySelector('.modal-content');
        const firstChild = modalContent.querySelector('h3');
        modalContent.insertBefore(errorDiv, firstChild.nextSibling);
        
        // Remove message after 5 seconds
        setTimeout(function() {
            errorDiv.remove();
        }, 5000);
    }
    
    // Helper function to add new activity
    function addActivity(activityText) {
        const timestamp = new Date();
        const activity = {
            text: activityText,
            time: timestamp,
            display: 'Just now'
        };
        
        systemActivities.unshift(activity);
        
        // Keep only last 10 activities
        if (systemActivities.length > 10) {
            systemActivities = systemActivities.slice(0, 10);
        }
        
        updateActivityDisplay();
    }
    
    // Update activity display
    function updateActivityDisplay() {
        activityList.innerHTML = '';
        
        systemActivities.forEach(activity => {
            const li = document.createElement('li');
            li.innerHTML = `<span>✔</span> ${activity.text} - <small>${activity.display}</small>`;
            activityList.appendChild(li);
        });
    }
    
    // Update activity timestamps
    function updateActivityTimestamps() {
        const now = new Date();
        
        systemActivities.forEach(activity => {
            const diffMs = now - activity.time;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);
            
            if (diffMins < 1) {
                activity.display = 'Just now';
            } else if (diffMins < 60) {
                activity.display = `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
            } else if (diffHours < 24) {
                activity.display = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
            } else {
                activity.display = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
            }
        });
        
        updateActivityDisplay();
    }
    
    // Update timestamps every minute
    setInterval(updateActivityTimestamps, 60000);
    
    // Phone number formatting - Fixed to allow editing of all digits
    const phoneInput = document.getElementById('edit-phone');
    phoneInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, ''); // Remove non-digits
        
        // Limit to 11 digits (like 09123456789)
        if (value.length > 11) {
            value = value.substring(0, 11);
        }
        
        // Format based on length
        if (value.length >= 4 && value.length <= 7) {
            value = value.replace(/(\d{4})(\d{0,3})/, '$1-$2');
        } else if (value.length > 7) {
            value = value.replace(/(\d{4})(\d{3})(\d{0,4})/, '$1-$2-$3');
        }
        
        this.value = value;
    });
    
    // Form validation for real-time feedback
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
    });
    
    function validateInput(input) {
        const value = input.value.trim();
        
        // Remove existing error styling
        input.style.borderColor = '#ccc';
        
        // Validate based on input type
        if (input.type === 'email' && value !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                input.style.borderColor = '#dc3545';
            }
        }
        
        if (input.name === 'phone' && value !== '') {
            const phoneRegex = /^\d{4}-\d{3}-\d{4}$/;
            if (!phoneRegex.test(value)) {
                input.style.borderColor = '#dc3545';
            }
        }
        
        if (input.type === 'password' && value !== '' && value.length < 6) {
            input.style.borderColor = '#dc3545';
        }
    }
    
    // Initialize with welcome activity
    addActivity('Admin profile page loaded');
    
    console.log('Admin Profile page loaded successfully!');
});