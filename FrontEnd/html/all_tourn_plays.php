<?php 
include 'app_logic.php'; 
session_start(); 
$username = $_SESSION['username']; 
//$score = $_SESSION['score'];
$token = $_SESSION["token"]; 
?>

<!DOCTYPE html>
<html>
<style>

#element {display:inline-block;margin-right:10px; width:180px;} 

table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 90%;
}

td, th {
  border: 1px solid #000000;
  text-align: left;
  padding: 5px;
}

tr:nth-child(even) {
  background-color: #b9c9c2;
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

  <div id="element1">   
    <?php echo "<span title='Home Page'><a href='welcome.php'> <b style='color:black;'> </b> <img src='imgs/home.png' alt='trophy' width='45' height='45'> </a> </span> "; ?>
  </div>

  <h2><u>All tournament results</u></h2>
  <div style="margin-left:10px;">

  <?php  

  $curl = curl_init();

  curl_setopt_array($curl, array(
    CURLOPT_URL => "http://172.16.1.6:5000/get_tournament_plays",
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
        <th>Tourn. No</th>
        <th>Tournament name</th>
        <th>Player1</th>
        <th>Player2</th>
        <th>Winner/Tie</th>
        <th>Round</th>
        <th>Gametype</th>
        <th>Player1 score</th>
        <th>Player2 score</th>
      </tr>
    ";

  for ($x = 0; $x <= $size-1; $x++) {

    $id = $myArray[$x][0]; 

    if($myArray[$x][3] == "home")
    {
      $result = $myArray[$x][1];
      $pl1score = 3;
      $pl2score = 0;
      if($myArray[$x][4] == "2")
      {
        $pl1score = "23 (CHAMPION) <img src='imgs/trophy.png' alt='trophy' width='100' height='100'>";
      }
    }
    else if($myArray[$x][3] == "away")
    {
      $result = $myArray[$x][2]; 
      $pl1score = 0;
      $pl2score = 3;
      if($myArray[$x][4] == "2")
      {
        $pl2score = "23 (CHAMPION) <img src='imgs/trophy.png' alt='trophy' width='100' height='100'>";
      }
    } 
    else 
    {
      $result = "<b><i>Tie</i></b>";
      $pl1score = 1;
      $pl2score = 1;
    }

    if($myArray[$x][4] == "4")
    {
      $round = "Semifinals";
    }
    else if($myArray[$x][4] == "2")
    {
      $round = "<b><i>Final</i></b>";
    } 
    else 
    {
      $i = $myArray[$x][4];
      $round = "Phase of ".$i."";
    }

    echo 
    " <tr>
        <td>".$myArray[$x][0]."</td>
        <td>".$myArray[$x][6]."</td>
        <td>".$myArray[$x][1]."</td>
        <td>".$myArray[$x][2]."</td>
        <td>".$result."</td>
        <td>".$round."</td>
        <td>".$myArray[$x][5]."</td>
        <td>".$pl1score."</td>
        <td>".$pl2score."</td>
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
