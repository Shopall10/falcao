document.addEventListener('DOMContentLoaded', () => {
    const addProductForm = document.getElementById('add-product-form');
    const productList = document.getElementById('product-list');
    const sellerNumber = document.getElementById('sellerNumber').value;

    // Função para carregar produtos
    const loadProducts = async () => {
        try {
            const response = await fetch(`/user/products?sellerNumber=${sellerNumber}`);
            const products = await response.json();
            productList.innerHTML = products.map(product => `
                <li>
                    <img src="${product.image_path}" alt="${product.name}" width="100">
                    <p>Nome: ${product.name}</p>
                    <p>Categoria: ${product.category}</p>
                    <p>Preço: ${product.price}</p>
                    <p>Localização: ${product.location}</p>
                    <button onclick="editProduct(${product.id})">Editar</button>
                    <button onclick="deleteProduct(${product.id})">Excluir</button>
                </li>
            `).join('');
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        }
    };

    // Adicionar um novo produto
    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(addProductForm);
        const imageFile = formData.get('image');
        const name = formData.get('name');
        const category = formData.get('category');
        const price = formData.get('price');
        const location = formData.get('location');
        const sellerNumber = formData.get('sellerNumber');

        const imageResponse = await fetch('/upload', { // Endpoint para upload de imagem
            method: 'POST',
            body: imageFile
        });

        const { imagePath } = await imageResponse.json();

        const productData = {
            name,
            category,
            price,
            location,
            sellerNumber,
            imagePath
        };

        try {
            const response = await fetch('/user/product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            const data = await response.json();

            if (data.success) {
                alert('Produto adicionado com sucesso!');
                addProductForm.reset();
                loadProducts();
            } else {
                alert('Erro ao adicionar produto: ' + data.message);
            }
        } catch (error) {
            alert('Erro ao adicionar produto: ' + error.message);
        }
    });

    // Função para editar um produto
    window.editProduct = (productId) => {
        // Implementar lógica para editar o produto
    };

    // Função para excluir um produto
    window.deleteProduct = async (productId) => {
        if (confirm('Tem certeza de que deseja excluir este produto?')) {
            try {
                const response = await fetch(`/user/product/${productId}`, {
                    method: 'DELETE'
                });
                const data = await response.json();
                if (data.success) {
                    alert('Produto excluído com sucesso!');
                    loadProducts();
                } else {
                    alert('Erro ao excluir produto: ' + data.message);
                }
            } catch (error) {
                alert('Erro ao excluir produto: ' + error.message);
            }
        }
    };

    // Carregar produtos ao inicializar a página
    loadProducts();
});
