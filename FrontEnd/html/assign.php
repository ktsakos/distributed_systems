<?php 

session_start(); 

$token = $_SESSION['token']; 

if($_SESSION['role'] == NULL || $_SESSION['role'] != 'Admin')
{
    echo "You don't have the right to enter.";
    echo '<a href="index.php"> Home Page </a>';
}
else {
    header('Location: http://172.16.1.4:5000/assign?token='.$token.''); 
}


?>

<!DOCTYPE html>
<html>
<head>
<title>Board Games</title>

<meta charset="utf-8"> 
 
</head>

</html>
