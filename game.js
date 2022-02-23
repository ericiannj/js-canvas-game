var square;
var background;
var obstacles = [];
var scoreboard;
var lessScore;
var secondStage = false;
var completedGame = false;

var game = {
    canvas: document.getElementById("canvas"),
    start: function () {
        this.canvas.width = 480;
        this.canvas.height = 320;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.obstaclesFrequency = 0;
        this.score = 0;
        this.less = "";
        this.interval = setInterval(updateGame, 9); 
        this.message = "";
        window.addEventListener("keydown", (e) => {
            game.key = e.key;
        });
        window.addEventListener("keyup", (e) => {
            game.key = false;
        })
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }
}

function startGame() {
    square = new component(30, 30, "assets/ship.png", 10, 120, "image");
    background = new component(493, 270, "assets/bg.jpg", 0, 0, "background");
    scoreboard = new component("30px", "Bebas Neue", "white", 365, 305, "text");
    lessScore = new component("18px", "Roboto", "yellow", 460, 290, "text");  
    game.start();
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = color;
    }

    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.pastPlayer = false;

    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.type == "background") {
            if (this.x == -this.width) {
                this.x = 0;
            }
        }
    }

    this.update = function () {
        ctx = game.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else if (this.type == "image" || this.type == "background") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

            if (this.type == "background") {
                ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
            }
        }else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    this.crashWith = function (otherObstacle) {
        var myLeft = this.x;
        var myRight = this.x + this.width;
        var myTop = this.y;
        var myBottom = this.y + this.height;

        var otherLeft = otherObstacle.x;
        var otherRight = otherObstacle.x + otherObstacle.width;
        var otherTop = otherObstacle.y;
        var otherBottom = otherObstacle.y + otherObstacle.height;

        var crash = false;

        if (((myBottom >= otherTop) && (myRight >= otherLeft) && (myLeft < otherLeft) && (myTop < otherBottom)) ||
            ((myTop <= otherBottom) && (myRight >= otherLeft) && (myLeft < otherLeft) && (myBottom > otherTop)) ||
            ((myTop <= otherBottom) && (myRight > otherRight) && (myLeft < otherRight) && (myBottom >= otherTop)) ||
            ((myTop >= otherBottom) && (myRight > otherRight) && (myLeft < otherRight) && (myBottom <= otherTop))
        ) {
            crash = true;
        }

        return crash;
    }
}

function updateGame() {
    var x, y;

    for (i = 0; i < obstacles.length; i += 1) {
        if (square.crashWith(obstacles[i]) && game.score == 0) {
            alert('Game over! Reload, please.');
            game.message = "Game over";
            game.clear();
            return;
        } else if (square.crashWith(obstacles[i]) && game.score > 0) {
            obstacles[i].y = 400;
            game.score -= 1;
            game.less = "-1";
        } else if (game.score == 51 && secondStage == false) {
            alert('Congrats! Now you are in the second stage!');
            setInterval(updateGame, 8);
            secondStage = true;
        } else if (game.score == 101 && secondStage == true && completedGame == false) {
            alert('Congrats! Now you are in the last stage!');
            setInterval(updateGame, 7);
            completedGame = true;
        } else if (game.score == 151 && completedGame == true) {
            alert('You won! Reload, please.');
            game.clear();
        } 
    }

    game.clear();
    background.speedX = -1;
    background.newPos();
    background.update();

    if (game.key == "ArrowUp") square.y -= 3;
    if (game.key == "ArrowDown") square.y += 3;
    if (game.key == "ArrowLeft") square.x -= 3;
    if (game.key == "ArrowRight") square.x += 3;

    if (square.x <= 0) square.x = 0;
    if (square.y <= 0) square.y = 0;
    if (square.x >= game.canvas.width - 30) square.x = game.canvas.width - 30;
    if (square.y >= game.canvas.height - 80) square.y = game.canvas.height - 80;

    game.obstaclesFrequency += 1;

    if (everyInterval(game.obstaclesFrequency, 100)) {
        x = game.canvas.width;
        y = Math.floor(Math.random() * (game.canvas.height - 80));

        obstacles.push(new component(30, 30, "assets/asteroid.png", x, y, "image"));
    }

    for (i = 0; i < obstacles.length; i += 1) {
        obstacles[i].speedX = - 1;
        obstacles[i].newPos();
        obstacles[i].update();
    }

    lessScore.text = game.less;
    lessScore.update();

    scoreboard.text = "SCORE: " + game.score;
    scoreboard.update();

    square.update();

    for (i = 0; i < obstacles.length; i += 1) {
        if (square.x > (obstacles[i].x + 30) && obstacles[i].pastPlayer == false) {
            obstacles[i].pastPlayer = true;
            game.score += 1;
            game.less = "";
        }
    }
}

function everyInterval(frame, number) {
    if ((frame / number) % 1 == 0) return true;

    return false;
}

startGame();