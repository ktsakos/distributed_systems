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

.myDiv { 
  text-align: center;
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

  <div class="myDiv">

    <br>
    <h3><b> You are not allowed to enter this page! You are not an Administrator. </b></h3>
    <br>
    <img src="imgs/cantenter.png" alt="error" width="150" height="150">
    <br><br><br>
    <div>
    <?php echo "<a href='welcome.php'><b> Go back to Home Page </b> </a>"; ?>
    </div>
    <br>
    <div>
    <?php echo "<a href='logout.php'><b> Log out </b> </a>"; ?>
    </div>

  </div>
  
</body>
</html>
