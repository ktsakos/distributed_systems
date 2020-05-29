<?php 
include 'app_logic.php'; 
session_start(); 
$username = $_SESSION['username']; 
$score = $_SESSION['score'];
$flag = $_SESSION['flag'];
$token = $_SESSION["token"]; 

$safekey = $_GET['safekey'];

?>

<!DOCTYPE html>
<html>
<style>

#element {display:inline-block;margin-right:10px; width:180px;} 

table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 70%;
}

td, th {
  border: 1px solid #5500de;
  text-align: left;
  padding: 4px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>

 <head>
  <title>Board Games</title>

  <meta charset="utf-8"> 

  
 </head>
<body>

  <div id="element1">   
    <?php echo "<span title='Home Page'><a href='welcome.php'> <b style='color:black;'> </b> <img src='imgs/home.png' alt='trophy' width='45' height='45'> </a> </span> "; ?>
  </div>

  <br> 

  <?php  

  echo "You have successfully joined this tournament! \n";
  echo "Your safe key is: ";
  echo $safekey;

  ?>

  <br> 

  <img src="imgs/success.png" alt="chess" width="60" height="60"> 
  
</body>
</html>
