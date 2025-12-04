// labirinto.js - Jogo do Labirinto do Zoológico (Versão Completa e Corrigida)

// ==================== CONFIGURAÇÕES E VARIÁVEIS ====================
const MAZE = document.getElementById('maze');
const LEVEL_ELEMENT = document.getElementById('level');
const MOVES_ELEMENT = document.getElementById('moves');
const STARS_ELEMENT = document.getElementById('stars');
const MESSAGE_ELEMENT = document.getElementById('message');
const MESSAGE_TEXT = MESSAGE_ELEMENT.querySelector('.message-text');
const MESSAGE_EMOJI = MESSAGE_ELEMENT.querySelector('.message-emoji');
const RESTART_BTN = document.getElementById('restart-btn');
const HINT_BTN = document.getElementById('hint-btn');
const SOUND_BTN = document.getElementById('sound-btn');
const NEXT_LEVEL_BTN = document.getElementById('next-level-btn');
const LEVELS_GRID = document.getElementById('levels-grid');
const START_MOBILE_BTN = document.getElementById('start-mobile-btn');
const ANIMAL_EMOJI_DISPLAY = document.getElementById('current-animal-emoji');
const FOOD_EMOJI_DISPLAY = document.getElementById('target-food-emoji');

// ==================== LISTA DE ANIMAIS E COMIDAS ====================
const ANIMALS = [
    { id: 1, name: "Leão", emoji: "🦁", food: "Carne", foodEmoji: "🥩", difficulty: 1 },
    { id: 2, name: "Elefante", emoji: "🐘", food: "Frutas", foodEmoji: "🍎", difficulty: 1 },
    { id: 3, name: "Girafa", emoji: "🦒", food: "Folhas", foodEmoji: "🍃", difficulty: 2 },
    { id: 4, name: "Macaco", emoji: "🐒", food: "Banana", foodEmoji: "🍌", difficulty: 2 },
    { id: 5, name: "Panda", emoji: "🐼", food: "Bambu", foodEmoji: "🎋", difficulty: 3 },
    { id: 6, name: "Pinguim", emoji: "🐧", food: "Peixe", foodEmoji: "🐟", difficulty: 3 },
    { id: 7, name: "Coelho", emoji: "🐇", food: "Cenoura", foodEmoji: "🥕", difficulty: 4 },
    { id: 8, name: "Tartaruga", emoji: "🐢", food: "Alface", foodEmoji: "🥬", difficulty: 4 },
    { id: 9, name: "Cachorro", emoji: "🐕", food: "Osso", foodEmoji: "🦴", difficulty: 5 },
    { id: 10, name: "Gato", emoji: "🐈", food: "Leite", foodEmoji: "🥛", difficulty: 5 },
    { id: 11, name: "Coruja", emoji: "🦉", food: "Rato", foodEmoji: "🐭", difficulty: 6 },
    { id: 12, name: "Raposa", emoji: "🦊", food: "Uva", foodEmoji: "🍇", difficulty: 6 }
];

// ==================== NÍVEIS DO JOGO ====================
const LEVELS = [
    // Níveis Fáceis (5x5 a 7x7)
    { id: 1, name: "Iniciante", size: 5, animalId: 1, maxMoves: 12, stars: [5, 8, 11] },
    { id: 2, name: "Explorador", size: 5, animalId: 2, maxMoves: 12, stars: [5, 8, 11] },
    { id: 3, name: "Aventureiro", size: 6, animalId: 3, maxMoves: 15, stars: [6, 10, 14] },
    { id: 4, name: "Detetive", size: 6, animalId: 4, maxMoves: 15, stars: [6, 10, 14] },
    
    // Níveis Médios (7x7 a 8x8)
    { id: 5, name: "Mestre Jr", size: 7, animalId: 5, maxMoves: 18, stars: [7, 12, 17] },
    { id: 6, name: "Especialista", size: 7, animalId: 6, maxMoves: 18, stars: [7, 12, 17] },
    { id: 7, name: "Profissional", size: 8, animalId: 7, maxMoves: 20, stars: [8, 14, 19] },
    { id: 8, name: "Veterano", size: 8, animalId: 8, maxMoves: 20, stars: [8, 14, 19] },
    
    // Níveis Difíceis (9x9 a 10x10)
    { id: 9, name: "Expert", size: 9, animalId: 9, maxMoves: 25, stars: [10, 18, 23] },
    { id: 10, name: "Mestre", size: 9, animalId: 10, maxMoves: 25, stars: [10, 18, 23] },
    { id: 11, name: "Lenda", size: 10, animalId: 11, maxMoves: 30, stars: [12, 22, 28] },
    { id: 12, name: "Campeão", size: 10, animalId: 12, maxMoves: 30, stars: [12, 22, 28] }
];

// ==================== ESTADO DO JOGO ====================
let currentLevel = 1;
let currentAnimal = ANIMALS[0];
let currentPosition = { x: 0, y: 0 };
let endPosition = { x: 0, y: 0 };
let mazeGrid = [];
let moves = 0;
let stars = 0;
let gameActive = false;
let visitedCells = new Set();
let soundEnabled = true;
let isHintActive = false;

// ==================== ALGORITMO DO LABIRINTO CORRIGIDO ====================

/**
 * Gera um labirinto garantindo que sempre haja caminho do início ao fim
 */
function generateMaze(size) {
    // Inicializa grid com paredes (1 = parede, 0 = caminho)
    const grid = Array(size).fill().map(() => Array(size).fill(1));
    
    // SEMPRE garante que início e fim são caminhos
    const start = { x: 0, y: 0 };
    const end = { x: size - 1, y: size - 1 };
    
    grid[start.y][start.x] = 0; // Início
    grid[end.y][end.x] = 0;     // Fim
    
    // Lista de células para processar
    const cellsToProcess = [start];
    const directions = [
        { dx: 1, dy: 0 },  // direita
        { dx: -1, dy: 0 }, // esquerda
        { dx: 0, dy: 1 },  // baixo
        { dx: 0, dy: -1 }  // cima
    ];
    
    // Função auxiliar para verificar limites
    function isValid(x, y) {
        return x >= 0 && x < size && y >= 0 && y < size;
    }
    
    // Passo 1: Conecta início e fim garantidamente
    let current = start;
    let pathToEnd = [start];
    
    while (!(current.x === end.x && current.y === end.y)) {
        // Calcula direção para o fim
        let possibleDirections = [];
        
        if (current.x < end.x) possibleDirections.push({ dx: 1, dy: 0 });
        if (current.x > end.x) possibleDirections.push({ dx: -1, dy: 0 });
        if (current.y < end.y) possibleDirections.push({ dx: 0, dy: 1 });
        if (current.y > end.y) possibleDirections.push({ dx: 0, dy: -1 });
        
        // Escolhe uma direção aleatória válida
        const dir = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
        const nextX = current.x + dir.dx;
        const nextY = current.y + dir.dy;
        
        if (isValid(nextX, nextY)) {
            grid[nextY][nextX] = 0;
            current = { x: nextX, y: nextY };
            pathToEnd.push(current);
        }
    }
    
    // Passo 2: Expande caminhos aleatórios a partir do caminho principal
    for (const cell of pathToEnd) {
        // Tenta criar caminhos laterais
        for (const dir of directions) {
            if (Math.random() > 0.5) { // 50% de chance de criar ramificação
                const sideX = cell.x + dir.dx;
                const sideY = cell.y + dir.dy;
                
                if (isValid(sideX, sideY) && grid[sideY][sideX] === 1) {
                    grid[sideY][sideX] = 0;
                    
                    // Tenta estender um pouco mais
                    if (Math.random() > 0.7) {
                        const sideX2 = sideX + dir.dx;
                        const sideY2 = sideY + dir.dy;
                        if (isValid(sideX2, sideY2)) {
                            grid[sideY2][sideX2] = 0;
                        }
                    }
                }
            }
        }
    }
    
    // Passo 3: Garante que pelo menos 50% das células são caminhos
    const totalCells = size * size;
    let pathCount = grid.flat().filter(cell => cell === 0).length;
    const minPaths = Math.floor(totalCells * 0.5);
    
    // Adiciona caminhos extras se necessário
    while (pathCount < minPaths) {
        const x = Math.floor(Math.random() * size);
        const y = Math.floor(Math.random() * size);
        
        if (grid[y][x] === 1) {
            // Verifica se tem pelo menos um vizinho caminho
            const neighbors = [
                { x: x+1, y }, { x: x-1, y },
                { x, y: y+1 }, { x, y: y-1 }
            ].filter(n => isValid(n.x, n.y));
            
            if (neighbors.some(n => grid[n.y][n.x] === 0)) {
                grid[y][x] = 0;
                pathCount++;
            }
        }
    }
    
    // Passo 4: Verifica e corrige se há caminho do início ao fim
    if (!hasPath(grid, start, end)) {
        console.log("Criando caminho forçado...");
        // Cria um caminho direto se necessário
        const forcedPath = createForcedPath(size);
        for (const cell of forcedPath) {
            grid[cell.y][cell.x] = 0;
        }
    }
    
    return grid;
}

/**
 * Verifica se existe caminho entre dois pontos usando BFS
 */
function hasPath(grid, start, end) {
    const size = grid.length;
    const visited = new Set();
    const queue = [start];
    
    while (queue.length > 0) {
        const current = queue.shift();
        const key = `${current.x},${current.y}`;
        
        if (visited.has(key)) continue;
        visited.add(key);
        
        if (current.x === end.x && current.y === end.y) {
            return true;
        }
        
        const neighbors = [
            { x: current.x + 1, y: current.y },
            { x: current.x - 1, y: current.y },
            { x: current.x, y: current.y + 1 },
            { x: current.x, y: current.y - 1 }
        ].filter(n => 
            n.x >= 0 && n.x < size && 
            n.y >= 0 && n.y < size && 
            grid[n.y][n.x] === 0
        );
        
        queue.push(...neighbors);
    }
    
    return false;
}

/**
 * Cria um caminho forçado do início ao fim
 */
function createForcedPath(size) {
    const path = [];
    let x = 0, y = 0;
    
    // Move para a direita até a última coluna
    while (x < size - 1) {
        path.push({ x, y });
        x++;
    }
    
    // Move para baixo até a última linha
    while (y < size - 1) {
        path.push({ x, y });
        y++;
    }
    
    path.push({ x, y }); // Adiciona o fim
    return path;
}

// ==================== FUNÇÕES DE RENDERIZAÇÃO ====================

/**
 * Renderiza o labirinto na tela
 */
function renderMaze(grid) {
    MAZE.innerHTML = '';
    const size = grid.length;
    
    // Configura o grid CSS
    MAZE.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    MAZE.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    
    // Cria as células
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            
            // Adiciona classes baseadas no tipo de célula
            if (x === currentPosition.x && y === currentPosition.y) {
                cell.classList.add('current');
                cell.innerHTML = `<span class="animal-emoji">${currentAnimal.emoji}</span>`;
            } else if (x === endPosition.x && y === endPosition.y) {
                cell.classList.add('end');
                cell.innerHTML = `<span class="food-emoji">${currentAnimal.foodEmoji}</span>`;
            } else if (grid[y][x] === 0) {
                cell.classList.add('path');
                if (visitedCells.has(`${x},${y}`)) {
                    cell.classList.add('visited');
                    cell.innerHTML = `<span class="footprint">👣</span>`;
                }
            } else {
                cell.classList.add('wall');
                // Emojis aleatórios para paredes
                const wallEmojis = ['🧱', '🪨', '🌳', '🪵', '🚧', '🗿'];
                cell.innerHTML = `<span class="wall-emoji">${wallEmojis[Math.floor(Math.random() * wallEmojis.length)]}</span>`;
            }
            
            MAZE.appendChild(cell);
        }
    }
}

/**
 * Atualiza as informações do jogo na tela
 */
function updateGameInfo() {
    LEVEL_ELEMENT.textContent = currentLevel;
    MOVES_ELEMENT.textContent = moves;
    STARS_ELEMENT.textContent = `${stars}/3`;
    
    // Atualiza animal e comida atual
    if (currentAnimal) {
        document.getElementById('current-animal-img').textContent = currentAnimal.emoji;
        document.getElementById('current-animal-name').textContent = currentAnimal.name;
        document.getElementById('target-food-img').textContent = currentAnimal.foodEmoji;
        document.getElementById('target-food-name').textContent = currentAnimal.food;
        
        // Atualiza emojis nas instruções
        ANIMAL_EMOJI_DISPLAY.textContent = currentAnimal.emoji;
        FOOD_EMOJI_DISPLAY.textContent = currentAnimal.foodEmoji;
    }
}

/**
 * Mostra uma mensagem no jogo
 */
function showMessage(text, emoji = "🎮", type = "info") {
    MESSAGE_TEXT.textContent = text;
    MESSAGE_EMOJI.textContent = emoji;
    
    // Limpa classes anteriores
    MESSAGE_ELEMENT.classList.remove('info', 'success', 'error', 'hint');
    
    // Adiciona classe baseada no tipo
    MESSAGE_ELEMENT.classList.add(type);
    
    // Remove a mensagem após alguns segundos (exceto sucesso)
    if (type !== 'success') {
        setTimeout(() => {
            if (MESSAGE_TEXT.textContent === text) {
                showMessage('Use as setas para mover o animal', '🎮', 'info');
            }
        }, 3000);
    }
}

// ==================== FUNÇÕES DO JOGADOR ====================

/**
 * Move o animal na direção especificada
 */
function moveAnimal(direction) {
    if (!gameActive) return;
    
    const newPos = {
        x: currentPosition.x,
        y: currentPosition.y
    };
    
    switch(direction) {
        case 'up': newPos.y--; break;
        case 'down': newPos.y++; break;
        case 'left': newPos.x--; break;
        case 'right': newPos.x++; break;
    }
    
    // Verifica se a nova posição é válida
    const size = mazeGrid.length;
    if (newPos.x < 0 || newPos.x >= size || newPos.y < 0 || newPos.y >= size) {
        showMessage("🚫 Você bateu na parede!", "💥", "error");
        playSound('error');
        return;
    }
    
    if (mazeGrid[newPos.y][newPos.x] === 1) {
        showMessage("🚫 Tem uma parede no caminho!", "🧱", "error");
        playSound('error');
        return;
    }
    
    // Move o animal
    currentPosition = newPos;
    moves++;
    
    // Marca a célula como visitada
    visitedCells.add(`${newPos.x},${newPos.y}`);
    
    // Toca som de movimento
    playSound('move');
    
    // Verifica se chegou na comida
    if (newPos.x === endPosition.x && newPos.y === endPosition.y) {
        completeLevel();
        return;
    }
    
    // Atualiza a tela
    renderMaze(mazeGrid);
    updateGameInfo();
    
    // Verifica se passou do limite de movimentos
    const level = LEVELS[currentLevel - 1];
    if (moves > level.maxMoves) {
        showMessage("⏰ Acabaram os movimentos!", "😢", "error");
        playSound('error');
        setTimeout(() => restartLevel(), 2000);
    }
}

/**
 * Completa o nível atual
 */
function completeLevel() {
    gameActive = false;
    
    // Calcula estrelas
    const level = LEVELS[currentLevel - 1];
    let earnedStars = 0;
    
    if (moves <= level.stars[0]) earnedStars = 3;
    else if (moves <= level.stars[1]) earnedStars = 2;
    else if (moves <= level.stars[2]) earnedStars = 1;
    
    stars = Math.max(stars, earnedStars);
    
    // Toca som de vitória
    playSound('win');
    
    // Mostra mensagem de vitória
    showMessage(`🎉 Parabéns! Você alimentou o ${currentAnimal.name}!`, currentAnimal.emoji, "success");
    
    // Mostra botão do próximo nível
    if (currentLevel < LEVELS.length) {
        NEXT_LEVEL_BTN.style.display = 'inline-flex';
    }
    
    // Salva o progresso
    saveProgress();
    
    // Mostra efeito de vitória
    setTimeout(() => showVictoryEffect(earnedStars), 1000);
}

/**
 * Mostra efeito visual de vitória
 */
function showVictoryEffect(earnedStars) {
    const effect = document.createElement('div');
    effect.className = 'victory-effect';
    effect.style.display = 'flex';
    
    // Cria estrelas como emojis
    let starsDisplay = '';
    for (let i = 0; i < 3; i++) {
        starsDisplay += i < earnedStars ? '⭐' : '☆';
    }
    
    effect.innerHTML = `
        <div class="victory-content">
            <h2>🎊 NÍVEL ${currentLevel} COMPLETO! 🎊</h2>
            <div class="victory-animal">${currentAnimal.emoji} ➡️ ${currentAnimal.foodEmoji}</div>
            <div class="victory-stats">
                <div>🏆 ${currentAnimal.name} alimentado com sucesso!</div>
                <div>👣 Movimentos usados: ${moves}</div>
                <div>⭐ Estrelas conquistadas: ${starsDisplay}</div>
                <div>🎯 Próximo nível: ${currentLevel < LEVELS.length ? LEVELS[currentLevel].name : 'ÚLTIMO!'}</div>
            </div>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <button class="game-btn" onclick="this.parentElement.parentElement.remove(); restartLevel();">
                    🔄 Jogar Novamente
                </button>
                ${currentLevel < LEVELS.length ? `
                    <button class="game-btn" onclick="loadLevel(${currentLevel + 1}); this.parentElement.parentElement.remove();">
                        ▶️ Nível ${currentLevel + 1}
                    </button>
                ` : ''}
                <button class="game-btn" onclick="this.parentElement.parentElement.remove(); updateLevelsGrid();">
                    📊 Ver Todos Níveis
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(effect);
    
    // Remove efeito ao clicar fora
    effect.addEventListener('click', (e) => {
        if (e.target === effect) {
            effect.remove();
        }
    });
}

/**
 * Reinicia o nível atual
 */
function restartLevel() {
    loadLevel(currentLevel);
}

/**
 * Carrega um nível específico
 */
function loadLevel(levelNumber) {
    if (levelNumber < 1 || levelNumber > LEVELS.length) return;
    
    currentLevel = levelNumber;
    const level = LEVELS[levelNumber - 1];
    
    // Configura animal atual
    currentAnimal = ANIMALS.find(a => a.id === level.animalId) || ANIMALS[0];
    
    // Gera o labirinto
    mazeGrid = generateMaze(level.size);
    
    // Verifica novamente se há caminho
    if (!hasPath(mazeGrid, {x:0, y:0}, {x:level.size-1, y:level.size-1})) {
        console.warn("Labirinto sem caminho, regenerando...");
        mazeGrid = generateMaze(level.size); // Regenera
    }
    
    // Posições inicial e final
    currentPosition = { x: 0, y: 0 };
    endPosition = { x: level.size - 1, y: level.size - 1 };
    
    // Reinicia contadores
    moves = 0;
    visitedCells.clear();
    visitedCells.add('0,0');
    
    // Ativa o jogo
    gameActive = true;
    isHintActive = false;
    
    // Renderiza
    renderMaze(mazeGrid);
    updateGameInfo();
    updateLevelsGrid();
    
    // Esconde botão do próximo nível
    NEXT_LEVEL_BTN.style.display = 'none';
    
    // Mostra mensagem inicial
    showMessage(`Ajude o ${currentAnimal.name} a encontrar ${currentAnimal.food.toLowerCase()}!`, currentAnimal.emoji, "info");
}

// ==================== SISTEMA DE DICAS ====================

/**
 * Mostra uma dica (caminho até a comida)
 */
function showHint() {
    if (!gameActive || isHintActive) return;
    
    isHintActive = true;
    
    // Encontra o caminho mais curto usando BFS
    const path = findShortestPath();
    
    if (path.length > 0) {
        // Mostra o próximo movimento como dica
        const nextMove = path[1]; // [0] é a posição atual
        
        // Encontra a direção
        let directionEmoji = '';
        let directionText = '';
        
        if (nextMove.y < currentPosition.y) {
            directionEmoji = '⬆️';
            directionText = 'CIMA';
        } else if (nextMove.y > currentPosition.y) {
            directionEmoji = '⬇️';
            directionText = 'BAIXO';
        } else if (nextMove.x < currentPosition.x) {
            directionEmoji = '⬅️';
            directionText = 'ESQUERDA';
        } else if (nextMove.x > currentPosition.x) {
            directionEmoji = '➡️';
            directionText = 'DIREITA';
        }
        
        showMessage(`💡 Dica: Vá para ${directionText} ${directionEmoji}`, '💡', 'hint');
        playSound('hint');
        
        // Pisca a célula da dica
        const cell = document.querySelector(`.cell[data-x="${nextMove.x}"][data-y="${nextMove.y}"]`);
        if (cell) {
            const originalClasses = cell.className;
            cell.classList.add('hint');
            
            setTimeout(() => {
                cell.className = originalClasses;
                isHintActive = false;
            }, 2000);
        }
    } else {
        showMessage("😅 Não consegui encontrar um caminho!", '🤔', 'error');
        isHintActive = false;
    }
}

/**
 * Encontra o caminho mais curto usando BFS
 */
function findShortestPath() {
    const size = mazeGrid.length;
    const queue = [{...currentPosition, path: [currentPosition]}];
    const visited = new Set([`${currentPosition.x},${currentPosition.y}`]);
    
    const directions = [
        {dx: 0, dy: -1}, // up
        {dx: 0, dy: 1},  // down
        {dx: -1, dy: 0}, // left
        {dx: 1, dy: 0}   // right
    ];
    
    while (queue.length > 0) {
        const current = queue.shift();
        
        // Verifica se chegou ao destino
        if (current.x === endPosition.x && current.y === endPosition.y) {
            return current.path;
        }
        
        // Explora vizinhos
        for (const dir of directions) {
            const nx = current.x + dir.dx;
            const ny = current.y + dir.dy;
            
            if (nx >= 0 && nx < size && ny >= 0 && ny < size &&
                mazeGrid[ny][nx] === 0 && !visited.has(`${nx},${ny}`)) {
                
                visited.add(`${nx},${ny}`);
                queue.push({
                    x: nx,
                    y: ny,
                    path: [...current.path, {x: nx, y: ny}]
                });
            }
        }
    }
    
    return []; // Nenhum caminho encontrado
}

// ==================== SISTEMA DE SONS ====================

/**
 * Toca um som (emoji flutuante)
 */
function playSound(type) {
    if (!soundEnabled) return;
    
    const soundEmojis = {
        'move': ['👣', '🚶', '🏃'],
        'eat': ['🍽️', '😋', '🥳'],
        'win': ['🎉', '🏆', '🎊'],
        'error': ['💥', '😵', '💢'],
        'hint': ['💡', '🔍', '🎯']
    };
    
    const emoji = soundEmojis[type][Math.floor(Math.random() * soundEmojis[type].length)];
    
    // Mostra emoji flutuante
    showFloatingEmoji(emoji);
}

/**
 * Mostra emoji flutuante
 */
function showFloatingEmoji(emoji) {
    const floatEmoji = document.createElement('div');
    floatEmoji.textContent = emoji;
    floatEmoji.className = 'floating-emoji';
    
    // Posição aleatória perto do centro
    const x = 40 + Math.random() * 20;
    const y = 40 + Math.random() * 20;
    floatEmoji.style.left = `${x}%`;
    floatEmoji.style.top = `${y}%`;
    
    document.body.appendChild(floatEmoji);
    
    setTimeout(() => {
        floatEmoji.remove();
    }, 1000);
}

/**
 * Alterna som ligado/desligado
 */
function toggleSound() {
    soundEnabled = !soundEnabled;
    SOUND_BTN.innerHTML = soundEnabled ? 
        '<span class="btn-emoji">🔊</span><span class="btn-text">Som</span>' :
        '<span class="btn-emoji">🔇</span><span class="btn-text">Som</span>';
    
    showMessage(soundEnabled ? 'Som ligado!' : 'Som desligado', 
                soundEnabled ? '🔊' : '🔇', 
                'info');
}

// ==================== SISTEMA DE SALVAMENTO ====================

/**
 * Salva o progresso do jogo
 */
function saveProgress() {
    const progress = JSON.parse(localStorage.getItem('zookid_maze_progress') || '{}');
    
    progress[currentLevel] = {
        completed: true,
        stars: Math.max(progress[currentLevel]?.stars || 0, stars),
        moves: Math.min(progress[currentLevel]?.moves || Infinity, moves),
        date: new Date().toISOString()
    };
    
    localStorage.setItem('zookid_maze_progress', JSON.stringify(progress));
    localStorage.setItem('zookid_maze_current_level', currentLevel.toString());
}

/**
 * Obtém o progresso de um nível
 */
function getLevelProgress(levelId) {
    const progress = JSON.parse(localStorage.getItem('zookid_maze_progress') || '{}');
    const levelProgress = progress[levelId];
    
    return {
        completed: !!levelProgress,
        stars: levelProgress?.stars || 0,
        moves: levelProgress?.moves || 0
    };
}

// ==================== GRADE DE NÍVEIS ====================

/**
 * Renderiza a grade de níveis
 */
function updateLevelsGrid() {
    LEVELS_GRID.innerHTML = '';
    
    LEVELS.forEach(level => {
        const levelBtn = document.createElement('button');
        levelBtn.className = 'level-btn';
        levelBtn.dataset.level = level.id;
        
        if (level.id === currentLevel) {
            levelBtn.classList.add('current');
        }
        
        // Verifica se o nível foi completado
        const progress = getLevelProgress(level.id);
        const animal = ANIMALS.find(a => a.id === level.animalId) || ANIMALS[0];
        
        if (progress.completed) {
            levelBtn.classList.add('completed');
        }
        
        levelBtn.innerHTML = `
            <span style="font-size: 1.5rem;">${animal.emoji}</span>
            <span>${level.id}</span>
            <span style="font-size: 0.8rem;">${level.name}</span>
            <div class="level-stars">
                <span class="star ${progress.stars >= 1 ? 'filled' : ''}">⭐</span>
                <span class="star ${progress.stars >= 2 ? 'filled' : ''}">⭐</span>
                <span class="star ${progress.stars >= 3 ? 'filled' : ''}">⭐</span>
            </div>
        `;
        
        levelBtn.addEventListener('click', () => {
            loadLevel(level.id);
        });
        
        LEVELS_GRID.appendChild(levelBtn);
    });
}

// ==================== CONTROLES E EVENTOS ====================

/**
 * Configura os controles do jogo
 */
function setupControls() {
    // Controles de teclado
    document.addEventListener('keydown', (e) => {
        if (!gameActive && e.key.startsWith('Arrow')) {
            loadLevel(currentLevel);
            return;
        }
        
        switch(e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                e.preventDefault();
                moveAnimal('up');
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                e.preventDefault();
                moveAnimal('down');
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                e.preventDefault();
                moveAnimal('left');
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                e.preventDefault();
                moveAnimal('right');
                break;
            case 'r':
            case 'R':
                restartLevel();
                break;
            case 'h':
            case 'H':
                showHint();
                break;
            case ' ':
            case 'Spacebar':
                if (!gameActive) loadLevel(currentLevel);
                break;
        }
    });
    
    // Controles móveis
    document.querySelectorAll('.control-btn[data-direction]').forEach(btn => {
        btn.addEventListener('click', () => {
            const direction = btn.dataset.direction;
            moveAnimal(direction);
        });
        
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const direction = btn.dataset.direction;
            moveAnimal(direction);
        });
    });
    
    // Botão de iniciar no mobile
    START_MOBILE_BTN.addEventListener('click', () => {
        if (!gameActive) {
            loadLevel(currentLevel);
        }
    });
    
    // Botões do jogo
    RESTART_BTN.addEventListener('click', restartLevel);
    HINT_BTN.addEventListener('click', showHint);
    SOUND_BTN.addEventListener('click', toggleSound);
    NEXT_LEVEL_BTN.addEventListener('click', () => {
        loadLevel(currentLevel + 1);
    });
}

// ==================== INICIALIZAÇÃO DO JOGO ====================

/**
 * Inicializa o jogo
 */
function initGame() {
    // Carrega o progresso salvo
    const savedLevel = localStorage.getItem('zookid_maze_current_level') || 1;
    currentLevel = Math.min(parseInt(savedLevel), LEVELS.length);
    
    // Verifica se o som estava ligado
    const savedSound = localStorage.getItem('zookid_sound_enabled');
    if (savedSound !== null) {
        soundEnabled = savedSound === 'true';
    }
    
    // Configura controles
    setupControls();
    
    // Configura botão de som
    SOUND_BTN.innerHTML = soundEnabled ? 
        '<span class="btn-emoji">🔊</span><span class="btn-text">Som</span>' :
        '<span class="btn-emoji">🔇</span><span class="btn-text">Som</span>';
    
    // Carrega o nível atual
    loadLevel(currentLevel);
    
    // Atualiza a grade de níveis
    updateLevelsGrid();
    
    // Mostra mensagem de boas-vindas
    showMessage('Bem-vindo ao Labirinto do Zoológico! Selecione um nível ou use as setas para começar.', '🦁', 'info');
    
    // Adiciona animação às células
    setInterval(() => {
        if (gameActive) {
            const currentCell = document.querySelector('.cell.current');
            if (currentCell) {
                currentCell.style.animation = 'bounce 0.5s infinite alternate';
            }
        }
    }, 100);
    
    console.log('🎮 Labirinto do Zoológico inicializado!');
    console.log('Níveis disponíveis:', LEVELS.length);
    console.log('Animais disponíveis:', ANIMALS.length);
}

// ==================== INICIA O JOGO ====================
document.addEventListener('DOMContentLoaded', initGame);

// Funções globais para acesso pelo HTML
window.restartLevel = restartLevel;
window.loadLevel = loadLevel;
window.updateLevelsGrid = updateLevelsGrid;

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