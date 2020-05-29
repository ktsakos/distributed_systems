<?php

$curl = curl_init();



curl_setopt_array($curl, array(
  CURLOPT_URL => "172.16.1.6:5000/get_tourn_data",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "GET",
  CURLOPT_POSTFIELDS =>"{\"playID\": \"".$_GET['id']."\"}\r\n\r\n",
  CURLOPT_HTTPHEADER => array(
    "Content-Type: application/json"
  ),
));

$response = curl_exec($curl);

curl_close($curl);
$myArray = json_decode($response, true);

if($myArray[0][5]=="chess"){
    $url="chess.php?id=".$_GET['id']."&tourname=".$myArray[0][6]."&tournid=".$myArray[0][0]."&round=".$myArray[0][4]."&home=".$myArray[0][1]."&away=".$myArray[0][2];
    header('Location:'.$url);
}
else if($myArray[0][5]=="tictactoe"){
    $url="tictactoe.php?id=".$_GET['id']."&tourname=".$myArray[0][6]."&tournid=".$myArray[0][0]."&round=".$myArray[0][4]."&home=".$myArray[0][1]."&away=".$myArray[0][2];
    header('Location:'.$url);
}


?>