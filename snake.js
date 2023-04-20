//board
let blockSize = 30;
let rows = 25;
let cols = 25;
let board;
let context; 

// Note: those are not real milliseconds!
// the setTimeout method actually takes longer time than what we ask it to
// in practice, this is about 100 milliseconds
// Same disclaimer applies to all milliseconds
const POWERUP_SPAWN_PROBABILITY = 0.04;
const MILLISECONDS_FOR_BOARD_UPDATE = 65;
const MILLISECONDS_FOR_BOARD_UPDATE_WITH_POWERUP = 48; // 35% speedup
const POWERUP_DURATION_MS = 4000;

//snake head
let snakeX = blockSize * 5;
let snakeY = blockSize * 5;

let velocityX = 0;
let velocityY = 0;

let snakeBody = [];

let foodX;
let foodY;

let powerupX = null;
let powerupY = null;

let gameOver = false;

let accumulatedTicks = 0;
let ticksNeededForUpdate = MILLISECONDS_FOR_BOARD_UPDATE;

let timeElapsed = 0; // milliseconds
let powerupActiveUntil = Infinity;

window.onload = function() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d"); 

    spawnFood();
    document.addEventListener("keyup", changeDirection);
    setInterval(tick, 10);
}

function tick() {
    accumulatedTicks += 7;
    timeElapsed += 7;
    if (powerupActiveUntil <= timeElapsed) {
        ticksNeededForUpdate = MILLISECONDS_FOR_BOARD_UPDATE;
        powerupActiveUntil = Infinity;
    }
    if (accumulatedTicks >= ticksNeededForUpdate) {
        update();
        accumulatedTicks = 0;
    }
}

function update() {
    if (gameOver) {
        return;
    }

    const powerupIsPresent = powerupX !== null;
    const gameHasStarted = velocityX !== 0;

    context.fillStyle="black";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle="red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    context.fillStyle="yellow";
    if (powerupIsPresent)
        context.fillRect(powerupX, powerupY, blockSize, blockSize);

    if (!powerupIsPresent && gameHasStarted && Math.random() < POWERUP_SPAWN_PROBABILITY) {
        spawnPowerup();
    }

    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        spawnFood();
    }

    if (snakeX == powerupX && snakeY == powerupY) {
        ticksNeededForUpdate = MILLISECONDS_FOR_BOARD_UPDATE_WITH_POWERUP;
        powerupActiveUntil = timeElapsed + POWERUP_DURATION_MS;
        powerupX = null;
        powerupY = null;
    }

    for (let i = snakeBody.length-1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle="lime";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    //game over conditions
    if (snakeX < 0 || snakeX > cols*blockSize || snakeY < 0 || snakeY > rows*blockSize) {
        gameOver = true;
        alert("GG");
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOver = true;
            alert("GG");
        }
    }
}

function changeDirection(e) {
    if (e.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    }
    else if (e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    }
    else if (e.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }
    else if (e.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

function spawnFood() {
    // TODO: powerup should not spawn on top of power-up or snake
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

function spawnPowerup() {
    // TODO: powerup should not spawn on top of food or snake
    powerupX = Math.floor(Math.random() * cols) * blockSize;
    powerupY = Math.floor(Math.random() * rows) * blockSize;
}