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

   <h2> <b> Choose a tournament to join! </b> </h2>

  <?php  

  //get all available tournaments where a user can join 

  $curl = curl_init();

  curl_setopt_array($curl, array(
    CURLOPT_URL => "http://172.16.1.6:5000/get_available_tournaments",
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
        <th>Tournament name</th>
        <th>Game type</th>
        <th>Joined players</th>
        <th>Maximum number of players</p>
        <th>Creator</th>
        <th>Action</th>
      </tr>
    ";

  for ($x = 0; $x <= $size-1; $x++) {

    $id = $myArray[$x][5]; // tournamentID 

    $action = '<a href="join_tournament.php?id='.$id.'">Join Tournament</a>';

    // check if this user has alreasy joined any of the retrieved tournaments 

    $curl1 = curl_init();

    curl_setopt_array($curl1, array(
      CURLOPT_URL => "http://172.16.1.6:5000/get_joined_players",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => "",
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => "GET",
      CURLOPT_POSTFIELDS =>'{ "tournamentID": "'.$id.'", "player": "'.$username.'" }',
      CURLOPT_HTTPHEADER => array(
        "Content-Type: application/json"
      ),
    ));

    $resp1 = curl_exec($curl1);

    curl_close($curl1);

    $json = json_decode($resp1, TRUE); 
    $response1 = $json['response'];

    if ($response1 == "yes")
    {
      $action = "Already joined";
    } 

    echo 
    " <tr>
        <td>".$myArray[$x][6]."</td>
        <td>".$myArray[$x][0]."</td>
        <td>".$myArray[$x][2]."</td>
        <td>".$myArray[$x][1]."</td>
        <td>".$myArray[$x][4]."</td>
        <td>".$action."</td>
      </tr>
    ";
   
  }

  echo "</table>";

  ?>
 

  
</body>
</html>
