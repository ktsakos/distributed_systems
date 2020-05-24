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

   <h1>Board Games</h1>
   <p>Choose a game:</p>
   <div style="margin-left:10px;">
   <?php echo "<a href='join_tournament.php'> Take part in this tournament! </a>"; ?>
   </div>
 

  
</body>
</html>
