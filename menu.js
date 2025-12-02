document.addEventListener('DOMContentLoaded', () => {
    // 1. Seleciona o botão e o menu
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');

    if (hamburgerBtn && dropdownMenu) {
        // 2. Adiciona o ouvinte de evento (click)
        hamburgerBtn.addEventListener('click', (event) => {
            event.stopPropagation(); 
            
            // 3. Alterna a classe 'open' no menu para deslizar
            dropdownMenu.classList.toggle('open');
            
            // 4. Alterna a classe 'active' no botão para animar as barras para um 'X'
            hamburgerBtn.classList.toggle('active');
        });

        // 5. Opcional: Fechar o menu se o usuário clicar fora dele
        document.addEventListener('click', (event) => {
            const isClickInsideMenu = dropdownMenu.contains(event.target);
            const isClickOnButton = hamburgerBtn.contains(event.target);
            
            if (dropdownMenu.classList.contains('open') && !isClickInsideMenu && !isClickOnButton) {
                dropdownMenu.classList.remove('open');
                hamburgerBtn.classList.remove('active');
            }
        });
    }
});