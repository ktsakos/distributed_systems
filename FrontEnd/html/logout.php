<?php 
include 'app_logic.php';
//$token = $_SESSION['token']; 
$username = $_SESSION['username']; 

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "http://172.16.1.4:5000/logout",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS =>'{ "username": "'.$username.'" }',
  CURLOPT_HTTPHEADER => array(
    "Content-Type: application/json",
    "Cookie: session=eyJzY29yZSI6MCwidGltZSI6eyIgZCI6IldlZCwgMTMgTWF5IDIwMjAgMTA6Mjc6NTkgR01UIn19.XrvLrw.L-2Wy8MtEhqDXAfFhl-jLfDpiXY"
  ),
));

$response = curl_exec($curl);
curl_close($curl);

$json = json_decode($response, TRUE); 
$resp = $json['response'];

if ($resp = "logged_out")
{
  //$_SESSION['token'] = ''; 
  $_SESSION['flag'] = 'logged_out'; 
  header('Location: index.php'); 
}
else 
{
   echo "Something went wrong. Try again please.";
}  

?>
