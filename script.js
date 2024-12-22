var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;  // Збільшена швидкість м'яча
var dy = -2; // Збільшена швидкість м'яча
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 100;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
var brickCount = 0;
var score = 0;
var lives = 3;

function generateBricks() {
    var columns = Math.floor(canvas.width / (brickWidth + brickPadding));
    for (var c = 0; c < columns; c++) {
        var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = brickOffsetTop;
        bricks.push({ x: brickX, y: brickY, status: 1 });
    }
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 + paddleWidth / 2 && relativeX < canvas.width - paddleWidth / 2) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function drawBricks() {
    bricks.forEach((brick, index) => {
        if (brick.status === 1) {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brickWidth, brickHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
            brick.y += 0.05; // Зменшена швидкість прямокутників
            if (brick.y > canvas.height) {
                bricks.splice(index, 1);
            }
        }
    });
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function collisionDetection() {
    bricks.forEach((brick, index) => {
        if (brick.status === 1) {
            if (x > brick.x && x < brick.x + brickWidth && y > brick.y && y < brick.y + brickHeight) {
                dy = -dy;
                brick.status = 0;
                bricks.splice(index, 1);
                score++;
                brickCount++;
            }
        }
    });
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawBrickCount() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Bricks Killed: " + brickCount, 8, 40);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 75, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawBrickCount();
    drawLives();
    collisionDetection();

    if (y + dy < ballRadius) {
        dy = -dy;
    }
    else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives--;
            if (!lives) {
                alert("GAME OVER!");
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;

    if (Math.random() < 0.001) { 
        generateBricks();
    }

    requestAnimationFrame(draw);
}

generateBricks();
draw();
