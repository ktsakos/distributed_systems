<?php  
include 'app_logic.php'; 
session_start(); 
$username = $_SESSION['username']; 
$token = $_SESSION["token"];  
?>

<!DOCTYPE html>
<html>
<style>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 50%;
}

td, th {
  border: 1px solid #4d79ff;
  text-align: left;
  padding: 5px;
}

tr:nth-child(even) {
  background-color: #e6f9ff;
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

  <h2><u>Total ranking (Standing)</u></h2>
  <div style="margin-left:10px;">

  <?php  

  echo 
    "<table>
      <tr>
        <th>Player</th>
        <th>Total Score</th>
      </tr>
    ";

  $curl = curl_init();

  curl_setopt_array($curl, array(
    CURLOPT_URL => "http://172.16.1.6:5000/get_all_players",
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

  $myArray = json_decode($response, true);

  $size  = count($myArray);

  for ($x = 0; $x <= $size-1; $x++) {

    //echo $myArray[$x][0]; 

    $player = $myArray[$x][0]; 

    $curl = curl_init();

    curl_setopt_array($curl, array(
      CURLOPT_URL => "http://172.16.1.6:5000/getscore",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => "",
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => "GET",
      CURLOPT_POSTFIELDS =>'{ "username": "'.$player.'" }',
      CURLOPT_HTTPHEADER => array(
        "Content-Type: application/json"
      ),
    ));

    $resp = curl_exec($curl);
    curl_close($curl);

    $json = json_decode($resp, TRUE); 
    $total_score = $json['score'];

    $scores[$player] = $total_score;

    arsort($scores);

  }
  
  foreach($scores as $x => $x_value) {
    $player = $x; 
    if($x == $username)
    {
      $x = "<b style='color:blue'><i>".$x."</i></b>";
    }
    echo 
    " <tr>
        <td>".$x."</td>
        <td>".$x_value."</td>
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
