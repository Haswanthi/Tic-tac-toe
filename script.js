var origBoard;
const huplayer = 'O';
const aiplayer = 'X';
const WinCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();
function startGame(){
    document.querySelector(".endgame").style.display = "none"
    document.querySelector(".imgbox1").style.display = "none"
    document.querySelector(".imgbox2").style.display = "none"
    document.querySelector(".imgbox3").style.display = "none"

    origBoard =  Array.from(Array(9).keys())
    for(var i =0; i<cells.length; i++){
        cells[i].innerText = ' ';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick,false);
    }
} 

function turnClick(square){
    if(typeof origBoard[square.target.id] == 'number'){
        turn(square.target.id, huplayer)
        if(!checkTie()) turn(bestspot(), aiplayer);
    }
    
}

function turn(squareId, player){
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gamewon = checkwin(origBoard,player);
    if(gamewon) gameOver(gamewon);
}

function checkwin(board, player){
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a,[]);
    let gamewon = null;
    for(let [index,win] of WinCombos.entries()){
        if(win.every(elem => plays.indexOf(elem) > -1)){
            gamewon = {index: index, player: player};
            break;
        }
    }
    return gamewon;
}

function gameOver(gamewon){
    for(let index of WinCombos[gamewon.index]){
        document.getElementById(index).style.backgroundColor = gamewon.player == huplayer? "hotpink": "aqua";
    }
    for(var i =0; i <cells.length; i++){
        cells[i].removeEventListener('click', turnClick, false);
    }
    declarewinner(gamewon.player == huplayer? "YOU WIN!" : "YOU LOSE!")
}

function declarewinner(who){
    document. querySelector(".endgame").style.display = "block";
    if(who == "YOU LOSE!"){
        document. querySelector(".imgbox2").style.display = "block";
    }
    document. querySelector(".endgame .text").innerText = who;
}

function emptySquares(){
    return origBoard.filter(s => typeof s == 'number');
}

function bestspot(){
    return minmax(origBoard, aiplayer).index;
}

function checkTie(){
    if (emptySquares().length == 0){
        for(var i = 0; i<cells.length; i++){
            cells[i].style.backgroundColor = "darksalmon";
            cells[i].removeEventListener('click', turnClick,false);
        }
        declarewinner("Tie Game!")
        return true;

    }
    return false;
}

function minmax(newboard, player){
    var availspots = emptySquares(newboard);
    if (checkwin(newboard,player)){
        return {score: -10};
    }
    else if (checkwin(newboard, aiplayer)){
        return {score: 20};
    }
    else if (availspots.length === 0){
        return {score: 0};
    }

    var moves = [];
    for(var i =0; i<availspots.length; i++){
        var move = {};
        move.index = newboard[availspots[i]];
        newboard[availspots[i]] = player;

        if(player == aiplayer){
            var result = minmax(newboard, huplayer);
            move.score = result.score;
        }
        else{
            var result = minmax(newboard, aiplayer);
            move.score = result.score;
        }

        newboard[availspots[i]] = move.index;

        moves.push(move);
    }

    var bestmove;
    if(player === aiplayer){
        var bestscore = -10000;
        for(var i =0; i<moves.length; i++){
            if(moves[i].score> bestscore){
                bestscore= moves[i].score;
                bestmove= i;
            }
        }
    }
    else{
        var bestscore = 10000;
        for(var i =0; i<moves.length; i++){
            if(moves[i].score < bestscore){
                bestscore= moves[i].score;
                bestmove= i;
            }
        }
    }

    return moves[bestmove];
}


