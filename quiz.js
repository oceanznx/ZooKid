// quiz.js - Versão com Limite de 10 Rodadas

// 1. ESTRUTURA DE DADOS: MAPA DE ANIMAIS E CATEGORIAS
const ANIMALS = [
    // 1. ANIMAIS DA FAZENDA (FARM) - 6 Animais
    { name: 'Vaca', sound: 'cow.mp3', image: 'cow-sim.jpg', category: 'farm', correctName: 'Vaca' },
    { name: 'Galinha', sound: 'chicken.mp3', image: 'chicken-sim.jpg', category: 'farm', correctName: 'Galinha' },
    { name: 'Porco', sound: 'pig.mp3', image: 'pig-sim.jpg', category: 'farm', correctName: 'Porco' },
    { name: 'Ovelha', sound: 'sheep.mp3', image: 'sheep-sim.jpg', category: 'farm', correctName: 'Ovelha' },
    { name: 'Pato', sound: 'duck.mp3', image: 'duck-sim.jpg', category: 'farm', correctName: 'Pato' },
    { name: 'Cavalo', sound: 'horse.mp3', image: 'horse-sim.jpg', category: 'farm', correctName: 'Cavalo' },
    
    // 2. ANIMAIS DOMÉSTICOS (DOMESTIC) - 6 Animais
    { name: 'Cachorro', sound: 'dog.mp3', image: 'dog-sim.jpg', category: 'domestic', correctName: 'Cachorro' },
    { name: 'Gato', sound: 'cat.mp3', image: 'cat-sim.jpg', category: 'domestic', correctName: 'Gato' },
    { name: 'Coelho', sound: 'rabbit.mp3', image: 'rabbit-sim.jpg', category: 'domestic', correctName: 'Coelho' },
    { name: 'Papagaio', sound: 'parrot.mp3', image: 'parrot-sim.jpg', category: 'domestic', correctName: 'Papagaio' },
    { name: 'Canário', sound: 'canary.mp3', image: 'canary-sim.jpg', category: 'domestic', correctName: 'Canário' },
    
    // 3. ANIMAIS DA SELVA (JUNGLE) - 6 Animais
    { name: 'Macaco', sound: 'monkey.mp3', image: 'monkey-sim.jpg', category: 'jungle', correctName: 'Macaco' },
    { name: 'Tucano', sound: 'tucan.mp3', image: 'tucan-sim.jpg', category: 'jungle', correctName: 'Tucano' },
    { name: 'Jaguar', sound: 'jaguar.mp3', image: 'jaguar-sim.jpg', category: 'jungle', correctName: 'Jaguar' },
    { name: 'Cobra', sound: 'snake.mp3', image: 'snake-sim.jpg', category: 'jungle', correctName: 'Cobra' },
    { name: 'Gorila', sound: 'gorilla.mp3', image: 'gorilla-sim.jpg', category: 'jungle', correctName: 'Gorila' },
    { name: 'Arara', sound: 'macaw.mp3', image: 'macaw-sim.jpg', category: 'jungle', correctName: 'Arara' },
    
    // 4. ANIMAIS DA SAVANA (SAVANNA) - 6 Animais
    { name: 'Leão', sound: 'lion.mp3', image: 'lion-sim.jpg', category: 'savanna', correctName: 'Leão' },
    { name: 'Elefante', sound: 'elephant.mp3', image: 'elephant-sim.jpg', category: 'savanna', correctName: 'Elefante' },
    { name: 'Girafa', sound: 'giraffe.mp3', image: 'giraffe-sim.jpg', category: 'savanna', correctName: 'Girafa' },
    { name: 'Zebra', sound: 'zebra.mp3', image: 'zebra-sim.jpg', category: 'savanna', correctName: 'Zebra' },
    { name: 'Rinoceronte', sound: 'rhino.mp3', image: 'rhino-sim.jpg', category: 'savanna', correctName: 'Rinoceronte' },
    { name: 'Hiena', sound: 'hyena.mp3', image: 'hyena-sim.jpg', category: 'savanna', correctName: 'Hiena' },
    
    // 5. ANIMAIS DO OCEANO (OCEAN) - 6 Animais
    { name: 'Baleia', sound: 'whale.mp3', image: 'whale-sim.jpg', category: 'ocean', correctName: 'Baleia' },
    { name: 'Golfinho', sound: 'dolphin.mp3', image: 'dolphin-sim.jpg', category: 'ocean', correctName: 'Golfinho' },
    { name: 'Foca', sound: 'seal.mp3', image: 'seal-sim.jpg', category: 'ocean', correctName: 'Foca' },
    { name: 'Pinguim', sound: 'penguin.mp3', image: 'penguin-sim.jpg', category: 'ocean', correctName: 'Pinguim' },
    { name: 'Morsa', sound: 'walrus.mp3', image: 'walrus-sim.jpg', category: 'ocean', correctName: 'Morsa' },
    { name: 'Gaivota', sound: 'seagull.mp3', image: 'seagull.jpg', category: 'ocean', correctName: 'Gaivota' },
];

// 2. VARIÁVEIS DE ESTADO DO JOGO
let score = 0;
let correctCount = 0;
let currentCorrectAnimal = null;
let currentCategory = 'all'; 
let currentAudio = null; 
let roundCount = 0; // NOVA VARIÁVEL: Contador de rodadas
const MAX_ROUNDS = 10; // NOVA CONSTANTE: Limite de rodadas

// 3. SELETORES DO DOM
const scoreElement = document.getElementById('score');
const correctCountElement = document.getElementById('correct-count');
const playSoundBtn = document.getElementById('play-sound-btn');
const optionsContainer = document.getElementById('options-container');
const feedbackMessage = document.getElementById('feedback-message'); 
const nextQuestionBtn = document.getElementById('next-question-btn');


// 4. FUNÇÕES DO JOGO

/**
 * Atualiza o placar na interface.
 */
function updateScore() {
    scoreElement.textContent = `${score} (Rodada ${roundCount}/${MAX_ROUNDS})`; // Incluindo o contador de rodadas
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
 * Para o áudio que estiver tocando e reseta o botão.
 */
function stopAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0; 
        playSoundBtn.textContent = 'Tocar o Som Novamente';
        playSoundBtn.disabled = false;
    }
}

/**
 * Configura o estado do jogo para começar uma nova pergunta.
 */
function selectNewQuestion() {
    // Verifica se atingiu o limite de rodadas
    if (roundCount >= MAX_ROUNDS) {
        endGame();
        return;
    }

    // 1. Esconde o botão Próxima Pergunta e reabilita o botão Som
    nextQuestionBtn.style.display = 'none';
    playSoundBtn.disabled = false;

    // 2. Limpa o feedback
    feedbackMessage.textContent = '';
    feedbackMessage.classList.remove('correct-color', 'incorrect-color');

    // 3. Define os animais disponíveis
    const availableAnimals = ANIMALS; // Sem filtro de categoria (usando 'all')

    if (availableAnimals.length < 3) {
        displayFeedback("Ops! Adicione mais animais a esta categoria para jogar.", false);
        optionsContainer.innerHTML = '';
        return;
    }
    
    // 4. Lógica de seleção (1 correto + 2 distratores)
    const shuffledAnimals = availableAnimals.sort(() => 0.5 - Math.random());
    currentCorrectAnimal = shuffledAnimals[0];
    
    let options = [currentCorrectAnimal];
    let i = 1;
    
    while (options.length < 3 && i < shuffledAnimals.length) {
        const potentialDistractor = shuffledAnimals[i];
        
        if (!options.some(opt => opt.name === potentialDistractor.name)) {
            options.push(potentialDistractor);
        }
        i++;
    }
    
    options = options.sort(() => 0.5 - Math.random());

    renderOptions(options);
    updateScore(); // Atualiza a pontuação/rodada ao iniciar a pergunta
}

/**
 * Renderiza os cards de opção no HTML.
 * @param {Array} options - Array de 3 objetos de animais.
 */
function renderOptions(options) {
    optionsContainer.innerHTML = ''; 
    
    options.forEach(animal => {
        const optionDiv = document.createElement('div');
        optionDiv.classList.add('animal-option');
        optionDiv.dataset.animal = animal.name;
        
        optionDiv.innerHTML = `
            <img src="${animal.image}" alt="${animal.name}">
            <p>${animal.correctName}</p>
        `;
        
        optionDiv.addEventListener('click', (event) => {
            event.stopPropagation(); 
            checkAnswer(animal.name, optionDiv);
        }, { once: true });
        
        optionsContainer.appendChild(optionDiv);
    });
}


/**
 * Toca o arquivo de som do animal correto, com tratamento de erro.
 */
function playSound() {
    if (!currentCorrectAnimal || !currentCorrectAnimal.sound) return;

    stopAudio(); 
    
    const audioFilePath = currentCorrectAnimal.sound; 
    const audio = new Audio(audioFilePath);
    currentAudio = audio; 

    playSoundBtn.textContent = '🔊 Tocando...';
    playSoundBtn.disabled = true;

    try {
        audio.play().then(() => {
            console.log(`Áudio ${audioFilePath} iniciado com sucesso.`);
        }).catch(error => {
            console.error(`Erro ao tentar tocar o áudio ${audioFilePath}. Verifique o caminho.`, error);
            playSoundBtn.textContent = '❌ Erro no Áudio! Tente novamente.';
        });

        audio.onended = () => {
            playSoundBtn.textContent = 'Tocar o Som Novamente';
            playSoundBtn.disabled = false;
        };

    } catch (e) {
        console.error("Erro fatal ao criar ou iniciar o objeto Audio:", e);
        playSoundBtn.textContent = '❌ Erro no Áudio! Tente novamente.';
        playSoundBtn.disabled = false;
    }
}


/**
 * Verifica se a resposta clicada está correta e lida com a pontuação e feedback.
 * @param {string} selectedAnimalName - Nome do animal clicado.
 * @param {HTMLElement} clickedElement - O div do animal clicado.
 */
function checkAnswer(selectedAnimalName, clickedElement) {
    // 1. Incrementa a rodada e para o áudio
    roundCount++; 
    stopAudio(); 

    // 2. Desabilita os cliques em todas as opções
    Array.from(optionsContainer.children).forEach(option => {
        option.style.pointerEvents = 'none';
    });

    let message = '';
    let isAnswerCorrect = false;

    if (selectedAnimalName === currentCorrectAnimal.name) {
        score += 10;
        correctCount += 1;
        clickedElement.classList.add('correct');
        message = '🎉 VOCÊ ACERTOU! (+10 pontos)';
        isAnswerCorrect = true;
    } else {
        score = Math.max(0, score - 5); 
        clickedElement.classList.add('incorrect');
        
        const correctElement = Array.from(optionsContainer.children).find(el => el.dataset.animal === currentCorrectAnimal.name);
        if (correctElement) {
            correctElement.classList.add('correct');
        }
        message = `❌ ERRADO! Era o ${currentCorrectAnimal.correctName}. (-5 pontos)`;
        isAnswerCorrect = false;
    }

    updateScore();
    displayFeedback(message, isAnswerCorrect); 
    
    // 3. Mostra o botão Próxima Pergunta
    nextQuestionBtn.style.display = 'inline-block';
    playSoundBtn.disabled = true; 
    
    // 4. Remove o feedback visual após 3 segundos
    setTimeout(() => {
        Array.from(optionsContainer.children).forEach(option => {
            option.classList.remove('correct', 'incorrect');
        });
        
    }, 3000);
}

/**
 * Lida com o fim do jogo após atingir o limite de rodadas.
 */
function endGame() {
    stopAudio();
    nextQuestionBtn.style.display = 'none';
    playSoundBtn.disabled = true;
    optionsContainer.innerHTML = ''; // Limpa as opções
    
    // Calcula o percentual de acertos
    const successRate = (correctCount / MAX_ROUNDS) * 100;
    
    let finalMessage = `🏆 FIM DO QUIZ! 🏆\nSua pontuação final é ${score}.\nVocê acertou ${correctCount} de ${MAX_ROUNDS} perguntas (${successRate.toFixed(0)}%).`;
    
    if (successRate >= 80) {
        finalMessage += "\nVOCÊ É UM EXPERT EM SONS ANIMAIS!";
    } else if (successRate >= 50) {
        finalMessage += "\nÓTIMO TRABALHO! Você está quase lá!";
    } else {
        finalMessage += "\nBom esforço! Tente novamente para melhorar!";
    }

    // Exibe a mensagem final
    displayFeedback(finalMessage, successRate >= 50); 
    
    // Reinicia o jogo após 5 segundos, simulando a ida para o "próximo tema"
    setTimeout(() => {
        initGame();
    }, 5000);
}


// 5. INICIALIZAÇÃO DO JOGO

/**
 * Zera o placar e inicia a primeira pergunta.
 */
function initGame() {
    // Zera as variáveis de estado do jogo
    score = 0;
    correctCount = 0;
    roundCount = 0; 

    // Reconfigura os ouvintes de evento, garantindo que não haja duplicatas
    playSoundBtn.removeEventListener('click', playSound);
    nextQuestionBtn.removeEventListener('click', selectNewQuestion);
    
    playSoundBtn.addEventListener('click', playSound);
    nextQuestionBtn.addEventListener('click', selectNewQuestion);

    // Inicia a primeira pergunta (Rodada 1)
    roundCount = 0;
    selectNewQuestion(); 
}

// Inicia o jogo quando a página carrega
document.addEventListener('DOMContentLoaded', initGame);