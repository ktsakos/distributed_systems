<?php 
include 'app_logic.php';
$token = $_SESSION['token']; 
?>

<!DOCTYPE html>
<html>
    <head>
        <title>Chess Game</title>
        <link rel="shortcut icon" href="imgs/favicon-16x16.png">
        <meta charset="utf-8">
        <script src="//cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js" integrity="sha256-yr4fRk/GU1ehYJPAs8P4JlTgu0Hdsp4ZKrx8bDEDC3I=" crossorigin="anonymous"></script>
        <link rel="stylesheet" type="text/css" href="css/chess.css">
    </head>
    <body>
      <p id="username"><?php echo $username;?></p>
      <p>You are playing against:</p>
      <p id="opponent"></p>
      <?php
        if (isset($_GET['id'])){
            echo "<p>Game For Tournament:".$_GET['tourname']."</p>";
            echo "<p id=\"tournid\">".$_GET['tournid']."</p>";
            echo "<p id=\"round\">".$_GET['round']."</p>";
            echo "<p id=\"playid\">".$_GET['id']."</p>";
        }
      ?>
      <h1>Chess</h1>
        <table class="chess-board">
            <tbody>
                <tr>
                    <th></th>
                    <th>a</th>
                    <th>b</th>
                    <th>c</th>
                    <th>d</th>
                    <th>e</th>
                    <th>f</th>
                    <th>g</th>
                    <th>h</th>
                </tr>
                <tr>
                    <th>8</th>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block70">&#9820;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block71">&#9822;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block72">&#9821;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block73">&#9819;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block74">&#9818;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block75">&#9821;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block76">&#9822;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block77">&#9820;</div></td>
                </tr>
                <tr>
                    <th>7</th>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block60">&#9823;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block61">&#9823;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block62">&#9823;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block63">&#9823;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block64">&#9823;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block65">&#9823;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block66">&#9823;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block67">&#9823;</div></td>
                </tr>
                <tr>
                    <th>6</th>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block50"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block51"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block52"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block53"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block54"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block55"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block56"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block57"></div></td>
                </tr>
                <tr>
                    <th>5</th>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block40"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block41"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block42"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block43"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block44"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block45"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block46"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block47"></div></td>
                </tr>
                <tr>
                    <th>4</th>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block30"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block31"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block32"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block33"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block34"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block35"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block36"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block37"></div></td>
                </tr>
                <tr>
                    <th>3</th>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block20"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block21"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block22"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block23"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block24"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block25"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block26"></div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block27"></div></td>
                </tr>
                <tr>
                    <th>2</th>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block10">&#9817;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block11">&#9817;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block12">&#9817;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block13">&#9817;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block14">&#9817;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block15">&#9817;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block16">&#9817;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div  id="block17">&#9817;</div></td>
                </tr>
                <tr>
                    <th>1</th>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div id="block00" >&#9814;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block01">&#9816;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div id="block02" >&#9815;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block03">&#9813;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div id="block04" >&#9812;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block05">&#9815;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="dark"><div id="block06" >&#9816;</div></td>
                    <td onmouseout="unchooseblock(this)" onmouseover="chooseblock(this)" onclick="makemove(this)" class="light"><div id="block07">&#9814;</div></td>
                </tr>
            </tbody>
        </table>
        <script type="text/javascript" src="js/chess.js"></script> 

    </body>
</html>