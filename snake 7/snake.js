const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [];
let direction;
let food;
let specialApple;
let score;
let game;  // Declaração da variável para o jogo

function initGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = "RIGHT";
    food = {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box
    };
    specialApple = {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box,
        isVisible: false,
        timer: 0
    };
    score = 0;
    clearInterval(game);  // Limpa qualquer intervalo anterior
    game = setInterval(draw, document.getElementById("speed").value);
}

function setDirection(event) {
    if (event.keyCode == 37 && direction != "RIGHT") {
        direction = "LEFT";
    } else if (event.keyCode == 38 && direction != "DOWN") {
        direction = "UP";
    } else if (event.keyCode == 39 && direction != "LEFT") {
        direction = "RIGHT";
    } else if (event.keyCode == 40 && direction != "UP") {
        direction = "DOWN";
    }
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    // Define a cor de fundo do mapa usando RGB
    ctx.fillStyle = "rgb(103, 58, 183)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenha a cobra
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#2ecc71" : "#ecf0f1";
        ctx.strokeStyle = "#2c3e50";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Desenha a comida
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(food.x, food.y, box, box);

    // Desenha a maçã especial se estiver visível
    if (specialApple.isVisible) {
        ctx.fillStyle = "#f1c40f";
        ctx.fillRect(specialApple.x, specialApple.y, box, box);
    }

    // Movimenta a cobra
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction == "LEFT") snakeX -= box;
    if (direction == "UP") snakeY -= box;
    if (direction == "RIGHT") snakeX += box;
    if (direction == "DOWN") snakeY += box;

    // Verifica se a cobra comeu a comida
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else if (snakeX == specialApple.x && snakeY == specialApple.y && specialApple.isVisible) {
        score += 3;
        for (let i = 0; i < 3; i++) {
            snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
        }
        specialApple.isVisible = false;
        specialApple.timer = 0;
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    // Verifica colisões
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        gameOver();
        return;
    }

    snake.unshift(newHead);

    // Exibe a pontuação
    ctx.fillStyle = "#ecf0f1";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);

    // Gerencia a maçã especial
    if (!specialApple.isVisible && Math.random() < 0.01) {
        specialApple.x = Math.floor(Math.random() * 19 + 1) * box;
        specialApple.y = Math.floor(Math.random() * 19 + 1) * box;
        specialApple.isVisible = true;
    }

    if (specialApple.isVisible) {
        specialApple.timer++;
        if (specialApple.timer > 100) {
            specialApple.isVisible = false;
            specialApple.timer = 0;
        }
    }
}

function gameOver() {
    clearInterval(game);
    document.getElementById("finalScore").innerText = score;
    document.getElementById("gameOverScreen").style.display = "flex";
    canvas.style.display = "none";
}

function startGame() {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("gameOverScreen").style.display = "none";
    canvas.style.display = "block";
    initGame();
}

function restartGame() {
    startGame();
}

document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("restartButton").addEventListener("click", restartGame);
document.addEventListener("keydown", setDirection);
