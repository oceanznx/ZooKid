
const ANIMALS = [
    
    { name: 'Vaca', sound: 'cow.mp3', image: 'cow-sim.jpg', category: 'farm', correctName: 'VACA' },
    { name: 'Galinha', sound: 'chicken.mp3', image: 'chicken-sim.jpg', category: 'farm', correctName: 'GALINHA' },
    { name: 'Porco', sound: 'pig.mp3', image: 'pig-sim.jpg', category: 'farm', correctName: 'PORCO' },
    { name: 'Ovelha', sound: 'sheep.mp3', image: 'sheep-sim.jpg', category: 'farm', correctName: 'OVELHA' },
    { name: 'Pato', sound: 'duck.mp3', image: 'duck-sim.jpg', category: 'farm', correctName: 'PATO' },
    { name: 'Cavalo', sound: 'horse.mp3', image: 'horse-sim.jpg', category: 'farm', correctName: 'CAVALO' },
    

    { name: 'Cachorro', sound: 'dog.mp3', image: 'dog-sim.jpg', category: 'domestic', correctName: 'CACHORRO' },
    { name: 'Gato', sound: 'cat.mp3', image: 'cat-sim.jpg', category: 'domestic', correctName: 'GATO' },
    { name: 'Coelho', sound: 'rabbit.mp3', image: 'rabbit-sim.jpg', category: 'domestic', correctName: 'COELHO' },
    { name: 'Papagaio', sound: 'parrot.mp3', image: 'parrot-sim.jpg', category: 'domestic', correctName: 'PAPAGAIO' },
    { name: 'Canário', sound: 'canary.mp3', image: 'canary-sim.jpg', category: 'domestic', correctName: 'CANÁRIO' },
    

    { name: 'Macaco', sound: 'monkey.mp3', image: 'monkey-sim.jpg', category: 'jungle', correctName: 'MACACO' },
    { name: 'Jaguar', sound: 'jaguar.mp3', image: 'jaguar-sim.jpg', category: 'jungle', correctName: 'JAGUAR' },
    { name: 'Cobra', sound: 'snake.mp3', image: 'snake-sim.jpg', category: 'jungle', correctName: 'COBRA' },
    { name: 'Gorila', sound: 'gorilla.mp3', image: 'gorilla-sim.jpg', category: 'jungle', correctName: 'GORILA' },
    { name: 'Arara', sound: 'macaw.mp3', image: 'macaw-sim.jpg', category: 'jungle', correctName: 'ARARA' },
    
   
    { name: 'Leão', sound: 'lion.mp3', image: 'lion-sim.jpg', category: 'savanna', correctName: 'LEÃO' },
    { name: 'Elefante', sound: 'elephant.mp3', image: 'elephant-sim.jpg', category: 'savanna', correctName: 'ELEFANTE' },
    { name: 'Girafa', sound: 'giraffe.mp3', image: 'giraffe-sim.jpg', category: 'savanna', correctName: 'GIRAFA' },
    { name: 'Zebra', sound: 'zebra.mp3', image: 'zebra-sim.jpg', category: 'savanna', correctName: 'ZEBRA' },
    { name: 'Rinoceronte', sound: 'rhino.mp3', image: 'rhino-sim.jpg', category: 'savanna', correctName: 'RINOCERONTE' },
    { name: 'Hiena', sound: 'hyena.mp3', image: 'hyena-sim.jpg', category: 'savanna', correctName: 'HIENA' },
    

    { name: 'Baleia', sound: 'whale.mp3', image: 'whale-sim.jpg', category: 'ocean', correctName: 'BALEIA' },
    { name: 'Golfinho', sound: 'dolphin.mp3', image: 'dolphin-sim.jpg', category: 'ocean', correctName: 'GOLFINHO' },
    { name: 'Foca', sound: 'seal.mp3', image: 'seal-sim.jpg', category: 'ocean', correctName: 'FOCA' },
    { name: 'Pinguim', sound: 'penguin.mp3', image: 'penguin-sim.jpg', category: 'ocean', correctName: 'PINGUIM' },
    { name: 'Morsa', sound: 'walrus.mp3', image: 'walrus-sim.jpg', category: 'ocean', correctName: 'MORSA' },
    { name: 'Gaivota', sound: 'seagull.mp3', image: 'seagull.jpg', category: 'ocean', correctName: 'GAIVOTA' },
];


let score = 0;
let correctCount = 0;
let currentCorrectAnimal = null;
let currentCategory = 'all'; 
let currentAudio = null; 
let roundCount = 0; 
const MAX_ROUNDS = 10;

// 3. SELETORES DO DOM
const scoreElement = document.getElementById('score');
const correctCountElement = document.getElementById('correct-count');
const playSoundBtn = document.getElementById('play-sound-btn');
const optionsContainer = document.getElementById('options-container');
const feedbackMessage = document.getElementById('feedback-message'); 
const nextQuestionBtn = document.getElementById('next-question-btn');





 

function updateScore() {
    scoreElement.textContent = `${score} (RODADA ${roundCount}/${MAX_ROUNDS})`; 
    correctCountElement.textContent = correctCount;
}

/**

 * @param {string} message 
 * @param {boolean} isCorrect 
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
 
 */
function stopAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0; 
        playSoundBtn.textContent = '🔊 TOCAR SOM';
        playSoundBtn.disabled = false;
    }
}

/**
 * Configura o estado do jogo para começar uma nova pergunta.
 */
function selectNewQuestion() {

    if (roundCount >= MAX_ROUNDS) {
        endGame();
        return;
    }

  
    nextQuestionBtn.style.display = 'none';
    playSoundBtn.disabled = false;

  
    feedbackMessage.textContent = '';
    feedbackMessage.classList.remove('correct-color', 'incorrect-color');

  
    const availableAnimals = ANIMALS; 

    if (availableAnimals.length < 3) {
        displayFeedback("Ops! Adicione mais animais a esta categoria para jogar.", false);
        optionsContainer.innerHTML = '';
        return;
    }
    

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
    updateScore(); 
}

/**
 * Renderiza os cards de opção no HTML.
 * @param {Array} options 
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

    playSoundBtn.textContent = '🔊 TOCANDO...';
    playSoundBtn.disabled = true;

    try {
        audio.play().then(() => {
            console.log(`Áudio ${audioFilePath} iniciado com sucesso.`);
        }).catch(error => {
            console.error(`Erro ao tentar tocar o áudio ${audioFilePath}. Verifique o caminho.`, error);
            playSoundBtn.textContent = '❌ Erro no Áudio! Tente novamente.';
        });

        audio.onended = () => {
            playSoundBtn.textContent = 'TOCAR SOM NOVAMENTE';
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
        message = `❌ ERRADO! ERA O ${currentCorrectAnimal.correctName}. (-5 PONTOS)`;
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
    optionsContainer.innerHTML = ''; 
    playSoundBtn.style.display = 'none';
    
    // Calcula o percentual de acertos
    const successRate = (correctCount / MAX_ROUNDS) * 100;
    
    let finalMessage = `🏆 FIM DO QUIZ! 🏆\nSUA PONTUAÇÃO FINAL É ${score}.\nVOCÊ ACERTOU ${correctCount} DE ${MAX_ROUNDS} PERGUNTAS (${successRate.toFixed(0)}%).`;
    
    if (successRate >= 80) {
        finalMessage += "\nVOCÊ É UM EXPERT EM SONS ANIMAIS!";
    } else if (successRate >= 50) {
        finalMessage += "\nÓTIMO TRABALHO! VOCÊ ESTÁ QUASE LÁ!";
    } else {
        finalMessage += "\nBOM ESFORÇO! TENTE NOVAMENTE PARA MELHORAR   !";
    }

    // Exibe a mensagem final
    displayFeedback(finalMessage, successRate >= 50); 
    
}


// 5. INICIALIZAÇÃO DO JOGO


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