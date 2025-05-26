<?php
session_start();

// Check if admin is logged in
if (!isset($_SESSION["admin_id"])) {
    echo "<script>alert('Please log in first!'); window.location.href='login.php';</script>";
    exit;
}

// Get admin data from session
$admin_name = isset($_SESSION["admin_name"]) ? $_SESSION["admin_name"] : "Admin User";
$admin_email = isset($_SESSION["admin_email"]) ? $_SESSION["admin_email"] : "admin@villasalud.com";
$admin_phone = isset($_SESSION["admin_phone"]) ? $_SESSION["admin_phone"] : "N/A";
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard - Villa Salud</title>
  <link rel="stylesheet" href="../style/admin_profile.css">
</head>
<body>
  <header class="header-image"></header>

  <nav class="navbar">
    <ul>
      <li><a href="../pages/a_homepage.html">Home</a></li>
      <li><a href="../pages/a_inquiries.php">View Inquiries</a></li>
      <li><a href="../pages/a_make_reservation.php">Make Reservation</a></li>
      <li><a href="../pages/a_view_report.html">View Report</a></li>
      <li><a href="#" class="active">Admin Profile</a></li>
    </ul>
  </nav>

  <section class="dashboard-container">
    <div class="admin-profile">
      <div class="profile-header">
        <div class="profile-pic-container">
          <img src="../assets/admin_picture.jpg" alt="Admin Profile Picture" class="profile-pic" id="profile-pic">
          <button class="change-pic-btn" id="change-pic-btn">📷</button>
          <input type="file" id="profile-pic-input" accept="image/*">
        </div>
        <h2 id="admin-name"><?php echo htmlspecialchars($admin_name); ?></h2>
        <p>System Administrator</p>
      </div>
      <div class="profile-info">
        <h3>Profile Information</h3>
        <p><strong>Email:</strong> <span id="admin-email"><?php echo htmlspecialchars($admin_email); ?></span></p>
        <p><strong>Phone:</strong> <span id="admin-phone"><?php echo htmlspecialchars($admin_phone); ?></span></p>
        <p><strong>Username:</strong> <span id="admin-username"><?php echo htmlspecialchars(explode('@', $admin_email)[0]); ?></span></p>
        <p><strong>Password:</strong> •••••••• <a href="#" class="change-password" id="change-password-link">Change</a></p>
      </div>
      <div class="buttons">
        <button class="edit-btn" id="edit-profile-btn">Edit Profile</button>
        <button class="logout-btn" id="logout-btn" onclick="logout()">Logout</button>
      </div>
    </div>

    <div class="admin-activity">
      <h3>Recent Activities</h3>
      <ul id="activity-list">
        <li><span>✔</span> Logged in successfully - <small><?php echo date('M d, Y H:i'); ?></small></li>
        <li><span>✔</span> System initialized - <small>Just now</small></li>
      </ul>
    </div>
  </section>

  <!-- Edit Profile Modal -->
  <div id="edit-modal" class="modal">
    <div class="modal-content">
      <span class="close" id="close-modal">&times;</span>
      <h3>Edit Profile</h3>
      <form id="edit-form">
        <div class="form-group">
          <label for="edit-name">Name:</label>
          <input type="text" id="edit-name" name="name" value="<?php echo htmlspecialchars($admin_name); ?>" required>
        </div>
        <div class="form-group">
          <label for="edit-email">Email:</label>
          <input type="email" id="edit-email" name="email" value="<?php echo htmlspecialchars($admin_email); ?>" required>
        </div>
        <div class="form-group">
          <label for="edit-phone">Phone:</label>
          <input type="text" id="edit-phone" name="phone" value="<?php echo htmlspecialchars($admin_phone); ?>" required>
        </div>
        <div class="form-group">
          <label for="edit-username">Username:</label>
          <input type="text" id="edit-username" name="username" value="<?php echo htmlspecialchars(explode('@', $admin_email)[0]); ?>" required>
        </div>
        <div class="modal-buttons">
          <button type="button" class="cancel-btn" id="cancel-edit">Cancel</button>
          <button type="submit" class="save-btn">Save Changes</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Change Password Modal -->
  <div id="password-modal" class="modal">
    <div class="modal-content">
      <span class="close" id="close-password-modal">&times;</span>
      <h3>Change Password</h3>
      <form id="password-form">
        <div class="form-group">
          <label for="current-password">Current Password:</label>
          <input type="password" id="current-password" name="current-password" required>
        </div>
        <div class="form-group">
          <label for="new-password">New Password:</label>
          <input type="password" id="new-password" name="new-password" required>
        </div>
        <div class="form-group">
          <label for="confirm-password">Confirm New Password:</label>
          <input type="password" id="confirm-password" name="confirm-password" required>
        </div>
        <div class="modal-buttons">
          <button type="button" class="cancel-btn" id="cancel-password">Cancel</button>
          <button type="submit" class="save-btn">Update Password</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Success Modal -->
  <div id="success-modal" class="success-modal">
    <div class="success-modal-content">
      <div class="success-icon">✓</div>
      <div class="success-title">Success!</div>
      <div class="success-message" id="success-message-text">Profile updated successfully!</div>
      <button class="success-ok-btn" id="success-ok-btn">OK</button>
    </div>
  </div>

  <script src="../script/admin_profile.js"></script>
  <script>
    function logout() {
      if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'logout.php';
      }
    }
  </script>
</body>
</html>