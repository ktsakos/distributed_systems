var board= new Array(8); //board of the chess game 8X8
for (var i=0;i<=7;i++){
    board[i]=new Array(8);
}
var whiteUnicodes=["\u2654","\u2655","\u2656","\u2657","\u2658","\u2659"]; //chess pawns in hexademimal format that js can interpret
var blackUnicodes=["\u265A","\u265B","\u265C","\u265D","\u265E","\u265F"];
BoardInitialization();
//DisableBoard();
var numberofmoves=0; //If this value is even then white play,else if value is odd then black plays

//Variables for Rokke Move Permition
var BlackKingHasMoved=false;
var WhiteKingHasMoved=false;
var WhiteTowerBigRoke=false;
var WhiteTowerSmallRoke=false;
var BlackTowerBigRoke=false;
var BlackTowerSmallRoke=false;

//This Variable contains the position of a pawn(soldier) which has been moved two positions front,the value is maintained only till next round of that movement
var EnPassant="";

//websocket communication testing
var socket=io.connect('http://147.27.60.48:5001');
var username=document.getElementById("username").innerHTML;
var gametype="chess";
socket.on('connect',function(){//connection trying event
    socket.emit('connectionack',"{\"username\":\""+ username+"\",\"gametype\":\""+gametype+"\",\"clientid\":\""+socket.id+"\"}");
});

socket.on('connectionresponse',function(msg){//connection acceptance event
    console.log("Received from server: "+msg);
    alert("Wait for a player to be connected!");
    DisableBoard();
});

socket.on('gamestart',function(opponent){
    document.getElementById("opponent").innerHTML=opponent;
    alert("Game Started!");
});

socket.on('makemove',function(){//Time to play
    EnableBoard();
});

socket.on('opponentsmovesent',function(data){//Update the board after the other player's move is done
    for(var i=0;i<8;i++){
        for(var j=0;j<8;j++){
            board[i][j]=data.board[i][j];
            if(data.board[i][j]=="-"){
                document.getElementById("block"+String(i)+String(j)).innerHTML="";
            }
            else{
                document.getElementById("block"+String(i)+String(j)).innerHTML=data.board[i][j];
            }
        }
    }
    numberofmoves++;
});



socket.on('EndOfGame',function(msg){
    socket.disconnect();
    alert(msg);
    //socket.close();
    window.location.href="welcome.php";
});

socket.on('ConnectionReject',function(msg){//connection rejection
    console.log(msg);
    socket.close();
});

window.onunload= function() {
    socket.disconnect();
}
window.onbeforeunload= function() {
    socket.disconnect();
}
window.onclose= function() {
    socket.disconnect();
}

function EnableBoard(){//Disable the events on empty blocks and the player's blocks who dont have the turn
    var blocks=document.getElementsByTagName("td");
    var childelement;
    var kingsposition;
    if(numberofmoves%2==0){
        //White player's turn and the King is under attack (Sax case) and there are no possible movements to protect him
        if(CheckSach(board,"white")==true && CheckForPat("white")==true){
            DisableBoard();//End of the Game!
            socket.emit('WinCaseChess');
            alert("Rua Mat!!!Blacks win!!!");
            return;//May redirection of the index page
        }
        //White player's turn and the King is not under attack but there are no valid movements (Pat-Draw Case)
        else if(CheckForPat("white")==true){
            DisableBoard();
            socket.emit('DrawCase');
            alert("Pat!!!Nobody wins!It's a draw result!!");
            return;//May redirection of the index page
        }
        //White player's turn and the King is under attack but there are possible movements to protect him
        else if(CheckSach(board,"white")==true){
            alert("Sah!White King is under attack!He must be protected!");
        }
        for (var i=0;i<blocks.length;i++){
            childelement=blocks[i].childNodes[0];
            if(blackUnicodes.includes(board[parseInt(childelement.id.charAt(5))][parseInt(childelement.id.charAt(6))])==true || board[parseInt(childelement.id.charAt(5))][parseInt(childelement.id.charAt(6))]=="-"){
               childelement.parentNode.style.pointerEvents="none";
               unchooseblock(childelement.parentNode);//in case a user clicks on a pawn ,doesn't click it again to cancel its movement and it clicks another one
               childelement.style.pointerEvents="none";
            }
            else{
                childelement.parentNode.style.pointerEvents="auto";
                unchooseblock(childelement.parentNode);//in case a user clicks on a pawn ,doesn't click it again to cancel its movement and it clicks another one
                childelement.style.pointerEvents="auto";
            }
        }  
    }
    else if(numberofmoves%2==1){
         //Black player's turn and the King is under attack (Sax case) and there are no possible movements to protect him
         if(CheckSach(board,"black")==true && CheckForPat("black")==true){
            DisableBoard();//End of the Game!
            socket.emit('WinCaseChess');
            alert("Rua Mat!!!Whites win!!!");
            return;//May redirection of the index page
        }
        //Black player's turn and the King is not under attack but there are no valid movements (Pat-Draw Case)
        else if(CheckForPat("black")==true){
            DisableBoard();
            socket.emit('DrawCase');
            alert("Pat!!!Nobody wins!It's a draw result!!");
            return;//May redirection of the index page
        }
        //Black player's turn and the King is under attack but there are possible movements to protect him
        else if(CheckSach(board,"black")==true){
            alert("Sah!Black King is under attack!He must be protected!");
        }
        for (var i=0;i<blocks.length;i++){
            childelement=blocks[i].childNodes[0];
            if(whiteUnicodes.includes(board[parseInt(childelement.id.charAt(5))][parseInt(childelement.id.charAt(6))])==true || board[parseInt(childelement.id.charAt(5))][parseInt(childelement.id.charAt(6))]=="-"){
                childelement.parentNode.style.pointerEvents="none";
                unchooseblock(childelement.parentNode);//in case a user clicks on a pawn ,doesn't click it again to cancel its movement and it clicks another one
                childelement.style.pointerEvents="none";
            }
            else{
                childelement.parentNode.style.pointerEvents="auto";
                unchooseblock(childelement.parentNode);//in case a user clicks on a pawn ,doesn't click it again to cancel its movement and it clicks another one
                childelement.style.pointerEvents="auto";
            }
        }  
    } 
}

function DisableBoard(){
    var blocks=document.getElementsByTagName("div");
    for (var i=0;i<blocks.length;i++){
           blocks[i].parentNode.style.pointerEvents="none";
           blocks[i].style.pointerEvents="none";
    }
}

function chooseblock(element){
    element.style.backgroundColor="#B0E0E6";
}

function unchooseblock(element){
    if(element.className=="dark"){
        element.style.backgroundColor="grey";
    }
    else if(element.className=="light"){
        element.style.backgroundColor="#eee";

    }
}

function BoardInitialization(){
    for (var i=0;i<=7;i++){
        for (var j=0;j<=7;j++){
            if (i==1){ //Case of white pawn
                board[i][j]="\u2659";
            }
            else if (i==6){ //Case of black pawn
                board[i][j]="\u265F";
            }
            else if (i==0 && (j==0 || j==7)){//case of white tower
                board[i][j]="\u2656";
            }
            else if (i==0 && (j==1 || j==6)){//case of white horse
                board[i][j]="\u2658";
            }
            else if (i==0 && (j==2 || j==5)){//case of white bishop
                board[i][j]="\u2657";
            }
            else if (i==0 && j==3){//case of white Queen
                board[i][j]="\u2655";
            }
            else if (i==0 && j==4){//case of white King
                board[i][j]="\u2654";
            }
            else if (i==7 && (j==0 || j==7)){//case of black tower
                board[i][j]="\u265C";
            }
            else if (i==7 && (j==1 || j==6)){//case of black horse
                board[i][j]="\u265E";
            }
            else if (i==7 && (j==2 || j==5)){//case of black bishop
                board[i][j]="\u265D";
            }
            else if (i==7 && j==3){//case of black Queen
                board[i][j]="\u265B";
            }
            else if (i==7 && j==4){//case of black King
                board[i][j]="\u265A";
            }
            else{
                board[i][j]="-";
            }
        }
    }
}

var valueoffullblock;//Keeping the value of a click non empty block 
var positionoffullblock="initial";//Keeping the position of a clicked non empty block 
var permitedpositions=[];

function makemove(element){
    var childElement=element.childNodes[0];
    var positionrow=parseInt(childElement.id.charAt(5));
    var positioncol=parseInt(childElement.id.charAt(6));
    if(childElement.innerHTML.length!=0){//When click happens on non empty block
        if(positionoffullblock==childElement.id){//The case when user clicks two times the same non empty block
            for(var i=0;i<permitedpositions.length;i++){
                unchooseblock(document.getElementById(permitedpositions[i]).parentNode);
            }
            positionoffullblock="initial";//Assign another value in case he clicks the same non empty block for 3 times in a row in order not to enter again in this if loop
            CleanArray(permitedpositions);
            EnableBoard();
            return ;
        }
        if(permitedpositions.includes(childElement.id)){//If current position has not been cleaned from the permited positions means we have an eating of opponent
            childElement.innerHTML=valueoffullblock; //Insert the value of the pawn was clicked before
            document.getElementById(positionoffullblock).innerHTML=""; //Erase the pawn from its previous block
            board[positionrow][positioncol]=valueoffullblock; //insert new value from the board table
            board[parseInt(positionoffullblock.charAt(5))][parseInt(positionoffullblock.charAt(6))]="-"; //erase old value from the board table
            CheckForPromotion(childElement,valueoffullblock);

            //Check Kings and Towers if were moved for roke move permition
            if(valueoffullblock=="\u2654"){//First time the white King is moved
                WhiteKingHasMoved=true;
            }
            else if(valueoffullblock=="\u265A"){//First time the black King is moved
                BlackKingHasMoved=true;
            }
            else if(valueoffullblock=="\u2656" && positionoffullblock=="block00"){//First time the white Tower on position 0,0 is moved
                WhiteTowerBigRoke=true;
            }
            else if(valueoffullblock=="\u2656" && positionoffullblock=="block07"){//First time the white Tower on position 0,7 is moved
                WhiteTowerSmallRoke=true;
            }
            else if(valueoffullblock=="\u265C" && positionoffullblock=="block70"){//First time the black Tower on position 7,0 is moved
                BlackTowerBigRoke=true;
            }
            else if(valueoffullblock=="\u265C" && positionoffullblock=="block77"){//First time the black Tower on position 7,7 is moved
                BlackTowerSmallRoke=true;
            }

            valueoffullblock="";
            positionoffullblock="";
            for(var i=0;i<permitedpositions.length;i++){
                unchooseblock(document.getElementById(permitedpositions[i]).parentNode);
            }
            CleanArray(permitedpositions);
            numberofmoves++;
            socket.emit('receivemovechess',{board});
            DisableBoard();
            return;
        }
        positionoffullblock=childElement.id;//take block's position
        valueoffullblock=childElement.innerHTML;//take block's value
        CleanArray(permitedpositions);//In case we have a new pawn choice for movement clean array with candidate positions
        //EnableBoard();
        if(childElement.innerHTML=="\u2659"){//Click on white pawn
            if(board[positionrow+1][positioncol]=="-" && positionrow+1<8){
                permitedpositions.push("block"+String(positionrow+1)+String(positioncol));
            }
            if(positionrow==1 && board[positionrow+1][positioncol]=="-" && board[positionrow+2][positioncol]=="-" && positionrow+2<8){//If the white pawn is in its initial position
                permitedpositions.push("block"+String(positionrow+2)+String(positioncol));
            }
            if(board[positionrow+1][positioncol-1]!="-" && blackUnicodes.includes(board[positionrow+1][positioncol-1]) && positionrow+1<8 && positioncol-1>=0){
                permitedpositions.push("block"+String(positionrow+1)+String(positioncol-1));
            }
            if(board[positionrow+1][positioncol+1]!="-" && blackUnicodes.includes(board[positionrow+1][positioncol+1]) && positionrow+1<8 && positioncol+1<8){
                permitedpositions.push("block"+String(positionrow+1)+String(positioncol+1));
            }
            //Check EnPassant Permition
            if(EnPassant!=""){
                if(parseInt(EnPassant.charAt(5))==positionrow && (parseInt(EnPassant.charAt(6))-positioncol==1 || parseInt(EnPassant.charAt(6))-positioncol==-1)){
                    permitedpositions.push("block"+String(positionrow+1)+EnPassant.charAt(6));
                 }
            }
        }
        else if(childElement.innerHTML=="\u265F"){//Click on black pawn
            if(board[positionrow-1][positioncol]=="-" && positionrow-1>=0){
                permitedpositions.push("block"+String(positionrow-1)+String(positioncol));
            }
            if(positionrow==6 && board[positionrow-1][positioncol]=="-" && board[positionrow-2][positioncol]=="-" && positionrow-2>=0){//If the white pawn is in its initial position
                permitedpositions.push("block"+String(positionrow-2)+String(positioncol));
            }
            if(board[positionrow-1][positioncol-1]!="-" && whiteUnicodes.includes(board[positionrow-1][positioncol-1]) && positionrow-1>=0 && positioncol-1>=0){
                permitedpositions.push("block"+String(positionrow-1)+String(positioncol-1));
            }
            if(board[positionrow-1][positioncol+1]!="-" && whiteUnicodes.includes(board[positionrow-1][positioncol+1]) && positionrow-1>=0 && positioncol+1<8){
                permitedpositions.push("block"+String(positionrow-1)+String(positioncol+1));
            }
            //Check EnPassant Permition
            if(EnPassant!=""){
                if(parseInt(EnPassant.charAt(5))==positionrow && (parseInt(EnPassant.charAt(6))-positioncol==1 || parseInt(EnPassant.charAt(6))-positioncol==-1)){
                    permitedpositions.push("block"+String(positionrow-1)+EnPassant.charAt(6));
                 }
            }
        }
        else if(childElement.innerHTML=="\u2656" || childElement.innerHTML=="\u265C"){//Click on white or black tower
            var i=positionrow+1;
            while(i<8 && board[i][positioncol]=="-"){
                permitedpositions.push("block"+String(i)+String(positioncol));
                i++;
            }
            if(i<8 && ((childElement.innerHTML=="\u2656" && blackUnicodes.includes(board[i][positioncol])) || (childElement.innerHTML=="\u265C" && whiteUnicodes.includes(board[i][positioncol])))){
                permitedpositions.push("block"+String(i)+String(positioncol));
            }
            i=positionrow-1;
            while(i>=0 && board[i][positioncol]=="-"){
                permitedpositions.push("block"+String(i)+String(positioncol));
                i--;
            }
            if(i>=0 && ((childElement.innerHTML=="\u2656" && blackUnicodes.includes(board[i][positioncol])) || (childElement.innerHTML=="\u265C" && whiteUnicodes.includes(board[i][positioncol])))){
                permitedpositions.push("block"+String(i)+String(positioncol));
            }
            i=positioncol+1;
            while(i<8 && board[positionrow][i]=="-"){
                permitedpositions.push("block"+String(positionrow)+String(i));
                i++;
            }
            if(i<8 && ((childElement.innerHTML=="\u2656" && blackUnicodes.includes(board[positionrow][i])) || (childElement.innerHTML=="\u265C" && whiteUnicodes.includes(board[positionrow][i])))){
                permitedpositions.push("block"+String(positionrow)+String(i));
            }
            i=positioncol-1;
            while(i>=0 && board[positionrow][i]=="-" ){
                permitedpositions.push("block"+String(positionrow)+String(i));
                i--;
            }
            if(i>=0 && ((childElement.innerHTML=="\u2656" && blackUnicodes.includes(board[positionrow][i])) || (childElement.innerHTML=="\u265C" && whiteUnicodes.includes(board[positionrow][i])))){
                permitedpositions.push("block"+String(positionrow)+String(i));
            }
        }
        else if(childElement.innerHTML=="\u2658" || childElement.innerHTML=="\u265E"){//Click on white or black horse
            if(childElement.innerHTML=="\u2658"){//Click on white horse
                if(positionrow+2<8 && positioncol+1<8 && (board[positionrow+2][positioncol+1]=="-"|| blackUnicodes.includes(board[positionrow+2][positioncol+1]))){
                    permitedpositions.push("block"+String(positionrow+2)+String(positioncol+1));
                }
                if(positionrow+2<8 && positioncol-1>=0 && (board[positionrow+2][positioncol-1]=="-"|| blackUnicodes.includes(board[positionrow+2][positioncol-1]))){
                    permitedpositions.push("block"+String(positionrow+2)+String(positioncol-1));
                }
                if(positionrow-2>=0 && positioncol+1<8 && (board[positionrow-2][positioncol+1]=="-"|| blackUnicodes.includes(board[positionrow-2][positioncol+1]))){
                    permitedpositions.push("block"+String(positionrow-2)+String(positioncol+1));
                }
                if(positionrow-2>=0 && positioncol-1>=0 && (board[positionrow-2][positioncol-1]=="-"|| blackUnicodes.includes(board[positionrow-2][positioncol-1]))){
                    permitedpositions.push("block"+String(positionrow-2)+String(positioncol-1));
                }
                if(positionrow+1<8 && positioncol+2<8 && (board[positionrow+1][positioncol+2]=="-"|| blackUnicodes.includes(board[positionrow+1][positioncol+2]))){
                    permitedpositions.push("block"+String(positionrow+1)+String(positioncol+2));
                }
                if(positionrow+1<8 && positioncol-2>=0 && (board[positionrow+1][positioncol-2]=="-"|| blackUnicodes.includes(board[positionrow+1][positioncol-2]))){
                    permitedpositions.push("block"+String(positionrow+1)+String(positioncol-2));
                }
                if(positionrow-1>=0 && positioncol+2<8 && (board[positionrow-1][positioncol+2]=="-"|| blackUnicodes.includes(board[positionrow-1][positioncol+2]))){
                    permitedpositions.push("block"+String(positionrow-1)+String(positioncol+2));
                }
                if(positionrow-1>=0 && positioncol-2>=0 && (board[positionrow-1][positioncol-2]=="-"|| blackUnicodes.includes(board[positionrow-1][positioncol-2]))){
                    permitedpositions.push("block"+String(positionrow-1)+String(positioncol-2));
                }
            }
            else {//Click on Black horse
                if(positionrow+2<8 && positioncol+1<8 && (board[positionrow+2][positioncol+1]=="-"|| whiteUnicodes.includes(board[positionrow+2][positioncol+1]))){
                    permitedpositions.push("block"+String(positionrow+2)+String(positioncol+1));
                }
                if(positionrow+2<8 && positioncol-1>=0 && (board[positionrow+2][positioncol-1]=="-"|| whiteUnicodes.includes(board[positionrow+2][positioncol-1]))){
                    permitedpositions.push("block"+String(positionrow+2)+String(positioncol-1));
                }
                if(positionrow-2>=0 && positioncol+1<8 && (board[positionrow-2][positioncol+1]=="-"|| whiteUnicodes.includes(board[positionrow-2][positioncol+1]))){
                    permitedpositions.push("block"+String(positionrow-2)+String(positioncol+1));
                }
                if(positionrow-2>=0 && positioncol-1>=0 && (board[positionrow-2][positioncol-1]=="-"|| whiteUnicodes.includes(board[positionrow-2][positioncol-1]))){
                    permitedpositions.push("block"+String(positionrow-2)+String(positioncol-1));
                }
                if(positionrow+1<8 && positioncol+2<8 && (board[positionrow+1][positioncol+2]=="-"|| whiteUnicodes.includes(board[positionrow+1][positioncol+2]))){
                    permitedpositions.push("block"+String(positionrow+1)+String(positioncol+2));
                }
                if(positionrow+1<8 && positioncol-2>=0 && (board[positionrow+1][positioncol-2]=="-"|| whiteUnicodes.includes(board[positionrow+1][positioncol-2]))){
                    permitedpositions.push("block"+String(positionrow+1)+String(positioncol-2));
                }
                if(positionrow-1>=0 && positioncol+2<8 && (board[positionrow-1][positioncol+2]=="-"|| whiteUnicodes.includes(board[positionrow-1][positioncol+2]))){
                    permitedpositions.push("block"+String(positionrow-1)+String(positioncol+2));
                }
                if(positionrow-1>=0 && positioncol-2>=0 && (board[positionrow-1][positioncol-2]=="-"|| whiteUnicodes.includes(board[positionrow-1][positioncol-2]))){
                    permitedpositions.push("block"+String(positionrow-1)+String(positioncol-2));
                }
            }
        }
        else if (childElement.innerHTML=="\u2657" || childElement.innerHTML=="\u265D"){//Click on white or black bishop
            var i=positionrow+1;
            var j=positioncol+1;
            while(i<8 && j<8 && board[i][j]=="-"){
                permitedpositions.push("block"+String(i)+String(j));
                i++;
                j++;
            }
            if(i<8 && j<8 && ((childElement.innerHTML=="\u2657" && blackUnicodes.includes(board[i][j])) || (childElement.innerHTML=="\u265D" && whiteUnicodes.includes(board[i][j])))){
                permitedpositions.push("block"+String(i)+String(j));
            }
            i=positionrow-1;
            j=positioncol+1;
            while(i>=0 && j<8 && board[i][j]=="-"){
                permitedpositions.push("block"+String(i)+String(j));
                i--;
                j++;
            }
            if(i>=0 && j<8 && ((childElement.innerHTML=="\u2657" && blackUnicodes.includes(board[i][j])) || (childElement.innerHTML=="\u265D" && whiteUnicodes.includes(board[i][j])))){
                permitedpositions.push("block"+String(i)+String(j));
            }
            i=positionrow+1;
            j=positioncol-1;
            while(i<8 && j>=0 && board[i][j]=="-"){
                permitedpositions.push("block"+String(i)+String(j));
                i++;
                j--;
            }
            if(i<8 && j>=0 && ((childElement.innerHTML=="\u2657" && blackUnicodes.includes(board[i][j])) || (childElement.innerHTML=="\u265D" && whiteUnicodes.includes(board[i][j])))){
                permitedpositions.push("block"+String(i)+String(j));
            }
            i=positionrow-1;
            j=positioncol-1;
            while(i>=0 && j>=0 && board[i][j]=="-"){
                permitedpositions.push("block"+String(i)+String(j));
                i--;
                j--;
            }
            if(i>=0 && j>=0 && ((childElement.innerHTML=="\u2657" && blackUnicodes.includes(board[i][j])) || (childElement.innerHTML=="\u265D" && whiteUnicodes.includes(board[i][j])))){
                permitedpositions.push("block"+String(i)+String(j));
            }
        }
        else if(childElement.innerHTML=="\u2655" || childElement.innerHTML=="\u265B"){//Click on white or black Queen
            var i=positionrow+1;
            var j=positioncol+1;
            while(i<8 && j<8 && board[i][j]=="-"){
                permitedpositions.push("block"+String(i)+String(j));
                i++;
                j++;
            }
            if(i<8 && j<8 && ((childElement.innerHTML=="\u2655" && blackUnicodes.includes(board[i][j])) || (childElement.innerHTML=="\u265B" && whiteUnicodes.includes(board[i][j])))){
                permitedpositions.push("block"+String(i)+String(j));
            }
            i=positionrow-1;
            j=positioncol+1;
            while(i>=0 && j<8 && board[i][j]=="-"){
                permitedpositions.push("block"+String(i)+String(j));
                i--;
                j++;
            }
            if(i>=0 && j<8 && ((childElement.innerHTML=="\u2655" && blackUnicodes.includes(board[i][j])) || (childElement.innerHTML=="\u265B" && whiteUnicodes.includes(board[i][j])))){
                permitedpositions.push("block"+String(i)+String(j));
            }
            i=positionrow+1;
            j=positioncol-1;
            while(i<8 && j>=0 && board[i][j]=="-"){
                permitedpositions.push("block"+String(i)+String(j));
                i++;
                j--;
            }
            if(i<8 && j>=0 && ((childElement.innerHTML=="\u2655" && blackUnicodes.includes(board[i][j])) || (childElement.innerHTML=="\u265B" && whiteUnicodes.includes(board[i][j])))){
                permitedpositions.push("block"+String(i)+String(j));
            }
            i=positionrow-1;
            j=positioncol-1;
            while(i>=0 && j>=0 && board[i][j]=="-"){
                permitedpositions.push("block"+String(i)+String(j));
                i--;
                j--;
            }
            if(i>=0 && j>=0 && ((childElement.innerHTML=="\u2655" && blackUnicodes.includes(board[i][j])) || (childElement.innerHTML=="\u265B" && whiteUnicodes.includes(board[i][j])))){
                permitedpositions.push("block"+String(i)+String(j));
            }
            i=positionrow+1;
            while(i<8 && board[i][positioncol]=="-"){
                permitedpositions.push("block"+String(i)+String(positioncol));
                i++;
            }
            if(i<8 && ((childElement.innerHTML=="\u2655" && blackUnicodes.includes(board[i][positioncol])) || (childElement.innerHTML=="\u265B" && whiteUnicodes.includes(board[i][positioncol])))){
                permitedpositions.push("block"+String(i)+String(positioncol));
            }
            i=positionrow-1;
            while(i>=0 && board[i][positioncol]=="-"){
                permitedpositions.push("block"+String(i)+String(positioncol));
                i--;
            }
            if(i>=0 && ((childElement.innerHTML=="\u2655" && blackUnicodes.includes(board[i][positioncol])) || (childElement.innerHTML=="\u265B" && whiteUnicodes.includes(board[i][positioncol])))){
                permitedpositions.push("block"+String(i)+String(positioncol));
            }
            i=positioncol+1;
            while(i<8 && board[positionrow][i]=="-"){
                permitedpositions.push("block"+String(positionrow)+String(i));
                i++;
            }
            if(i<8 && ((childElement.innerHTML=="\u2655" && blackUnicodes.includes(board[positionrow][i])) || (childElement.innerHTML=="\u265B" && whiteUnicodes.includes(board[positionrow][i])))){
                permitedpositions.push("block"+String(positionrow)+String(i));
            }
            i=positioncol-1;
            while(i>=0 && board[positionrow][i]=="-" ){
                permitedpositions.push("block"+String(positionrow)+String(i));
                i--;
            }
            if(i>=0 && ((childElement.innerHTML=="\u2655" && blackUnicodes.includes(board[positionrow][i])) || (childElement.innerHTML=="\u265B" && whiteUnicodes.includes(board[positionrow][i])))){
                permitedpositions.push("block"+String(positionrow)+String(i));
            }
        }
        else if(childElement.innerHTML=="\u2654" || childElement.innerHTML=="\u265A"){//Click on white or black King
            if(positionrow+1<8 && positioncol+1<8 && (board[positionrow+1][positioncol+1]=="-" || (childElement.innerHTML=="\u2654" && blackUnicodes.includes(board[positionrow+1][positioncol+1])) || (childElement.innerHTML=="\u265A" && whiteUnicodes.includes(board[positionrow+1][positioncol+1])))){
                //Last checking to avoid the King to be moved in a position under attack by the opponent
                if((blackUnicodes.includes(childElement.innerHTML) && CheckForThreat("block"+String(positionrow+1)+String(positioncol+1),"white")==false) || (whiteUnicodes.includes(childElement.innerHTML) && CheckForThreat("block"+String(positionrow+1)+String(positioncol+1),"black")==false)){
                    permitedpositions.push("block"+String(positionrow+1)+String(positioncol+1));
                }
            }
            if(positioncol+1<8 && (board[positionrow][positioncol+1]=="-" || (childElement.innerHTML=="\u2654" && blackUnicodes.includes(board[positionrow][positioncol+1])) || (childElement.innerHTML=="\u265A" && whiteUnicodes.includes(board[positionrow][positioncol+1])))){
                if((blackUnicodes.includes(childElement.innerHTML) && CheckForThreat(board,"block"+String(positionrow)+String(positioncol+1),"white")==false) || (whiteUnicodes.includes(childElement.innerHTML) && CheckForThreat(board,"block"+String(positionrow)+String(positioncol+1),"black")==false)){
                    permitedpositions.push("block"+String(positionrow)+String(positioncol+1));
                }
            }
            if(positionrow-1>=0 && positioncol+1<8 && (board[positionrow-1][positioncol+1]=="-" || (childElement.innerHTML=="\u2654" && blackUnicodes.includes(board[positionrow-1][positioncol+1])) || (childElement.innerHTML=="\u265A" && whiteUnicodes.includes(board[positionrow-1][positioncol+1])))){
                if((blackUnicodes.includes(childElement.innerHTML) && CheckForThreat(board,"block"+String(positionrow-1)+String(positioncol+1),"white")==false) || (whiteUnicodes.includes(childElement.innerHTML) && CheckForThreat(board,"block"+String(positionrow-1)+String(positioncol+1),"black")==false)){
                    permitedpositions.push("block"+String(positionrow-1)+String(positioncol+1));
                }
            }
            if(positionrow-1>=0 && (board[positionrow-1][positioncol]=="-" || (childElement.innerHTML=="\u2654" && blackUnicodes.includes(board[positionrow-1][positioncol])) || (childElement.innerHTML=="\u265A" && whiteUnicodes.includes(board[positionrow-1][positioncol])))){
                if((blackUnicodes.includes(childElement.innerHTML) && CheckForThreat(board,"block"+String(positionrow-1)+String(positioncol),"white")==false) || (whiteUnicodes.includes(childElement.innerHTML) && CheckForThreat(board,"block"+String(positionrow-1)+String(positioncol),"black")==false)){
                    permitedpositions.push("block"+String(positionrow-1)+String(positioncol));
                }
            }
            if(positionrow-1>=0 && positioncol-1>=0 && (board[positionrow-1][positioncol-1]=="-" || (childElement.innerHTML=="\u2654" && blackUnicodes.includes(board[positionrow-1][positioncol-1])) || (childElement.innerHTML=="\u265A" && whiteUnicodes.includes(board[positionrow-1][positioncol-1])))){
                if((blackUnicodes.includes(childElement.innerHTML) && CheckForThreat(board,"block"+String(positionrow-1)+String(positioncol-1),"white")==false) || (whiteUnicodes.includes(childElement.innerHTML) && CheckForThreat(board,"block"+String(positionrow-1)+String(positioncol-1),"black")==false)){
                    permitedpositions.push("block"+String(positionrow-1)+String(positioncol-1));
                }
            }
            if(positioncol-1>=0 && (board[positionrow][positioncol-1]=="-" || (childElement.innerHTML=="\u2654" && blackUnicodes.includes(board[positionrow][positioncol-1])) || (childElement.innerHTML=="\u265A" && whiteUnicodes.includes(board[positionrow][positioncol-1])))){
                if((blackUnicodes.includes(childElement.innerHTML) && CheckForThreat(board,"block"+String(positionrow)+String(positioncol-1),"white")==false) || (whiteUnicodes.includes(childElement.innerHTML) && CheckForThreat(board,"block"+String(positionrow)+String(positioncol-1),"black")==false)){
                    permitedpositions.push("block"+String(positionrow)+String(positioncol-1));
                }
            }
            if(positionrow+1<8 && positioncol-1>=0 && (board[positionrow+1][positioncol-1]=="-" || (childElement.innerHTML=="\u2654" && blackUnicodes.includes(board[positionrow+1][positioncol-1])) || (childElement.innerHTML=="\u265A" && whiteUnicodes.includes(board[positionrow+1][positioncol-1])))){
                if((blackUnicodes.includes(childElement.innerHTML) && CheckForThreat(board,"block"+String(positionrow+1)+String(positioncol-1),"white")==false) || (whiteUnicodes.includes(childElement.innerHTML) && CheckForThreat(board,"block"+String(positionrow+1)+String(positioncol-1),"black")==false)){
                    permitedpositions.push("block"+String(positionrow+1)+String(positioncol-1));
                }
            }
            if(positionrow+1<8 && (board[positionrow+1][positioncol]=="-" || (childElement.innerHTML=="\u2654" && blackUnicodes.includes(board[positionrow+1][positioncol])) || (childElement.innerHTML=="\u265A" && whiteUnicodes.includes(board[positionrow+1][positioncol])))){
                if((blackUnicodes.includes(childElement.innerHTML) && CheckForThreat(board,"block"+String(positionrow+1)+String(positioncol),"white")==false) || (whiteUnicodes.includes(childElement.innerHTML) && CheckForThreat(board,"block"+String(positionrow+1)+String(positioncol),"black")==false)){
                    permitedpositions.push("block"+String(positionrow+1)+String(positioncol));
                }
            }

            //Check for roke possible movement
            //White King's big roke statement
            if(childElement.innerHTML=="\u2654" && WhiteKingHasMoved==false && WhiteTowerBigRoke==false && CheckForThreat(board,"block02","black")==false && CheckForThreat(board,"block03","black")==false && CheckForThreat(board,"block04","black")==false && board[0][1]=="-" && board[0][2]=="-" && board[0][3]=="-"){
                permitedpositions.push("block02");
            }
            //White King's small roke statement
            if(childElement.innerHTML=="\u2654" && WhiteKingHasMoved==false && WhiteTowerSmallRoke==false && CheckForThreat(board,"block04","black")==false && CheckForThreat(board,"block05","black")==false && CheckForThreat(board,"block06","black")==false && board[0][5]=="-" && board[0][6]=="-"){
                permitedpositions.push("block06");
            }
             //Black King's big roke statement
             if(childElement.innerHTML=="\u265A" && BlackKingHasMoved==false && BlackTowerBigRoke==false && CheckForThreat(board,"block72","white")==false && CheckForThreat(board,"block73","white")==false && CheckForThreat(board,"block74","white")==false && board[7][1]=="-" && board[7][2]=="-" && board[7][3]=="-"){
                permitedpositions.push("block72");
            }
            //Black King's small roke statement
            if(childElement.innerHTML=="\u265A" && BlackKingHasMoved==false && BlackTowerSmallRoke==false && CheckForThreat(board,"block74","white")==false && CheckForThreat(board,"block75","white")==false && CheckForThreat(board,"block76","white")==false && board[7][5]=="-" && board[7][6]=="-"){
                permitedpositions.push("block76");
            }

        }
        for(var i=0;i<permitedpositions.length;i++){
            //i initialize the table with the current board of the game
            var table= new Array(8); //board of the chess game 8X8
            for (var l=0;l<=7;l++){
                table[l]=new Array(8);
            }
            for (var l=0;l<=7;l++){
                for (var m=0;m<=7;m++){
                    table[l][m]=board[l][m];
                }
            }
            //I guess that the pawn is moved from the (positionrow,positioncol) position to the permited position
            table[positionrow][positioncol]="-";
            table[parseInt(permitedpositions[i].charAt(5))][parseInt(permitedpositions[i].charAt(6))]=board[positionrow][positioncol];
            if((CheckSach(table,"white")==false && numberofmoves%2==0) || (CheckSach(table,"black")==false && numberofmoves%2==1)){//I check after the guessed movement if the King still is under attack,then i permit only the movements which protect the King
                chooseblock(document.getElementById(permitedpositions[i]).parentNode);
                document.getElementById(permitedpositions[i]).parentNode.style.pointerEvents="auto";
            } 
        }
    }
    else{//When click happens on empty block
        childElement.innerHTML=valueoffullblock; //Insert the value of the pawn was clicked before
        document.getElementById(positionoffullblock).innerHTML=""; //Erase the pawn from its previous block
        board[positionrow][positioncol]=valueoffullblock; //insert new value from the board table
        board[parseInt(positionoffullblock.charAt(5))][parseInt(positionoffullblock.charAt(6))]="-"; //erase old value from the board table
        CheckForPromotion(childElement,valueoffullblock);
        numberofmoves++;
        //EnableBoard();
        for(var i=0;i<permitedpositions.length;i++){
            unchooseblock(document.getElementById(permitedpositions[i]).parentNode);
        }
        CleanArray(permitedpositions);

        //Check Kings and Towers if were moved for roke move permition
        if(valueoffullblock=="\u2654"){//First time the white King is moved
            WhiteKingHasMoved=true;
        }
        else if(valueoffullblock=="\u265A"){//First time the black King is moved
            BlackKingHasMoved=true;
        }
        else if(valueoffullblock=="\u2656" && positionoffullblock=="block00"){//First time the white Tower on position 0,0 is moved
            WhiteTowerBigRoke=true;
        }
        else if(valueoffullblock=="\u2656" && positionoffullblock=="block07"){//First time the white Tower on position 0,7 is moved
            WhiteTowerSmallRoke=true;
        }
        else if(valueoffullblock=="\u265C" && positionoffullblock=="block70"){//First time the black Tower on position 7,0 is moved
            BlackTowerBigRoke=true;
        }
        else if(valueoffullblock=="\u265C" && positionoffullblock=="block77"){//First time the black Tower on position 7,7 is moved
            BlackTowerSmallRoke=true;
        }

        //Check the case that a King was moved from its initial position two columns right or left-Big OR Small Roke movement
        //White King's big roke then move the white tower from position 0,0 to 0,3
        if(valueoffullblock=="\u2654" && positionoffullblock=="block04" && "block"+String(positionrow)+String(positioncol)=="block02"){
            document.getElementById("block03").innerHTML="\u2656";
            board[0][3]="\u2656";
            document.getElementById("block00").innerHTML="";
            board[0][0]="-";
        }
         //White King's small roke then move the white tower from position 0,7 to 0,5
         if(valueoffullblock=="\u2654" && positionoffullblock=="block04" && "block"+String(positionrow)+String(positioncol)=="block06"){
            document.getElementById("block05").innerHTML="\u2656";
            board[0][5]="\u2656";
            document.getElementById("block07").innerHTML="";
            board[0][7]="-";
        }
        //Black King's big roke then move the black tower from position 7,0 to 7,3
        if(valueoffullblock=="\u265A" && positionoffullblock=="block74" && "block"+String(positionrow)+String(positioncol)=="block72"){
            document.getElementById("block73").innerHTML="\u265C";
            board[7][3]="\u265C";
            document.getElementById("block70").innerHTML="";
            board[7][0]="-";
        }
        //Black King's small roke then move the black tower from position 7,7 to 7,5
        if(valueoffullblock=="\u265A" && positionoffullblock=="block74" && "block"+String(positionrow)+String(positioncol)=="block76"){
            document.getElementById("block75").innerHTML="\u265C";
            board[7][5]="\u265C";
            document.getElementById("block77").innerHTML="";
            board[7][7]="-";
        }

        //En Passant checking
        //White Pawn just moved two positions front
        if(valueoffullblock=="\u2659" && parseInt(positionoffullblock.charAt(5))==1 && positionrow==3){
            EnPassant="block"+String(positionrow)+String(positioncol);
        }
        //Black Pawn just moved two positions front
        else if(valueoffullblock=="\u265F" && parseInt(positionoffullblock.charAt(5))==6 && positionrow==4){
            EnPassant="block"+String(positionrow)+String(positioncol);
        }
        else{
            EnPassant="";
        }
        //White Pawn attacked to opponent via En Passant
        if(valueoffullblock=="\u2659" && (parseInt(positionoffullblock.charAt(6))-positioncol==1 || parseInt(positionoffullblock.charAt(6))-positioncol==-1)){
            //We have en  Passat move
            document.getElementById("block"+String(positionrow-1)+String(positioncol)).innerHTML="";
            board[positionrow-1][positioncol]="-";
            alert("En Passant");
        }
         //Black Pawn attacked to opponent via En Passant
         if(valueoffullblock=="\u265F" && (parseInt(positionoffullblock.charAt(6))-positioncol==1 || parseInt(positionoffullblock.charAt(6))-positioncol==-1)){
            //We have en  Passat move
            document.getElementById("block"+String(positionrow+1)+String(positioncol)).innerHTML="";
            board[positionrow+1][positioncol]="-";
            alert("En Passant");
        }

        socket.emit('receivemovechess',{board});
        DisableBoard();
        valueoffullblock="";
        positionoffullblock="";
        
    }
}

function CleanArray(array){//Cleans the array with the candidate positions of a movement
    array.length=0;
    
}

function CheckForPromotion(element,finalvalue){
    var finalposition=element.id;
    if(parseInt(finalposition.charAt(5))==7 && finalvalue=="\u2659"){//A white pawn just moved in the 8th row of the board
        var choosepawn=prompt("Choose the type of promotion:","Press Q:Queen,H:Horse,B:Bishop and T:Tower");
        while(choosepawn!="Q" && choosepawn!="H" && choosepawn!="B" && choosepawn!="T"){
            alert("Wrong answer!");
            choosepawn=prompt("Choose the type of promotion:","Press Q:Queen,H:Horse,B:Bishop and T:Tower");
        }
        if(choosepawn=="Q"){
            element.innerHTML="\u2655";//Promotion to White Queen
            board[parseInt(finalposition.charAt(5))][parseInt(finalposition.charAt(6))]="\u2655";
        }
        else if(choosepawn=="H"){
            element.innerHTML="\u2658";//Promotion to White Horse
            board[parseInt(finalposition.charAt(5))][parseInt(finalposition.charAt(6))]="\u2658";
        }
        else if(choosepawn=="B"){
            element.innerHTML="\u2657";//Promotion to White Bishop
            board[parseInt(finalposition.charAt(5))][parseInt(finalposition.charAt(6))]="\u2657";
        }
        else if(choosepawn=="T"){
            element.innerHTML="\u2656";//Promotion to White Tower
            board[parseInt(finalposition.charAt(5))][parseInt(finalposition.charAt(6))]="\u2656";
            
        }
    }
    else if(parseInt(finalposition.charAt(5))==0 && finalvalue=="\u265F"){//A black pawn just moved in the 1st row of the board
        var choosepawn=prompt("Choose the type of promotion:","Press Q:Queen,H:Horse,B:Bishop and T:Tower");
        while(choosepawn!="Q" && choosepawn!="H" && choosepawn!="B" && choosepawn!="T"){
            alert("Wrong answer!");
            choosepawn=prompt("Choose the type of promotion:","Press Q:Queen,H:Horse,B:Bishop and T:Tower");
        }
        if(choosepawn=="Q"){
            element.innerHTML="\u265B";//Promotion to Black Queen
            board[parseInt(finalposition.charAt(5))][parseInt(finalposition.charAt(6))]="\u265B";
        }
        else if(choosepawn=="H"){
            element.innerHTML="\u265E";//Promotion to Black Horse
            board[parseInt(finalposition.charAt(5))][parseInt(finalposition.charAt(6))]="\u265E";
        }
        else if(choosepawn=="B"){
            element.innerHTML="\u265D";//Promotion to Black Bishop
            board[parseInt(finalposition.charAt(5))][parseInt(finalposition.charAt(6))]="\u265D";
        }
        else if(choosepawn=="T"){
            element.innerHTML="\u265C";//Promotion to Black Tower
            board[parseInt(finalposition.charAt(5))][parseInt(finalposition.charAt(6))]="\u265C";
        }
    }
}

function CheckForThreat(table,positiontocheck,opponent){//I want to check if any of the opponent's(white or black) pawns threat the positionofpawn,etc if there is an opponent's pawn which could be moved to the positionofpawn
    var candidatepos=[];//Every time check the candidate position of the opponent's pawn(the positions where a pawn could attack),if you find that the positiontocheck is a candidate position of an opponents pawn return true else false 
    if(opponent=="white"){
        for(var i=0;i<8;i++){
            for(var j=0;j<8;j++){
                if(table[i][j]=="\u2659"){//Check for white pawn
                    if(i+1<8 && j-1>=0){
                        candidatepos.push("block"+String(i+1)+String(j-1));
                    }
                    if(i+1<8 && j+1<8){
                        candidatepos.push("block"+String(i+1)+String(j+1));
                    }
                    //May i must add the en passat move case
                }
                else if(table[i][j]=="\u2656"){//Check for white tower
                    var temprow=i+1;
                    while(temprow<8 && table[temprow][j]=="-"){
                        candidatepos.push("block"+String(temprow)+String(j));
                        temprow++;
                    }
                    if(temprow<8 && blackUnicodes.includes(table[temprow][j])){
                        candidatepos.push("block"+String(temprow)+String(j));
                    }
                    temprow=i-1;
                    while(temprow>=0 && table[temprow][j]=="-"){
                        candidatepos.push("block"+String(temprow)+String(j));
                        temprow--;
                    }
                    if(temprow>=0 && blackUnicodes.includes(table[temprow][j])){
                        candidatepos.push("block"+String(temprow)+String(j));
                    }
                    var tempcol=j+1;
                    while(tempcol<8 && table[i][tempcol]=="-"){
                        candidatepos.push("block"+String(i)+String(tempcol));
                        tempcol++;
                    }
                    if(tempcol<8 && blackUnicodes.includes(table[i][tempcol])){
                        candidatepos.push("block"+String(i)+String(tempcol));
                    }
                    tempcol=j-1;
                    while(tempcol>=0 && table[i][tempcol]=="-"){
                        candidatepos.push("block"+String(i)+String(tempcol));
                        tempcol--;
                    }
                    if(tempcol>=0 && blackUnicodes.includes(table[i][tempcol])){
                        candidatepos.push("block"+String(i)+String(tempcol));
                    }
                }
                else if(table[i][j]=="\u2658"){//Check for white horse
                    if(i+2<8 && j+1<8 && (table[i+2][j+1]=="-" || blackUnicodes.includes(table[i+2][j+1]))){
                        candidatepos.push("block"+String(i+2)+String(j+1));
                    }
                    if(i+2<8 && j-1>=0 && (table[i+2][j-1]=="-" || blackUnicodes.includes(table[i+2][j-1]))){
                        candidatepos.push("block"+String(i+2)+String(j-1));
                    }
                    if(i-2>=0 && j+1<8 && (table[i-2][j+1]=="-" || blackUnicodes.includes(table[i-2][j+1]))){
                        candidatepos.push("block"+String(i-2)+String(j+1));
                    }
                    if(i-2>=0 && j-1>=0 && (table[i-2][j-1]=="-" || blackUnicodes.includes(table[i-2][j-1]))){
                        candidatepos.push("block"+String(i-2)+String(j-1));
                    }
                    if(i+1<8 && j+2<8 && (table[i+1][j+2]=="-" || blackUnicodes.includes(table[i+1][j+2]))){
                        candidatepos.push("block"+String(i+1)+String(j+2));
                    }
                    if(i+1<8 && j-2>=0 && (table[i+1][j-2]=="-" || blackUnicodes.includes(table[i+1][j-2]))){
                        candidatepos.push("block"+String(i+1)+String(j-2));
                    }
                    if(i-1>=0 && j+2<8 && (table[i-1][j+2]=="-" || blackUnicodes.includes(table[i-1][j+2]))){
                        candidatepos.push("block"+String(i-1)+String(j+2));
                    }
                    if(i-1>=0 && j-2>=0 && (table[i-1][j-2]=="-" || blackUnicodes.includes(table[i-1][j-2]))){
                        candidatepos.push("block"+String(i-1)+String(j-2));
                    }
                }
                else if(table[i][j]=="\u2657"){//Check for white bishop
                    var temprow=i+1;
                    var tempcol=j+1;
                    while(temprow<8 && tempcol<8 && table[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow++;
                        tempcol++;
                    }
                    if(temprow<8 && tempcol<8 && blackUnicodes.includes(table[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i-1;
                    tempcol=j+1;
                    while(temprow>=0 && tempcol<8 && table[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow--;
                        tempcol++;
                    }
                    if(temprow>=0 && tempcol<8 && blackUnicodes.includes(table[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i+1;
                    tempcol=j-1;
                    while(temprow<8 && tempcol>=0 && table[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow++;
                        tempcol--;
                    }
                    if(temprow<8 && tempcol>=0 && blackUnicodes.includes(table[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i-1;
                    tempcol=j-1;
                    while(temprow>=0 && tempcol>=0 && table[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow--;
                        tempcol--;
                    }
                    if(temprow>=0 && tempcol>=0 && blackUnicodes.includes(table[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                }
                else if(table[i][j]=="\u2655"){//Check for white Queen
                    var temprow=i+1;
                    var tempcol=j+1;
                    while(temprow<8 && tempcol<8 && table[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow++;
                        tempcol++;
                    }
                    if(temprow<8 && tempcol<8 && blackUnicodes.includes(table[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i-1;
                    tempcol=j+1;
                    while(temprow>=0 && tempcol<8 && table[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow--;
                        tempcol++;
                    }
                    if(temprow>=0 && tempcol<8 && blackUnicodes.includes(table[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i+1;
                    tempcol=j-1;
                    while(temprow<8 && tempcol>=0 && table[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow++;
                        tempcol--;
                    }
                    if(temprow<8 && tempcol>=0 && blackUnicodes.includes(table[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i-1;
                    tempcol=j-1;
                    while(temprow>=0 && tempcol>=0 && table[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow--;
                        tempcol--;
                    }
                    if(temprow>=0 && tempcol>=0 && blackUnicodes.includes(table[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i+1;
                    while(temprow<8 && table[temprow][j]=="-"){
                        candidatepos.push("block"+String(temprow)+String(j));
                        temprow++;
                    }
                    if(temprow<8 && blackUnicodes.includes(table[temprow][j])){
                        candidatepos.push("block"+String(temprow)+String(j));
                    }
                    temprow=i-1;
                    while(temprow>=0 && table[temprow][j]=="-"){
                        candidatepos.push("block"+String(temprow)+String(j));
                        temprow--;
                    }
                    if(temprow>=0 && blackUnicodes.includes(table[temprow][j])){
                        candidatepos.push("block"+String(temprow)+String(j));
                    }
                    tempcol=j+1;
                    while(tempcol<8 && table[i][tempcol]=="-"){
                        candidatepos.push("block"+String(i)+String(tempcol));
                        tempcol++;
                    }
                    if(tempcol<8 && blackUnicodes.includes(table[i][tempcol])){
                        candidatepos.push("block"+String(i)+String(tempcol));
                    }
                    tempcol=j-1;
                    while(tempcol>=0 && table[i][tempcol]=="-"){
                        candidatepos.push("block"+String(i)+String(tempcol));
                        tempcol--;
                    }
                    if(tempcol>=0 && blackUnicodes.includes(table[i][tempcol])){
                        candidatepos.push("block"+String(i)+String(tempcol));
                    }
                }
                else if(table[i][j]=="\u2654"){//Check for white King
                    if(i+1<8 && j+1<8 && (table[i+1][j+1]=="-" || blackUnicodes.includes(table[i+1][j+1]))){
                        candidatepos.push("block"+String(i+1)+String(j+1));
                    }
                    if(j+1<8 && (table[i][j+1]=="-" || blackUnicodes.includes(table[i][j+1]))){
                        candidatepos.push("block"+String(i)+String(j+1));
                    }
                    if(i-1>=0 && j+1<8 && (table[i-1][j+1]=="-" || blackUnicodes.includes(table[i-1][j+1]))){
                        candidatepos.push("block"+String(i-1)+String(j+1));
                    }
                    if(i-1>=0 && (table[i-1][j]=="-" || blackUnicodes.includes(table[i-1][j]))){
                        candidatepos.push("block"+String(i-1)+String(j));
                    }
                    if(i-1>=0 && j-1>=0 && (table[i-1][j-1]=="-" || blackUnicodes.includes(table[i-1][j-1]))){
                        candidatepos.push("block"+String(i-1)+String(j-1));
                    }
                    if(j-1>=0 && (table[i][j-1]=="-" || blackUnicodes.includes(table[i][j-1]))){
                        candidatepos.push("block"+String(i)+String(j-1));
                    }
                    if(i+1<8 && j-1>=0 && (table[i+1][j-1]=="-" || blackUnicodes.includes(table[i+1][j-1]))){
                        candidatepos.push("block"+String(i+1)+String(j-1));
                    }
                    if(i+1<8 && (table[i+1][j]=="-" || blackUnicodes.includes(table[i+1][j]))){
                        candidatepos.push("block"+String(i+1)+String(j));
                    }
                }
                if(candidatepos.includes(positiontocheck)){
                    return true; //the positiontocheck is under attack by the opponent ,don't have to check further
                }
                else{
                    candidatepos=[];//clean array of candidatepos and check the candidate positions of the next opponent's pawn
                }
            }
        }
    }
    else if (opponent=="black"){
        for(var i=0;i<8;i++){
            for(var j=0;j<8;j++){
                if(table[i][j]=="\u265F"){//Check for black pawn
                    if(i-1>=0 && j-1>=0){
                        candidatepos.push("block"+String(i-1)+String(j-1));
                    }
                    if(i-1>=0 && j+1<8){
                        candidatepos.push("block"+String(i-1)+String(j+1));
                    }
                    //May i have to add the en passat case
                }
                else if(table[i][j]=="\u265C"){//Check for black tower
                    var temprow=i+1;
                    while(temprow<8 && table[temprow][j]=="-"){
                        candidatepos.push("block"+String(temprow)+String(j));
                        temprow++;
                    }
                    if(temprow<8 && whiteUnicodes.includes(table[temprow][j])){
                        candidatepos.push("block"+String(temprow)+String(j));
                    }
                    temprow=i-1;
                    while(temprow>=0 && table[temprow][j]=="-"){
                        candidatepos.push("block"+String(temprow)+String(j));
                        temprow--;
                    }
                    if(temprow>=0 && whiteUnicodes.includes(table[temprow][j])){
                        candidatepos.push("block"+String(temprow)+String(j));
                    }
                    var tempcol=j+1;
                    while(tempcol<8 && table[i][tempcol]=="-"){
                        candidatepos.push("block"+String(i)+String(tempcol));
                        tempcol++;
                    }
                    if(tempcol<8 && whiteUnicodes.includes(table[i][tempcol])){
                        candidatepos.push("block"+String(i)+String(tempcol));
                    }
                    tempcol=j-1;
                    while(tempcol>=0 && table[i][tempcol]=="-"){
                        candidatepos.push("block"+String(i)+String(tempcol));
                        tempcol--;
                    }
                    if(tempcol>=0 && whiteUnicodes.includes(table[i][tempcol])){
                        candidatepos.push("block"+String(i)+String(tempcol));
                    }
                }
                else if(table[i][j]=="\u265E"){//Check for black horse
                    if(i+2<8 && j+1<8 && (table[i+2][j+1]=="-" || whiteUnicodes.includes(table[i+2][j+1]))){
                        candidatepos.push("block"+String(i+2)+String(j+1));
                    }
                    if(i+2<8 && j-1>=0 && (table[i+2][j-1]=="-" || whiteUnicodes.includes(table[i+2][j-1]))){
                        candidatepos.push("block"+String(i+2)+String(j-1));
                    }
                    if(i-2>=0 && j+1<8 && (table[i-2][j+1]=="-" || whiteUnicodes.includes(table[i-2][j+1]))){
                        candidatepos.push("block"+String(i-2)+String(j+1));
                    }
                    if(i-2>=0 && j-1>=0 && (table[i-2][j-1]=="-" || whiteUnicodes.includes(table[i-2][j-1]))){
                        candidatepos.push("block"+String(i-2)+String(j-1));
                    }
                    if(i+1<8 && j+2<8 && (table[i+1][j+2]=="-" || whiteUnicodes.includes(table[i+1][j+2]))){
                        candidatepos.push("block"+String(i+1)+String(j+2));
                    }
                    if(i+1<8 && j-2>=0 && (table[i+1][j-2]=="-" || whiteUnicodes.includes(table[i+1][j-2]))){
                        candidatepos.push("block"+String(i+1)+String(j-2));
                    }
                    if(i-1>=0 && j+2<8 && (table[i-1][j+2]=="-" || whiteUnicodes.includes(table[i-1][j+2]))){
                        candidatepos.push("block"+String(i-1)+String(j+2));
                    }
                    if(i-1>=0 && j-2>=0 && (table[i-1][j-2]=="-" || whiteUnicodes.includes(table[i-1][j-2]))){
                        candidatepos.push("block"+String(i-1)+String(j-2));
                    }
                }
                else if(table[i][j]=="\u265D"){//Check for black bishop
                    var temprow=i+1;
                    var tempcol=j+1;
                    while(temprow<8 && tempcol<8 && table[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow++;
                        tempcol++;
                    }
                    if(temprow<8 && tempcol<8 && whiteUnicodes.includes(table[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i-1;
                    tempcol=j+1;
                    while(temprow>=0 && tempcol<8 && table[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow--;
                        tempcol++;
                    }
                    if(temprow>=0 && tempcol<8 && whiteUnicodes.includes(table[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i+1;
                    tempcol=j-1;
                    while(temprow<8 && tempcol>=0 && table[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow++;
                        tempcol--;
                    }
                    if(temprow<8 && tempcol>=0 && whiteUnicodes.includes(table[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i-1;
                    tempcol=j-1;
                    while(temprow>=0 && tempcol>=0 && table[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow--;
                        tempcol--;
                    }
                    if(temprow>=0 && tempcol>=0 && whiteUnicodes.includes(table[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                }
                else if(table[i][j]=="\u265B"){//Check for black Queen
                    var temprow=i+1;
                    var tempcol=j+1;
                    while(temprow<8 && tempcol<8 && table[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow++;
                        tempcol++;
                    }
                    if(temprow<8 && tempcol<8 && whiteUnicodes.includes(table[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i-1;
                    tempcol=j+1;
                    while(temprow>=0 && tempcol<8 && table[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow--;
                        tempcol++;
                    }
                    if(temprow>=0 && tempcol<8 && whiteUnicodes.includes(table[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i+1;
                    tempcol=j-1;
                    while(temprow<8 && tempcol>=0 && table[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow++;
                        tempcol--;
                    }
                    if(temprow<8 && tempcol>=0 && whiteUnicodes.includes(table[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i-1;
                    tempcol=j-1;
                    while(temprow>=0 && tempcol>=0 && table[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow--;
                        tempcol--;
                    }
                    if(temprow>=0 && tempcol>=0 && whiteUnicodes.includes(table[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i+1;
                    while(temprow<8 && table[temprow][j]=="-"){
                        candidatepos.push("block"+String(temprow)+String(j));
                        temprow++;
                    }
                    if(temprow<8 && whiteUnicodes.includes(table[temprow][j])){
                        candidatepos.push("block"+String(temprow)+String(j));
                    }
                    temprow=i-1;
                    while(temprow>=0 && table[temprow][j]=="-"){
                        candidatepos.push("block"+String(temprow)+String(j));
                        temprow--;
                    }
                    if(temprow>=0 && whiteUnicodes.includes(table[temprow][j])){
                        candidatepos.push("block"+String(temprow)+String(j));
                    }
                    tempcol=j+1;
                    while(tempcol<8 && table[i][tempcol]=="-"){
                        candidatepos.push("block"+String(i)+String(tempcol));
                        tempcol++;
                    }
                    if(tempcol<8 && whiteUnicodes.includes(table[i][tempcol])){
                        candidatepos.push("block"+String(i)+String(tempcol));
                    }
                    tempcol=j-1;
                    while(tempcol>=0 && table[i][tempcol]=="-"){
                        candidatepos.push("block"+String(i)+String(tempcol));
                        tempcol--;
                    }
                    if(tempcol>=0 && whiteUnicodes.includes(table[i][tempcol])){
                        candidatepos.push("block"+String(i)+String(tempcol));
                    }
                }
                else if(table[i][j]=="\u265A"){//Check for black King
                    if(i+1<8 && j+1<8 && (table[i+1][j+1]=="-" || whiteUnicodes.includes(table[i+1][j+1]))){
                        candidatepos.push("block"+String(i+1)+String(j+1));
                    }
                    if(j+1<8 && (table[i][j+1]=="-" || whiteUnicodes.includes(table[i][j+1]))){
                        candidatepos.push("block"+String(i)+String(j+1));
                    }
                    if(i-1>=0 && j+1<8 && (table[i-1][j+1]=="-" || whiteUnicodes.includes(table[i-1][j+1]))){
                        candidatepos.push("block"+String(i-1)+String(j+1));
                    }
                    if(i-1>=0 && (table[i-1][j]=="-" || whiteUnicodes.includes(table[i-1][j]))){
                        candidatepos.push("block"+String(i-1)+String(j));
                    }
                    if(i-1>=0 && j-1>=0 && (table[i-1][j-1]=="-" || whiteUnicodes.includes(table[i-1][j-1]))){
                        candidatepos.push("block"+String(i-1)+String(j-1));
                    }
                    if(j-1>=0 && (table[i][j-1]=="-" || whiteUnicodes.includes(table[i][j-1]))){
                        candidatepos.push("block"+String(i)+String(j-1));
                    }
                    if(i+1<8 && j-1>=0 && (table[i+1][j-1]=="-" || whiteUnicodes.includes(table[i+1][j-1]))){
                        candidatepos.push("block"+String(i+1)+String(j-1));
                    }
                    if(i+1<8 && (table[i+1][j]=="-" || whiteUnicodes.includes(table[i+1][j]))){
                        candidatepos.push("block"+String(i+1)+String(j));
                    }
                }
                if(candidatepos.includes(positiontocheck)){
                    return true; //the positiontocheck is under attack by the opponent ,don't have to check further
                }
                else{
                    candidatepos=[];//clean array of candidatepos and check the candidate positions of the next opponent's pawn
                }
            }
        }
    }
    return false;
}

function CheckSach(table,player){//Check if a king is under attack-Player==white we check the white King else if player==black we check the black King
    var kingsposition;
    for(var i=0;i<8;i++){
        for(var j=0;j<8;j++){   
            if(player=="white" && table[i][j]=="\u2654"){
                kingsposition="block"+String(i)+String(j);
                return CheckForThreat(table,kingsposition,"black");
            }
            else if(player=="black" && table[i][j]=="\u265A"){
                kingsposition="block"+String(i)+String(j);
                return CheckForThreat(table,kingsposition,"white");
            }
        }
    }
}

function CheckForPat(player){//Check if there are not possible movements for a player to protect the King
    var candidatepos=[];//Every time check the candidate position of the player's pawn(the positions where a pawn could be moved)
    if(player=="white"){
        for(var i=0;i<8;i++){
            for(var j=0;j<8;j++){
                if(board[i][j]=="\u2659"){//Check for white pawn
                    if(i+1<8 && board[i+1][j]=="-"){
                        candidatepos.push("block"+String(i+1)+String(j));
                    }
                    if(i+1<8 && board[i+1][j]=="-" && board[i+2][j]=="-"){
                        candidatepos.push("block"+String(i+2)+String(j));
                    }
                    if(i+1<8 && j-1>=0 && board[i+1][j-1]!="-" && blackUnicodes.includes(board[i+1][j-1])){
                        candidatepos.push("block"+String(i+1)+String(j-1));
                    }
                    if(i+1<8 && j+1<8 && board[i+1][j+1]!="-" && blackUnicodes.includes(board[i+1][j+1])){
                        candidatepos.push("block"+String(i+1)+String(j+1));
                    }
                    if(EnPassant!=""){
                        if(parseInt(EnPassant.charAt(5))==i && (parseInt(EnPassant.charAt(6))-j==1 || parseInt(EnPassant.charAt(6))-j==-1)){
                            candidatepos.push("block"+String(i+1)+EnPassant.charAt(6));
                        }
                    }
                }
                else if(board[i][j]=="\u2656"){//Check for white tower
                    var temprow=i+1;
                    while(temprow<8 && board[temprow][j]=="-"){
                        candidatepos.push("block"+String(temprow)+String(j));
                        temprow++;
                    }
                    if(temprow<8 && blackUnicodes.includes(board[temprow][j])){
                        candidatepos.push("block"+String(temprow)+String(j));
                    }
                    temprow=i-1;
                    while(temprow>=0 && board[temprow][j]=="-"){
                        candidatepos.push("block"+String(temprow)+String(j));
                        temprow--;
                    }
                    if(temprow>=0 && blackUnicodes.includes(board[temprow][j])){
                        candidatepos.push("block"+String(temprow)+String(j));
                    }
                    var tempcol=j+1;
                    while(tempcol<8 && board[i][tempcol]=="-"){
                        candidatepos.push("block"+String(i)+String(tempcol));
                        tempcol++;
                    }
                    if(tempcol<8 && blackUnicodes.includes(board[i][tempcol])){
                        candidatepos.push("block"+String(i)+String(tempcol));
                    }
                    tempcol=j-1;
                    while(tempcol>=0 && board[i][tempcol]=="-"){
                        candidatepos.push("block"+String(i)+String(tempcol));
                        tempcol--;
                    }
                    if(tempcol>=0 && blackUnicodes.includes(board[i][tempcol])){
                        candidatepos.push("block"+String(i)+String(tempcol));
                    }
                }
                else if(board[i][j]=="\u2658"){//Check for white horse
                    if(i+2<8 && j+1<8 && (board[i+2][j+1]=="-" || blackUnicodes.includes(board[i+2][j+1]))){
                        candidatepos.push("block"+String(i+2)+String(j+1));
                    }
                    if(i+2<8 && j-1>=0 && (board[i+2][j-1]=="-" || blackUnicodes.includes(board[i+2][j-1]))){
                        candidatepos.push("block"+String(i+2)+String(j-1));
                    }
                    if(i-2>=0 && j+1<8 && (board[i-2][j+1]=="-" || blackUnicodes.includes(board[i-2][j+1]))){
                        candidatepos.push("block"+String(i-2)+String(j+1));
                    }
                    if(i-2>=0 && j-1>=0 && (board[i-2][j-1]=="-" || blackUnicodes.includes(board[i-2][j-1]))){
                        candidatepos.push("block"+String(i-2)+String(j-1));
                    }
                    if(i+1<8 && j+2<8 && (board[i+1][j+2]=="-" || blackUnicodes.includes(board[i+1][j+2]))){
                        candidatepos.push("block"+String(i+1)+String(j+2));
                    }
                    if(i+1<8 && j-2>=0 && (board[i+1][j-2]=="-" || blackUnicodes.includes(board[i+1][j-2]))){
                        candidatepos.push("block"+String(i+1)+String(j-2));
                    }
                    if(i-1>=0 && j+2<8 && (board[i-1][j+2]=="-" || blackUnicodes.includes(board[i-1][j+2]))){
                        candidatepos.push("block"+String(i-1)+String(j+2));
                    }
                    if(i-1>=0 && j-2>=0 && (board[i-1][j-2]=="-" || blackUnicodes.includes(board[i-1][j-2]))){
                        candidatepos.push("block"+String(i-1)+String(j-2));
                    }
                }
                else if(board[i][j]=="\u2657"){//Check for white bishop
                    var temprow=i+1;
                    var tempcol=j+1;
                    while(temprow<8 && tempcol<8 && board[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow++;
                        tempcol++;
                    }
                    if(temprow<8 && tempcol<8 && blackUnicodes.includes(board[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i-1;
                    tempcol=j+1;
                    while(temprow>=0 && tempcol<8 && board[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow--;
                        tempcol++;
                    }
                    if(temprow>=0 && tempcol<8 && blackUnicodes.includes(board[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i+1;
                    tempcol=j-1;
                    while(temprow<8 && tempcol>=0 && board[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow++;
                        tempcol--;
                    }
                    if(temprow<8 && tempcol>=0 && blackUnicodes.includes(board[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i-1;
                    tempcol=j-1;
                    while(temprow>=0 && tempcol>=0 && board[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow--;
                        tempcol--;
                    }
                    if(temprow>=0 && tempcol>=0 && blackUnicodes.includes(board[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                }
                else if(board[i][j]=="\u2655"){//Check for white Queen
                    var temprow=i+1;
                    var tempcol=j+1;
                    while(temprow<8 && tempcol<8 && board[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow++;
                        tempcol++;
                    }
                    if(temprow<8 && tempcol<8 && blackUnicodes.includes(board[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i-1;
                    tempcol=j+1;
                    while(temprow>=0 && tempcol<8 && board[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow--;
                        tempcol++;
                    }
                    if(temprow>=0 && tempcol<8 && blackUnicodes.includes(board[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i+1;
                    tempcol=j-1;
                    while(temprow<8 && tempcol>=0 && board[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow++;
                        tempcol--;
                    }
                    if(temprow<8 && tempcol>=0 && blackUnicodes.includes(board[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i-1;
                    tempcol=j-1;
                    while(temprow>=0 && tempcol>=0 && board[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow--;
                        tempcol--;
                    }
                    if(temprow>=0 && tempcol>=0 && blackUnicodes.includes(board[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i+1;
                    while(temprow<8 && board[temprow][j]=="-"){
                        candidatepos.push("block"+String(temprow)+String(j));
                        temprow++;
                    }
                    if(temprow<8 && blackUnicodes.includes(board[temprow][j])){
                        candidatepos.push("block"+String(temprow)+String(j));
                    }
                    temprow=i-1;
                    while(temprow>=0 && board[temprow][j]=="-"){
                        candidatepos.push("block"+String(temprow)+String(j));
                        temprow--;
                    }
                    if(temprow>=0 && blackUnicodes.includes(board[temprow][j])){
                        candidatepos.push("block"+String(temprow)+String(j));
                    }
                    tempcol=j+1;
                    while(tempcol<8 && board[i][tempcol]=="-"){
                        candidatepos.push("block"+String(i)+String(tempcol));
                        tempcol++;
                    }
                    if(tempcol<8 && blackUnicodes.includes(board[i][tempcol])){
                        candidatepos.push("block"+String(i)+String(tempcol));
                    }
                    tempcol=j-1;
                    while(tempcol>=0 && board[i][tempcol]=="-"){
                        candidatepos.push("block"+String(i)+String(tempcol));
                        tempcol--;
                    }
                    if(tempcol>=0 && blackUnicodes.includes(board[i][tempcol])){
                        candidatepos.push("block"+String(i)+String(tempcol));
                    }
                }
                else if(board[i][j]=="\u2654"){//Check for white King
                    if(i+1<8 && j+1<8 && (board[i+1][j+1]=="-" || blackUnicodes.includes(board[i+1][j+1]))){
                        if(CheckForThreat(board,"block"+String(i+1)+String(j+1),"black")==false){
                            candidatepos.push("block"+String(i+1)+String(j+1));
                        }                    
                    }
                    if(j+1<8 && (board[i][j+1]=="-" || blackUnicodes.includes(board[i][j+1]))){
                        if(CheckForThreat(board,"block"+String(i)+String(j+1),"black")==false){
                            candidatepos.push("block"+String(i)+String(j+1));
                        }                    
                    }
                    if(i-1>=0 && j+1<8 && (board[i-1][j+1]=="-" || blackUnicodes.includes(board[i-1][j+1]))){
                        if(CheckForThreat(board,"block"+String(i-1)+String(j+1),"black")==false){
                            candidatepos.push("block"+String(i-1)+String(j+1));
                        }                    
                    }
                    if(i-1>=0 && (board[i-1][j]=="-" || blackUnicodes.includes(board[i-1][j]))){
                        if(CheckForThreat(board,"block"+String(i-1)+String(j),"black")==false){
                            candidatepos.push("block"+String(i-1)+String(j));
                        }                   
                     }
                    if(i-1>=0 && j-1>=0 && (board[i-1][j-1]=="-" || blackUnicodes.includes(board[i-1][j-1]))){
                        if(CheckForThreat(board,"block"+String(i-1)+String(j-1),"black")==false){
                            candidatepos.push("block"+String(i-1)+String(j-1));
                        }                    
                    }
                    if(j-1>=0 && (board[i][j-1]=="-" || blackUnicodes.includes(board[i][j-1]))){
                        if(CheckForThreat(board,"block"+String(i)+String(j-1),"black")==false){
                            candidatepos.push("block"+String(i)+String(j-1));
                        }                    
                    }
                    if(i+1<8 && j-1>=0 && (board[i+1][j-1]=="-" || blackUnicodes.includes(board[i+1][j-1]))){
                        if(CheckForThreat(board,"block"+String(i+1)+String(j-1),"black")==false){
                            candidatepos.push("block"+String(i+1)+String(j-1));
                        }                    
                    }
                    if(i+1<8 && (board[i+1][j]=="-" || blackUnicodes.includes(board[i+1][j]))){
                        if(CheckForThreat(board,"block"+String(i+1)+String(j),"black")==false){
                            candidatepos.push("block"+String(i+1)+String(j));
                        }                    
                    }
                    //White King's big roke statement
                    if(WhiteKingHasMoved==false && WhiteTowerBigRoke==false && CheckForThreat(board,"block02","black")==false && CheckForThreat(board,"block03","black")==false && CheckForThreat(board,"block04","black")==false && board[0][1]=="-" && board[0][2]=="-" && board[0][3]=="-"){
                        candidatepos.push("block02");
                    }
                    //White King's small roke statement
                    if(WhiteKingHasMoved==false && WhiteTowerSmallRoke==false && CheckForThreat(board,"block04","black")==false && CheckForThreat(board,"block05","black")==false && CheckForThreat(board,"block06","black")==false && board[0][5]=="-" && board[0][6]=="-"){
                        candidatepos.push("block06");
                    }

                }
                //After taking the possible positions of a pawn for movement
                //I check the table guessing that every time the player makes a movement from them
                for(var k=0;k<candidatepos.length;k++){
                   //i initialize the table with the current board of the game
                    var table= new Array(8); //board of the chess game 8X8
                    for (var l=0;l<=7;l++){
                        table[l]=new Array(8);
                    }
                    for (var l=0;l<=7;l++){
                        for (var m=0;m<=7;m++){
                            table[l][m]=board[l][m];
                        }
                    }
                    //I guess that the pawn is moved from the (i,j) position to the candidate position
                    table[i][j]="-";
                    table[parseInt(candidatepos[k].charAt(5))][parseInt(candidatepos[k].charAt(6))]=board[i][j];
                    if(CheckSach(table,player)==false){//After the guessed move i check if King is threatened
                        return false; //There is at least one movement to do in order to protect the King,No Pat exists
                    }
                }
                candidatepos=[];//clean array of candidatepos and check the candidate positions of the next player's pawn
                
            }
        }
    }
    else if (player=="black"){
        for(var i=0;i<8;i++){
            for(var j=0;j<8;j++){
                if(board[i][j]=="\u265F"){//Check for black pawn
                    if(i-1>=0 && board[i-1][j]=="-"){
                        candidatepos.push("block"+String(i-1)+String(j));
                    }
                    if(i-2>=0 && board[i-1][j]=="-" && board[i-2][j]=="-"){
                        candidatepos.push("block"+String(i-2)+String(j));
                    }
                    if(i-1>=0 && j-1>=0 && board[i-1][j-1]!="-" && whiteUnicodes.includes(board[i-1][j-1])){
                        candidatepos.push("block"+String(i-1)+String(j-1));
                    }
                    if(i-1>=0 && j+1<8 && board[i-1][j+1]!="-" && whiteUnicodes.includes(board[i-1][j+1])){
                        candidatepos.push("block"+String(i-1)+String(j+1));
                    }
                    if(EnPassant!=""){
                        if(parseInt(EnPassant.charAt(5))==i && (parseInt(EnPassant.charAt(6))-j==1 || parseInt(EnPassant.charAt(6))-j==-1)){
                            candidatepos.push("block"+String(i-1)+EnPassant.charAt(6));
                        }
                    }
                }
                else if(board[i][j]=="\u265C"){//Check for black tower
                    var temprow=i+1;
                    while(temprow<8 && board[temprow][j]=="-"){
                        candidatepos.push("block"+String(temprow)+String(j));
                        temprow++;
                    }
                    if(temprow<8 && whiteUnicodes.includes(board[temprow][j])){
                        candidatepos.push("block"+String(temprow)+String(j));
                    }
                    temprow=i-1;
                    while(temprow>=0 && board[temprow][j]=="-"){
                        candidatepos.push("block"+String(temprow)+String(j));
                        temprow--;
                    }
                    if(temprow>=0 && whiteUnicodes.includes(board[temprow][j])){
                        candidatepos.push("block"+String(temprow)+String(j));
                    }
                    var tempcol=j+1;
                    while(tempcol<8 && board[i][tempcol]=="-"){
                        candidatepos.push("block"+String(i)+String(tempcol));
                        tempcol++;
                    }
                    if(tempcol<8 && whiteUnicodes.includes(board[i][tempcol])){
                        candidatepos.push("block"+String(i)+String(tempcol));
                    }
                    tempcol=j-1;
                    while(tempcol>=0 && board[i][tempcol]=="-"){
                        candidatepos.push("block"+String(i)+String(tempcol));
                        tempcol--;
                    }
                    if(tempcol>=0 && whiteUnicodes.includes(board[i][tempcol])){
                        candidatepos.push("block"+String(i)+String(tempcol));
                    }
                }
                else if(board[i][j]=="\u265E"){//Check for black horse
                    if(i+2<8 && j+1<8 && (board[i+2][j+1]=="-" || whiteUnicodes.includes(board[i+2][j+1]))){
                        candidatepos.push("block"+String(i+2)+String(j+1));
                    }
                    if(i+2<8 && j-1>=0 && (board[i+2][j-1]=="-" || whiteUnicodes.includes(board[i+2][j-1]))){
                        candidatepos.push("block"+String(i+2)+String(j-1));
                    }
                    if(i-2>=0 && j+1<8 && (board[i-2][j+1]=="-" || whiteUnicodes.includes(board[i-2][j+1]))){
                        candidatepos.push("block"+String(i-2)+String(j+1));
                    }
                    if(i-2>=0 && j-1>=0 && (board[i-2][j-1]=="-" || whiteUnicodes.includes(board[i-2][j-1]))){
                        candidatepos.push("block"+String(i-2)+String(j-1));
                    }
                    if(i+1<8 && j+2<8 && (board[i+1][j+2]=="-" || whiteUnicodes.includes(board[i+1][j+2]))){
                        candidatepos.push("block"+String(i+1)+String(j+2));
                    }
                    if(i+1<8 && j-2>=0 && (board[i+1][j-2]=="-" || whiteUnicodes.includes(board[i+1][j-2]))){
                        candidatepos.push("block"+String(i+1)+String(j-2));
                    }
                    if(i-1>=0 && j+2<8 && (board[i-1][j+2]=="-" || whiteUnicodes.includes(board[i-1][j+2]))){
                        candidatepos.push("block"+String(i-1)+String(j+2));
                    }
                    if(i-1>=0 && j-2>=0 && (board[i-1][j-2]=="-" || whiteUnicodes.includes(board[i-1][j-2]))){
                        candidatepos.push("block"+String(i-1)+String(j-2));
                    }
                }
                else if(board[i][j]=="\u265D"){//Check for black bishop
                    var temprow=i+1;
                    var tempcol=j+1;
                    while(temprow<8 && tempcol<8 && board[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow++;
                        tempcol++;
                    }
                    if(temprow<8 && tempcol<8 && whiteUnicodes.includes(board[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i-1;
                    tempcol=j+1;
                    while(temprow>=0 && tempcol<8 && board[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow--;
                        tempcol++;
                    }
                    if(temprow>=0 && tempcol<8 && whiteUnicodes.includes(board[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i+1;
                    tempcol=j-1;
                    while(temprow<8 && tempcol>=0 && board[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow++;
                        tempcol--;
                    }
                    if(temprow<8 && tempcol>=0 && whiteUnicodes.includes(board[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i-1;
                    tempcol=j-1;
                    while(temprow>=0 && tempcol>=0 && board[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow--;
                        tempcol--;
                    }
                    if(temprow>=0 && tempcol>=0 && whiteUnicodes.includes(board[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                }
                else if(board[i][j]=="\u265B"){//Check for black Queen
                    var temprow=i+1;
                    var tempcol=j+1;
                    while(temprow<8 && tempcol<8 && board[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow++;
                        tempcol++;
                    }
                    if(temprow<8 && tempcol<8 && whiteUnicodes.includes(board[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i-1;
                    tempcol=j+1;
                    while(temprow>=0 && tempcol<8 && board[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow--;
                        tempcol++;
                    }
                    if(temprow>=0 && tempcol<8 && whiteUnicodes.includes(board[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i+1;
                    tempcol=j-1;
                    while(temprow<8 && tempcol>=0 && board[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow++;
                        tempcol--;
                    }
                    if(temprow<8 && tempcol>=0 && whiteUnicodes.includes(board[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i-1;
                    tempcol=j-1;
                    while(temprow>=0 && tempcol>=0 && board[temprow][tempcol]=="-"){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                        temprow--;
                        tempcol--;
                    }
                    if(temprow>=0 && tempcol>=0 && whiteUnicodes.includes(board[temprow][tempcol])){
                        candidatepos.push("block"+String(temprow)+String(tempcol));
                    }
                    temprow=i+1;
                    while(temprow<8 && board[temprow][j]=="-"){
                        candidatepos.push("block"+String(temprow)+String(j));
                        temprow++;
                    }
                    if(temprow<8 && whiteUnicodes.includes(board[temprow][j])){
                        candidatepos.push("block"+String(temprow)+String(j));
                    }
                    temprow=i-1;
                    while(temprow>=0 && board[temprow][j]=="-"){
                        candidatepos.push("block"+String(temprow)+String(j));
                        temprow--;
                    }
                    if(temprow>=0 && whiteUnicodes.includes(board[temprow][j])){
                        candidatepos.push("block"+String(temprow)+String(j));
                    }
                    tempcol=j+1;
                    while(tempcol<8 && board[i][tempcol]=="-"){
                        candidatepos.push("block"+String(i)+String(tempcol));
                        tempcol++;
                    }
                    if(tempcol<8 && whiteUnicodes.includes(board[i][tempcol])){
                        candidatepos.push("block"+String(i)+String(tempcol));
                    }
                    tempcol=j-1;
                    while(tempcol>=0 && board[i][tempcol]=="-"){
                        candidatepos.push("block"+String(i)+String(tempcol));
                        tempcol--;
                    }
                    if(tempcol>=0 && whiteUnicodes.includes(board[i][tempcol])){
                        candidatepos.push("block"+String(i)+String(tempcol));
                    }
                }
                else if(board[i][j]=="\u265A"){//Check for black King
                    if(i+1<8 && j+1<8 && (board[i+1][j+1]=="-" || whiteUnicodes.includes(board[i+1][j+1]))){
                        if(CheckForThreat(board,"block"+String(i+1)+String(j+1),"white")==false){
                            candidatepos.push("block"+String(i+1)+String(j+1));
                        }
                    }
                    if(j+1<8 && (board[i][j+1]=="-" || whiteUnicodes.includes(board[i][j+1]))){
                        if(CheckForThreat(board,"block"+String(i)+String(j+1),"white")==false){
                            candidatepos.push("block"+String(i)+String(j+1));
                        }                    
                    }
                    if(i-1>=0 && j+1<8 && (board[i-1][j+1]=="-" || whiteUnicodes.includes(board[i-1][j+1]))){
                        if(CheckForThreat(board,"block"+String(i-1)+String(j+1),"white")==false){
                            candidatepos.push("block"+String(i-1)+String(j+1));
                        }                    
                    }
                    if(i-1>=0 && (board[i-1][j]=="-" || whiteUnicodes.includes(board[i-1][j]))){
                        if(CheckForThreat(board,"block"+String(i-1)+String(j),"white")==false){
                            candidatepos.push("block"+String(i-1)+String(j));
                        }                    
                    }
                    if(i-1>=0 && j-1>=0 && (board[i-1][j-1]=="-" || whiteUnicodes.includes(board[i-1][j-1]))){
                        if(CheckForThreat(board,"block"+String(i-1)+String(j-1),"white")==false){
                            candidatepos.push("block"+String(i-1)+String(j-1));
                        }                    
                    }
                    if(j-1>=0 && (board[i][j-1]=="-" || whiteUnicodes.includes(board[i][j-1]))){
                        if(CheckForThreat(board,"block"+String(i)+String(j-1),"white")==false){
                            candidatepos.push("block"+String(i)+String(j-1));
                        }                    
                    }
                    if(i+1<8 && j-1>=0 && (board[i+1][j-1]=="-" || whiteUnicodes.includes(board[i+1][j-1]))){
                        if(CheckForThreat(board,"block"+String(i+1)+String(j-1),"white")==false){
                            candidatepos.push("block"+String(i+1)+String(j-1));
                        }                    
                    }
                    if(i+1<8 && (board[i+1][j]=="-" || whiteUnicodes.includes(board[i+1][j]))){
                        if(CheckForThreat(board,"block"+String(i+1)+String(j),"white")==false){
                            candidatepos.push("block"+String(i+1)+String(j));
                        }                    
                    }
                    //Black King's big roke statement
                    if(BlackKingHasMoved==false && BlackTowerBigRoke==false && CheckForThreat(board,"block72","white")==false && CheckForThreat(board,"block73","white")==false && CheckForThreat(board,"block74","white")==false && board[7][1]=="-" && board[7][2]=="-" && board[7][3]=="-"){
                        candidatepos.push("block72");
                    }
                    //Black King's small roke statement
                    if(BlackKingHasMoved==false && BlackTowerSmallRoke==false && CheckForThreat(board,"block74","white")==false && CheckForThreat(board,"block75","white")==false && CheckForThreat(board,"block76","white")==false && board[7][5]=="-" && board[7][6]=="-"){
                        candidatepos.push("block76");
                    }

                }
                //After taking the possible positions of a pawn for movement
                //I check the table guessing that every time the player makes a movement from them
                for(var k=0;k<candidatepos.length;k++){
                    //i initialize the table with the current board of the game
                    var table= new Array(8); //board of the chess game 8X8
                    for (var l=0;l<=7;l++){
                        table[l]=new Array(8);
                    }
                    for (var l=0;l<=7;l++){
                        for (var m=0;m<=7;m++){
                            table[l][m]=board[l][m];
                        }
                    }
                    //I guess that the pawn is moved from the (i,j) position to the candidate position
                    table[i][j]="-";
                    table[parseInt(candidatepos[k].charAt(5))][parseInt(candidatepos[k].charAt(6))]=board[i][j];
                    if(CheckSach(table,player)==false){//After the guessed move i check if King is threatened
                        return false; //There is at least one movement to do in order to protect the King,No Pat exists
                    }
                }
                candidatepos=[];//clean array of candidatepos and check the candidate positions of the next opponent's pawn
                
            }
        }
    }
    return true;//There is no candidate movement to protect the KIng, Pat or Mat(if the King already under threat)
}