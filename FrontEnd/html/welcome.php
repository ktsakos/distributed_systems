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
   <?php echo "<a href='tictactoe.php'>Play Tic-Tac-Toe</a>"; ?>
   </div>
   <div style="margin-left:10px;">
   <?php echo "<a href='chess.php'>Play Chess</a>"; ?>
   </div>
   <div style="margin-left:10px;">
   <?php echo "<a href='tournaments.php'>Join a tournament now! </a>"; ?>
   </div>

   <div style="margin-left:10px;">
   <?php echo '<a href="http://147.27.60.48:5000/assign?token='.$token.'"">Assign Roles</a>'; ?>
   </div>
   <br>

   <?php echo "<h4 style='margin-left:10px;'> Welcome, $username !! </h4>"; ?>
   <?php echo "<h4 style='margin-left:10px;'> Your total score is: $score </h4>"; ?>
   <?php //echo "<h4 style='margin-left:10px;'> Everything is: $flag"; ?>

   <br><br>
   <div style="margin-left:10px;">
   <?php echo "<a href='logout.php'>Log out</a>"; ?>
   </div>




  
</body>
</html>
