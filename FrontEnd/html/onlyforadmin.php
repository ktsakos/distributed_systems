<?php 
include 'app_logic.php'; 
session_start(); 
$username = $_SESSION['username']; 
$score = $_SESSION['score'];
$flag = $_SESSION['flag'];
$token = $_SESSION["token"]; 
?>

<!DOCTYPE html>
<html>
<style>

.w3-lobster {
  font-family: "Lobster", serif;
}

</style>
 <head>
  <title>Board Games</title>

  <meta charset="utf-8"> 

  <meta name="viewport" content="width=device-width, initial-scale=1">
   <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
   <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lobster">

 </head>
<body>

   <p style="margin-left:10px;"> You are not allowed to enter this page (you are not an Administrator or Official). </p>

   <br><br>

   <div style="margin-left:10px;">
   <?php echo "<a href='welcome.php'>Go back to Home Page</a>"; ?>
   </div>

   <br><br>
   <div style="margin-left:10px;">
   <?php echo "<a href='logout.php'>Log out</a>"; ?>
   </div>


  
</body>
</html>
