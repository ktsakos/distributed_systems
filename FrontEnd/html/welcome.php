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

.menu {
  padding: 10px;
  transition: transform .2s;
  width: 20px;
  height: 20px;
}

.menu:hover {
  -ms-transform: scale(1.5); /* IE 9 */
  -webkit-transform: scale(1.5); /* Safari 3-8 */
  transform: scale(1.5); 
}

#element1 {display:inline-block;margin-right:10px; width:180px;} 
#element2 {display:inline-block; width:180px; } 
#element3 {display:inline-block; width:180px; } 
#element4 {display:inline-block; margin-right: 10px; margin-top:100px; width:180px; } 
#element5 {display:inline-block; margin-right: 10px; margin-top:100px; width:100px; } 


.w3-lobster {
  font-family: "Lobster", serif;
}

#shiva
{
  width: 100px;
   height: 100px;
   background: red;
   -moz-border-radius: 50px;
   -webkit-border-radius: 50px;
   border-radius: 50px;
  float:left;
  margin:5px;
}
.count
{
  line-height: 100px;
  color:white;
  margin-left:30px;
  font-size:25px;
}
#talkbubble {
   width: 120px;
   height: 80px;
   background: red;
   position: relative;
   -moz-border-radius:    10px;
   -webkit-border-radius: 10px;
   border-radius:         10px;
  float:left;
  margin:20px;
}
#talkbubble:before {
   content:"";
   position: absolute;
   right: 100%;
   top: 26px;
   width: 0;
   height: 0;
   border-top: 13px solid transparent;
   border-right: 26px solid red;
   border-bottom: 13px solid transparent;
}

.linker
{
  font-size : 20px;
  font-color: black;
}

#value {
    font-size: 30px;
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
   <div class="w3-container w3-lobster">
      <p class="w3-xxxlarge">Board Games</p>
   </div>

   <div id="element1">   
      <div class="menu">
         <?php echo "<span title='Join a new tournament'><a href='tournaments.php'> <b style='color:black;'> </b> <img src='imgs/trophy.png' alt='trophy' width='100' height='100'> </a> </span> "; ?>
      </div>
   </div>
   
   <div id="element2">   
      <div class="menu">
         <?php echo "<span title='Next Tournament Matches'><a href='next_matches.php'> <b style='color:black;'> </b> <img src='imgs/battle.png' alt='trophy' width='100' height='100'> </a> </span> "; ?>
      </div> 
   </div> 

   <div id="element3">   
      <div class="menu">
         <?php echo "<span title='Practice Chess Game'><a href='chess.php'> <b style='color:black;'> </b> <img src='imgs/chess.png' alt='chess' width='100' height='100'> </a> </span> "; ?>
      </div> 
   </div> 

   <div id="element3">   
      <div class="menu">
         <?php echo "<span title='Practice Tic-tac-toe Game'><a href='tictactoe.php'> <b style='color:black;'> </b> <img src='imgs/tictactoe.png' alt='chess' width='100' height='100'> </a> </span> "; ?>
      </div> 
   </div> 

   <div id="element3">   
      <div class="menu">
         <?php echo '<span title="Create New Tournament"> <a href="create_tournament.php"> <b style="color:black;"> </b> <img src="imgs/tournament.png" alt="chess" width="100" height="100"> </a> </span>'; ?>
      </div> 
   </div> 

   <div id="element3">   
      <div class="menu">
         <?php echo '<span title="Tournament Results"> <a href="all_tourn_plays.php"> <b style="color:black;"> </b> <img src="imgs/results.png" alt="chess" width="100" height="100"> </a> </span>'; ?>
      </div> 
   </div> 

   <div id="element4">   
      <div class="menu">
         <?php echo '<span title="Total Ranking"> <a href="total_ranking.php"> <b style="color:black;"> </b> <img src="imgs/ranking.png" alt="chess" width="120" height="120"> </a> </span>'; ?>
      </div> 
   </div> 

   <div id="element4">   
      <div class="menu">
         <?php echo '<span title="Practice Plays Record"> <a href="all_practice_plays.php"> <b style="color:black;"> </b> <img src="imgs/historic.png" alt="chess" width="100" height="100"> </a> </span>'; ?>
      </div> 
   </div> 

   <div id="element4">   
      <div class="menu">
         <?php echo '<span title="Assign Roles"> <a href="http://172.16.1.4:5000/assign?token='.$token.'""> <b style="color:black;"> </b> <img src="imgs/roles.png" alt="chess" width="100" height="100"> </a> </span>'; ?>
      </div> 
   </div> 

   <div id="element4">   
      <div class="menu">
         <?php echo '<span title="Administration Panel (Admin Only)"> <a href="listoftournaments.php"> <b style="color:black;"> </b> <img src="imgs/admin.png" alt="chess" width="110" height="110"> </a> </span>'; ?>
      </div> 
   </div> 

   <br>

   <div id="element4">  

      <?php echo "<h5> Welcome, $username !! </h5>"; ?>
      <h5> Your total score is: <?php echo $score; ?></h5> 
      <br>
      <div style="margin-right: :10px;">
      <?php echo "<a href='logout.php'>Log out</a>"; ?>
      </div>

   </div> 

   
  
</body>
</html>
