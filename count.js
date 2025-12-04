
// 1. ESTRUTURA DE DADOS: USANDO OS ANIMAIS E SUAS IMAGENS
const ANIMALS = [
    { name: 'VACA', image: 'cow-sim.jpg' },
    { name: 'GALINHA', image: 'chicken-sim.jpg' },
    { name: 'PORCO', image: 'pig-sim.jpg' },
    { name: 'OVELHA', image: 'sheep-sim.jpg' },
    { name: 'PATO', image: 'duck-sim.jpg' },
    { name: 'CAVALO', image: 'horse-sim.jpg' },
    { name: 'CACHORRO', image: 'dog-sim.jpg' },
    { name: 'GATO', image: 'cat-sim.jpg' },
    { name: 'LEÕE', image: 'lion-sim.jpg' },
    { name: 'ELEFANTE', image: 'elephant-sim.jpg' },
];

// 2. VARIÁVEIS DE ESTADO
let score = 0;
let correctCount = 0;
let correctAnswer = 0;
const MAX_ROUNDS = 10;
let roundCount = 0;

// 3. SELETORES DO DOM
const scoreElement = document.getElementById('score');
const correctCountElement = document.getElementById('correct-count');
const questionTextElement = document.getElementById('question-text');
const displayArea = document.getElementById('animal-display-area');
const optionsContainer = document.getElementById('options-container');
const feedbackMessage = document.getElementById('feedback-message'); 
const nextQuestionBtn = document.getElementById('next-question-btn');


// 4. FUNÇÕES DE UTILIDADE
function updateScore() {
    scoreElement.textContent = `${score} (Rodada ${roundCount}/${MAX_ROUNDS})`;
    correctCountElement.textContent = correctCount;
}

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
 * Retorna um inteiro aleatório entre min e max (inclusivo).
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Cria um array de números (opções) garantindo que o correto esteja presente.
 * @param {number} correct - O número correto.
 * @returns {Array<number>} Um array de 4 opções aleatórias e embaralhadas.
 */
function generateOptions(correct) {
    const options = new Set();
    options.add(correct);
    
    // Define um intervalo para os distratores
    const minRange = Math.max(1, correct - 3);
    const maxRange = correct + 3;

    while (options.size < 4) {
        let distractor = getRandomInt(minRange, maxRange);
        // Garante que o distrator não seja 0 (se minRange é > 0)
        if (distractor > 0) {
            options.add(distractor);
        }
    }

    return Array.from(options).sort(() => 0.5 - Math.random());
}


// 5. FUNÇÕES PRINCIPAIS DO JOGO

/**
 * Gera uma nova pergunta de contagem.
 */
function selectNewQuestion() {
    if (roundCount >= MAX_ROUNDS) {
        endGame();
        return;
    }

    // Limpa o estado
    nextQuestionBtn.style.display = 'none';
    feedbackMessage.textContent = '';
    feedbackMessage.classList.remove('correct-color', 'incorrect-color');
    displayArea.innerHTML = '';


    // --- 1. Gera o Cenário de Animais ---
    // Escolhe o número de diferentes tipos de animais (entre 2 e 4)
    const numTypes = getRandomInt(2, 4);
    const availableAnimals = ANIMALS.sort(() => 0.5 - Math.random()).slice(0, numTypes);
    
    const sceneAnimals = [];
    let totalCount = 0;
    
    // Adiciona uma quantidade aleatória (1 a 4) de cada tipo
    availableAnimals.forEach(animalType => {
        const count = getRandomInt(1, 4); 
        totalCount += count;
        for (let i = 0; i < count; i++) {
            sceneAnimals.push(animalType);
        }
    });

    // Embaralha a ordem de exibição
    sceneAnimals.sort(() => 0.5 - Math.random());

    // --- 2. Cria a Pergunta ---
    const questionType = getRandomInt(0, 1); // 0: Contar Total, 1: Contar Tipo Específico

    if (questionType === 0 || availableAnimals.length === 1) {
        // PERGUNTA 1: Contar Total
        questionTextElement.textContent = `QUANTOS ANIMAIS VOCÊ VÊ NO TOTAL?`;
        correctAnswer = totalCount;

    } else {
        // PERGUNTA 2: Contar um Tipo Específico
        const targetAnimal = availableAnimals[getRandomInt(0, availableAnimals.length - 1)];
        let targetCount = 0;
        sceneAnimals.forEach(animal => {
            if (animal.name === targetAnimal.name) {
                targetCount++;
            }
        });

        questionTextElement.textContent = `QUANTO(A)S  ${targetAnimal.name}S VOCÊ VÊ NA TELA?`;
        correctAnswer = targetCount;
    }
    
    // --- 3. Renderiza a Cena e Opções ---
    sceneAnimals.forEach(animal => {
        const img = document.createElement('img');
        img.src = animal.image;
        img.alt = animal.name;
        img.classList.add('animal-icon');
        displayArea.appendChild(img);
    });

    renderOptions(generateOptions(correctAnswer));
    updateScore(); 
}

/**
 * Renderiza os botões de opção de resposta numérica.
 * @param {Array<number>} options - Array de 4 números.
 */
function renderOptions(options) {
    optionsContainer.innerHTML = ''; 
    
    options.forEach(number => {
        const optionButton = document.createElement('button');
        optionButton.classList.add('option-button');
        optionButton.dataset.answer = number;
        optionButton.textContent = number;
        
        optionButton.addEventListener('click', (event) => {
            checkAnswer(parseInt(event.target.dataset.answer), optionButton);
        }, { once: true });
        
        optionsContainer.appendChild(optionButton);
    });
}


/**
 * Verifica a resposta do usuário.
 * @param {number} selectedAnswer - O número clicado.
 * @param {HTMLElement} clickedElement - O botão clicado.
 */
function checkAnswer(selectedAnswer, clickedElement) {
    // 1. Incrementa a rodada e desabilita os botões
    roundCount++; 
    Array.from(optionsContainer.children).forEach(button => {
        button.disabled = true;
    });

    let message = '';
    let isAnswerCorrect = false;

    if (selectedAnswer === correctAnswer) {
        // Resposta Correta
        score += 10;
        correctCount += 1;
        clickedElement.classList.add('correct');
        message = `🎉 CORRETO! O NÚMERO É ${correctAnswer}. (+10 PONTOS)`;
        isAnswerCorrect = true;
    } else {
        // Resposta Incorreta
        score = Math.max(0, score - 5); 
        clickedElement.classList.add('incorrect');
        
        // Destaca a resposta correta
        const correctElement = Array.from(optionsContainer.children).find(el => parseInt(el.dataset.answer) === correctAnswer);
        if (correctElement) {
            correctElement.classList.add('correct');
        }
        message = `❌ ERRADO! A RESPOSTA CORRETA ERA ${correctAnswer}. (-5 PONTOS)`;
        isAnswerCorrect = false;
    }

    updateScore();
    displayFeedback(message, isAnswerCorrect); 
    
    // 2. Mostra o botão Próxima Pergunta
    nextQuestionBtn.style.display = 'inline-block';
}

/**
 * Lida com o fim do jogo.
 */
function endGame() {
    nextQuestionBtn.style.display = 'none';
    displayArea.innerHTML = '';
    optionsContainer.innerHTML = ''; 
    
    const successRate = (correctCount / MAX_ROUNDS) * 100;
    
    let finalMessage = `🏆 FIM DO JOGO! 🏆\nPONTUAÇÃO: ${score}.\nACERTOS: ${correctCount}/${MAX_ROUNDS} (${successRate.toFixed(0)}%).`;
    
    if (successRate >= 70) {
        finalMessage += "\nEXCELENTE HABILIDADE DE CONTAGEM!";
    } else {
        finalMessage += "\nCONTINUE PRATICANDO PARA SE TORNAR UM MESTRE EM CONTAGEM!";
    }

    displayFeedback(finalMessage, successRate >= 50); 
    
    // Reinicia o jogo após 5 segundos
    setTimeout(() => {
        initGame();
    }, 5000);
}


// 6. INICIALIZAÇÃO

function initGame() {
    score = 0;
    correctCount = 0;
    roundCount = 0; 

    nextQuestionBtn.removeEventListener('click', selectNewQuestion);
    nextQuestionBtn.addEventListener('click', selectNewQuestion);

    roundCount = 0;
    selectNewQuestion(); 
}

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