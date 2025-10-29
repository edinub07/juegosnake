const menu = document.getElementById("menu");
const gameContainer = document.getElementById("game");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");
const startBtn = document.getElementById("startGameBtn");
const restartBtn = document.getElementById("restartBtn");
const bgMusic = document.getElementById("bgMusic");
const toggleMusicBtn = document.getElementById("toggleMusicBtn");

let snake = [];
let food, score, direction, game;
const box = 20;

let foodImg = new Image();
let snakeImg = new Image();
let groundColor = "#86c06c";

bgMusic.volume = 0.3;

// ====== Seleccionar skin y comida ======
document.querySelectorAll("#snakeOptions img").forEach(img => {
  img.addEventListener("click", () => {
    document.querySelectorAll("#snakeOptions img").forEach(i => i.classList.remove("selected"));
    img.classList.add("selected");
  });
});

document.querySelectorAll("#foodOptions img").forEach(img => {
  img.addEventListener("click", () => {
    document.querySelectorAll("#foodOptions img").forEach(i => i.classList.remove("selected"));
    img.classList.add("selected");
  });
});

// ====== Iniciar juego ======
startBtn.addEventListener("click", () => {
  const selectedSkin = document.querySelector("#snakeOptions img.selected").dataset.skin;
  const selectedFood = document.querySelector("#foodOptions img.selected").dataset.food;

  snakeImg.src = `assets/${selectedSkin}`;
  foodImg.src = `assets/${selectedFood}`;

  bgMusic.play();
  menu.classList.add("hidden");
  gameContainer.classList.remove("hidden");

  startGame();
});

function startGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  score = 0;
  direction = null;
  food = randomFood();
  scoreText.textContent = "Puntaje: 0";

  document.addEventListener("keydown", setDirection);
  clearInterval(game);
  game = setInterval(drawGame, 120);
}

function setDirection(e) {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box,
  };
}

function drawGame() {
  ctx.fillStyle = groundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    ctx.drawImage(snakeImg, snake[i].x, snake[i].y, box, box);
  }

  ctx.drawImage(foodImg, food.x, food.y, box, box);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  if (snakeX === food.x && snakeY === food.y) {
    score++;
    scoreText.textContent = "Puntaje: " + score;
    food = randomFood();
  } else {
    snake.pop();
  }

  const newHead = { x: snakeX, y: snakeY };

  if (
    snakeX < 0 || snakeX >= canvas.width ||
    snakeY < 0 || snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    bgMusic.pause();
    bgMusic.currentTime = 0;
    setTimeout(() => alert("💀 Fin del juego - Puntaje final: " + score), 200);
  }

  snake.unshift(newHead);
}

function collision(newHead, snake) {
  return snake.some(segment => segment.x === newHead.x && segment.y === newHead.y);
}

restartBtn.addEventListener("click", () => {
  clearInterval(game);
  bgMusic.pause();
  bgMusic.currentTime = 0;
  menu.classList.remove("hidden");
  gameContainer.classList.add("hidden");
});

// ====== Música ON/OFF ======
toggleMusicBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    toggleMusicBtn.textContent = "🔊 Música ON";
  } else {
    bgMusic.pause();
    toggleMusicBtn.textContent = "🔈 Música OFF";
  }
});
