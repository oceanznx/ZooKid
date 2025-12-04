// ranking.js - Sistema de ranking global

const RANKING_KEY = 'zookid_ranking';

// Função para salvar pontuação
function saveScore(gameName, playerName, score) {
    const ranking = getRanking();
    const newEntry = {
        game: gameName,
        player: playerName || 'Jogador Anônimo',
        score: score,
        date: new Date().toLocaleDateString('pt-BR'),
        timestamp: Date.now()
    };
    
    ranking.push(newEntry);
    // Mantém apenas os 20 melhores scores
    ranking.sort((a, b) => b.score - a.score);
    const top20 = ranking.slice(0, 20);
    
    localStorage.setItem(RANKING_KEY, JSON.stringify(top20));
    return newEntry;
}

// Função para obter ranking
function getRanking() {
    const stored = localStorage.getItem(RANKING_KEY);
    return stored ? JSON.parse(stored) : [];
}

// Função para obter ranking por jogo específico
function getGameRanking(gameName) {
    const ranking = getRanking();
    return ranking.filter(entry => entry.game === gameName)
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 10);
}

// Função para mostrar ranking na tela
function displayRanking(containerId, gameFilter = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const ranking = gameFilter ? getGameRanking(gameFilter) : getRanking();
    
    if (ranking.length === 0) {
        container.innerHTML = '<p>🎮 Nenhuma pontuação ainda. Seja o primeiro!</p>';
        return;
    }
    
    let html = '<div class="ranking-table">';
    html += '<div class="ranking-header">';
    html += '<div>POSIÇÃO</div><div>JOGADOR</div><div>JOGO</div><div>PONTUAÇÃO</div><div>DATA</div>';
    html += '</div>';
    
    ranking.forEach((entry, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        html += `
            <div class="ranking-row ${index < 3 ? 'top-three' : ''}">
                <div>${medal}</div>
                <div>${entry.player}</div>
                <div>${getGameIcon(entry.game)} ${entry.game}</div>
                <div>${entry.score} pts</div>
                <div>${entry.date}</div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Ícones para cada jogo
function getGameIcon(gameName) {
    const icons = {
        'Quiz dos Sons': '🔊',
        'Cobrinha': '🐍',
        'Contagem Animal': '🧮',
        'Memória Animal': '🧩'
    };
    return icons[gameName] || '🎮';
}

// Para salvar ao final de cada jogo, adicione ao final do seu jogo:
function finalizarJogoComRanking(gameName, score) {
    const playerName = prompt('🎉 Parabéns! Digite seu nome para o ranking:') || 'Jogador';
    saveScore(gameName, playerName, score);
    alert(`Pontuação salva no ranking! Você ficou em ${getRanking().findIndex(e => e.game === gameName && e.score === score) + 1}º lugar!`);
}

