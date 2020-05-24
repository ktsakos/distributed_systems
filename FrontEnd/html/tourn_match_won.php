<?php 
/*
include 'app_logic.php'; 
session_start(); 
$username = $_SESSION['username']; 
$score = $_SESSION['score'];
$flag = $_SESSION['flag'];
$token = $_SESSION["token"]; */

$player1 = 'player1'; //username  
$player2 = 'player2';
$playID = 52; 
$round = 8; 
$tournamentID = 1;  

// send results to GameMaster service and get new opponent (or just wait)
$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "http://172.16.1.6:5000/endtournmatch",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS =>'{ "player1": "'.$player1.'", "player2": "'.$player2.'", "result": "loss", "playID": "'.$playID.'", "tournamentID": "'.$tournamentID.'", "round": "'.$round.'" }',
  CURLOPT_HTTPHEADER => array(
    "Content-Type: application/json"
  ),
));

$response = curl_exec($curl);

curl_close($curl);


$json = json_decode($response, TRUE); 
$resp = $json['response'];  // playID of the next play 
$resp2 = $json['response2']; // the player column where we must place him in the GM dB (home/away), next to the opponent  

if($resp == "No_available_players_yet") {
  echo "No available player. Please wait."; // wait....
}

// match the player with the new opponent in GameMaster service DB   
$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "http://172.16.1.6:5000/matchplayers",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS =>'{ "player": "'.$player2.'", "playID": "'.$resp.'", "tournamentID": "'.$tournamentID.'", "place": "'.$resp2.'" }',
  CURLOPT_HTTPHEADER => array(
    "Content-Type: application/json"
  ),
));

$response = curl_exec($curl);

curl_close($curl);

$json = json_decode($response, TRUE); 
$resp = $json['response'];

echo $resp; 


?>