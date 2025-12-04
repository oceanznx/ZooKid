// puzzle.js - Jogo de Quebra-Cabeça Animal - VERSÃO COMPLETA

// 1. CONFIGURAÇÕES INICIAIS
const PUZZLE_BOARD = document.getElementById('puzzle-board');
const PIECES_CONTAINER = document.getElementById('pieces-container');
const REFERENCE_IMAGE = document.getElementById('current-puzzle-img');
const TIMER_ELEMENT = document.getElementById('timer');
const MOVES_ELEMENT = document.getElementById('moves');
const PIECES_COUNT_ELEMENT = document.getElementById('pieces-count');
const GAME_MESSAGE = document.getElementById('game-message');
const MESSAGE_TEXT = GAME_MESSAGE.querySelector('.message-text');
const MESSAGE_EMOJI = GAME_MESSAGE.querySelector('.message-emoji');
const START_BTN = document.getElementById('start-btn');
const HINT_BTN = document.getElementById('hint-btn');
const SHUFFLE_BTN = document.getElementById('shuffle-btn');
const RESET_BTN = document.getElementById('reset-btn');
const WIN_MODAL = document.getElementById('win-modal');
const FINAL_TIME = document.getElementById('final-time');
const FINAL_MOVES = document.getElementById('final-moves');
const FINAL_DIFFICULTY = document.getElementById('final-difficulty');
const PLAY_AGAIN_BTN = document.getElementById('play-again-btn');
const NEXT_PUZZLE_BTN = document.getElementById('next-puzzle-btn');
const SHARE_BTN = document.getElementById('share-btn');
const VIEW_MODE_BTN = document.getElementById('view-mode-btn');

// 2. VARIÁVEIS DO JOGO
let currentPuzzle = 'zoologico';
let currentDifficulty = 'easy';
let gameStarted = false;
let timerInterval = null;
let seconds = 0;
let moves = 0;
let placedPieces = 0;
let totalPieces = 9;
let puzzlePieces = [];
let boardState = [];
let draggedPiece = null;
let isZoomMode = false;

// 3. CONFIGURAÇÕES DOS QUEBRA-CABEÇAS
const PUZZLES = {
    zoologico: {
        name: 'Zoológico',
        image: 'zoologico.jpg',
        alt: 'Imagem do zoológico'
    },
    tigre: {
        name: 'Tigre',
        image: 'tigre quebra.webp',
        alt: 'Imagem de um tigre'
    },
    fazenda: {
        name: 'Fazenda',
        image: 'fazenda quebra.jpg',
        alt: 'Imagem da fazenda'
    },
    elefante: {
        name: 'Elefante',
        image: 'elefante quebra.jpg',
        alt: 'Imagem de um elefante'
    }
};

const DIFFICULTIES = {
    easy: { rows: 3, cols: 3, name: 'Fácil', total: 9, pieceSize: 150 },
    medium: { rows: 4, cols: 4, name: 'Médio', total: 16, pieceSize: 120 },
    hard: { rows: 5, cols: 5, name: 'Difícil', total: 25, pieceSize: 100 }
};

// 4. FUNÇÕES PRINCIPAIS DO JOGO

/**
 * Inicializa o jogo
 */
function initGame() {
    setupEventListeners();
    loadPuzzle();
    updatePiecesCounter();
    showMessage('Escolha um quebra-cabeça e clique em Iniciar!', '👆');
}

/**
 * Configura todos os event listeners
 */
function setupEventListeners() {
    // Seleção de quebra-cabeça
    document.querySelectorAll('.puzzle-option').forEach(option => {
        option.addEventListener('click', () => {
            if (gameStarted) {
                if (!confirm('Tem certeza? Isso reiniciará o jogo atual.')) return;
            }
            selectPuzzle(option.dataset.puzzle);
        });
    });
    
    // Botões de dificuldade
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (gameStarted) {
                if (!confirm('Mudar a dificuldade reiniciará o jogo. Continuar?')) return;
            }
            selectDifficulty(btn.dataset.difficulty);
        });
    });
    
    // Botões de controle
    START_BTN.addEventListener('click', startGame);
    HINT_BTN.addEventListener('click', showHint);
    SHUFFLE_BTN.addEventListener('click', shufflePieces);
    RESET_BTN.addEventListener('click', resetGame);
    
    // Botão de modo zoom
    if (VIEW_MODE_BTN) {
        VIEW_MODE_BTN.addEventListener('click', toggleZoomMode);
    }
    
    // Botões do modal
    PLAY_AGAIN_BTN.addEventListener('click', () => {
        WIN_MODAL.style.display = 'none';
        resetGame();
    });
    
    NEXT_PUZZLE_BTN.addEventListener('click', nextPuzzle);
    SHARE_BTN.addEventListener('click', saveScore);
}

/**
 * Carrega o quebra-cabeça selecionado
 */
function loadPuzzle() {
    const puzzle = PUZZLES[currentPuzzle];
    REFERENCE_IMAGE.src = puzzle.image;
    REFERENCE_IMAGE.alt = puzzle.alt;
    
    // Fallback para imagens que não carregarem
    REFERENCE_IMAGE.onerror = function() {
        this.src = `https://placehold.co/600x400/4CAF50/white?text=${encodeURIComponent(puzzle.name)}`;
    };
    
    // Atualiza seleção visual
    document.querySelectorAll('.puzzle-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.puzzle === currentPuzzle) {
            option.classList.add('active');
        }
    });
}

/**
 * Seleciona um quebra-cabeça
 */
function selectPuzzle(puzzleName) {
    currentPuzzle = puzzleName;
    loadPuzzle();
    
    if (gameStarted) {
        createPuzzle();
    }
}

/**
 * Seleciona a dificuldade
 */
function selectDifficulty(difficulty) {
    currentDifficulty = difficulty;
    totalPieces = DIFFICULTIES[difficulty].total;
    
    // Atualiza botões visuais
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.difficulty === difficulty) {
            btn.classList.add('active');
        }
    });
    
    PIECES_COUNT_ELEMENT.textContent = `0/${totalPieces}`;
    
    if (gameStarted) {
        createPuzzle();
    }
}

/**
 * Alterna modo zoom
 */
function toggleZoomMode() {
    isZoomMode = !isZoomMode;
    
    if (VIEW_MODE_BTN) {
        if (isZoomMode) {
            VIEW_MODE_BTN.classList.add('active');
            VIEW_MODE_BTN.querySelector('.view-text').textContent = 'Modo Normal';
            VIEW_MODE_BTN.querySelector('.view-emoji').textContent = '👁️';
            showMessage('Modo Zoom ativado! Clique em 🔍 nas peças para ampliar.', '🔍');
        } else {
            VIEW_MODE_BTN.classList.remove('active');
            VIEW_MODE_BTN.querySelector('.view-text').textContent = 'Modo Zoom';
            VIEW_MODE_BTN.querySelector('.view-emoji').textContent = '🔍';
            showMessage('Modo Zoom desativado.', '👁️');
        }
    }
}

/**
 * Inicia o jogo
 */
function startGame() {
    if (gameStarted) {
        showMessage('O jogo já está em andamento!', '🎮');
        return;
    }
    
    gameStarted = true;
    seconds = 0;
    moves = 0;
    placedPieces = 0;
    
    updateTimer();
    updateMoves();
    updatePiecesCount();
    
    // Inicia o timer
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    
    createPuzzle();
    showMessage('Arraste as peças para o tabuleiro! Clique em 🔍 para zoom.', '🧩');
}

/**
 * Cria o quebra-cabeça
 */
function createPuzzle() {
    const difficulty = DIFFICULTIES[currentDifficulty];
    
    // Limpa o tabuleiro e peças
    PUZZLE_BOARD.innerHTML = '';
    PIECES_CONTAINER.innerHTML = '';
    
    // Configura classes de dificuldade
    PUZZLE_BOARD.className = 'puzzle-board';
    PIECES_CONTAINER.className = 'pieces-container';
    
    PUZZLE_BOARD.classList.add(currentDifficulty);
    PIECES_CONTAINER.classList.add(currentDifficulty);
    
    // Ajusta tamanho das células baseado na dificuldade
    const pieceSize = difficulty.pieceSize;
    
    // Cria o tabuleiro
    boardState = Array(difficulty.rows).fill().map(() => Array(difficulty.cols).fill(null));
    
    for (let row = 0; row < difficulty.rows; row++) {
        for (let col = 0; col < difficulty.cols; col++) {
            const cell = document.createElement('div');
            cell.className = 'board-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.dataset.index = row * difficulty.cols + col;
            
            // Tamanho mínimo baseado na dificuldade
            cell.style.minHeight = `${pieceSize}px`;
            cell.style.minWidth = `${pieceSize}px`;
            
            // Permite soltar peças
            cell.addEventListener('dragover', handleDragOver);
            cell.addEventListener('drop', handleDrop);
            cell.addEventListener('dragenter', handleDragEnter);
            cell.addEventListener('dragleave', handleDragLeave);
            
            PUZZLE_BOARD.appendChild(cell);
        }
    }
    
    // Cria as peças
    puzzlePieces = [];
    
    for (let i = 0; i < totalPieces; i++) {
        const piece = document.createElement('div');
        piece.className = 'piece-slot empty';
        piece.dataset.index = i;
        piece.style.minHeight = `${pieceSize}px`;
        piece.style.minWidth = `${pieceSize}px`;
        
        // Permite soltar peças de volta
        piece.addEventListener('dragover', handleDragOver);
        piece.addEventListener('drop', handleDrop);
        piece.addEventListener('dragenter', handleDragEnter);
        piece.addEventListener('dragleave', handleDragLeave);
        
        PIECES_CONTAINER.appendChild(piece);
        
        // Calcula posição da peça na imagem original
        const row = Math.floor(i / difficulty.cols);
        const col = i % difficulty.cols;
        
        puzzlePieces.push({
            element: null,
            correctRow: row,
            correctCol: col,
            currentRow: null,
            currentCol: null,
            placed: false,
            index: i
        });
    }
    
    // Embaralha as peças
    shufflePieces();
    updatePiecesCounter();
}

/**
 * Cria elemento de peça com zoom
 */
function createPieceElement(piece) {
    const container = document.createElement('div');
    container.className = 'piece-container';
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.height = '100%';
    
    const img = document.createElement('img');
    img.className = 'puzzle-piece';
    img.draggable = true;
    img.dataset.index = piece.index;
    
    // Configuração da imagem
    const difficulty = DIFFICULTIES[currentDifficulty];
    const xPercent = (piece.correctCol / difficulty.cols) * 100;
    const yPercent = (piece.correctRow / difficulty.rows) * 100;
    
    // Usa background-image para mostrar apenas a parte correta
    img.style.backgroundImage = `url('${PUZZLES[currentPuzzle].image}')`;
    img.style.backgroundSize = `${difficulty.cols * 100}% ${difficulty.rows * 100}%`;
    img.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
    img.style.backgroundRepeat = 'no-repeat';
    
    // SVG transparente como placeholder
    img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"></svg>';
    img.alt = `Peça ${piece.index + 1} do quebra-cabeça ${PUZZLES[currentPuzzle].name}`;
    
    // Eventos de drag and drop
    img.addEventListener('dragstart', handleDragStart);
    img.addEventListener('dragend', handleDragEnd);
    
    // Evento de clique para zoom (apenas no modo zoom)
    if (isZoomMode) {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            showPieceZoom(piece);
        });
    }
    
    // Botão de zoom sempre visível
    const zoomBtn = document.createElement('button');
    zoomBtn.className = 'zoom-btn';
    zoomBtn.innerHTML = '🔍';
    zoomBtn.title = 'Ampliar peça';
    
    zoomBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPieceZoom(piece);
    });
    
    container.appendChild(img);
    container.appendChild(zoomBtn);
    
    return container;
}

/**
 * Mostra zoom da peça
 */
function showPieceZoom(piece) {
    const zoomModal = document.createElement('div');
    zoomModal.className = 'zoom-modal';
    zoomModal.style.display = 'flex';
    
    const zoomContent = document.createElement('div');
    zoomContent.className = 'zoom-content';
    
    const img = document.createElement('img');
    img.src = PUZZLES[currentPuzzle].image;
    img.alt = `Zoom da peça ${piece.index + 1}`;
    
    // Configura para mostrar apenas a parte da peça
    const difficulty = DIFFICULTIES[currentDifficulty];
    img.style.width = '400px';
    img.style.height = '400px';
    img.style.objectFit = 'none';
    img.style.objectPosition = `-${(piece.correctCol / difficulty.cols) * 400}px -${(piece.correctRow / difficulty.rows) * 400}px`;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-zoom';
    closeBtn.innerHTML = '×';
    closeBtn.title = 'Fechar';
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(zoomModal);
    });
    
    // Fecha ao clicar fora
    zoomModal.addEventListener('click', (e) => {
        if (e.target === zoomModal) {
            document.body.removeChild(zoomModal);
        }
    });
    
    // Fecha com ESC
    document.addEventListener('keydown', function closeOnEsc(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(zoomModal);
            document.removeEventListener('keydown', closeOnEsc);
        }
    });
    
    zoomContent.appendChild(img);
    zoomContent.appendChild(closeBtn);
    zoomModal.appendChild(zoomContent);
    document.body.appendChild(zoomModal);
}

/**
 * Embaralha as peças
 */
function shufflePieces() {
    if (!gameStarted) {
        showMessage('Inicie o jogo primeiro!', '🎮');
        return;
    }
    
    // Remove todas as peças colocadas
    document.querySelectorAll('.puzzle-piece').forEach(piece => piece.remove());
    boardState = boardState.map(row => row.map(() => null));
    placedPieces = 0;
    updatePiecesCount();
    
    // Redefine estado das peças
    puzzlePieces.forEach(piece => {
        piece.placed = false;
        piece.currentRow = null;
        piece.currentCol = null;
    });
    
    // Embaralha a ordem das peças
    const shuffledIndices = [...Array(totalPieces).keys()].sort(() => Math.random() - 0.5);
    
    // Cria peças novas em ordem embaralhada
    shuffledIndices.forEach((shuffledIndex, slotIndex) => {
        const piece = puzzlePieces[shuffledIndex];
        const pieceElement = createPieceElement(piece);
        const slot = PIECES_CONTAINER.children[slotIndex];
        
        slot.classList.remove('empty');
        slot.innerHTML = '';
        slot.appendChild(pieceElement);
        
        piece.element = pieceElement;
    });
    
    showMessage('Peças embaralhadas! Comece a montar!', '🔀');
    updatePiecesCounter();
}

/**
 * Mostra uma dica
 */
function showHint() {
    if (!gameStarted) {
        showMessage('Inicie o jogo primeiro!', '🎮');
        return;
    }
    
    // Encontra uma peça não colocada
    const unplacedPieces = puzzlePieces.filter(piece => !piece.placed);
    if (unplacedPieces.length === 0) return;
    
    // Escolhe uma peça aleatória
    const randomPiece = unplacedPieces[Math.floor(Math.random() * unplacedPieces.length)];
    
    // Mostra a célula correta
    const cell = document.querySelector(`.board-cell[data-row="${randomPiece.correctRow}"][data-col="${randomPiece.correctCol}"]`);
    if (cell && !cell.querySelector('.puzzle-piece')) {
        cell.classList.add('hint');
        
        setTimeout(() => {
            cell.classList.remove('hint');
        }, 2000);
        
        showMessage(`Dica: esta peça vai na linha ${randomPiece.correctRow + 1}, coluna ${randomPiece.correctCol + 1}`, '💡');
    } else {
        showMessage('Todas as posições estão ocupadas!', '🤔');
    }
}

/**
 * Reseta o jogo
 */
function resetGame() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    gameStarted = false;
    seconds = 0;
    moves = 0;
    placedPieces = 0;
    
    updateTimer();
    updateMoves();
    updatePiecesCount();
    
    PUZZLE_BOARD.innerHTML = '';
    PIECES_CONTAINER.innerHTML = '';
    
    showMessage('Escolha um quebra-cabeça e clique em Iniciar!', '👆');
    updatePiecesCounter();
}

/**
 * Atualiza o timer
 */
function updateTimer() {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    TIMER_ELEMENT.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Atualiza contador de movimentos
 */
function updateMoves() {
    MOVES_ELEMENT.textContent = moves;
}

/**
 * Atualiza contador de peças
 */
function updatePiecesCount() {
    PIECES_COUNT_ELEMENT.textContent = `${placedPieces}/${totalPieces}`;
}

/**
 * Atualiza contador visível de peças
 */
function updatePiecesCounter() {
    let counter = document.querySelector('.pieces-counter');
    
    if (!counter) {
        counter = document.createElement('div');
        counter.className = 'pieces-counter';
        document.querySelector('.puzzle-game-area').appendChild(counter);
    }
    
    const difficulty = DIFFICULTIES[currentDifficulty];
    counter.innerHTML = `
        <span>🧩 ${placedPieces}/${totalPieces}</span>
        <div>${difficulty.name.toUpperCase()} ${difficulty.rows}x${difficulty.cols}</div>
    `;
}

/**
 * Mostra uma mensagem
 */
function showMessage(text, emoji = '🧩') {
    MESSAGE_TEXT.textContent = text;
    MESSAGE_EMOJI.textContent = emoji;
    
    // Remove mensagem após alguns segundos (exceto mensagens importantes)
    if (!text.includes('Escolha') && !text.includes('Iniciar')) {
        setTimeout(() => {
            if (gameStarted) {
                showMessage(`Progresso: ${placedPieces}/${totalPieces} peças`, '📊');
            }
        }, 3000);
    }
}

// 5. SISTEMA DE DRAG AND DROP

/**
 * Inicia o arraste
 */
function handleDragStart(e) {
    if (!gameStarted) {
        e.preventDefault();
        return;
    }
    
    draggedPiece = e.target;
    draggedPiece.classList.add('dragging');
    
    // Define dados para transferência
    e.dataTransfer.setData('text/plain', draggedPiece.dataset.index);
    e.dataTransfer.effectAllowed = 'move';
    
    // Efeito visual
    setTimeout(() => {
        draggedPiece.style.opacity = '0.6';
    }, 0);
}

/**
 * Finaliza o arraste
 */
function handleDragEnd(e) {
    if (draggedPiece) {
        draggedPiece.classList.remove('dragging');
        draggedPiece.style.opacity = '1';
    }
    
    draggedPiece = null;
    
    // Remove classes de hover
    document.querySelectorAll('.board-cell, .piece-slot').forEach(el => {
        el.classList.remove('hover');
    });
}

/**
 * Permite soltar
 */
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

/**
 * Entra na área de soltar
 */
function handleDragEnter(e) {
    e.preventDefault();
    if (draggedPiece && (e.target.classList.contains('board-cell') || e.target.classList.contains('piece-slot'))) {
        e.target.classList.add('hover');
    }
}

/**
 * Sai da área de soltar
 */
function handleDragLeave(e) {
    e.target.classList.remove('hover');
}

/**
 * Solta a peça
 */
function handleDrop(e) {
    e.preventDefault();
    e.target.classList.remove('hover');
    
    if (!draggedPiece || !gameStarted) return;
    
    const pieceIndex = parseInt(draggedPiece.dataset.index);
    const piece = puzzlePieces[pieceIndex];
    
    // Se estiver soltando em uma célula do tabuleiro
    if (e.target.classList.contains('board-cell')) {
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        
        // Verifica se a célula está vazia
        if (!boardState[row][col]) {
            // Remove da posição anterior
            if (piece.placed) {
                boardState[piece.currentRow][piece.currentCol] = null;
                const oldCell = document.querySelector(`.board-cell[data-row="${piece.currentRow}"][data-col="${piece.currentCol}"]`);
                if (oldCell) {
                    oldCell.classList.remove('correct');
                }
            } else {
                // Remove do container de peças
                const oldSlot = draggedPiece.closest('.piece-slot');
                if (oldSlot) {
                    oldSlot.classList.add('empty');
                    oldSlot.innerHTML = '';
                }
            }
            
            // Coloca na nova posição
            e.target.appendChild(draggedPiece);
            boardState[row][col] = pieceIndex;
            
            // Atualiza estado da peça
            piece.placed = true;
            piece.currentRow = row;
            piece.currentCol = col;
            draggedPiece.classList.add('placed');
            
            // Verifica se está na posição correta
            if (row === piece.correctRow && col === piece.correctCol) {
                e.target.classList.add('correct');
                placedPieces++;
                updatePiecesCount();
                updatePiecesCounter();
                
                // Efeito visual
                showMessage(`Correto! ${placedPieces}/${totalPieces} peças`, '✅');
                
                // Verifica vitória
                if (placedPieces === totalPieces) {
                    setTimeout(() => gameWon(), 500);
                }
            } else {
                showMessage('Continue tentando!', '💪');
                e.target.classList.remove('correct');
            }
            
            moves++;
            updateMoves();
        }
    }
    // Se estiver soltando de volta no container
    else if (e.target.classList.contains('piece-slot') && !e.target.querySelector('.puzzle-piece')) {
        // Remove do tabuleiro (se estava lá)
        if (piece.placed) {
            boardState[piece.currentRow][piece.currentCol] = null;
            
            // Remove classe de correto da célula
            const oldCell = document.querySelector(`.board-cell[data-row="${piece.currentRow}"][data-col="${piece.currentCol}"]`);
            if (oldCell) {
                oldCell.classList.remove('correct');
            }
            
            piece.placed = false;
            piece.currentRow = null;
            piece.currentCol = null;
            placedPieces--;
            updatePiecesCount();
            updatePiecesCounter();
        }
        
        // Coloca no slot
        e.target.appendChild(draggedPiece);
        e.target.classList.remove('empty');
        draggedPiece.classList.remove('placed');
        
        moves++;
        updateMoves();
        showMessage('Peça movida de volta para o container', '↩️');
    }
}

// 6. SISTEMA DE VITÓRIA

/**
 * Quando o jogador vence
 */
function gameWon() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Atualiza modal com estatísticas
    FINAL_TIME.textContent = TIMER_ELEMENT.textContent;
    FINAL_MOVES.textContent = moves;
    FINAL_DIFFICULTY.textContent = DIFFICULTIES[currentDifficulty].name;
    
    // Mostra modal
    WIN_MODAL.style.display = 'block';
    
    // Efeitos de celebração
    createConfetti();
    playVictorySound();
}

/**
 * Próximo quebra-cabeça
 */
function nextPuzzle() {
    WIN_MODAL.style.display = 'none';
    
    const puzzleNames = Object.keys(PUZZLES);
    const currentIndex = puzzleNames.indexOf(currentPuzzle);
    const nextIndex = (currentIndex + 1) % puzzleNames.length;
    
    selectPuzzle(puzzleNames[nextIndex]);
    resetGame();
    startGame();
}

/**
 * Salva a pontuação
 */
function saveScore() {
    const playerName = prompt('Digite seu nome para o ranking:') || 'Jogador ZooKid';
    const difficulty = DIFFICULTIES[currentDifficulty].name;
    const time = TIMER_ELEMENT.textContent;
    const puzzleName = PUZZLES[currentPuzzle].name;
    
    // Simulação de salvamento (substitua pela sua função real)
    const scores = JSON.parse(localStorage.getItem('zookid_puzzle_scores') || '[]');
    
    scores.push({
        game: `Quebra-Cabeça: ${puzzleName}`,
        player: playerName,
        moves: moves,
        time: time,
        difficulty: difficulty,
        date: new Date().toISOString(),
        score: calculateScore(moves, seconds, difficulty)
    });
    
    // Mantém apenas os 10 melhores scores
    scores.sort((a, b) => b.score - a.score);
    if (scores.length > 10) scores.length = 10;
    
    localStorage.setItem('zookid_puzzle_scores', JSON.stringify(scores));
    
    alert(`🏆 Pontuação salva!\n\n${playerName} - ${puzzleName}\n⏱️ ${time} - 👣 ${moves} movimentos\n🎯 Dificuldade: ${difficulty}`);
    
    WIN_MODAL.style.display = 'none';
}

/**
 * Calcula pontuação
 */
function calculateScore(moves, seconds, difficulty) {
    let baseScore = 1000;
    let movePenalty = moves * 10;
    let timePenalty = Math.floor(seconds / 10) * 5;
    let difficultyBonus = 0;
    
    if (difficulty === 'Médio') difficultyBonus = 500;
    if (difficulty === 'Difícil') difficultyBonus = 1000;
    
    return Math.max(100, baseScore - movePenalty - timePenalty + difficultyBonus);
}

/**
 * Cria efeito de confete
 */
function createConfetti() {
    const colors = ['#f3cb2b', '#28a745', '#007bff', '#dc3545', '#ff9966', '#9C27B0'];
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '9999';
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 10 + 5;
        const startX = Math.random() * 100;
        const duration = Math.random() * 3 + 2;
        
        confetti.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            top: -20px;
            left: ${startX}%;
            animation: confettiFall ${duration}s linear forwards;
            transform: rotate(${Math.random() * 360}deg);
        `;
        
        confettiContainer.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, duration * 1000);
    }
    
    document.body.appendChild(confettiContainer);
    
    // Remove após 5 segundos
    setTimeout(() => {
        if (confettiContainer.parentNode) {
            confettiContainer.remove();
        }
    }, 5000);
    
    // Adiciona animação CSS se não existir
    if (!document.querySelector('#confetti-animation')) {
        const style = document.createElement('style');
        style.id = 'confetti-animation';
        style.textContent = `
            @keyframes confettiFall {
                to {
                    transform: translateY(100vh) rotate(${Math.random() * 720}deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Toca som de vitória (visual)
 */
function playVictorySound() {
    // Efeito visual em vez de som
    const victoryEmoji = document.createElement('div');
    victoryEmoji.textContent = '🎉🎊🌟';
    victoryEmoji.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 4rem;
        z-index: 10000;
        animation: victoryPop 1s ease-out forwards;
        pointer-events: none;
    `;
    
    document.body.appendChild(victoryEmoji);
    
    setTimeout(() => {
        victoryEmoji.remove();
    }, 1000);
    
    // Adiciona animação CSS
    if (!document.querySelector('#victory-animation')) {
        const style = document.createElement('style');
        style.id = 'victory-animation';
        style.textContent = `
            @keyframes victoryPop {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// 7. INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', initGame);