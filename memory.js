// memory.js - Versão Sem Sons

// Usando os primeiros 8 animais da sua lista original (8 pares = 16 cartas)
const GAME_ANIMALS = [
    { name: 'Vaca', image: 'cow-sim.jpg' }, // Som removido
    { name: 'Galinha', image: 'chicken-sim.jpg' }, // Som removido
    { name: 'Porco', image: 'pig-sim.jpg' }, // Som removido
    { name: 'Ovelha', image: 'sheep-sim.jpg' }, // Som removido
    { name: 'Pato', image: 'duck-sim.jpg' }, // Som removido
    { name: 'Cavalo', image: 'horse-sim.jpg' }, // Som removido
    { name: 'Cachorro', image: 'dog-sim.jpg' }, // Som removido
    { name: 'Gato', image: 'cat-sim.jpg' },
    { name: 'Leão', image: 'lion-sim.jpg' },
    { name: 'Elefante', image: 'elephant-sim.jpg' },
    
];

// VARIÁVEIS DE ESTADO DO JOGO
let firstCard = null;
let secondCard = null;
let lockBoard = false; // Impede cliques durante a comparação
let movesCount = 0;
let matchedPairs = 0;

// SELETORES DO DOM
const grid = document.getElementById('memory-game-grid');
const movesCountElement = document.getElementById('moves-count');
const matchedCountElement = document.getElementById('matched-count');
const winModal = document.getElementById('win-modal');
const finalMovesElement = document.getElementById('final-moves');
const restartButton = document.getElementById('restart-button');


/**
 * Cria o array de cartas duplicando os animais e embaralhando.
 * @returns {Array} Array de 16 cartas embaralhadas.
 */
function createDeck() {
    const doubledAnimals = [...GAME_ANIMALS, ...GAME_ANIMALS];
    return doubledAnimals.sort(() => 0.5 - Math.random());
}

/**
 * Renderiza o grid de cartas no HTML.
 */
function renderCards() {
    grid.innerHTML = '';
    const deck = createDeck();
    
    deck.forEach(animal => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.name = animal.name;

        card.innerHTML = `
            <img class="front-face" src="${animal.image}" alt="${animal.name}">
            <div class="back-face">?</div>
        `;

        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    });
}

/**
 * Lida com o clique na carta: vira e inicia a comparação.
 */
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return; // Não permite clicar na mesma carta duas vezes

    this.classList.add('flip');
    
    // O CÓDIGO DE REPRODUÇÃO DE SOM FOI REMOVIDO DAQUI

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    
    movesCount++;
    movesCountElement.textContent = movesCount;

    checkForMatch();
}

/**
 * Verifica se as duas cartas viradas são um par.
 */
function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    isMatch ? disableCards() : unflipCards();
}

/**
 * Pares encontrados: Mantém as cartas viradas e adiciona classe 'match'.
 */
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    firstCard.classList.add('match');
    secondCard.classList.add('match');

    matchedPairs++;
    matchedCountElement.textContent = matchedPairs;
    
    resetBoard();
    
    // Verifica a vitória
    if (matchedPairs === GAME_ANIMALS.length) {
        setTimeout(showWinModal, 500);
    }
}

/**
 * Não são um par: Vira as cartas de volta após um atraso.
 */
function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

/**
 * Reseta as variáveis de controle após a comparação.
 */
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

/**
 * Exibe o modal de vitória e a pontuação final.
 */
function showWinModal() {
    finalMovesElement.textContent = movesCount;
    winModal.style.display = 'block';
}

/**
 * Zera o placar e reinicia o jogo.
 */
function startGame() {
    movesCount = 0;
    matchedPairs = 0;
    movesCountElement.textContent = movesCount;
    matchedCountElement.textContent = matchedPairs;
    
    winModal.style.display = 'none';
    resetBoard();
    renderCards();
}

// 5. INICIALIZAÇÃO DO JOGO
document.addEventListener('DOMContentLoaded', () => {
    startGame();
    restartButton.addEventListener('click', startGame);
});