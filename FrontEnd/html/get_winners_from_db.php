<?php 
include 'app_logic.php'; 
session_start(); 
$username = $_SESSION['username']; 
$token = $_SESSION["token"]; 
$gametype = $_GET['q'];

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "http://172.16.1.6:5000/get_all_finals",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "GET",
  CURLOPT_POSTFIELDS =>'{ "gametype": "'.$gametype.'" }',
  CURLOPT_HTTPHEADER => array(
    "Content-Type: application/json"
  ),
));

$response = curl_exec($curl);

curl_close($curl);

$myArray = json_decode($response, true);

$size = count($myArray);

echo 
    "<table>
      <tr>
        <th>  Tourn. No  </th>
        <th>  Gametype  </th>
        <th>  Champion  </th>
      </tr>
    ";

for ($x = 0; $x <= $size-1; $x++) {

  $winner = ""; 

  $result = $myArray[$x][5]; 

  if($result == "home")
  {
    $winner = $myArray[$x][0];
  }  
  else if($result == "away")
  {
    $winner = $myArray[$x][1];
  }

  echo 
    " <tr>
        <td>  ".$myArray[$x][2]."  </td>
        <td>  ".$myArray[$x][3]."  </td>
        <td>  ".$winner."  </td>
      </tr>
    ";

}

echo "</table>";

      
?>

