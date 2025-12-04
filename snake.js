// snake.js - Jogo da Cobrinha ZooKid

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
let gameSpeed = 150; // Velocidade inicial (ms)
let isGameRunning = false;

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

/**
 * Desenha todo o jogo no tabuleiro.
 */
function draw() {
    GAME_BOARD.innerHTML = '';

    // Desenha a comida
    if (food) {
        const foodCell = createCell(food.x, food.y, 'food-cell');
        GAME_BOARD.appendChild(foodCell);
    }

    // Desenha a cobra
    snake.forEach((segment, index) => {
        // Cabeça da cobra
        if (index === 0) {
            const headCell = createCell(segment.x, segment.y, 'snake-head');

            // Adiciona classe de direção para girar os olhos
            if (direction.x === 1) headCell.classList.add('head-right');
            else if (direction.x === -1) headCell.classList.add('head-left');
            else if (direction.y === 1) headCell.classList.add('head-down');
            else if (direction.y === -1) headCell.classList.add('head-up');

            GAME_BOARD.appendChild(headCell);
        } else {
            // Corpo da cobra
            const bodyCell = createCell(segment.x, segment.y, 'snake-cell');
            GAME_BOARD.appendChild(bodyCell);
        }
    });

    // Atualiza a pontuação na tela
    SCORE_ELEMENT.textContent = score;
}

/**
 * Gera comida em uma posição aleatória que não está ocupada pela cobra.
 */
function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * GRID_SIZE) + 1,
            y: Math.floor(Math.random() * GRID_SIZE) + 1
        };
    } while (isSnake(newFood)); // Evita colocar comida sobre a cobra

    food = newFood;
}

/**
 * Verifica se uma posição está ocupada pela cobra.
 */
function isSnake(pos) {
    return snake.some(segment => segment.x === pos.x && segment.y === pos.y);
}

/**
 * Atualiza o estado do jogo a cada frame.
 */
function updateGame() {
    if (!isGameRunning) return;

    // Calcula nova posição da cabeça
    const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // Verifica colisões
    if (isCollision(newHead)) {
        gameOver();
        return;
    }

    // Move a cobra adicionando nova cabeça
    snake.unshift(newHead);

    // Verifica se comeu a comida
    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        generateFood();
        updateSpeed(); // Aumenta a velocidade conforme a pontuação
    } else {
        snake.pop(); // Remove a cauda se não comeu
    }

    draw(); // Redesenha o jogo
}

/**
 * Verifica se há colisão com paredes ou com o próprio corpo.
 */
function isCollision(head) {
    // Colisão com as paredes
    const hitWall = (head.x < 1 || head.x > GRID_SIZE || head.y < 1 || head.y > GRID_SIZE);

    // Colisão com o próprio corpo
    const hitBody = snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);

    return hitWall || hitBody;
}

/**
 * Verifica se duas direções são opostas.
 */
function oppositeDirection(newDir, currentDir) {
    return (newDir.x === -currentDir.x && newDir.y === currentDir.y) ||
           (newDir.y === -currentDir.y && newDir.x === currentDir.x);
}

/**
 * Aumenta a velocidade do jogo conforme a pontuação.
 */
function updateSpeed() {
    // A cada 50 pontos, aumenta a velocidade
    if (score % 50 === 0 && score > 0) {
        gameSpeed = Math.max(80, gameSpeed - 10); // Velocidade mínima de 80ms
        clearInterval(gameInterval);
        gameInterval = setInterval(updateGame, gameSpeed);
    }
}

/**
 * Inicia um novo jogo.
 */
function startGame() {
    snake = [...INITIAL_SNAKE];
    direction = { x: 1, y: 0 };
    score = 0;
    gameSpeed = 150;
    isGameRunning = true;

    generateFood();
    draw();

    MESSAGE_ELEMENT.textContent = 'JOGO EM ANDAMENTO!';
    MESSAGE_ELEMENT.style.color = '#28a745';

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, gameSpeed);
}

/**
 * Reinicia o jogo.
 */
function restartGame() {
    if (gameInterval) clearInterval(gameInterval);
    startGame();
}

/**
 * Finaliza o jogo.
 */
function gameOver() {
    isGameRunning = false;
    clearInterval(gameInterval);
    
    // Efeito visual de game over
    GAME_BOARD.style.animation = 'shake 0.5s';
    setTimeout(() => {
        GAME_BOARD.style.animation = '';
    }, 500);
    
    MESSAGE_ELEMENT.textContent = `FIM DE JOGO! 😢 PONTUAÇÃO FINAL: ${score}`;
    MESSAGE_ELEMENT.style.color = '#dc3545';
    
    // Adiciona botão de reinício
    setTimeout(() => {
        const restartBtn = document.createElement('button');
        restartBtn.textContent = '🔄 JOGAR NOVAMENTE';
        restartBtn.style.cssText = `
            background: #f3cb2b;
            color: #000;
            border: none;
            padding: 1rem 2rem;
            border-radius: 30px;
            font-size: 1.2rem;
            font-weight: bold;
            cursor: pointer;
            margin-top: 1rem;
            transition: all 0.3s ease;
        `;
        restartBtn.onmouseover = () => {
            restartBtn.style.transform = 'scale(1.05)';
            restartBtn.style.background = '#ffd700';
        };
        restartBtn.onmouseout = () => {
            restartBtn.style.transform = 'scale(1)';
            restartBtn.style.background = '#f3cb2b';
        };
        restartBtn.onclick = restartGame;
        
        // Remove botão anterior se existir
        const oldBtn = document.querySelector('.restart-btn');
        if (oldBtn) oldBtn.remove();
        
        restartBtn.className = 'restart-btn';
        MESSAGE_ELEMENT.parentNode.appendChild(restartBtn);
        
        // Opção de salvar no ranking
        setTimeout(() => {
            const save = confirm(`🏆 Pontuação: ${score}\nDeseja salvar sua pontuação no ranking?`);
            if (save) {
                const playerName = prompt('Digite seu nome:') || 'Jogador';
                if (typeof saveScore === 'function') {
                    saveScore('Cobrinha', playerName, score);
                    alert('Pontuação salva! Veja o ranking na página principal.');
                }
            }
        }, 1000);
    }, 1000);
}

/**
 * Controla a direção da cobra com teclado.
 */
function changeDirection(event) {
    // Previne comportamento padrão apenas para teclas do jogo
    const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'];
    
    if (gameKeys.includes(event.key)) {
        event.preventDefault();
    }

    // Se o jogo não está rodando e o usuário pressionou uma tecla de jogo, inicia
    if (!isGameRunning) {
        if (gameKeys.includes(event.key)) {
            startGame();
        }
        return;
    }

    const key = event.key.toLowerCase();
    const currentX = direction.x;
    const currentY = direction.y;

    let newDirection = null;

    // Detecta direção (inclui WASD e setas)
    switch (key) {
        case 'arrowup':
        case 'w':
            if (currentY !== 1 && !oppositeDirection({ x: 0, y: -1 }, direction)) {
                newDirection = { x: 0, y: -1 };
            }
            break;
        case 'arrowdown':
        case 's':
            if (currentY !== -1 && !oppositeDirection({ x: 0, y: 1 }, direction)) {
                newDirection = { x: 0, y: 1 };
            }
            break;
        case 'arrowleft':
        case 'a':
            if (currentX !== 1 && !oppositeDirection({ x: -1, y: 0 }, direction)) {
                newDirection = { x: -1, y: 0 };
            }
            break;
        case 'arrowright':
        case 'd':
            if (currentX !== -1 && !oppositeDirection({ x: 1, y: 0 }, direction)) {
                newDirection = { x: 1, y: 0 };
            }
            break;
    }

    // Aplica a nova direção se válida
    if (newDirection) {
        direction = newDirection;
    }
}

/**
 * Controla a direção com toques na tela (para mobile).
 */
function setupTouchControls() {
    let touchStartX = 0;
    let touchStartY = 0;
    
    GAME_BOARD.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        
        // Se o jogo não está rodando, inicia com toque
        if (!isGameRunning) {
            startGame();
        }
    });
    
    GAME_BOARD.addEventListener('touchend', (e) => {
        e.preventDefault();
        const touch = e.changedTouches[0];
        const touchEndX = touch.clientX;
        const touchEndY = touch.clientY;
        
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        
        // Determina a direção baseada no deslize
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Deslize horizontal
            if (diffX > 0 && direction.x !== -1) {
                direction = { x: 1, y: 0 }; // Direita
            } else if (diffX < 0 && direction.x !== 1) {
                direction = { x: -1, y: 0 }; // Esquerda
            }
        } else {
            // Deslize vertical
            if (diffY > 0 && direction.y !== -1) {
                direction = { x: 0, y: 1 }; // Baixo
            } else if (diffY < 0 && direction.y !== 1) {
                direction = { x: 0, y: -1 }; // Cima
            }
        }
    });
}

// 3. INICIALIZAÇÃO DO JOGO

/**
 * Inicializa todos os eventos e configurações do jogo.
 */
function initGame() {
    // Configura controles de teclado
    document.removeEventListener('keydown', changeDirection);
    document.addEventListener('keydown', changeDirection);
    
    // Configura controles de toque (mobile)
    setupTouchControls();
    
    // Configura clique para iniciar
    GAME_BOARD.addEventListener('click', () => {
        if (!isGameRunning) {
            startGame();
        }
    }, { once: true });
    
    // Configura botão de espaço para reiniciar
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Spacebar') {
            restartGame();
        }
    });
    
    // Desenha o estado inicial
    draw();
    MESSAGE_ELEMENT.textContent = 'PRESSIONE UMA TECLA OU CLIQUE PARA COMEÇAR!';
    MESSAGE_ELEMENT.style.color = '#f3cb2b';
    
    // Adiciona animação de piscar para a mensagem inicial
    let blinkInterval = setInterval(() => {
        MESSAGE_ELEMENT.style.opacity = MESSAGE_ELEMENT.style.opacity === '0.5' ? '1' : '0.5';
    }, 500);
    
    // Para de piscar quando o jogo começa
    const originalStartGame = startGame;
    startGame = function() {
        clearInterval(blinkInterval);
        MESSAGE_ELEMENT.style.opacity = '1';
        originalStartGame.call(this);
    };
}

// 4. ANIMAÇÕES CSS ADICIONAIS (adiciona dinamicamente)
function addGameAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes eat {
            0% { transform: scale(1); }
            50% { transform: scale(1.3); }
            100% { transform: scale(1); }
        }
        
        .food-cell.eaten {
            animation: eat 0.3s ease;
        }
        
        .snake-head.moving {
            animation: pulse 0.5s infinite alternate;
        }
        
        @keyframes pulse {
            from { box-shadow: 0 0 5px rgba(243, 203, 43, 0.5); }
            to { box-shadow: 0 0 15px rgba(243, 203, 43, 0.8); }
        }
    `;
    document.head.appendChild(style);
}

// 5. INICIA O JOGO QUANDO A PÁGINA CARREGA
document.addEventListener('DOMContentLoaded', () => {
    addGameAnimations();
    initGame();
    
    // Adiciona instruções no console
    console.log('🎮 Jogo da Cobrinha ZooKid 🐍');
    console.log('Controles:');
    console.log('• Setas ou WASD: Movimentar');
    console.log('• Espaço: Reiniciar jogo');
    console.log('• Toque/Clique: Iniciar/Controles móveis');
});

// No final do endGame() de cada jogo, adicione:
function endGame() {
    // ... código existente ...
    
    // Após mostrar a pontuação final:
    setTimeout(() => {
        const save = confirm(`🏆 Fim do jogo! Pontuação: ${score}\nDeseja salvar sua pontuação no ranking?`);
        if (save) {
            const playerName = prompt('Digite seu nome:') || 'Jogador';
            // Chama a função do ranking.js
            if (typeof saveScore === 'function') {
                saveScore('Nome do Jogo Aqui', playerName, score);
                alert('Pontuação salva! Veja o ranking na página principal.');
            }
        }
    }, 1000);
}

// Em qualquer jogo, você pode acessar:
if (window.ZooKidConfig) {
    const config = ZooKidConfig.getConfig();
    
    // Verificar se som está ativo
    if (config.audio.enabled) {
        // Tocar som
    }
    
    // Verificar dificuldade
    if (config.game.difficulty === 'hard') {
        // Aumentar dificuldade
    }
}