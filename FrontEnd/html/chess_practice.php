<?php 
/*
include 'app_logic.php'; 
session_start(); 
$username = $_SESSION['username']; 
$score = $_SESSION['score'];
$flag = $_SESSION['flag'];
$token = $_SESSION["token"]; */
$username = 'tsakostas7'; 

/*
// if user submits the form
if (isset($_POST["submit"])) {  



}
*/

?>

<!DOCTYPE html>
<html>
<head>
<style>
.button {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 12px 28px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;
}

.button3 {
  background-color: white; 
  color: black; 
  border: 2px solid #f44336;
}

.button3:hover {
  background-color: #f44336;
  color: white;
}

</style>
</head>

<title>Board Games</title>

<meta charset="utf-8"> 

  
</head>
<body>

	<h1>Board Games</h1>
	<div style="margin-left:10px;">
	<?php echo "<a href='join_tournament.php'> Take part in this tournament! </a>"; ?>
	</div>

   	<h4>Ready to play a practice chess game?</h4>
	<button name="submit" class="button button3">Ask for an opponent</button>

	<div id="demo"></div> 

  
</body>
</html>

