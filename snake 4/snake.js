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

// Maçã especial
let specialApple = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box,
    isVisible: false,
    timer: 0
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

    // Desenhar maçã especial
    if (specialApple.isVisible) {
        ctx.fillStyle = "#f1c40f";
        ctx.fillRect(specialApple.x, specialApple.y, box, box);
    }

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
    } else if (snakeX == specialApple.x && snakeY == specialApple.y && specialApple.isVisible) {
        // Cobra cresce mais quando come a maçã especial
        score += 3;
        for (let i = 0; i < 3; i++) {
            snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
        }
        specialApple.isVisible = false;  // Desaparece após ser comida
        specialApple.timer = 0;  // Reiniciar o timer para a próxima aparição
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

    // Gerenciar a maçã especial
    if (!specialApple.isVisible && Math.random() < 0.01) {  // Probabilidade de aparecer
        specialApple.x = Math.floor(Math.random() * 19 + 1) * box;
        specialApple.y = Math.floor(Math.random() * 19 + 1) * box;
        specialApple.isVisible = true;
    }

    if (specialApple.isVisible) {
        specialApple.timer++;
        if (specialApple.timer > 100) {  // Desaparece após um tempo
            specialApple.isVisible = false;
            specialApple.timer = 0;
        }
    }
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
