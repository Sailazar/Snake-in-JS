
// board 

var blockSize = 25;
var rows = 21;
var cols = 21;
var board;
var context;

//snake head
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

//food
var foodX;
var foodY;


window.onload = function() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width   = cols * blockSize;
    context = board.getContext("2d") // for drawing on the board 

    placeFood();
    update();
}

function update() {
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "lime";
    context.fillRect(snakeX, snakeY, blockSize, blockSize);

    context.fillStyle="red";
    context.fillRect(foodX, foodY, blockSize, blockSize); 
}

// head

function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}