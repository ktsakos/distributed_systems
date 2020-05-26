<?php 
include 'app_logic.php'; 
session_start(); 
$username = $_SESSION['username']; 
$score = $_SESSION['score'];
$flag = $_SESSION['flag'];
$token = $_SESSION["token"]; 

if($_SESSION["role"] != 'Admin')
{
  header('Location: onlyforadmin.php');
}
?>

<!DOCTYPE html>
<html>
<style>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 90%;
}

td, th {
  border: 1px solid #5500de;
  text-align: left;
  padding: 5px;
}

tr:nth-child(even) {
  background-color: #8da6b5;
}

.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
 <head>
  <title>Board Games</title>

  <meta charset="utf-8"> 

  
 </head>
<body>

  <?php echo "<h4 style='margin-right:10px;'> Signed in as: $username </h4>"; ?>
  <?php echo "<h4 style='margin-right:10px;'> Total score: $score </h4>"; ?>
  <?php //echo "<h4 style='margin-left:10px;'> Everything is: $flag"; ?>

  <p>Full list of tournaments:</p>
  <div style="margin-left:10px;">

  <?php  

  $curl = curl_init();

  curl_setopt_array($curl, array(
    CURLOPT_URL => "http://172.16.1.6:5000/viewtournaments",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
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
        <th>TournamentID</th>
        <th>Tournament name</th>
        <th>Game type</th>
        <th>Maximum number of users</th>
        <th>Joined users</th>
        <th>Safe key (password)</th>
        <th>Creator</th>
        <th>Started</th>
        <th>Actions</th>
      </tr>
    ";

  for ($x = 0; $x <= $size-1; $x++) {

    $id = $myArray[$x][5]; 

    if($myArray[$x][7] == "1")
    {
      $myArray[$x][7] = "Yes";
    }
    else
    {
      $myArray[$x][7] = "No"; 
    }

    echo 
    " <tr>
        <td>".$myArray[$x][5]."</td>
        <td>".$myArray[$x][6]."</td>
        <td>".$myArray[$x][0]."</td>
        <td>".$myArray[$x][1]."</td>
        <td>".$myArray[$x][2]."</td>
        <td>".$myArray[$x][3]."</td>
        <td>".$myArray[$x][4]."</td>
        <td>".$myArray[$x][7]."</td>
        <td> <div class='tooltip'> <a href='begin_tournament.php?id=$id'> <img src='imgs/start.png' alt='start' width='60' height='60'> </a> <span class='tooltiptext'>Start tournament</span> </div>  <div class='tooltip'> <a href='delete_tournament.php?id=$id'> <img src='imgs/delete.png' alt='start' width='60' height='60'> </a> <span class='tooltiptext'>Delete tournament</span> </div> </td>
      </tr>
    ";

  }

  echo "</table>";

      
  ?>

  <br><br>
  <div style="margin-left:10px;">
  <br>  
  <?php echo "<a href='logout.php'>Log out</a>"; ?>
  </div>


  
</body>
</html>
