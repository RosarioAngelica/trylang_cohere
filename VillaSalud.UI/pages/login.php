<?php
session_start();
include 'db_connect.php';

// Function to generate unique log ID
function generateLogId() {
    return uniqid('LOG_', true);
}

// Function to log activity
function logActivity($conn, $admin_id, $activity_type, $description = null, $inquiry_id = null, $reserve_id = null) {
    $log_id = generateLogId();
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? null;
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? null;
    
    $stmt = $conn->prepare("INSERT INTO activity_log (log_id, admin_id, activity_type, description, inquiry_id, reserve_id, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sissiiis", $log_id, $admin_id, $activity_type, $description, $inquiry_id, $reserve_id, $ip_address, $user_agent);
    
    return $stmt->execute();
}

// Handle login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    
    if (!empty($email) && !empty($password)) {
        // Query to get admin details from your admin table
        $stmt = $conn->prepare("SELECT admin_id, f_name, l_name, email, password FROM admin WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $admin = $result->fetch_assoc();
            
            // Verify password
            if (password_verify($password, $admin['password'])) {
                // Create full name from f_name and l_name
                $admin_full_name = $admin['f_name'] . ' ' . $admin['l_name'];
                
                // Set session variables
                $_SESSION['admin_id'] = $admin['admin_id'];
                $_SESSION['admin_name'] = $admin_full_name;
                $_SESSION['admin_email'] = $admin['email'];
                $_SESSION['login_time'] = time();
                
                // Log successful login
                logActivity($conn, $admin['admin_id'], 'login', "Admin '{$admin_full_name}' logged in successfully");
                
                // Redirect to dashboard
                header("Location: a_homepage.html");
                exit;
            } else {
                $error_message = "Invalid email or password.";
            }
        } else {
            $error_message = "Invalid email or password.";
        }
        $stmt->close();
    } else {
        $error_message = "Please fill in all fields.";
    }
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Villa Salud Catering</title>
    <link rel="stylesheet" href="../style/login.css">
    <script src="../script/login.js" defer></script>
</head>

<body>
    <div class="container">
        <div class="left-section">
            <h1>Hello, Admin! Welcome to Villa Salud System</h1>
            <p>Your Event, Your Way - Log In to Start!</p>
            <div class="login-box">
                <h2>Log In</h2>
                
                <?php if (isset($error_message)): ?>
                    <div class="error-message" style="color: #dc3545; background: #f8d7da; border: 1px solid #f5c6cb; padding: 10px; margin-bottom: 15px; border-radius: 4px;">
                        <?php echo htmlspecialchars($error_message); ?>
                    </div>
                <?php endif; ?>
                
                <form id="login-form" action="login.php" method="POST">
                    <label>Email Address:</label>
                    <input type="email" name="email" required>

                    <label>Password:</label>
                    <input type="password" id="password" 
                        name="password" required>

                    <div class="checkbox-container">
                        <input type="checkbox" id="show-password">
                        <label for="show-password">Show Password</label>
                    </div>
                    <button type="submit">Log In</button>
                </form>
                <p class="login-link">
                    Haven't signed up? <a href="../pages/signup.php">Register here!</a>
                </p>
            </div>
        </div>
        <div class="right-section"></div>
    </div>
</body>
</html>