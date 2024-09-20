document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const searchInput = document.querySelector('#search-bar input');
    const searchButton = document.querySelector('#search-bar button');

    // Função para carregar produtos mais recentes
    const loadRecentProducts = async () => {
        try {
            const response = await fetch('/user/recent-products');
            if (!response.ok) throw new Error('Erro na requisição dos produtos recentes');
            const products = await response.json();
            productList.innerHTML = products.map(product => `
                <div class="product-item">
                    <img src="${product.imageUrl}" alt="${product.productName}" width="150">
                    <h3>${product.productName}</h3>
                    <p>Categoria: ${product.category}</p>
                    <p>Preço: ${product.price} mt</p>
                    <p>Localização: ${product.location || 'Não especificada'}</p>
                    <p>Número: ${product.phoneNumber || 'Não especificado'}</p>
                </div>
            `).join('');
        } catch (error) {
            console.error('Erro ao carregar produtos recentes:', error);
        }
    };

    // Função para pesquisar produtos
    const searchProducts = async () => {
        const query = searchInput.value.trim();
        
        if (!query) {
            alert('Por favor, insira um termo de pesquisa.');
            return;
        }

        try {
            const response = await fetch(`/user/search-products?query=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Erro na requisição de pesquisa');
            const products = await response.json();
            const filteredList = document.getElementById('filtered-list');
            filteredList.innerHTML = products.map(product => `
                <div class="product-item">
                    <img src="${product.imageUrl}" alt="${product.productName}" width="150">
                    <h3>${product.productName}</h3>
                    <p>Categoria: ${product.category}</p>
                    <p>Preço: ${product.price} mt</p>
                    <p>Localização: ${product.location || 'Não especificada'}</p>
                    <p>Número: ${product.phoneNumber || 'Não especificado'}</p>
                </div>
            `).join('');
        } catch (error) {
            console.error('Erro ao pesquisar produtos:', error);
        }
    };

    // Adiciona evento ao botão de pesquisa
    searchButton.addEventListener('click', searchProducts);

    // Carregar produtos mais recentes ao iniciar
    loadRecentProducts();
});














function toggleMenu() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('active');
}
