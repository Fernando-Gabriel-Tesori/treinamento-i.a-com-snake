const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let direction;
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

let score = 0;
let game;  // Declaração da variável para o jogo

// Controle da direção
document.addEventListener("keydown", setDirection);

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

// Colisão
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

// Desenho do jogo
function draw() {
    ctx.fillStyle = "#34495e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenhar a cobra
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#2ecc71" : "#ecf0f1";
        ctx.strokeStyle = "#2c3e50";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Desenhar comida
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction == "LEFT") snakeX -= box;
    if (direction == "UP") snakeY -= box;
    if (direction == "RIGHT") snakeX += box;
    if (direction == "DOWN") snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
    }

    snake.unshift(newHead);

    // Desenhar pontuação
    ctx.fillStyle = "#ecf0f1";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

// Iniciar o jogo com base na velocidade escolhida
function startGame() {
    const speed = document.getElementById("speed").value;
    clearInterval(game);  // Limpa qualquer intervalo anterior
    game = setInterval(draw, speed);
}

// Inicia o jogo ao carregar a página
window.onload = startGame;

// Atualiza o jogo ao mudar a velocidade
document.getElementById("speed").addEventListener("change", startGame);
