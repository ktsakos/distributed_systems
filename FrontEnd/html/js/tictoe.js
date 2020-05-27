//websocket communication testing
var socket=io.connect('http://147.27.60.48:5001');
var username=document.getElementById("username").innerHTML;
var gametype="tic-tac-toe";
socket.on('connect',function(){//connection trying event
    socket.emit('connectionack',"{\"username\":\""+ username+"\",\"gametype\":\""+gametype+"\",\"clientid\":\""+socket.id+"\"}");
});

socket.on('connectionresponse',function(msg){//connection acceptance event
console.log("Received from server: "+msg);
alert("Wait for a player to be connected!");
disableboard();
});

socket.on('gamestart',function(opponent){
    document.getElementById("opponent").innerHTML=opponent;
    alert("Game Started!");
});

socket.on('makemove',function(){
    enableboard();

});

socket.on('opponentsmovesent',function(idplayed){
    updateopponentsmove(idplayed);
    
});

socket.on('EndOfGame',function(msg){
    socket.disconnect();
    alert(msg);
    //socket.close();
    window.location.href="welcome.php";
});

socket.on('ConnectionReject',function(msg){//connection rejection
    alert(msg);
    socket.close();
});

function sendwin(){
    socket.emit('WinCase');
}

function senddraw(){
    socket.emit('DrawCase');
}

function closingConnection(){
    socket.close();
}

window.onunload= function() {
    socket.disconnect();
}
window.onbeforeunload= function() {
    socket.disconnect();
}
window.onclose= function() {
    socket.disconnect();
}
numberofclicks=0;
var board= new Array(3);
for (var i=0;i<=2;i++){
    board[i]=new Array(3);
}

for (var i=0;i<=2;i++){
    for (var j=0;j<=2;j++){
        board[i][j]='-';
    }
}
function chooseblock(id){
    id.style.backgroundColor="#D0D0D0";
}
function unchooseblock(id){
    id.style.backgroundColor="white";
}
function makemove(id){
    var letter=playwithletter(); //Change X to O and opposite every time a move is done
    document.getElementById(id).innerHTML="<img src=imgs/"+letter+".png style=\"width:100px;height:100px;\">";//load the appropriate png into the table which represents the letter
    document.getElementById(id).style.pointerEvents="none";//disable events into the blocks after a move id done
    board[id.charAt(5)][id.charAt(6)]=letter;
    
    socket.emit('receivemove',"{\"data\":\""+id+"\"}");
 
    disableboard();
    checkforwin();
    checkfordraw();
   // alert(id); 
}

function updateopponentsmove(id){
    var letter=playwithletter(); //Change X to O and opposite every time a move is done
    document.getElementById(id).innerHTML="<img src=imgs/"+letter+".png style=\"width:100px;height:100px;\">";//load the appropriate png into the table which represents the letter
    document.getElementById(id).style.pointerEvents="none";//disable events into the blocks after a move id done
    board[id.charAt(5)][id.charAt(6)]=letter; 
    
}

function playwithletter(){
           var letter;
           if (numberofclicks%2==0){
               letter= 'X';
           }
           else {
               letter='O';
            }
            numberofclicks++;
            return letter;
           
}
function checkfordraw(){
    arrayisfull=true;
    for (var i=0;i<=2;i++){
        for (var j=0;j<=2;j++){
            if(board[i][j]=="-"){
                arrayisfull=false;
            }
        }
    }
    if(arrayisfull){
        senddraw();
    }
}

function checkforwin(){
         //Check every column
         for (var i=0;i<=2;i++){
             if(board[0][i]!="-" && board[0][i]==board[1][i] && board[1][i]==board[2][i]){
                for (var j=0;j<=2;j++){
                    document.getElementById("block"+j.toString()+i.toString()).style.backgroundColor="red";
                }  
                disableboard();
                sendwin();
                //alert(board[0][i]+"s wins!!!");
                for (var j=0;j<=2;j++){
                    document.getElementById("block"+j.toString()+i.toString()).style.backgroundColor="white";
                }  
             }
         }


         //Check every row
         for (var i=0;i<=2;i++){
            if(board[i][0]!="-" && board[i][0]==board[i][1] && board[i][1]==board[i][2]){
                for (var j=0;j<=2;j++){
                    document.getElementById("block"+i.toString()+j.toString()).style.backgroundColor="red";
                }  
                disableboard();
                //alert(board[i][0]+"s wins!!!");
                sendwin();
                for (var j=0;j<=2;j++){
                    document.getElementById("block"+i.toString()+j.toString()).style.backgroundColor="white";
                }  
            }
        }
        
        //check diagonal
        if(board[0][0]!="-" && board[0][0]==board[1][1] && board[1][1]==board[2][2]){
            for (var i=0;i<=2;i++){
                document.getElementById("block"+i.toString()+i.toString()).style.backgroundColor="red";
            }  
            disableboard();
            sendwin();
            //alert(board[0][0]+"s wins!!!");
            for (var i=0;i<=2;i++){
                document.getElementById("block"+i.toString()+i.toString()).style.backgroundColor="white";
            } 
        }

         //check reverse diagonal
         if(board[0][2]!="-" && board[0][2]==board[1][1] && board[1][1]==board[2][0]){
            for (var i=0;i<=2;i++){
                document.getElementById("block"+i.toString()+(2-i).toString()).style.backgroundColor="red";
            }  
            disableboard();
            sendwin();
            //alert(board[0][2]+"s wins!!!");
            for (var i=0;i<=2;i++){
                document.getElementById("block"+i.toString()+(2-i).toString()).style.backgroundColor="white";
            } 
        }

    }
        


function disableboard(){
    for (var i=0;i<=2;i++){
        for (var j=0;j<=2;j++){
            document.getElementById("block"+i.toString()+j.toString()).style.pointerEvents="none";//disable events into the blocks after a move id done
        }
    }
}

function enableboard(){
    for (var i=0;i<=2;i++){
        for (var j=0;j<=2;j++){
            if(board[i][j]=="-"){
                document.getElementById("block"+i.toString()+j.toString()).style.pointerEvents="auto";//enable events into the empty blocks after a move id done
            }
        }
    }
}


