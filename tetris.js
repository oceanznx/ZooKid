// tetris.js - Tetris Animal com controles WASD e células quadradas

// 1. CONFIGURAÇÕES INICIAIS
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BOARD = document.getElementById('tetris-board');
const SCORE_ELEMENT = document.getElementById('score');
const LEVEL_ELEMENT = document.getElementById('level');
const LINES_ELEMENT = document.getElementById('lines');
const NEXT_PIECE_ELEMENT = document.getElementById('next-piece');
const MESSAGE_ELEMENT = document.getElementById('game-message');
const START_BTN = document.getElementById('start-btn');
const PAUSE_BTN = document.getElementById('pause-btn');
const RESTART_BTN = document.getElementById('restart-btn');

// 2. PEÇAS DO TETRIS (Cada uma com um animal)
const PIECES = {
    I: {
        shape: [
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0],
            [0,0,0,0]
        ],
        color: 'I',
        animal: '🐳'
    },
    J: {
        shape: [
            [1,0,0],
            [1,1,1],
            [0,0,0]
        ],
        color: 'J',
        animal: '🐘'
    },
    L: {
        shape: [
            [0,0,1],
            [1,1,1],
            [0,0,0]
        ],
        color: 'L',
        animal: '🦒'
    },
    O: {
        shape: [
            [1,1],
            [1,1]
        ],
        color: 'O',
        animal: '🐻'
    },
    S: {
        shape: [
            [0,1,1],
            [1,1,0],
            [0,0,0]
        ],
        color: 'S',
        animal: '🐍'
    },
    T: {
        shape: [
            [0,1,0],
            [1,1,1],
            [0,0,0]
        ],
        color: 'T',
        animal: '🦁'
    },
    Z: {
        shape: [
            [1,1,0],
            [0,1,1],
            [0,0,0]
        ],
        color: 'Z',
        animal: '🦊'
    }
};

// 3. VARIÁVEIS DO JOGO
let board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
let currentPiece = null;
let nextPiece = null;
let piecePosition = { x: 0, y: 0 };
let score = 0;
let level = 1;
let lines = 0;
let gameInterval = null;
let gameSpeed = 1000;
let isGameRunning = false;
let isPaused = false;
let dropInterval = null;

// 4. FUNÇÕES DO JOGO

/**
 * Inicializa o tabuleiro com células quadradas
 */
function initBoard() {
    BOARD.innerHTML = '';
    BOARD.style.gridTemplateColumns = `repeat(${BOARD_WIDTH}, 1fr)`;
    BOARD.style.gridTemplateRows = `repeat(${BOARD_HEIGHT}, 1fr)`;
    
    // Garante que todas as células sejam quadradas
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            const cell = document.createElement('div');
            cell.classList.add('tetris-cell');
            cell.dataset.x = x;
            cell.dataset.y = y;
            // Garante célula quadrada
            cell.style.aspectRatio = '1';
            BOARD.appendChild(cell);
        }
    }
}

/**
 * Cria uma nova peça aleatória
 */
function createRandomPiece() {
    const pieceNames = Object.keys(PIECES);
    const randomName = pieceNames[Math.floor(Math.random() * pieceNames.length)];
    return {
        ...PIECES[randomName],
        name: randomName
    };
}

/**
 * Renderiza o próximo bloco
 */
function renderNextPiece() {
    NEXT_PIECE_ELEMENT.innerHTML = '';
    NEXT_PIECE_ELEMENT.style.gridTemplateColumns = `repeat(4, 1fr)`;
    NEXT_PIECE_ELEMENT.style.gridTemplateRows = `repeat(4, 1fr)`;
    
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            const cell = document.createElement('div');
            cell.classList.add('next-cell');
            
            // Garante células quadradas no preview
            cell.style.aspectRatio = '1';
            
            if (nextPiece && y < nextPiece.shape.length && x < nextPiece.shape[y].length) {
                if (nextPiece.shape[y][x]) {
                    cell.classList.add('tetris-cell', nextPiece.color);
                    cell.textContent = nextPiece.animal;
                }
            }
            
            NEXT_PIECE_ELEMENT.appendChild(cell);
        }
    }
}

/**
 * Desenha o estado atual do jogo
 */
function draw() {
    // Limpa o tabuleiro
    document.querySelectorAll('.tetris-cell').forEach(cell => {
        cell.className = 'tetris-cell';
        cell.textContent = '';
        cell.style.aspectRatio = '1'; // Mantém quadrado
    });
    
    // Desenha as peças fixadas
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (board[y][x]) {
                const cellIndex = y * BOARD_WIDTH + x;
                const cell = BOARD.children[cellIndex];
                cell.classList.add('tetris-cell', 'filled', board[y][x]);
                cell.textContent = PIECES[board[y][x]]?.animal || '';
                cell.style.aspectRatio = '1'; // Mantém quadrado
            }
        }
    }
    
    // Desenha a peça atual
    if (currentPiece) {
        for (let y = 0; y < currentPiece.shape.length; y++) {
            for (let x = 0; x < currentPiece.shape[y].length; x++) {
                if (currentPiece.shape[y][x]) {
                    const boardX = piecePosition.x + x;
                    const boardY = piecePosition.y + y;
                    
                    if (boardY >= 0) {
                        const cellIndex = boardY * BOARD_WIDTH + boardX;
                        if (cellIndex >= 0 && cellIndex < BOARD.children.length) {
                            const cell = BOARD.children[cellIndex];
                            cell.classList.add('tetris-cell', currentPiece.color);
                            cell.textContent = currentPiece.animal;
                            cell.style.aspectRatio = '1'; // Mantém quadrado
                        }
                    }
                }
            }
        }
    }
    
    // Atualiza a pontuação
    SCORE_ELEMENT.textContent = score;
    LEVEL_ELEMENT.textContent = level;
    LINES_ELEMENT.textContent = lines;
}

/**
 * Move a peça para baixo
 */
function moveDown() {
    if (!currentPiece || !isGameRunning || isPaused) return;
    
    piecePosition.y++;
    
    if (checkCollision()) {
        piecePosition.y--;
        lockPiece();
        checkLines();
        spawnPiece();
    }
    
    draw();
}

/**
 * Move a peça lateralmente
 */
function movePiece(direction) {
    if (!currentPiece || !isGameRunning || isPaused) return;
    
    const originalX = piecePosition.x;
    piecePosition.x += direction;
    
    if (checkCollision()) {
        piecePosition.x = originalX;
    }
    
    draw();
}

/**
 * Rotaciona a peça
 */
function rotatePiece() {
    if (!currentPiece || !isGameRunning || isPaused) return;
    
    const originalShape = currentPiece.shape;
    
    // Transpõe e inverte para rotação horária
    const rotated = originalShape[0].map((_, colIndex) =>
        originalShape.map(row => row[colIndex])
    );
    
    currentPiece.shape = rotated.map(row => row.reverse());
    
    if (checkCollision()) {
        currentPiece.shape = originalShape;
    }
    
    draw();
}

/**
 * Verifica colisão
 */
function checkCollision() {
    if (!currentPiece) return true;
    
    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x]) {
                const boardX = piecePosition.x + x;
                const boardY = piecePosition.y + y;
                
                if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
                    return true;
                }
                
                if (boardY >= 0 && board[boardY][boardX]) {
                    return true;
                }
            }
        }
    }
    
    return false;
}

/**
 * Fixa a peça no tabuleiro
 */
function lockPiece() {
    if (!currentPiece) return;
    
    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x]) {
                const boardX = piecePosition.x + x;
                const boardY = piecePosition.y + y;
                
                if (boardY >= 0) {
                    board[boardY][boardX] = currentPiece.name;
                }
            }
        }
    }
}

/**
 * Verifica linhas completas
 */
function checkLines() {
    let linesCleared = 0;
    
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== 0)) {
            // Remove a linha
            board.splice(y, 1);
            // Adiciona nova linha no topo
            board.unshift(Array(BOARD_WIDTH).fill(0));
            linesCleared++;
            y++; // Verifica a mesma posição novamente
        }
    }
    
    if (linesCleared > 0) {
        // Calcula pontuação
        const points = [0, 100, 300, 500, 800][linesCleared] || 1000;
        score += points * level;
        lines += linesCleared;
        
        // Atualiza nível a cada 10 linhas
        level = Math.floor(lines / 10) + 1;
        gameSpeed = Math.max(100, 1000 - (level - 1) * 100);
        
        // Efeito visual
        MESSAGE_ELEMENT.textContent = `${linesCleared} LINHA${linesCleared > 1 ? 'S' : ''} COMPLETA${linesCleared > 1 ? 'S' : ''}! +${points * level} pontos`;
        MESSAGE_ELEMENT.style.color = '#28a745';
        
        setTimeout(() => {
            if (isGameRunning) {
                MESSAGE_ELEMENT.textContent = 'CONTINUE JOGANDO!';
                MESSAGE_ELEMENT.style.color = '#f3cb2b';
            }
        }, 1500);
        
        // Atualiza velocidade
        if (gameInterval) {
            clearInterval(gameInterval);
            gameInterval = setInterval(moveDown, gameSpeed);
        }
    }
}

/**
 * Cria uma nova peça
 */
function spawnPiece() {
    currentPiece = nextPiece || createRandomPiece();
    nextPiece = createRandomPiece();
    
    piecePosition = {
        x: Math.floor(BOARD_WIDTH / 2) - Math.floor(currentPiece.shape[0].length / 2),
        y: 0
    };
    
    // Verifica game over
    if (checkCollision()) {
        gameOver();
        return;
    }
    
    renderNextPiece();
    draw();
}

/**
 * Queda rápida da peça
 */
function hardDrop() {
    if (!currentPiece || !isGameRunning || isPaused) return;
    
    while (!checkCollision()) {
        piecePosition.y++;
    }
    piecePosition.y--;
    
    lockPiece();
    checkLines();
    spawnPiece();
}

/**
 * Inicia o jogo
 */
function startGame() {
    if (isGameRunning) return;
    
    // Reinicia o jogo
    board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
    score = 0;
    level = 1;
    lines = 0;
    gameSpeed = 1000;
    isGameRunning = true;
    isPaused = false;
    
    PAUSE_BTN.innerHTML = '<span class="btn-emoji">⏸️</span><span class="btn-text">Pausar</span>';
    
    // Cria peças iniciais
    nextPiece = createRandomPiece();
    spawnPiece();
    
    // Inicia o loop do jogo
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(moveDown, gameSpeed);
    
    MESSAGE_ELEMENT.textContent = 'JOGO EM ANDAMENTO!';
    MESSAGE_ELEMENT.style.color = '#28a745';
}

/**
 * Pausa/Continua o jogo
 */
function togglePause() {
    if (!isGameRunning) return;
    
    isPaused = !isPaused;
    
    if (isPaused) {
        clearInterval(gameInterval);
        clearInterval(dropInterval);
        PAUSE_BTN.innerHTML = '<span class="btn-emoji">▶️</span><span class="btn-text">Continuar</span>';
        MESSAGE_ELEMENT.textContent = 'JOGO PAUSADO';
        MESSAGE_ELEMENT.style.color = '#ffc107';
    } else {
        gameInterval = setInterval(moveDown, gameSpeed);
        PAUSE_BTN.innerHTML = '<span class="btn-emoji">⏸️</span><span class="btn-text">Pausar</span>';
        MESSAGE_ELEMENT.textContent = 'JOGO EM ANDAMENTO!';
        MESSAGE_ELEMENT.style.color = '#28a745';
    }
}

/**
 * Finaliza o jogo
 */
function gameOver() {
    isGameRunning = false;
    clearInterval(gameInterval);
    clearInterval(dropInterval);
    
    MESSAGE_ELEMENT.textContent = `FIM DE JOGO! PONTUAÇÃO: ${score}`;
    MESSAGE_ELEMENT.style.color = '#dc3545';
    
    // Botão de salvar pontuação
    setTimeout(() => {
        const saveBtn = document.createElement('button');
        saveBtn.innerHTML = '<span class="btn-emoji">🏆</span><span class="btn-text">Salvar Pontuação</span>';
        saveBtn.className = 'game-btn';
        saveBtn.style.marginTop = '1rem';
        saveBtn.onclick = () => {
            const playerName = prompt('Digite seu nome:') || 'Jogador';
            if (typeof saveScore === 'function') {
                saveScore('Tetris Animal', playerName, score);
                alert('Pontuação salva! Veja o ranking.');
            }
        };
        
        MESSAGE_ELEMENT.parentNode.appendChild(saveBtn);
    }, 1000);
}

// 5. CONTROLES DO TECLADO COM SETAS E WASD
function handleKeyPress(e) {
    if (!isGameRunning && e.key !== 'Enter') {
        startGame();
        return;
    }
    
    // Mapeamento de teclas
    const keyActions = {
        // Setas
        'ArrowLeft': () => movePiece(-1),
        'ArrowRight': () => movePiece(1),
        'ArrowDown': () => moveDown(),
        'ArrowUp': () => rotatePiece(),
        
        // WASD
        'a': () => movePiece(-1),
        'A': () => movePiece(-1),
        'd': () => movePiece(1),
        'D': () => movePiece(1),
        's': () => moveDown(),
        'S': () => moveDown(),
        'w': () => rotatePiece(),
        'W': () => rotatePiece(),
        
        // Outros controles
        ' ': () => hardDrop(),
        'p': () => togglePause(),
        'P': () => togglePause(),
        'Enter': () => { if (!isGameRunning) startGame(); }
    };
    
    if (keyActions[e.key]) {
        e.preventDefault();
        keyActions[e.key]();
    }
}

// 6. CONTROLES MÓVEIS
function setupMobileControls() {
    document.querySelectorAll('.mobile-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const action = btn.dataset.action;
            
            if (!isGameRunning && action !== 'start') {
                startGame();
                return;
            }
            
            const actions = {
                'left': () => movePiece(-1),
                'right': () => movePiece(1),
                'down': () => moveDown(),
                'rotate': () => rotatePiece(),
                'drop': () => hardDrop()
            };
            
            if (actions[action]) actions[action]();
        });
        
        // Suporte a touch para mobile
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const action = btn.dataset.action;
            
            if (!isGameRunning && action !== 'start') {
                startGame();
                return;
            }
            
            const actions = {
                'left': () => movePiece(-1),
                'right': () => movePiece(1),
                'down': () => moveDown(),
                'rotate': () => rotatePiece(),
                'drop': () => hardDrop()
            };
            
            if (actions[action]) actions[action]();
        });
    });
}

// 7. CONFIGURA QUEDA CONTÍNUA COM SETA/W/S
function setupContinuousDrop() {
    let dropKeys = {};
    
    document.addEventListener('keydown', (e) => {
        if (!isGameRunning || isPaused) return;
        
        // Verifica se é tecla de movimento para baixo
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
            if (!dropKeys[e.key]) {
                dropKeys[e.key] = true;
                // Acelera a queda enquanto a tecla está pressionada
                clearInterval(dropInterval);
                dropInterval = setInterval(moveDown, 50); // Queda rápida
            }
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
            dropKeys[e.key] = false;
            // Verifica se nenhuma tecla de queda está pressionada
            const anyDropKeyPressed = Object.values(dropKeys).some(v => v);
            if (!anyDropKeyPressed) {
                clearInterval(dropInterval);
                // Restaura velocidade normal
                if (gameInterval) {
                    clearInterval(gameInterval);
                    gameInterval = setInterval(moveDown, gameSpeed);
                }
            }
        }
    });
}

// 8. INICIALIZAÇÃO
function initGame() {
    initBoard();
    renderNextPiece();
    
    // Configura eventos
    document.addEventListener('keydown', handleKeyPress);
    START_BTN.addEventListener('click', startGame);
    PAUSE_BTN.addEventListener('click', togglePause);
    RESTART_BTN.addEventListener('click', () => {
        if (gameInterval) clearInterval(gameInterval);
        if (dropInterval) clearInterval(dropInterval);
        startGame();
    });
    
    // Configura controles
    setupMobileControls();
    setupContinuousDrop();
    
    // Mensagem inicial
    MESSAGE_ELEMENT.textContent = 'PRESSIONE QUALQUER TECLA PARA COMEÇAR!';
    MESSAGE_ELEMENT.style.color = '#f3cb2b';
    
    console.log('🎮 Tetris Animal inicializado!');
    console.log('Controles: Setas ou WASD para mover/girar, Espaço para queda rápida, P para pausar');
}

// 9. INICIA O JOGO
document.addEventListener('DOMContentLoaded', initGame);