// quiz.js

// 1. ESTRUTURA DE DADOS: MAPA DE ANIMAIS E CATEGORIAS
// Adicione o nome do animal, o nome da imagem (que você deve ter) e o arquivo de som.
const ANIMALS = [
    // Animais da Fazenda (Farm)
    { name: 'Vaca', sound: 'cow.mp3', image: 'cow-sim.jpg', category: 'farm', correctName: 'Vaca' },
    { name: 'Galinha', sound: 'chicken.mp3', image: 'chicken-sim.jpg', category: 'farm', correctName: 'Galinha' },
    { name: 'Porco', sound: 'pig.mp3', image: 'pig-sim.jpg', category: 'farm', correctName: 'Porco' },
    
    // Animais Domésticos (Domestic)
    { name: 'Cachorro', sound: 'dog.mp3', image: 'dog-sim.jpg', category: 'domestic', correctName: 'Cachorro' },
    { name: 'Gato', sound: 'cat.mp3', image: 'cat-sim.jpg', category: 'domestic', correctName: 'Gato' },
    
    // Animais da Selva (Jungle)
    { name: 'Macaco', sound: 'monkey.mp3', image: 'monkey-sim.jpg', category: 'jungle', correctName: 'Macaco' },
    { name: 'Tucano', sound: 'tucan.mp3', image: 'tucan-sim.jpg', category: 'jungle', correctName: 'Tucano' },
    
    // Animais da Savana (Savanna)
    { name: 'Leão', sound: 'lion.mp3', image: 'lion-sim.jpg', category: 'savanna', correctName: 'Leão' },
    { name: 'Elefante', sound: 'elephant.mp3', image: 'elephant-sim.jpg', category: 'savanna', correctName: 'Elefante' },
    
    // Animais do Oceano (Ocean)
    { name: 'Baleia', sound: 'whale.mp3', image: 'whale-sim.jpg', category: 'ocean', correctName: 'Baleia' },
    { name: 'Golfinho', sound: 'dolphin.mp3', image: 'dolphin-sim.jpg', category: 'ocean', correctName: 'Golfinho' },
];

// 2. VARIÁVEIS DE ESTADO DO JOGO
let score = 0;
let correctCount = 0;
let currentCorrectAnimal = null;
let currentCategory = 'all';

// 3. SELETORES DO DOM
const scoreElement = document.getElementById('score');
const correctCountElement = document.getElementById('correct-count');
const playSoundBtn = document.getElementById('play-sound-btn');
const optionsContainer = document.getElementById('options-container');
const categorySelect = document.getElementById('category-select');
const feedbackMessage = document.getElementById('feedback-message'); // NOVO SELETOR!

// 4. FUNÇÕES DO JOGO

/**
 * Atualiza o placar na interface.
 */
function updateScore() {
    scoreElement.textContent = score;
    correctCountElement.textContent = correctCount;
}

/**
 * Exibe a mensagem de feedback no banner e a prepara para ser limpa.
 * @param {string} message - O texto da mensagem.
 * @param {boolean} isCorrect - Se a resposta foi correta (true/false).
 */
function displayFeedback(message, isCorrect) {
    feedbackMessage.textContent = message;
    feedbackMessage.classList.remove('correct-color', 'incorrect-color');
    
    if (isCorrect) {
        feedbackMessage.classList.add('correct-color');
    } else {
        feedbackMessage.classList.add('incorrect-color');
    }
}

/**
 * Seleciona um novo animal para ser a resposta correta e as opções de distração.
 */
function selectNewQuestion() {
    // Filtra animais pela categoria selecionada
    const availableAnimals = currentCategory === 'all'
        ? ANIMALS
        : ANIMALS.filter(animal => animal.category === currentCategory);

    if (availableAnimals.length < 3) {
        // Exibe um erro amigável se a categoria não tiver animais suficientes
        displayFeedback("Ops! Adicione mais animais a esta categoria para jogar.", false);
        optionsContainer.innerHTML = '';
        return;
    }
    
    // Embaralha e pega 3 animais (1 correto + 2 distratores)
    const shuffledAnimals = availableAnimals.sort(() => 0.5 - Math.random());
    
    // O primeiro animal embaralhado é o correto
    currentCorrectAnimal = shuffledAnimals[0];
    
    let options = [currentCorrectAnimal];
    let i = 1;
    
    // Garante que as 3 opções são diferentes
    while (options.length < 3 && i < shuffledAnimals.length) {
        const potentialDistractor = shuffledAnimals[i];
        
        // Adiciona se ainda não estiver nas opções
        if (!options.some(opt => opt.name === potentialDistractor.name)) {
            options.push(potentialDistractor);
        }
        i++;
    }
    
    // Embaralha as 3 opções para que a resposta correta não seja sempre a primeira
    options = options.sort(() => 0.5 - Math.random());

    renderOptions(options);
    
    // Toca o som automaticamente ao iniciar a nova pergunta
    playSound(); 
}

/**
 * Renderiza os cards de opção no HTML.
 * @param {Array} options - Array de 3 objetos de animais.
 */
function renderOptions(options) {
    optionsContainer.innerHTML = ''; // Limpa as opções antigas
    
    options.forEach(animal => {
        const optionDiv = document.createElement('div');
        optionDiv.classList.add('animal-option');
        optionDiv.dataset.animal = animal.name;
        
        optionDiv.innerHTML = `
            <img src="${animal.image}" alt="${animal.name}">
            <p>${animal.correctName}</p>
        `;
        
        // Adiciona o evento de clique para verificar a resposta
        optionDiv.addEventListener('click', (event) => {
             // Previna o evento de propagar para evitar cliques múltiplos em navegadores antigos
            event.stopPropagation(); 
            checkAnswer(animal.name, optionDiv);
        }, { once: true }); // O { once: true } garante que o clique só pode ser feito uma vez por pergunta
        
        optionsContainer.appendChild(optionDiv);
    });
}


/**
 * Toca o arquivo de som do animal correto.
 */
function playSound() {
    if (!currentCorrectAnimal) return;

    // Cria um novo elemento Audio
    const audio = new Audio(currentCorrectAnimal.sound);
    audio.play();

    // Feedback visual/tátil no botão
    playSoundBtn.textContent = '🔊 Tocando...';
    playSoundBtn.disabled = true;

    // Habilita o botão novamente após o som terminar
    audio.onended = () => {
        playSoundBtn.textContent = '👂 Tocar o Som Novamente';
        playSoundBtn.disabled = false;
    };
}


/**
 * Verifica se a resposta clicada está correta e lida com a pontuação e feedback.
 * @param {string} selectedAnimalName - Nome do animal clicado.
 * @param {HTMLElement} clickedElement - O div do animal clicado.
 */
function checkAnswer(selectedAnimalName, clickedElement) {
    // Desabilita os cliques em todas as opções (necessário se não usar { once: true } no event listener)
    Array.from(optionsContainer.children).forEach(option => {
        option.style.pointerEvents = 'none';
    });

    let message = '';
    let isAnswerCorrect = false;

    if (selectedAnimalName === currentCorrectAnimal.name) {
        // Resposta Correta
        score += 10;
        correctCount += 1;
        clickedElement.classList.add('correct');
        message = '🎉 VOCÊ ACERTOU! (+10 pontos)';
        isAnswerCorrect = true;
    } else {
        // Resposta Incorreta
        score = Math.max(0, score - 5); // Penaliza, mas não deixa ir abaixo de zero
        clickedElement.classList.add('incorrect');
        
        // Destaca a resposta correta
        const correctElement = Array.from(optionsContainer.children).find(el => el.dataset.animal === currentCorrectAnimal.name);
        if (correctElement) {
            correctElement.classList.add('correct');
        }
        message = `❌ ERRADO! Era o ${currentCorrectAnimal.correctName}. (-5 pontos)`;
        isAnswerCorrect = false;
    }

    updateScore();
    displayFeedback(message, isAnswerCorrect); // EXIBE A MENSAGEM NO BANNER
    
    // Prepara a próxima pergunta após um breve atraso
    setTimeout(() => {
        // Remove as classes de feedback e limpa o estado
        Array.from(optionsContainer.children).forEach(option => {
            option.classList.remove('correct', 'incorrect');
            option.style.pointerEvents = 'auto'; // Reabilita os cliques
        });
        
        // Limpa a mensagem de feedback e a torna invisível
        feedbackMessage.textContent = '';
        feedbackMessage.classList.remove('correct-color', 'incorrect-color');
        
        selectNewQuestion();
    }, 3000);
}


// 5. INICIALIZAÇÃO DO JOGO

/**
 * Configura os ouvintes de eventos e inicia o jogo.
 */
function initGame() {
    // Evento do botão Tocar Som
    playSoundBtn.addEventListener('click', playSound);

    // Evento de mudança de categoria
    categorySelect.addEventListener('change', (event) => {
        currentCategory = event.target.value;
        score = 0; // Zera o placar ao mudar a categoria
        correctCount = 0;
        updateScore();
        
        // Limpa feedback anterior e inicia novo jogo
        feedbackMessage.textContent = '';
        feedbackMessage.classList.remove('correct-color', 'incorrect-color');
        
        selectNewQuestion(); 
    });

    // Inicia a primeira pergunta
    selectNewQuestion(); 
}

// Inicia o jogo quando a página carrega
document.addEventListener('DOMContentLoaded', initGame);