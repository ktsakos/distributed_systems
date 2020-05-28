<?php

session_start();

?>

<!DOCTYPE html>
<html>
<head>
<style>

body {font-family: Arial, Helvetica, sans-serif;}

body::after {
  content: "";
  background: url(imgs/background.jpg);
  opacity: 0.85;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  z-index: -1;   
}

/* Full-width input fields */
input[type=text], input[type=password] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

/* Set a style for all buttons */
button {
  background-color: blue;
  color: lightblue;
  padding: 10px 10px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 60%;
  position: center;
}

button:hover {
  opacity: 0.8;
}

.button2 {
  background-color: darkblue; 
  color: white; 
  border: 2px solid black;
}

.button2:hover {
  background-color: black;
  color: red;
}


/* Extra styles for the cancel button */
.cancelbtn {
  width: auto;
  padding: 10px 18px;
  background-color: #f44336;
}

/* Center the image and position the close button */
.imgcontainer {
  text-align: center;
  margin: 24px 0 12px 0;
  position: relative;
}

img.avatar {
  width: 40%;
  border-radius: 50%;
}

.container {
  padding: 16px;
}

span.psw {
  float: right;
  padding-top: 16px;
}

.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding: 100px;
}

/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
  padding-top: 60px;
}

/* Modal Content/Box */
.modal-content {
  background-color: #fefefe;
  margin: 5% auto 15% auto; /* 5% from the top, 15% from the bottom and centered */
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
}

/* The Close Button (x) */
.close {
  position: absolute;
  right: 25px;
  top: 0;
  color: #000;
  font-size: 35px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: red;
  cursor: pointer;
}

/* Add Zoom Animation */
.animate {
  -webkit-animation: animatezoom 0.6s;
  animation: animatezoom 0.6s
}

@-webkit-keyframes animatezoom {
  from {-webkit-transform: scale(0)} 
  to {-webkit-transform: scale(1)}
}
  
@keyframes animatezoom {
  from {transform: scale(0)} 
  to {transform: scale(1)}
}

/* Change styles for span and cancel button on extra small screens */
@media screen and (max-width: 300px) {
  span.psw {
     display: block;
     float: none;
  }
  .cancelbtn {
     width: 100%;
  }
}    

</style>
</head>
<body>

<title>Board Games</title>

<h2>Welcome to Board Games!</h2>

<img src="https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/SamCopeland/phpHiQWvM.gif" alt="Smiley face" height="200" width="200">

<img src="https://upload.wikimedia.org/wikipedia/commons/7/7d/Tic-tac-toe-animated.gif" alt="Smiley face" height="200" width="200">

<div class="center">

  <button class="button button2" onclick="document.getElementById('id01').style.display='block'" style="widows: 300px;">Login</button>

  <a href="signup.php"> <button class="button button2">Sign up</button> </a> 

</div>

  <?php 

  if(isset($_SESSION['flag']) && ($_SESSION['flag'] == 'logged_out'))
  {
    echo "You have successfully logged out."; 
  }

  ?>


<div id="id01" style="text-align:left;" class="modal">
  
  <form class="modal-content animate" action="login_auth.php" method="post">
    <div class="imgcontainer">
      <span onclick="document.getElementById('id01').style.display='none'" class="close" title="Close Modal">&times;</span>
      <img src="https://cdn.clipart.email/fcc8ead276ddb30d657f23845cd2e028_avatar-icon-of-flat-style-available-in-svg-png-eps-ai-icon-_512-512.png" style="width:200px;height:200px;" alt="Avatar" class="avatar">
    </div>

    <div class="container">
      <label for="uname"><b>Username</b></label>
      <input type="text" name="content" id="content" placeholder="Enter Username" required>

      <label for="psw"><b>Password</b></label>
      <input type="text" name="content1" id="content1" placeholder="Enter Password" required>
        
      <button type="submit" name="submit">Login</button>
      <label>
        <input type="checkbox" checked="checked" name="remember"> Remember me
      </label>
    </div>

    <div class="container" style="background-color:#f1f1f1">
      <button type="button" onclick="document.getElementById('id01').style.display='none'" class="cancelbtn">Cancel</button>
    </div>
  </form>
</div>


<script>
// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
</script>




</body>
</html>