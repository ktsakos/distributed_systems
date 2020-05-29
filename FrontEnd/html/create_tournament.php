<?php 

session_start();

$username = $_SESSION['username']; // name of user 

if($_SESSION["role"] != "Admin" && $_SESSION["role"] != "Official")
{
  header('Location: onlyforadmin.php');
}

// if user submits the tournament form
if (isset($_POST["submit"])) {  

  // form data 
  $maxNumOfUsers= $_POST["maxNumOfUsers"]; // maxNumOfUsers
  $gameType = $_POST["gameType"]; // gameType
  $password = $_POST["password"];  // password
  $tournamName = $_POST["tournamName"]; // tournamName

  // 172.16.1.6:5000

  $curl = curl_init();

  curl_setopt_array($curl, array(
    CURLOPT_URL => "http://172.16.1.6:5000/createtournament",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS =>'{ "maxNumOfUsers": "'.$maxNumOfUsers.'", "gameType": "'.$gameType.'", "password": "'.$password.'", "creator": "'.$username.'", "tournamName": "'.$tournamName.'" }',
    CURLOPT_HTTPHEADER => array(
      "Content-Type: application/json"
    ),
  ));

  $response = curl_exec($curl);
  curl_close($curl);   

  // we need the username from the form 
  $username = $content; 
  $json = json_decode($response, TRUE); 
  $resp = $json['response']; 

  if ($resp = "OK")
  { 
    header('Location: tournament_created.php'); 
  }
  else {
    echo "Something went wrong."; 
  }

}
//}

?>



<!DOCTYPE html>
<html>
<head>
<style>
* {
  box-sizing: border-box;
}

input[type=text], select, textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
}

label {
  padding: 12px 12px 12px 0;
  display: inline-block;
}

input[type=submit] {
  background-color: #144a87;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  float: right;
}

input[type=submit]:hover {
  background-color: #45a049;
}

.container {
  border-radius: 5px;
  background-color: #f2f2f2;
  padding: 20px;
}

.col-25 {
  float: left;
  width: 25%;
  margin-top: 6px;
}

.col-75 {
  float: left;
  width: 75%;
  margin-top: 6px;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}

/* Responsive layout - when the screen is less than 600px wide, make the two columns stack on top of each other instead of next to each other */
@media screen and (max-width: 600px) {
  .col-25, .col-75, input[type=submit] {
    width: 100%;
    margin-top: 0;
  }
}
</style>
</head>

<title>Board Games</title>

<body>


<div class="content">
    <h1 style="text-align: center">Create a new tournament</h1>

    <div class="form">

      <form name="myForm" action="" onsubmit="return validateForm()" method="POST">
          <div class="row">
              <div class="col-25">
                  <label for="tournamName">Tournament name</label>
              </div>
              <div class="col-75">
                  <input type="text" name="tournamName" id="tournamName" placeholder="Tournament Name..">
              </div>
          </div>
          <div class="row">
              <div class="col-25">
                  <label for="gameType">Game type</label>
              </div>
              <div class="col-75">
                  <select id="gameType" name="gameType">
                    <option value="chess">Chess</option>
                    <option value="tictactoe">Tic-tac-toe</option>
                  </select>
              </div>
          </div>
          <div class="row">
              <div class="col-25">
                  <label for="maxNumOfUsers">Maximum number of players</label>
              </div>
              <div class="col-75">
                  <select id="maxNumOfUsers" name="maxNumOfUsers">
                    <option value="4">4</option>
                    <option value="8">8</option>
                    <option value="16">16</option>
                    <option value="32">32</option>
                  </select>
              </div>
          </div>
              <div class="row">
                  <div class="col-25">
                      <label for="password">Tournament safe key (a password for players who join the tournament) </label> 
                  </div>
                  <div class="col-75">
                      <input type="text" name="password" id="password" placeholder="Tournament safe key..">
                  </div>
          </div>
          <div class="row">
              <input type="submit" name="submit" value="Create">
          </div>
      </form>
    
    </div>

</div>

<img src="https://img.pngio.com/tournament-png-s-wichita-hoops-tournament-png-512_512.png" alt="Tournament" width="300" height="300">



</body>
</html>


<script>
function validateForm() {
  var x = document.forms["myForm"]["tournamName"].value;
  var y = document.forms["myForm"]["maxNumOfUsers"].value;
  var z = document.forms["myForm"]["password"].value;
  if (x == "") {
    alert("Tournament name must be filled out");
    return false;
  }
  if (y == "") {
    alert("Maximum number of users must be filled out");
    return false;
  }
  if (z == "") {
    alert("Tournament safe key  must be filled out");
    return false;
  }
}
</script>


