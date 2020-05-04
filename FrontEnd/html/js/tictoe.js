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
 

    checkforwin();
   // alert(id); 
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
function checkforwin(){
         //Check every column
         for (var i=0;i<=2;i++){
             if(board[0][i]!="-" && board[0][i]==board[1][i] && board[1][i]==board[2][i]){
                for (var j=0;j<=2;j++){
                    document.getElementById("block"+j.toString()+i.toString()).style.backgroundColor="red";
                }  
                disableboard();

                alert(board[0][i]+"s wins!!!");
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
                alert(board[i][0]+"s wins!!!");
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
            alert(board[0][0]+"s wins!!!");
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
            alert(board[0][2]+"s wins!!!");
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
