<?php 
include 'app_logic.php'; 
session_start(); 
$username = $_SESSION['username']; 
$score = $_SESSION['score'];
$flag = $_SESSION['flag'];
$token = $_SESSION["token"]; 

//$username = 'iskis'; 
$tournamentID = 2;

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "http://172.16.1.6:5000/entertournament",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS =>'{ "username": "'.$username.'", "tournamentID": "'.$tournamentID.'" }',
  CURLOPT_HTTPHEADER => array(
    "Content-Type: application/json"
  ),
));

$response = curl_exec($curl);
curl_close($curl);

$json = json_decode($response, TRUE); 
$resp = $json['response'];
$safekey = $json['safekey'];

if ($resp == "OK")
{
   echo "You have successfully joined this tournament! \n";
   echo "Your safe key is: ";
   echo $safekey;
}




?>

