<?php 

session_start();

// form results 
$input_username = $_POST["content"];
$input_password = $_POST["content1"];

// check credentials using Auth. Service (GET request) 
$url = "http://172.16.1.4:5000/login_auth";

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => $url,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "GET",
  CURLOPT_POSTFIELDS =>'{ "username": "'.$input_username.'", "password": "'.$input_password.'" }',
  CURLOPT_HTTPHEADER => array(
    "Content-Type: application/json",
    "Cookie: session=eyJ0aW1lIjp7IiBkIjoiV2VkLCAxMyBNYXkgMjAyMCAwOToxMDo0OSBHTVQifX0.Xru5mg.a8sRLXiBTNVJtMXKP_ZknskSoPM"
  ),
));

$response = curl_exec($curl);
curl_close($curl);

$json = json_decode($response, TRUE); 
$resp = $json['response'];

// if authentication is OK, set session variables and proceed to home page 
if ($resp == "OK")
{
  $username = $json["username"];
  $_SESSION["username"] = $username;
  $_SESSION["role"] = $json['role'];
  $token = $json['token']; // this token contains some useless characters (one "b" and two single quotes)

  // so we remove useless chars 
  $token = substr($token, 1);
  $token = str_replace("'", "", $token);

  // and we save this token as a session variable 
  $_SESSION["token"] = $token;

  $_SESSION['flag'] = ''; 
  
  header('Location: welcome.php');
} 
else
{
  header('Location: invalid.html'); 
}  


?>
