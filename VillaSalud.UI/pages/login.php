<?php
session_start();
include 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST["email"]);
    $password = $_POST["password"];

    if (empty($email) || empty($password)) {
        echo "<script>alert('Email and password are required!'); 
            window.history.back();</script>";
        exit;
    }

    $stmt = $conn->prepare("SELECT * FROM admin WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $admin = $result->fetch_assoc();

        if (password_verify($password, $admin['password'])) {
            $_SESSION["admin_id"] = $admin["id"];
            $_SESSION["admin_name"] = $admin["f_name"] . " ". $admin["l_name"];
            $_SESSION["phone"] = $admin["phone"];

            echo "<script>alert('Login successful!'); 
                window.location.href='a_homepage.html';</script>";
        } else {
            echo "<script>alert('Incorrect password!'); 
                window.history.back();</script>";
        }
    } else {
        echo "<script>alert('No account found with this email!'); 
            window.history.back();</script>";
    }

    $stmt->close();
    $conn->close();
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

                    <?php
                    session_start();
                    if (isset($_SESSION['error'])) {
                        echo "<p style='color:red;'>" 
                            .$_SESSION['error'] . "</p>";
                        unset($_SESSION['error']); 
                    }
                    ?>

                    <button type="submit">Log In</button>
                </form>
            </div>
        </div>
        <div class="right-section"></div>
    </div>
</body>
</html>