<?php
include 'db_connect.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (
        !empty($_POST['email']) && !empty($_POST['f_name'])
        && !empty($_POST['l_name']) && !empty($_POST['phone'])
        && !empty($_POST['password']) && !empty($_POST['confirm_password'])
    ) {

        if ($_POST['password'] !== $_POST['confirm_password']) {
            echo "<script>alert('Passwords do not match. Please try again.'); window.history.back();</script>";
            exit;
        }

        // Server-side password validation
        $password = $_POST['password'];
        if (
            strlen($password) < 8 ||
            !preg_match('/[A-Z]/', $password) ||
            !preg_match('/[a-z]/', $password) ||
            !preg_match('/[0-9]/', $password) ||
            !preg_match('/[!@#$%^&*(),.?\":{}|<>]/', $password)
        ) {
            echo "<script>alert('Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.'); window.history.back();</script>";
            exit;
        }

        // Server-side phone number validation (must be exactly 11 digits)
        $phone = $_POST['phone'];
        if (!preg_match('/^[0-9]{11}$/', $phone)) {
            echo "<script>alert('Phone number must be exactly 11 digits and contain only numbers.'); window.history.back();</script>";
            exit;
        }

        $email = $conn->real_escape_string($_POST['email']);
        $f_name = $conn->real_escape_string($_POST['f_name']);
        $l_name = $conn->real_escape_string($_POST['l_name']);
        $phone = $conn->real_escape_string($_POST['phone']);
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO admin (email, f_name, l_name, phone, password) 
                VALUES ('$email', '$f_name', '$l_name', '$phone', '$hashed_password')";

        if ($conn->query($sql) === TRUE) {
            echo "<script>alert('Signup successful!'); 
                    window.location.href='login.php';</script>";
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
    <script src="../script/signup.js" defer></script>
</head>

<body>
    <div class="container">
        <div class="left-section">
            <h1>Welcome to Villa Salud Catering System</h1>
            <p>Enter your personal details to complete your reservation and access all system features.</p>
            <div class="signup-box">
                <h2>Create Account!</h2>

                <form action="signup.php" method="POST" id="signupForm">
                    <label>Email Address:</label>
                    <input type="email" name="email" required><br>

                    <label>First Name:</label>
                    <input type="text" name="f_name" required><br>

                    <label>Last Name:</label>
                    <input type="text" name="l_name" required><br>

                    <label>Contact Number:</label>
                    <input type="text" id="phone" name="phone" required><br>

                    <label>Password:</label>
                    <input type="password" id="password" name="password" required><br>

                    <label>Confirm Password:</label>
                    <input type="password" id="confirm_password" name="confirm_password" required><br>

                    <button type="submit">Sign Up</button>
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