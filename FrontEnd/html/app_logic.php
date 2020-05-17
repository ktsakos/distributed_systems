<?php 

session_start(); 

if(isset($_SESSION["token"])) {  // if we have a token in session 

    // if the token in session is empty (the user had logged out before)
    /*
    if(($_SESSION["token"]=='')) {
        header("Location: mustlogin.html"); 
    }*/ 
    
    $token = $_SESSION["token"]; 

    // we ask for authentication
    $curl = curl_init();

    curl_setopt_array($curl, array(
      CURLOPT_URL => "http://172.16.1.4:5000/checktoken",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => "",
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => "GET",
      CURLOPT_POSTFIELDS =>'{ "token": "'.$token.'" }',
      CURLOPT_HTTPHEADER => array(
        "Content-Type: application/json",
        "Cookie: session=eyJmbGFnIjoidHJ1ZSJ9.Xr6fxw.srX2FBiQ9sLhedMxLVSz5uXM6y8"
      ),
    ));

    $response = curl_exec($curl);

    curl_close($curl);

    $username = $_SESSION['username']; 

    $json = json_decode($response, TRUE); 
    $resp = $json['response'];

    //echo $resp;  

    if($resp == "false")
    {
        header('Location: login_again.html'); 
    } 
    else if ($resp == "OK")
    {
        $_SESSION['flag'] = 'OK';

        // get user's score   
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
          CURLOPT_POSTFIELDS =>'{ "username": "'.$username.'" }',
          CURLOPT_HTTPHEADER => array(
            "Content-Type: application/json"
          ),
        ));

        $response = curl_exec($curl);
        curl_close($curl); 

        $json = json_decode($response, TRUE); 
        $score = $json['score'];

        //echo $score;
        $_SESSION['score'] = $score; 

        if($score != NULL)
        {
            $_SESSION['score'] = $score; 
        }
 
    }
    else
    {
        header('Location: login_again.html'); 
    }   

} 
else {  // if we don't have a token in session  
    header("Location: mustlogin.html"); 
} 


?>
