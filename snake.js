// snake.js

// 1. CONFIGURAÇÕES E VARIÁVEIS DE ESTADO
const GAME_BOARD = document.getElementById('game-board');
const SCORE_ELEMENT = document.getElementById('score');
const MESSAGE_ELEMENT = document.getElementById('game-message');

const GRID_SIZE = 20; // 20x20 células no grid
const INITIAL_SNAKE = [{ x: 10, y: 10 }]; // Posição inicial da cabeça

let snake = [...INITIAL_SNAKE];
let food = null;
let score = 0;
let direction = { x: 1, y: 0 }; // Começa movendo para a direita
let gameInterval = null;
let gameSpeed = 120; // Velocidade inicial
let isGameRunning = false;
let nextDirection = null; // Para evitar conflitos de direção rápida


// 2. FUNÇÕES DE RENDERIZAÇÃO E ATUALIZAÇÃO

/**
 * Cria a célula visual no grid (div).
 */
function createCell(x, y, className) {
    const cell = document.createElement('div');
    // As coordenadas do grid CSS começam em 1
    cell.style.gridRowStart = y;
    cell.style.gridColumnStart = x;
    cell.classList.add(className);
    return cell;
}


 
function draw() {
    GAME_BOARD.innerHTML = ''; 

    // Desenha a comida
    if (food) {
        const foodCell = createCell(food.x, food.y, 'food-cell');
        GAME_BOARD.appendChild(foodCell);
    }
    
   
    snake.forEach((segment, index) => {
      
        if (index === 0) {
            const headCell = createCell(segment.x, segment.y, 'snake-head');
            
            // Adiciona classe de direção para girar os olhos
            if (direction.x === 1) headCell.classList.add('head-right');
            else if (direction.x === -1) headCell.classList.add('head-left');
            else if (direction.y === 1) headCell.classList.add('head-down');
            else if (direction.y === -1) headCell.classList.add('head-up');
            
            GAME_BOARD.appendChild(headCell);
        } else {
           
            const bodyCell = createCell(segment.x, segment.y, 'snake-cell');
            GAME_BOARD.appendChild(bodyCell);
        }
    });


    SCORE_ELEMENT.textContent = score;
}


function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * GRID_SIZE) + 1,
            y: Math.floor(Math.random() * GRID_SIZE) + 1
        };
    } while (isSnake(newFood)); 

    food = newFood;
}


function isSnake(pos) {
    return snake.some(segment => segment.x === pos.x && segment.y === pos.y);
}



function updateGame() {
    if (!isGameRunning) return;

   
    if (nextDirection) {
        direction = nextDirection;
        nextDirection = null;
    }
    
   
    const newHead = { 
        x: snake[0].x + direction.x, 
        y: snake[0].y + direction.y 
    };

    
    if (isCollision(newHead)) {
        gameOver();
        return;
    }

   
    snake.unshift(newHead);

    
    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        generateFood();
        updateSpeed(); 
    } else {
        snake.pop(); 
    }

    draw();
}


function isCollision(head) {
 
    const hitWall = (head.x < 1 || head.x > GRID_SIZE || head.y < 1 || head.y > GRID_SIZE);
    
 
    const hitBody = snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);

    return hitWall || hitBody;
}


function updateSpeed() {
    if (score % 50 === 0 && score > 0) {
        gameSpeed = Math.max(80, gameSpeed - 10); // 
        clearInterval(gameInterval);
        gameInterval = setInterval(updateGame, gameSpeed);
    }
}





function startGame() {
    snake = [...INITIAL_SNAKE];
    direction = { x: 1, y: 0 };
    score = 0;
    gameSpeed = 150;
    isGameRunning = true;
    nextDirection = null;
    
    generateFood(); 
    draw();
    
    MESSAGE_ELEMENT.textContent = 'JOGO EM ANDAMENTO!';
    
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, gameSpeed);
}

function gameOver() {
    isGameRunning = false;
    clearInterval(gameInterval);
    MESSAGE_ELEMENT.textContent = `FIM DE JOGO! 😢 PONTUAÇÃO FINAL: ${score}`;
    
   
    setTimeout(() => {
        MESSAGE_ELEMENT.textContent += ' (CLIQUE OU USE AS SETAS PARA REINICIAR)';
        GAME_BOARD.addEventListener('click', restartHandler, { once: true });
        document.addEventListener('keydown', restartHandler, { once: true });
    }, 1000);
}


 
function changeDirection(event) {
    const gameKeys = ['w', 's', 'a', 'd'];

  
    if (gameKeys.includes(event.key)) {
        event.preventDefault();
    }

   
    if (!isGameRunning) {
        if (gameKeys.includes(event.key)) {
            startGame();
        }
        return;
    }

    const key = event.key;
    const currentX = direction.x;
    const currentY = direction.y;

    let newDirection = null;

    
    switch (key) {
        case 'w':
            if (currentY !== 1) newDirection = { x: 0, y: -1 };
            break;
        case 's':
            if (currentY !== -1) newDirection = { x: 0, y: 1 };
            break;
        case 'a':
            if (currentX !== 1) newDirection = { x: -1, y: 0 };
            break;
        case 'd':
            if (currentX !== -1) newDirection = { x: 1, y: 0 };
            break;
    }

    if (newDirection) {
        nextDirection = newDirection; 
    }
}


function restartHandler(event) {

    GAME_BOARD.removeEventListener('click', restartHandler);
    document.removeEventListener('keydown', restartHandler);
    
   
    if (event.type === 'keydown') {
        const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        if (gameKeys.includes(event.key)) {
            event.preventDefault();
        }
    }
    
    startGame();
}


document.removeEventListener('keydown', changeDirection);
document.addEventListener('keydown', changeDirection);


draw(); 
MESSAGE_ELEMENT.textContent = 'PRESSIONE UMA TECLA DE SETA PARA COMEÇAR!';

GAME_BOARD.addEventListener('click', () => {
    if (!isGameRunning) {
        startGame();
    }
}, { once: true });