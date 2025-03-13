<?php

include 'db_connect.php';

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if all form fields are filled
    if (!empty($_POST['email']) && !empty($_POST['f_name']) && !empty($_POST['l_name']) && !empty($_POST['phone']) && !empty($_POST['password'])) {

        // Get form data and sanitize
        $email = $conn->real_escape_string($_POST['email']);
        $f_name = $conn->real_escape_string($_POST['f_name']);
        $l_name = $conn->real_escape_string($_POST['l_name']);
        $phone = $conn->real_escape_string($_POST['phone']);
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT); // Hash password for security

        // Insert data into the database
        $sql = "INSERT INTO admin (email, f_name, l_name, phone, password) 
                VALUES ('$email', '$f_name', '$l_name', '$phone', '$password')";

        if ($conn->query($sql) === TRUE) {
            echo "<script>alert('Signup successful!'); window.location.href='login.php';</script>";
        } else {
            echo "<script>alert('Error: " . $conn->error . "');</script>";
        }
    } else {
        echo "<script>alert('Please fill in all fields.');</script>";
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Signup - Villa Salud Catering</title>
    <link rel="stylesheet" href="../style/signup.css" />
    <link href="../assets/background_picture.jpeg" rel="stylesheet" />
</head>

<body>
    <div class="container">
        <div class="left-section">
            <h1>Welcome to Villa Salud Catering System</h1>
            <p>
                Enter your personal details to complete your reservation and access
                all system features.
            </p>
            <div class="signup-box">
                <h2>Create Account</h2>
                <p>Sign up to get started</p>
                <form action="signup.php" method="POST">
                    <label>Email Address:</label>
                    <input type="email" name="email" required><br>

                    <label>First Name:</label>
                    <input type="text" name="f_name" required><br>

                    <label>Last Name:</label>
                    <input type="text" name="l_name" required><br>

                    <label>Contact Number:</label>
                    <input type="text" name="phone" required><br>

                    <label>Password:</label>
                    <input type="password" name="password" required><br>

                    <button type="submit">Sign In</button>
                </form>
                <p class="login-link">
                    Already have an account? <a href="../pages/login.php">Log in here!</a>
                </p>
            </div>
        </div>
        <div class="right-section"></div>
    </div>
</body>

</html>