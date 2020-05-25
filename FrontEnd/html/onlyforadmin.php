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
 <head>
  <title>Board Games</title>

  <meta charset="utf-8"> 

  
 </head>
<body>

   <p> You are not allowed to enter this page (you are not an Administrator). Sorry </p>

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
