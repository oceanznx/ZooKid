// CONFIGURAÇÕES.JS - SISTEMA DE CONFIGURAÇÕES DO ZOOKID

// ==================== VARIÁVEIS GLOBAIS ====================
const CONFIG_KEY = 'zookid_config';
const DEFAULT_CONFIG = {
    audio: {
        enabled: true,
        effectsVolume: 80,
        musicVolume: 60
    },
    visual: {
        darkMode: false,
        fontSize: 'medium',
        animations: true
    },
    game: {
        difficulty: 'medium',
        vibration: true,
        timeLimit: 'unlimited'
    },
    profile: {
        name: 'JOGADOR',
        avatar: '🦁'
    }
};

// ==================== ELEMENTOS DO DOM ====================
let currentConfig = {...DEFAULT_CONFIG};

// ==================== FUNÇÕES DE INICIALIZAÇÃO ====================

/**
 * Inicializa as configurações
 */
function initSettings() {
    // Carrega configurações salvas
    loadSavedConfig();
    
    // Configura os elementos
    setupAudioSettings();
    setupVisualSettings();
    setupGameSettings();
    setupProfileSettings();
    setupActionButtons();
    
    // Atualiza interface
    updateUIFromConfig();
    
    // Configura menu
    updateMenuProfile();
    
    console.log('⚙️ Configurações inicializadas!');
}

/**
 * Carrega configurações salvas do localStorage
 */
function loadSavedConfig() {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) {
        try {
            currentConfig = JSON.parse(saved);
            console.log('📂 Configurações carregadas:', currentConfig);
        } catch (e) {
            console.error('❌ Erro ao carregar configurações:', e);
            currentConfig = {...DEFAULT_CONFIG};
        }
    } else {
        console.log('📝 Usando configurações padrão');
    }
}

/**
 * Salva configurações no localStorage
 */
function saveConfig() {
    try {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(currentConfig));
        console.log('💾 Configurações salvas:', currentConfig);
        showStatus('CONFIGURAÇÕES SALVAS!', '💾');
        updateMenuProfile();
    } catch (e) {
        console.error('❌ Erro ao salvar configurações:', e);
        showStatus('ERRO AO SALVAR!', '❌');
    }
}

// ==================== CONFIGURAÇÕES DE ÁUDIO ====================

/**
 * Configura os controles de áudio
 */
function setupAudioSettings() {
    const soundToggle = document.getElementById('sound-toggle');
    const effectsSlider = document.getElementById('effects-volume');
    const effectsValue = document.getElementById('effects-value');
    const musicSlider = document.getElementById('music-volume');
    const musicValue = document.getElementById('music-value');
    
    // Som dos jogos
    soundToggle.checked = currentConfig.audio.enabled;
    soundToggle.addEventListener('change', (e) => {
        currentConfig.audio.enabled = e.target.checked;
        updateAudioState();
    });
    
    // Volume dos efeitos
    effectsSlider.value = currentConfig.audio.effectsVolume;
    effectsValue.textContent = `${currentConfig.audio.effectsVolume}%`;
    
    effectsSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        currentConfig.audio.effectsVolume = parseInt(value);
        effectsValue.textContent = `${value}%`;
    });
    
    // Volume da música
    musicSlider.value = currentConfig.audio.musicVolume;
    musicValue.textContent = `${currentConfig.audio.musicVolume}%`;
    
    musicSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        currentConfig.audio.musicVolume = parseInt(value);
        musicValue.textContent = `${value}%`;
    });
}

/**
 * Atualiza o estado do áudio
 */
function updateAudioState() {
    const enabled = currentConfig.audio.enabled;
    const effectsVolume = enabled ? currentConfig.audio.effectsVolume / 100 : 0;
    const musicVolume = enabled ? currentConfig.audio.musicVolume / 100 : 0;
    
    // Aqui você integraria com o sistema de áudio do jogo
    console.log(`🔊 Áudio: ${enabled ? 'Ligado' : 'Desligado'}`);
    console.log(`🎮 Efeitos: ${effectsVolume * 100}%`);
    console.log(`🎵 Música: ${musicVolume * 100}%`);
    
    // Exemplo de integração com jogos existentes
    if (window.updateGameSound) {
        window.updateGameSound(enabled, effectsVolume);
    }
}

// ==================== CONFIGURAÇÕES VISUAIS ====================

/**
 * Configura os controles visuais
 */
function setupVisualSettings() {
    const darkToggle = document.getElementById('darkmode-toggle');
    const animToggle = document.getElementById('animations-toggle');
    const sizeButtons = document.querySelectorAll('.size-btn');
    
    // Modo escuro
    darkToggle.checked = currentConfig.visual.darkMode;
    darkToggle.addEventListener('change', (e) => {
        currentConfig.visual.darkMode = e.target.checked;
        updateVisualSettings();
    });
    
    // Animações
    animToggle.checked = currentConfig.visual.animations;
    animToggle.addEventListener('change', (e) => {
        currentConfig.visual.animations = e.target.checked;
        updateAnimationsState();
    });
    
    // Tamanho da fonte
    sizeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.size === currentConfig.visual.fontSize) {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', () => {
            sizeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentConfig.visual.fontSize = btn.dataset.size;
            updateFontSize();
        });
    });
}

/**
 * Atualiza configurações visuais
 */
function updateVisualSettings() {
    // Modo escuro
    if (currentConfig.visual.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    // Animações
    updateAnimationsState();
    
    // Tamanho da fonte
    updateFontSize();
}

/**
 * Atualiza estado das animações
 */
function updateAnimationsState() {
    const enabled = currentConfig.visual.animations;
    
    if (enabled) {
        // Reativa AOS
        if (window.AOS) {
            AOS.refresh();
        }
        document.body.style.animationPlayState = 'running';
    } else {
        // Desativa animações
        document.body.style.animationPlayState = 'paused';
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }
}

/**
 * Atualiza tamanho da fonte
 */
function updateFontSize() {
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${currentConfig.visual.fontSize}`);
}

// ==================== CONFIGURAÇÕES DE JOGO ====================

/**
 * Configura os controles de jogo
 */
function setupGameSettings() {
    const difficultySelect = document.getElementById('difficulty-select');
    const vibrationToggle = document.getElementById('vibration-toggle');
    const timeSelect = document.getElementById('time-select');
    
    // Dificuldade
    difficultySelect.value = currentConfig.game.difficulty;
    difficultySelect.addEventListener('change', (e) => {
        currentConfig.game.difficulty = e.target.value;
        updateGameDifficulty();
    });
    
    // Vibração
    vibrationToggle.checked = currentConfig.game.vibration;
    vibrationToggle.addEventListener('change', (e) => {
        currentConfig.game.vibration = e.target.checked;
        updateVibrationState();
    });
    
    // Tempo
    timeSelect.value = currentConfig.game.timeLimit;
    timeSelect.addEventListener('change', (e) => {
        currentConfig.game.timeLimit = e.target.value;
    });
}

/**
 * Atualiza dificuldade do jogo
 */
function updateGameDifficulty() {
    console.log(`🎮 Dificuldade alterada para: ${currentConfig.game.difficulty}`);
    
    // Atualiza dificuldade em todos os jogos
    const games = ['memory', 'quiz', 'count', 'snake', 'labirinto'];
    games.forEach(game => {
        const key = `${game}_difficulty`;
        localStorage.setItem(key, currentConfig.game.difficulty);
    });
}

/**
 * Atualiza estado da vibração
 */
function updateVibrationState() {
    const enabled = currentConfig.game.vibration;
    console.log(`📳 Vibração: ${enabled ? 'Ativada' : 'Desativada'}`);
    
    // Exemplo de vibração
    if (enabled && 'vibrate' in navigator) {
        // Testa vibração rápida
        navigator.vibrate(100);
    }
}

// ==================== CONFIGURAÇÕES DE PERFIL ====================

/**
 * Configura os controles de perfil
 */
function setupProfileSettings() {
    const nameInput = document.getElementById('player-name');
    const avatarOptions = document.querySelectorAll('.avatar-option');
    const saveProfileBtn = document.getElementById('save-profile');
    
    // Nome
    nameInput.value = currentConfig.profile.name;
    nameInput.addEventListener('input', (e) => {
        currentConfig.profile.name = e.target.value.toUpperCase() || 'JOGADOR';
    });
    
    // Avatar
    avatarOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.avatar === currentConfig.profile.avatar) {
            option.classList.add('active');
        }
        
        option.addEventListener('click', () => {
            avatarOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            currentConfig.profile.avatar = option.dataset.avatar;
            updateAvatar();
        });
    });
    
    // Botão salvar
    saveProfileBtn.addEventListener('click', () => {
        saveConfig();
        updateMenuProfile();
        showStatus('PERFIL SALVO!', '👤');
    });
}

/**
 * Atualiza avatar
 */
function updateAvatar() {
    console.log(`👤 Avatar alterado para: ${currentConfig.profile.avatar}`);
}

/**
 * Atualiza perfil no menu
 */
function updateMenuProfile() {
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    
    if (userAvatar) userAvatar.textContent = currentConfig.profile.avatar;
    if (userName) userName.textContent = currentConfig.profile.name;
}

// ==================== BOTÕES DE AÇÃO ====================

/**
 * Configura botões de ação
 */
function setupActionButtons() {
    const resetBtn = document.getElementById('reset-settings');
    const saveAllBtn = document.getElementById('save-all');
    const clearBtn = document.getElementById('clear-data');
    
    // Restaurar padrões
    resetBtn.addEventListener('click', resetToDefaults);
    
    // Salvar tudo
    saveAllBtn.addEventListener('click', () => {
        saveConfig();
        showStatus('TODAS CONFIGURAÇÕES SALVAS!', '💾');
    });
    
    // Limpar dados
    clearBtn.addEventListener('click', clearAllData);
}

/**
 * Restaura configurações padrão
 */
function resetToDefaults() {
    if (confirm('TEM CERTEZA QUE DESEJA RESTAURAR AS CONFIGURAÇÕES PADRÃO?')) {
        currentConfig = {...DEFAULT_CONFIG};
        updateUIFromConfig();
        saveConfig();
        showStatus('CONFIGURAÇÕES RESTAURADAS!', '🔄');
    }
}

/**
 * Limpa todos os dados
 */
function clearAllData() {
    if (confirm('TEM CERTEZA QUE DESEJA LIMPAR TODOS OS DADOS?\nISSO INCLUI:\n• CONFIGURAÇÕES\n• PONTUAÇÕES\n• PROGRESSO')) {
        // Limpa configurações
        localStorage.removeItem(CONFIG_KEY);
        
        // Limpa dados dos jogos
        const gameKeys = [
            'zookid_ranking',
            'zookid_maze_progress',
            'zookid_maze_current_level',
            'memory_scores',
            'quiz_scores',
            'count_scores',
            'snake_scores'
        ];
        
        gameKeys.forEach(key => localStorage.removeItem(key));
        
        // Recarrega página
        location.reload();
    }
}

// ==================== ATUALIZAÇÃO DA INTERFACE ====================

/**
 * Atualiza UI a partir das configurações
 */
function updateUIFromConfig() {
    // Áudio
    document.getElementById('sound-toggle').checked = currentConfig.audio.enabled;
    document.getElementById('effects-volume').value = currentConfig.audio.effectsVolume;
    document.getElementById('effects-value').textContent = `${currentConfig.audio.effectsVolume}%`;
    document.getElementById('music-volume').value = currentConfig.audio.musicVolume;
    document.getElementById('music-value').textContent = `${currentConfig.audio.musicVolume}%`;
    
    // Visual
    document.getElementById('darkmode-toggle').checked = currentConfig.visual.darkMode;
    document.getElementById('animations-toggle').checked = currentConfig.visual.animations;
    
    // Jogo
    document.getElementById('difficulty-select').value = currentConfig.game.difficulty;
    document.getElementById('vibration-toggle').checked = currentConfig.game.vibration;
    document.getElementById('time-select').value = currentConfig.game.timeLimit;
    
    // Perfil
    document.getElementById('player-name').value = currentConfig.profile.name;
    
    // Atualiza visualmente
    updateVisualSettings();
    updateAudioState();
    updateGameDifficulty();
    updateVibrationState();
}

// ==================== UTILITÁRIOS ====================

/**
 * Mostra mensagem de status
 */
function showStatus(message, emoji = '💾') {
    const statusEl = document.getElementById('status-message');
    const iconEl = statusEl.querySelector('.status-icon');
    const textEl = statusEl.querySelector('.status-text');
    
    iconEl.textContent = emoji;
    textEl.textContent = message;
    
    statusEl.classList.add('show');
    
    setTimeout(() => {
        statusEl.classList.remove('show');
    }, 3000);
}

/**
 * Obtém configuração atual
 */
function getConfig() {
    return {...currentConfig};
}

/**
 * Define uma configuração específica
 */
function setConfig(key, value) {
    const keys = key.split('.');
    let obj = currentConfig;
    
    for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
    }
    
    obj[keys[keys.length - 1]] = value;
    updateUIFromConfig();
}

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', initSettings);

// Exporta funções para uso em outros jogos
window.ZooKidConfig = {
    getConfig,
    setConfig,
    saveConfig,
    resetToDefaults
};