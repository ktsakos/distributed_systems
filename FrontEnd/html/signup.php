<?php 

// if user submits the form
if (isset($_POST["submit"])) {  

  // form data 
  $content= $_POST["content"]; // username
  $content1 = $_POST["content1"]; // password
  $content2 = $_POST["content2"];  // first name
  $content3 = $_POST["content3"]; // last name
  $content4 = $_POST["content4"]; // email 

  $curl = curl_init();

  curl_setopt_array($curl, array(
    CURLOPT_URL => "http://172.16.1.4:5000/register",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS =>'{ "content": "'.$content.'", "content1": "'.$content1.'", "content2": "'.$content2.'", "content3": "'.$content3.'", "content4": "'.$content4.'" }',
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
    // send a POST request to GameMaster Service in order to 
    // insert a record for this user in the Scores table with score = 0 
    $curl = curl_init();

    curl_setopt_array($curl, array(
      CURLOPT_URL => "http://172.16.1.6:5000/initial_score",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => "",
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => "POST",
      CURLOPT_POSTFIELDS =>'{ "username": "'.$username.'" }',
      CURLOPT_HTTPHEADER => array(
        "Content-Type: application/json"
      ),
    ));

    $response = curl_exec($curl);
      
    curl_close($curl);
    //echo $response;  
  
    header('Location: complete.php');  
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
    <h1 style="text-align: center">User registration</h1>

    <div class="form">

      <form name="myForm" action="" onsubmit="return validateForm()" method="POST">
          <div class="row">
              <div class="col-25">
                  <label for="content">Username</label>
              </div>
              <div class="col-75">
                  <input type="text" name="content" id="content" placeholder="Your username..">
              </div>
          </div>
          <div class="row">
              <div class="col-25">
                  <label for="content1">Password</label>
              </div>
              <div class="col-75">
                  <input type="text" name="content1" id="content1" placeholder="Your password..">
              </div>
          </div>
          <div class="row">
              <div class="col-25">
                  <label for="content2">First Name</label>
              </div>
              <div class="col-75">
                  <input type="text" name="content2" id="content2" placeholder="Your name..">
              </div>
          </div>
              <div class="row">
                  <div class="col-25">
                      <label for="content3">Last Name</label> 
                  </div>
                  <div class="col-75">
                      <input type="text" name="content3" id="content3" placeholder="Your last name..">
                  </div>
          </div>
          <div class="row">
              <div class="col-25">
                  <label for="content4">Email address</label>
              </div>
              <div class="col-75">
                  <div class="col-75">
                      <input type="text" name="content4" id="content4" placeholder="Your email address..">
                  </div>
              </div>
          </div>    
          <div class="row">
              <input type="submit" name="submit" value="Sign up">
          </div>
      </form>
    
    </div>

</div>


</body>
</html>



<script>
function validateForm() {
  var a = document.forms["myForm"]["content"].value;
  var b = document.forms["myForm"]["content1"].value;
  var c = document.forms["myForm"]["content2"].value;
  var d = document.forms["myForm"]["content3"].value; 
  var e = document.forms["myForm"]["content4"].value; 
  if (a == "") {
    alert("Username must be filled out");
    return false;
  }
  if (b == "") {
    alert("Password must be filled out");
    return false;
  }
  if (c == "") {
    alert("First name must be filled out");
    return false;
  }
  if (d == "") {
    alert("Last name must be filled out");
    return false;
  }
  if (e == "") {
    alert("Email address must be filled out");
    return false;
  }
}
</script>
