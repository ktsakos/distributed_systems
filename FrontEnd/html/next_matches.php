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

   <h3>Your next tournament matches:</h3>

  <?php  

  $curl = curl_init();
  
  curl_setopt_array($curl, array(
    CURLOPT_URL => "http://172.16.1.6:5000/next_tourn_matches",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
    CURLOPT_POSTFIELDS =>'{ "username": "'.$username.'" }',
    CURLOPT_HTTPHEADER => array(
      "Content-Type: application/json"
    ),
  ));

  $response = curl_exec($curl);

  curl_close($curl);
  //echo $response;

  $myArray = json_decode($response, true);

  $size  = count($myArray);

  echo 
    "<table>
      <tr>
        <th>You</th>
        <th>Opponent</th>
        <th>Action</th>
      </tr>
    ";

  for ($x = 0; $x <= $size-1; $x++) {

  	$id = $myArray[$x][2]; 

    if($myArray[$x][0]==$username)
    {
      $player1 = $myArray[$x][0]; 
      $player2 = $myArray[$x][1]; 
    } 
    else 
    {
      $player2 = $myArray[$x][0]; 
      $player1 = $myArray[$x][1]; 
    } 

    echo 
    " <tr>
        <td>".$player1."</td>
        <td>".$player2."</td>
        <td><a href='play_tourn_match.php?id=$id'>Play game now</a></td>
      </tr>
    ";

  }

  echo "</table>";

      
  ?>

  <br>

  <img src="imgs/battle2.png" alt="Girl in a jacket" width="90" height="90">
  
</body>
</html>
