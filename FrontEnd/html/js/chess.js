var board= new Array(8); //board of the chess game 8X8
for (var i=0;i<=7;i++){
    board[i]=new Array(8);
}

BoardInitialization();
DisableEventsForEmptyBlocks();
var whiteUnicodes=["&#9812;","&#9813;","&#9814;","&#9815;","&#9816;","&#9817;"];
var blackUnicodes=["&#9818;","&#9819;","&#9820;","&#9821;","&#9822;","&#9823;"];

function DisableEventsForEmptyBlocks(){
    var blocks=document.getElementsByTagName("div");
    for (var i=0;i<blocks.length;i++){
      /* if(whiteUnicodes.includes(blocks[i].innerHTML)==false && blackUnicodes.includes(blocks[i].innerHTML)==false){
            blocks[i].parentNode.style.pointerEvents="none";
        }*/
        console.log(i);
    }
}

function isWhite(value){//Check for white pawn
    for (var i=0;i<=5;i++){
        if(value==whiteUnicodes[i]){
            return true;
        }
    }
    return false;
}

function isBlack(value){//Check for black pawn
    for (var i=0;i<=5;i++){
        if(value==blackUnicodes[i]){
            return true;
        }
    }
    return false;
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
                board[i][j]="&#9817;";
            }
            else if (i==6){ //Case of black pawn
                board[i][j]="&#9823;";
            }
            else if (i==0 && (j==0 || j==7)){//case of white tower
                board[i][j]="&#9814;";
            }
            else if (i==0 && (j==1 || j==6)){//case of white horse
                board[i][j]="&#9816;";
            }
            else if (i==0 && (j==2 || j==5)){//case of white bishop
                board[i][j]="&#9815;";
            }
            else if (i==0 && j==3){//case of white Queen
                board[i][j]="&#9813;";
            }
            else if (i==0 && j==4){//case of white King
                board[i][j]="&#9812;";
            }
            else if (i==7 && (j==0 || j==7)){//case of black tower
                board[i][j]="&#9820;";
            }
            else if (i==7 && (j==1 || j==6)){//case of black horse
                board[i][j]="&#9822;";
            }
            else if (i==7 && (j==2 || j==5)){//case of black bishop
                board[i][j]="&#9821;";
            }
            else if (i==7 && j==3){//case of black Queen
                board[i][j]="&#9819;";
            }
            else if (i==7 && j==4){//case of black King
                board[i][j]="&#9818;";
            }
            else{
                board[i][j]="-";
            }
        }
    }
}