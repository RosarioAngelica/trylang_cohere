<?php
// Include database connection
include('db_connect.php');

// Initialize variables for form fields
$name = $email = $message = "";
$nameErr = $emailErr = $messageErr = "";
$successMessage = "";

// Process form data when form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validate name
    if (empty($_POST["name"])) {
        $nameErr = "Name is required";
    } else {
        $name = test_input($_POST["name"]);
    }
    
    // Validate email
    if (empty($_POST["email"])) {
        $emailErr = "Email is required";
    } else {
        $email = test_input($_POST["email"]);
        // Check if email address is well-formed
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $emailErr = "Invalid email format";
        }
    }
    
    // Validate message
    if (empty($_POST["message"])) {
        $messageErr = "Message is required";
    } else {
        $message = test_input($_POST["message"]);
    }
    
    // If no errors, insert data into database
    if (empty($nameErr) && empty($emailErr) && empty($messageErr)) {
        // Prepare SQL statement to prevent SQL injection
        $stmt = $conn->prepare("INSERT INTO feedback (name, feed_email, message) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $name, $email, $message);
        
        // Execute the statement
        if ($stmt->execute()) {
            $successMessage = "Thank you for your feedback!";
            // Clear form fields after successful submission
            $name = $email = $message = "";
        } else {
            echo "Error: " . $stmt->error;
        }
        
        // Close statement
        $stmt->close();
    }
}

// Function to sanitize input data
function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contact Us - Villa Salud Catering</title>
    <link rel="stylesheet" href="../style/feedback.css" />
    <style>
      .error {color: #FF0000;}
      .success {color: #008000; font-weight: bold;}
    </style>
  </head>
  <body>
    <header class="header-image"></header>

    <nav class="navbar">
      <ul>
        <li><a href="../pages/p_homepage.html">Home</a></li>
        <li><a href="../pages/p_make_reservation.php">Make Reservation</a></li>
        <li><a href="../pages/p_view_reservation.html">View Reservation</a></li>
        <li><a href="../pages/payment_order.html" >Payment Order</a></li>
        <li><a href="../pages/faqs.html">FAQs</a></li>
        <li><a href="#" class="active">Feedback</a></li>
      </ul>
    </nav>

    <div class="container">
      <div class="left-section">
        <h1>We value your time with us!</h1>
        <p>Could you share your thoughts with us?</p>

        <?php if (!empty($successMessage)): ?>
          <div class="success"><?php echo $successMessage; ?></div>
        <?php endif; ?>

        <div class="contact-box">
          <h2>Send us a message</h2>
          <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Your Name" value="<?php echo $name; ?>" />
            <span class="error"><?php echo $nameErr; ?></span>

            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Your Email"
              value="<?php echo $email; ?>"
            />
            <span class="error"><?php echo $emailErr; ?></span>

            <label for="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              placeholder="Your Message"
            ><?php echo $message; ?></textarea>
            <span class="error"><?php echo $messageErr; ?></span>

            <button type="submit">Send Message</button>
          </form>
        </div>

        <div class="contact-info">
          <h3>Our Location</h3>
          <p>Villa Salud Catering, Taguig City, Philippines</p>
          <p>Email: example@email.com</p>
          <p>Phone: 123-456-7890</p>
        </div>
      </div>

      <div class="right-section">
        <iframe
          src="https://maps.google.com/maps?q=Villa%20Salud%20Taguig&output=embed"
          frameborder="0"
          allowfullscreen
        >
        </iframe>
      </div>
    </div>
  </body>
</html>