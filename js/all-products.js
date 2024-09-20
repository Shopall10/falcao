document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');

    // Função para carregar todos os produtos
    const loadAllProducts = async () => {
        try {
            const response = await fetch('/user/all-products');
            if (!response.ok) throw new Error('Erro na requisição de todos os produtos');
            const products = await response.json();
            productList.innerHTML = products.map(product => `
                <div class="product-item">
                    <img src="${product.imageUrl}" alt="${product.productName}" width="150">
                    <h3>${product.productName}</h3>
                    <p>Categoria: ${product.category}</p>
                    <p>Preço: $${product.price}</p>
                    <p>Localização: ${product.location || 'Não especificada'}</p>
                    <p>Número: ${product.phoneNumber || 'Não especificado'}</p>
                </div>
            `).join('');
        } catch (error) {
            console.error('Erro ao carregar todos os produtos:', error);
        }
    };

    // Carregar todos os produtos ao iniciar
    loadAllProducts();
});













function toggleMenu() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('active');
}
