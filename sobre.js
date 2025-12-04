// SOBRE.JS - INTERAÇÕES DA PÁGINA "SOBRE O ZOOKID"

// Inicializa a página
document.addEventListener('DOMContentLoaded', function() {
    console.log('ℹ️ Página "Sobre o ZooKid" carregada!');
    
    // Configura animações dos emojis
    setupEmojiAnimations();
    
    // Configura botões interativos
    setupInteractiveButtons();
    
    // Mostra estatísticas
    showStatistics();
});

/**
 * Configura animações dos emojis
 */
function setupEmojiAnimations() {
    // Adiciona delay aleatório para emojis do footer
    const animalEmojis = document.querySelectorAll('.animal-emoji');
    animalEmojis.forEach((emoji, index) => {
        emoji.style.animationDelay = `${index * 0.3}s`;
    });
    
    // Anima os emojis das seções
    const sectionEmojis = document.querySelectorAll('.mission-icon, .game-emoji');
    sectionEmojis.forEach((emoji, index) => {
        emoji.style.animationDelay = `${index * 0.2}s`;
    });
}

/**
 * Configura botões interativos
 */
function setupInteractiveButtons() {
    // Botões de jogar agora
    const playButtons = document.querySelectorAll('.game-btn');
    playButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Adiciona efeito visual
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // Log para analytics (simulado)
            const gameName = this.closest('.game-card').querySelector('h3').textContent;
            console.log(`🎮 Jogador clicou em: ${gameName}`);
        });
    });
    
    // Botão voltar para o início
    const backButton = document.querySelector('.back-home-btn');
    if (backButton) {
        backButton.addEventListener('click', function() {
            // Efeito de confete simulado
            createConfettiEffect();
        });
    }
}

/**
 * Mostra estatísticas
 */
function showStatistics() {
    // Calcula estatísticas dos jogos
    const games = ['memory', 'quiz', 'count', 'snake', 'labirinto'];
    let totalScores = 0;
    let gamesPlayed = 0;
    
    games.forEach(game => {
        const scores = localStorage.getItem(`${game}_scores`);
        if (scores) {
            const parsed = JSON.parse(scores);
            totalScores += parsed.length;
            gamesPlayed++;
        }
    });
    
    // Atualiza estatísticas se houver dados
    if (totalScores > 0) {
        const statsElement = document.createElement('div');
        statsElement.className = 'live-stats';
        statsElement.innerHTML = `
            <div class="live-stat">
                <span class="live-number">${gamesPlayed}</span>
                <span class="live-label">JOGOS JOGADOS</span>
            </div>
            <div class="live-stat">
                <span class="live-number">${totalScores}</span>
                <span class="live-label">PARTIDAS</span>
            </div>
        `;
        
        // Insere após o hero stats
        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) {
            heroStats.parentNode.insertBefore(statsElement, heroStats.nextSibling);
            
            // Adiciona CSS
            const style = document.createElement('style');
            style.textContent = `
                .live-stats {
                    display: flex;
                    justify-content: center;
                    gap: 3rem;
                    margin-top: 2rem;
                    padding-top: 2rem;
                    border-top: 2px solid rgba(243, 203, 43, 0.3);
                }
                
                .live-stat {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                
                .live-number {
                    font-size: 2.5rem;
                    font-weight: bold;
                    color: #ffd700;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                }
                
                .live-label {
                    color: white;
                    font-size: 1rem;
                    margin-top: 0.5rem;
                    font-weight: bold;
                }
                
                @media (max-width: 768px) {
                    .live-stats {
                        gap: 1.5rem;
                        flex-direction: column;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

/**
 * Cria efeito de confete
 */
function createConfettiEffect() {
    const emojis = ['🎉', '🎊', '🦁', '🐘', '🦒', '🐒', '🐼', '⭐', '🎯'];
    
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        confetti.style.cssText = `
            position: fixed;
            font-size: 1.5rem;
            z-index: 10000;
            pointer-events: none;
            left: ${Math.random() * 100}%;
            top: -50px;
            animation: confetti-fall ${Math.random() * 2 + 1}s linear forwards;
        `;
        
        document.body.appendChild(confetti);
        
        // Remove após animação
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
    
    // Adiciona animação CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confetti-fall {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Rola suavemente para seções
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Exporta funções para uso global
window.ZooKidAbout = {
    scrollToSection,
    createConfettiEffect
};