<?php 
include 'app_logic.php'; 
session_start(); 
$username = $_SESSION['username']; 
$score = $_SESSION['score'];
$token = $_SESSION["token"]; 

?>

<!DOCTYPE html>
<html>
<head>
<style>

#element {display:inline-block;margin-right:10px; width:180px;} 

table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 50%;
}

td, th {
  border: 2px solid #000000;
  text-align: left;
  padding: 5px;
}

tr:nth-child(even) {
  background-color: #f7c060;
}

</style>

<script>
function showUser(str) {
  if (str=="") {
    document.getElementById("txtHint").innerHTML="";
    return;
  }
  var xmlhttp=new XMLHttpRequest();
  xmlhttp.onreadystatechange=function() {
    if (this.readyState==4 && this.status==200) {
      document.getElementById("txtHint").innerHTML=this.responseText;
    }
  }
  xmlhttp.open("GET","get_winners_from_db.php?q="+str,true);
  xmlhttp.send();
}
</script>
</head>
<body>

<div id="element1">   
  <?php echo "<span title='Home Page'><a href='welcome.php'> <b style='color:black;'> </b> <img src='imgs/home.png' alt='trophy' width='45' height='45'> </a> </span> "; ?>
</div>

<h2> You can see the tournament champions for any game here! </h2>

<form>
<select name="users" onchange="showUser(this.value)">
<option value="">Select a game:</option>
<option value="tictactoe">Tic-tac-toe</option>
<option value="chess">Chess</option>
</select>
</form>
<br>
<div id="txtHint"><b>Tournaments winners will be listed here.</b></div>

</body>


