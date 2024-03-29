<?php 
include 'app_logic.php';
$token = $_SESSION['token']; 
?>

<!DOCTYPE html>
<html>
 <head>
  <title>Tic Tac Toe</title>
  <link rel="shortcut icon" href="imgs/tictac.png">
  <meta charset="utf-8"> 
  <script src="//cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js" integrity="sha256-yr4fRk/GU1ehYJPAs8P4JlTgu0Hdsp4ZKrx8bDEDC3I=" crossorigin="anonymous"></script>
  <link rel="stylesheet" type="text/css" href="css/tictactoe.css">
  
 </head>
<body>
  <p id="username"><?php echo $username;?></p>
  <p>You are playing against:</p>
  <p id="opponent"></p>
  <?php
        if (isset($_GET['id'])){
          echo "<p>Game For Tournament:".$_GET['tourname']."</p>";
          echo "<p id=\"tournid\">".$_GET['tournid']."</p>";
          echo "<p id=\"round\">".$_GET['round']."</p>";
          echo "<p id=\"playid\">".$_GET['id']."</p>";
          echo "<p style=\"display:none;\" id=\"home\">".$_GET['home']."</p>";
          echo "<p style=\"display:none;\" id=\"away\">".$_GET['away']."</p>";
        }
      ?>
  <h1>Tic Tac Toe</h1>
  <table>
    <tr>
      <td id="block00" onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this.id)"></td>
      <td id="block01" onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this.id)" class="vert"></td>
      <td id="block02" onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this.id)"></td>
    </tr>
    <tr>
      <td id="block10" onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this.id)" class="hori"></td>
      <td id="block11" onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this.id)" class="vert hori"></td>
      <td id="block12" onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this.id)" class="hori"></td>
    </tr>
    <tr>
      <td id="block20" onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this.id)"></td>
      <td id="block21" onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this.id)" class="vert"></td>
      <td id="block22" onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this.id)"></td>
    </tr>
  </table>
  <script type="text/javascript" src="js/tictoe.js"></script>   

</body>
</html>