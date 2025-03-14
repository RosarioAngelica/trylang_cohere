<?php
$host = "localhost";  
$user = "root";       
$pass = "marcgasta1902.";  //change into the password na meron ka     
$dbname = "Salud"; 

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
