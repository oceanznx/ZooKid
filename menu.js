document.addEventListener('DOMContentLoaded', () => {
    // 1. Seleciona elementos
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const menuCloseBtn = document.getElementById('menu-close-btn');

    // 2. Função para abrir/fechar menu
    function toggleMenu() {
        dropdownMenu.classList.toggle('open');
        hamburgerBtn.classList.toggle('active');
        
        // Previne scroll no body quando menu está aberto
        if (dropdownMenu.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    // 3. Evento no botão hamburger
    if (hamburgerBtn && dropdownMenu) {
        hamburgerBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleMenu();
        });
    }

    // 4. Evento no botão fechar
    if (menuCloseBtn) {
        menuCloseBtn.addEventListener('click', () => {
            toggleMenu();
        });
    }

    // 5. Fechar menu ao clicar fora
    document.addEventListener('click', (event) => {
        const isClickInsideMenu = dropdownMenu.contains(event.target);
        const isClickOnButton = hamburgerBtn.contains(event.target);
        
        if (dropdownMenu.classList.contains('open') && !isClickInsideMenu && !isClickOnButton) {
            toggleMenu();
        }
    });

    // 6. Fechar menu com ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && dropdownMenu.classList.contains('open')) {
            toggleMenu();
        }
    });

    // 7. Funcionalidade de busca (mantida do código anterior)
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    const gameCards = document.querySelectorAll('.game-card');

    if (searchInput && searchButton && gameCards.length > 0) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            performSearch();
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });

        function performSearch() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                gameCards.forEach(card => {
                    card.style.display = 'block';
                    card.style.animation = '';
                    card.style.backgroundColor = '';
                    card.style.padding = '0';
                });
                document.querySelectorAll('.category-header').forEach(header => {
                    header.style.display = 'block';
                });
                
                // Remove mensagem de "nenhum resultado"
                const noResults = document.querySelector('.no-results-message');
                if (noResults) noResults.remove();
                return;
            }

            let foundAny = false;
            
            gameCards.forEach(card => {
                const titleElement = card.querySelector('.game-title-overlay');
                const title = titleElement ? titleElement.textContent.toLowerCase() : '';
                const description = card.querySelector('.info p') ? 
                                  card.querySelector('.info p').textContent.toLowerCase() : '';
                const badges = card.querySelectorAll('.badge');
                let badgeText = '';
                badges.forEach(badge => {
                    badgeText += badge.textContent.toLowerCase() + ' ';
                });

                if (title.includes(searchTerm) || 
                    description.includes(searchTerm) || 
                    badgeText.includes(searchTerm)) {
                    card.style.display = 'block';
                    foundAny = true;
                    
                    card.style.animation = 'highlight 0.5s ease';
                    card.style.backgroundColor = 'rgba(243, 203, 43, 0.1)';
                    card.style.borderRadius = '20px';
                    card.style.padding = '10px';
                } else {
                    card.style.display = 'none';
                    card.style.animation = '';
                    card.style.backgroundColor = '';
                    card.style.padding = '0';
                }
            });

            document.querySelectorAll('.category-header').forEach(header => {
                header.style.display = foundAny ? 'none' : 'block';
            });

            if (!foundAny && searchTerm !== '') {
                showNoResultsMessage(searchTerm);
            } else {
                const noResults = document.querySelector('.no-results-message');
                if (noResults) noResults.remove();
            }
        }

        function showNoResultsMessage(searchTerm) {
            const existingMessage = document.querySelector('.no-results-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            const message = document.createElement('div');
            message.className = 'no-results-message';
            message.innerHTML = `
                <div style="text-align: center; padding: 2rem; background: rgba(46, 46, 46, 0.9); 
                     border-radius: 20px; margin: 2rem auto; max-width: 600px; border: 2px solid #f3cb2b;">
                    <h3 style="color: #f3cb2b; margin-bottom: 1rem;">🐾 Nenhum jogo encontrado!</h3>
                    <p style="color: white;">Não encontramos jogos para: <strong>"${searchTerm}"</strong></p>
                    <p style="color: white; margin-top: 1rem;">Tente buscar por: "memória", "quiz", "contagem" ou "snake"</p>
                    <button id="clear-search" style="margin-top: 1rem; padding: 0.5rem 1.5rem; 
                            background: #f3cb2b; border: none; border-radius: 20px; 
                            cursor: pointer; font-weight: bold;">
                        Limpar Busca
                    </button>
                </div>
            `;

            const gamesSection = document.querySelector('.games');
            if (gamesSection) {
                gamesSection.parentNode.insertBefore(message, gamesSection);
                
                document.getElementById('clear-search').addEventListener('click', function() {
                    searchInput.value = '';
                    performSearch();
                });
            }
        }
    }

    // 8. Botões de categoria - filtragem
    const categoriaBtns = document.querySelectorAll('.categoria-btn');
    
    categoriaBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove classe ativa de todos
            categoriaBtns.forEach(b => b.classList.remove('ativa'));
            
            // Adiciona classe ativa ao clicado
            this.classList.add('ativa');
            
            // Filtra os jogos
            const categoria = this.textContent.toLowerCase();
            filterGamesByCategory(categoria);
        });
    });

    function filterGamesByCategory(categoria) {
        gameCards.forEach(card => {
            const badges = card.querySelectorAll('.badge.tipo');
            let cardTypes = '';
            badges.forEach(badge => {
                cardTypes += badge.textContent.toLowerCase() + ' ';
            });

            if (categoria.includes('todos') || 
                (categoria.includes('memória') && cardTypes.includes('memória')) ||
                (categoria.includes('quiz') && cardTypes.includes('quiz')) ||
                (categoria.includes('educativo') && cardTypes.includes('educativo')) ||
                (categoria.includes('clássico') && cardTypes.includes('clássico'))) {
                card.style.display = 'block';
                card.style.animation = '';
                card.style.backgroundColor = '';
            } else {
                card.style.display = 'none';
            }
        });
    }
});

// Adicione ao final do menu.js, antes do fechamento do DOMContentLoaded

// 6. Funcionalidade de busca
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const gameCards = document.querySelectorAll('.game-card');

if (searchInput && searchButton && gameCards.length > 0) {
    searchButton.addEventListener('click', function(e) {
        e.preventDefault();
        performSearch();
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // Mostra todos os jogos se a busca estiver vazia
            gameCards.forEach(card => {
                card.style.display = 'block';
            });
            // Remove destaque de categoria se existir
            document.querySelectorAll('.category-header').forEach(header => {
                header.style.display = 'block';
            });
            return;
        }

        let foundAny = false;
        
        gameCards.forEach(card => {
            const titleElement = card.querySelector('.game-title-overlay') || 
                               card.querySelector('h3') || 
                               card.querySelector('.info h3');
            const title = titleElement ? titleElement.textContent.toLowerCase() : '';
            const description = card.querySelector('.info p') ? 
                              card.querySelector('.info p').textContent.toLowerCase() : '';
            const badges = card.querySelectorAll('.badge');
            let badgeText = '';
            badges.forEach(badge => {
                badgeText += badge.textContent.toLowerCase() + ' ';
            });

            // Verifica se o termo de busca está no título, descrição ou badges
            if (title.includes(searchTerm) || 
                description.includes(searchTerm) || 
                badgeText.includes(searchTerm)) {
                card.style.display = 'block';
                foundAny = true;
                
                // Adiciona efeito visual de destaque
                card.style.animation = 'highlight 0.5s ease';
                card.style.backgroundColor = 'rgba(243, 203, 43, 0.1)';
                card.style.borderRadius = '20px';
                card.style.padding = '10px';
            } else {
                card.style.display = 'none';
            }
        });

        // Esconde os cabeçalhos de categoria se estiver buscando
        document.querySelectorAll('.category-header').forEach(header => {
            header.style.display = foundAny ? 'none' : 'block';
        });

        // Feedback visual
        if (!foundAny && searchTerm !== '') {
            showNoResultsMessage(searchTerm);
        }
    }

    function showNoResultsMessage(searchTerm) {
        // Remove mensagem anterior se existir
        const existingMessage = document.querySelector('.no-results-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Cria nova mensagem
        const message = document.createElement('div');
        message.className = 'no-results-message';
        message.innerHTML = `
            <div style="text-align: center; padding: 2rem; background: rgba(46, 46, 46, 0.9); 
                 border-radius: 20px; margin: 2rem auto; max-width: 600px; border: 2px solid #f3cb2b;">
                <h3 style="color: #f3cb2b; margin-bottom: 1rem;">🐾 Nenhum jogo encontrado!</h3>
                <p style="color: white;">Não encontramos jogos para: <strong>"${searchTerm}"</strong></p>
                <p style="color: white; margin-top: 1rem;">Tente buscar por: "memória", "quiz", "contagem" ou "snake"</p>
                <button id="clear-search" style="margin-top: 1rem; padding: 0.5rem 1.5rem; 
                        background: #f3cb2b; border: none; border-radius: 20px; 
                        cursor: pointer; font-weight: bold;">
                    Limpar Busca
                </button>
            </div>
        `;

        // Insere antes dos jogos
        const gamesSection = document.querySelector('.games');
        if (gamesSection) {
            gamesSection.parentNode.insertBefore(message, gamesSection);
            
            // Adiciona evento ao botão de limpar
            document.getElementById('clear-search').addEventListener('click', function() {
                searchInput.value = '';
                performSearch();
                message.remove();
            });
        }
    }
}

// 7. Botão para limpar busca
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('clear-search-btn')) {
        searchInput.value = '';
        performSearch();
    }
});