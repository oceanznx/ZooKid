// PAIS.JS - FUNCIONALIDADES DA PÁGINA PARA PAIS

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('👨‍👩‍👧‍👦 Página para Pais carregada!');
    
    // Inicializa todos os componentes
    initPage();
    
    // Carrega configurações do usuário
    loadUserConfig();
});

/**
 * Inicializa todos os componentes da página
 */
function initPage() {
    setupFAQ();
    setupTimerControls();
    setupConfigControls();
    setupReport();
    setupPrintFunctionality();
    setupSaveButtons();
    setupScrollToAnchors();
    
    // Anima elementos
    animateElements();
}

// ==================== CONFIGURAÇÕES DO USUÁRIO ====================

/**
 * Carrega configurações do usuário
 */
function loadUserConfig() {
    const savedConfig = localStorage.getItem('zookid_config');
    if (savedConfig) {
        try {
            const config = JSON.parse(savedConfig);
            
            // Atualiza avatar e nome no menu
            const userAvatar = document.getElementById('user-avatar');
            const userName = document.getElementById('user-name');
            
            if (userAvatar) userAvatar.textContent = config.profile.avatar || '🦁';
            if (userName) userName.textContent = config.profile.name || 'JOGADOR';
            
            // Atualiza controles da página
            updateControlsFromConfig(config);
            
        } catch (e) {
            console.log('Usando configurações padrão');
        }
    }
}

/**
 * Atualiza controles da página a partir das configurações
 */
function updateControlsFromConfig(config) {
    // Volume do som
    const volumeSlider = document.querySelector('.config-slider');
    const volumeValue = document.querySelector('.config-value');
    
    if (volumeSlider && volumeValue) {
        volumeSlider.value = config.audio.effectsVolume || 80;
        volumeValue.textContent = `${config.audio.effectsVolume || 80}%`;
    }
    
    // Dificuldade
    const difficultySelect = document.querySelector('.config-select');
    if (difficultySelect) {
        difficultySelect.value = config.game.difficulty || 'medium';
    }
    
    // Dicas
    const hintsToggle = document.getElementById('hints-toggle');
    if (hintsToggle) {
        hintsToggle.checked = config.visual.animations !== false;
    }
}

// ==================== FAQ (PERGUNTAS FREQUENTES) ====================

/**
 * Configura o sistema de FAQ (acordeão)
 */
function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');
            
            // Fecha todos os itens
            document.querySelectorAll('.faq-item').forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Abre o item clicado se não estiver ativo
            if (!isActive) {
                item.classList.add('active');
                playSound('click');
            }
        });
    });
}

// ==================== CONTROLE DE TEMPO ====================

/**
 * Configura os controles do temporizador
 */
function setupTimerControls() {
    const timeSlider = document.getElementById('time-slider');
    const timerMinutes = document.getElementById('timer-minutes');
    const timerButtons = document.querySelectorAll('.timer-btn');
    
    if (timeSlider && timerMinutes) {
        // Atualiza display quando slider muda
        timeSlider.addEventListener('input', function() {
            timerMinutes.textContent = this.value;
        });
        
        // Botões de tempo rápido
        timerButtons.forEach(button => {
            button.addEventListener('click', function() {
                const minutes = this.dataset.time;
                timeSlider.value = minutes;
                timerMinutes.textContent = minutes;
                playSound('click');
                
                // Destaque o botão clicado
                timerButtons.forEach(btn => btn.style.background = 'rgba(255, 153, 102, 0.3)');
                this.style.background = 'rgba(255, 153, 102, 0.5)';
                
                // Salva preferência
                saveTimerPreference(minutes);
            });
        });
        
        // Carrega preferência salva
        loadTimerPreference();
    }
}

/**
 * Salva preferência do temporizador
 */
function saveTimerPreference(minutes) {
    const preferences = JSON.parse(localStorage.getItem('zookid_parent_preferences') || '{}');
    preferences.timer = minutes;
    localStorage.setItem('zookid_parent_preferences', JSON.stringify(preferences));
    
    showNotification(`⏰ Temporizador definido para ${minutes} minutos`, 'success');
}

/**
 * Carrega preferência do temporizador
 */
function loadTimerPreference() {
    const preferences = JSON.parse(localStorage.getItem('zookid_parent_preferences') || '{}');
    if (preferences.timer) {
        const timeSlider = document.getElementById('time-slider');
        const timerMinutes = document.getElementById('timer-minutes');
        
        if (timeSlider && timerMinutes) {
            timeSlider.value = preferences.timer;
            timerMinutes.textContent = preferences.timer;
        }
    }
}

// ==================== CONFIGURAÇÕES ====================

/**
 * Configura controles de configurações
 */
function setupConfigControls() {
    // Slider de volume
    const volumeSlider = document.querySelector('.config-slider');
    const volumeValue = document.querySelector('.config-value');
    
    if (volumeSlider && volumeValue) {
        volumeSlider.addEventListener('input', function() {
            volumeValue.textContent = `${this.value}%`;
        });
    }
    
    // Toggle de dicas
    const hintsToggle = document.getElementById('hints-toggle');
    if (hintsToggle) {
        hintsToggle.addEventListener('change', function() {
            const status = this.checked ? 'ativadas' : 'desativadas';
            showNotification(`💡 Dicas ${status}`, 'info');
        });
    }
}

// ==================== RELATÓRIO DE USO ====================

/**
 * Configura o sistema de relatório
 */
function setupReport() {
    const viewReportBtn = document.getElementById('view-report');
    const resetStatsBtn = document.getElementById('reset-stats');
    const exportReportBtn = document.getElementById('export-report');
    
    // Carrega estatísticas
    loadStatistics();
    
    // Botão ver relatório completo
    if (viewReportBtn) {
        viewReportBtn.addEventListener('click', showFullReport);
    }
    
    // Botão limpar estatísticas
    if (resetStatsBtn) {
        resetStatsBtn.addEventListener('click', resetStatistics);
    }
    
    // Botão exportar relatório
    if (exportReportBtn) {
        exportReportBtn.addEventListener('click', exportReport);
    }
}

/**
 * Carrega e exibe estatísticas
 */
function loadStatistics() {
    const statsContainer = document.getElementById('relatorio-stats');
    if (!statsContainer) return;
    
    // Coleta dados de todos os jogos
    const games = ['memory', 'quiz', 'count', 'snake', 'labirinto'];
    let totalGames = 0;
    let totalTime = 0;
    let totalScore = 0;
    let gamesPlayed = new Set();
    
    games.forEach(game => {
        const scores = localStorage.getItem(`${game}_scores`);
        const times = localStorage.getItem(`${game}_times`);
        
        if (scores) {
            const parsedScores = JSON.parse(scores);
            totalGames += parsedScores.length;
            gamesPlayed.add(game);
            
            // Soma pontuações
            parsedScores.forEach(score => {
                totalScore += score.points || 0;
            });
        }
        
        if (times) {
            const parsedTimes = JSON.parse(times);
            parsedTimes.forEach(time => {
                totalTime += time.duration || 0;
            });
        }
    });
    
    // Formata tempo
    const hours = Math.floor(totalTime / 3600);
    const minutes = Math.floor((totalTime % 3600) / 60);
    
    // Atualiza interface
    statsContainer.innerHTML = `
        <div class="stats-grid">
            <div class="stat-item">
                <span class="stat-number">${totalGames}</span>
                <span class="stat-label">PARTIDAS JOGADAS</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${gamesPlayed.size}</span>
                <span class="stat-label">JOGOS EXPERIMENTADOS</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${hours}h ${minutes}m</span>
                <span class="stat-label">TEMPO TOTAL</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${totalScore}</span>
                <span class="stat-label">PONTOS TOTAIS</span>
            </div>
        </div>
    `;
    
    // Adiciona CSS para o grid
    const style = document.createElement('style');
    style.textContent = `
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
            width: 100%;
        }
        
        .stat-item {
            text-align: center;
            padding: 1rem;
            background: rgba(111, 66, 193, 0.2);
            border-radius: 10px;
            border: 2px solid #6f42c1;
        }
        
        .stat-number {
            display: block;
            font-size: 1.8rem;
            font-weight: bold;
            color: #f3cb2b;
            margin-bottom: 0.5rem;
        }
        
        .stat-label {
            font-size: 0.8rem;
            color: white;
            display: block;
        }
        
        @media (max-width: 768px) {
            .stats-grid {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Mostra relatório completo
 */
function showFullReport() {
    // Coleta dados detalhados
    const games = [
        { id: 'memory', name: '🧠 Memória Animal', icon: '🧠' },
        { id: 'quiz', name: '🔊 Quiz dos Sons', icon: '🔊' },
        { id: 'count', name: '🧮 Contagem', icon: '🧮' },
        { id: 'snake', name: '🐍 Cobrinha', icon: '🐍' },
        { id: 'labirinto', name: '🦁 Labirinto', icon: '🦁' }
    ];
    
    let reportHTML = `
        <div class="full-report">
            <h3>📊 RELATÓRIO COMPLETO DE USO</h3>
            <div class="report-date">📅 ${new Date().toLocaleDateString('pt-BR')}</div>
    `;
    
    games.forEach(game => {
        const scores = localStorage.getItem(`${game.id}_scores`);
        const times = localStorage.getItem(`${game.id}_times`);
        
        let gameHTML = `
            <div class="game-report">
                <div class="game-header">
                    <span class="game-icon">${game.icon}</span>
                    <h4>${game.name}</h4>
                </div>
        `;
        
        if (scores) {
            const parsedScores = JSON.parse(scores);
            const lastPlayed = parsedScores[parsedScores.length - 1];
            const bestScore = Math.max(...parsedScores.map(s => s.points || 0));
            
            gameHTML += `
                <div class="game-stats">
                    <div class="stat">
                        <span class="stat-label">🎮 PARTIDAS:</span>
                        <span class="stat-value">${parsedScores.length}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">🏆 MELHOR PONTUAÇÃO:</span>
                        <span class="stat-value">${bestScore}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">⏱️ ÚLTIMA JOGADA:</span>
                        <span class="stat-value">${lastPlayed ? new Date(lastPlayed.date).toLocaleDateString('pt-BR') : 'Nunca'}</span>
                    </div>
                </div>
            `;
        } else {
            gameHTML += `<p class="no-data">⏳ Nenhuma partida jogada ainda</p>`;
        }
        
        gameHTML += `</div>`;
        reportHTML += gameHTML;
    });
    
    reportHTML += `
            <div class="report-actions">
                <button onclick="printReport()" class="report-btn">🖨️ Imprimir</button>
                <button onclick="closeReport()" class="report-btn">❌ Fechar</button>
            </div>
        </div>
    `;
    
    // Cria modal
    const modal = document.createElement('div');
    modal.className = 'report-modal';
    modal.innerHTML = reportHTML;
    
    // Adiciona estilos
    const style = document.createElement('style');
    style.textContent = `
        .report-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            padding: 2rem;
            animation: fadeIn 0.3s ease;
        }
        
        .full-report {
            background: rgba(46, 46, 46, 0.95);
            border-radius: 20px;
            border: 4px solid #6f42c1;
            padding: 2rem;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            color: white;
        }
        
        .full-report h3 {
            color: #6f42c1;
            text-align: center;
            margin-bottom: 1rem;
        }
        
        .report-date {
            text-align: center;
            color: #f3cb2b;
            margin-bottom: 2rem;
            font-weight: bold;
        }
        
        .game-report {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            border: 2px solid rgba(111, 66, 193, 0.3);
        }
        
        .game-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .game-icon {
            font-size: 2rem;
        }
        
        .game-header h4 {
            color: #f3cb2b;
            margin: 0;
            font-size: 1.2rem;
        }
        
        .game-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }
        
        .stat {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
        }
        
        .stat-label {
            color: #aaa;
            font-size: 0.9rem;
        }
        
        .stat-value {
            color: #f3cb2b;
            font-weight: bold;
        }
        
        .no-data {
            color: #888;
            text-align: center;
            font-style: italic;
            padding: 1rem;
        }
        
        .report-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 2px solid rgba(255, 255, 255, 0.1);
        }
        
        .report-btn {
            padding: 0.8rem 2rem;
            background: linear-gradient(135deg, #6f42c1, #8a63d2);
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        .report-btn:hover {
            background: linear-gradient(135deg, #5a32a3, #7b52c9);
            transform: scale(1.05);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Fecha modal ao clicar fora
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    playSound('open');
}

// Funções auxiliares para o relatório
window.printReport = function() {
    window.print();
};

window.closeReport = function() {
    const modal = document.querySelector('.report-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
};

/**
 * Limpa todas as estatísticas
 */
function resetStatistics() {
    if (confirm('TEM CERTEZA QUE DESEJA LIMPAR TODAS AS ESTATÍSTICAS?\nISSO NÃO PODE SER DESFEITO!')) {
        const games = ['memory', 'quiz', 'count', 'snake', 'labirinto'];
        
        games.forEach(game => {
            localStorage.removeItem(`${game}_scores`);
            localStorage.removeItem(`${game}_times`);
        });
        
        localStorage.removeItem('zookid_ranking');
        localStorage.removeItem('zookid_maze_progress');
        
        showNotification('🗑️ Todas as estatísticas foram limpas!', 'success');
        setTimeout(() => location.reload(), 1500);
    }
}

/**
 * Exporta relatório
 */
function exportReport() {
    showNotification('📤 Função de exportação em desenvolvimento!', 'info');
}

// ==================== FUNCIONALIDADES DE IMPRESSÃO ====================

/**
 * Configura funcionalidades de impressão
 */
function setupPrintFunctionality() {
    // Adiciona estilos para impressão
    const printStyle = document.createElement('style');
    printStyle.textContent = `
        @media print {
            header, .dropdown-menu, .hero-pais .hero-badges,
            .timer-slider, .config-slider, .toggle-switch,
            .cta-section, button, .faq-icon {
                display: none !important;
            }
            
            body {
                background: white !important;
                color: black !important;
                font-size: 12pt !important;
            }
            
            .section, .carta-section, .controle-card, .dica-card {
                break-inside: avoid;
                border: 2px solid #ccc !important;
                background: white !important;
                color: black !important;
                box-shadow: none !important;
            }
            
            .hero-title, .section-title {
                color: black !important;
                text-shadow: none !important;
            }
            
            .badge, .game-tag {
                border: 1px solid #ccc !important;
                color: black !important;
                background: #f0f0f0 !important;
            }
            
            .carta-content, .controle-body, .dica-card p {
                color: black !important;
            }
        }
    `;
    document.head.appendChild(printStyle);
}

// ==================== BOTÕES DE SALVAR ====================

/**
 * Configura botões de salvar
 */
function setupSaveButtons() {
    const saveProfileBtn = document.getElementById('save-profile');
    const configSaveBtn = document.querySelector('.config-save-btn');
    
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', saveParentPreferences);
    }
    
    if (configSaveBtn) {
        configSaveBtn.addEventListener('click', saveAllConfigurations);
    }
}

/**
 * Salva preferências dos pais
 */
function saveParentPreferences() {
    const volumeSlider = document.querySelector('.config-slider');
    const difficultySelect = document.querySelector('.config-select');
    const hintsToggle = document.getElementById('hints-toggle');
    
    const preferences = {
        volume: volumeSlider ? volumeSlider.value : 80,
        difficulty: difficultySelect ? difficultySelect.value : 'medium',
        hints: hintsToggle ? hintsToggle.checked : true,
        savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('zookid_parent_preferences', JSON.stringify(preferences));
    showNotification('💾 Preferências salvas com sucesso!', 'success');
}

/**
 * Salva todas as configurações
 */
function saveAllConfigurations() {
    // Salva configurações principais
    const mainConfig = JSON.parse(localStorage.getItem('zookid_config') || '{}');
    
    const volumeSlider = document.querySelector('.config-slider');
    const difficultySelect = document.querySelector('.config-select');
    const hintsToggle = document.getElementById('hints-toggle');
    
    if (volumeSlider) {
        mainConfig.audio = mainConfig.audio || {};
        mainConfig.audio.effectsVolume = parseInt(volumeSlider.value);
    }
    
    if (difficultySelect) {
        mainConfig.game = mainConfig.game || {};
        mainConfig.game.difficulty = difficultySelect.value;
    }
    
    if (hintsToggle) {
        mainConfig.visual = mainConfig.visual || {};
        mainConfig.visual.animations = hintsToggle.checked;
    }
    
    localStorage.setItem('zookid_config', JSON.stringify(mainConfig));
    
    // Salva preferências dos pais
    saveParentPreferences();
    
    showNotification('✅ Todas as configurações foram salvas!', 'success');
}

// ==================== SCROLL PARA ÂNCORAS ====================

/**
 * Configura scroll suave para âncoras
 */
function setupScrollToAnchors() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    playSound('click');
                }
            }
        });
    });
}

// ==================== ANIMAÇÕES ====================

/**
 * Anima elementos da página
 */
function animateElements() {
    // Anima badges do hero
    const badges = document.querySelectorAll('.badge');
    badges.forEach((badge, index) => {
        badge.style.animationDelay = `${index * 0.2}s`;
        badge.classList.add('animated');
    });
    
    // Anima cards de informações
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// ==================== UTILITÁRIOS ====================

/**
 * Toca um som de feedback
 */
function playSound(type) {
    // Verifica se som está ativado
    const config = JSON.parse(localStorage.getItem('zookid_config') || '{}');
    if (config.audio && config.audio.enabled === false) return;
    
    const sounds = {
        click: '🔔',
        open: '📂',
        success: '✅',
        error: '❌',
        info: '💡'
    };
    
    const emoji = sounds[type] || '🔊';
    
    // Cria elemento de som visual
    const soundElement = document.createElement('div');
    soundElement.textContent = emoji;
    soundElement.style.cssText = `
        position: fixed;
        font-size: 1.5rem;
        z-index: 10000;
        pointer-events: none;
        animation: soundEffect 0.5s ease-out forwards;
        opacity: 0;
    `;
    
    // Posição aleatória
    const x = 50 + (Math.random() * 20 - 10);
    const y = 50 + (Math.random() * 20 - 10);
    soundElement.style.left = `${x}%`;
    soundElement.style.top = `${y}%`;
    
    document.body.appendChild(soundElement);
    
    // Remove após animação
    setTimeout(() => {
        soundElement.remove();
    }, 500);
    
    // Adiciona animação CSS
    if (!document.getElementById('sound-animations')) {
        const style = document.createElement('style');
        style.id = 'sound-animations';
        style.textContent = `
            @keyframes soundEffect {
                0% {
                    transform: scale(0.5) rotate(0deg);
                    opacity: 0;
                }
                50% {
                    transform: scale(1.2) rotate(10deg);
                    opacity: 1;
                }
                100% {
                    transform: scale(0.8) rotate(-5deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Mostra notificação
 */
function showNotification(message, type = 'info') {
    // Remove notificação anterior
    const oldNotification = document.querySelector('.parent-notification');
    if (oldNotification) oldNotification.remove();
    
    // Cria nova notificação
    const notification = document.createElement('div');
    notification.className = `parent-notification ${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${getNotificationIcon(type)}</span>
        <span class="notification-text">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Mostra notificação
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
    
    // Adiciona estilos se não existirem
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .parent-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(46, 46, 46, 0.95);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                border: 3px solid;
                display: flex;
                align-items: center;
                gap: 1rem;
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                max-width: 400px;
            }
            
            .parent-notification.show {
                transform: translateX(0);
            }
            
            .parent-notification.success {
                border-color: #28a745;
                background: rgba(40, 167, 69, 0.1);
            }
            
            .parent-notification.info {
                border-color: #17a2b8;
                background: rgba(23, 162, 184, 0.1);
            }
            
            .parent-notification.error {
                border-color: #dc3545;
                background: rgba(220, 53, 69, 0.1);
            }
            
            .notification-icon {
                font-size: 1.5rem;
            }
            
            .notification-text {
                font-weight: bold;
                font-size: 0.95rem;
            }
            
            @media (max-width: 768px) {
                .parent-notification {
                    top: auto;
                    bottom: 20px;
                    right: 20px;
                    left: 20px;
                    transform: translateY(100%);
                }
                
                .parent-notification.show {
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Retorna ícone para tipo de notificação
 */
function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        info: '💡',
        warning: '⚠️'
    };
    return icons[type] || 'ℹ️';
}

// ==================== EXPORTA FUNÇÕES ====================
window.ZooKidParents = {
    showNotification,
    loadStatistics,
    saveParentPreferences,
    resetStatistics
};