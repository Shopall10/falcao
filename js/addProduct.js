document.addEventListener('DOMContentLoaded', () => {
    const addProductForm = document.getElementById('addProductForm');
    const productList = document.getElementById('productList');
    const userId = localStorage.getItem('userId'); // Recupera o ID do vendedor

    if (!userId) {
        alert('Erro: Nenhum ID de vendedor encontrado. Faça login novamente.');
        return;
    }

    // Função para carregar os produtos do vendedor
    const loadProducts = async () => {
        try {
            const response = await fetch(`/products?vendedorId=${userId}`);
            const products = await response.json();

            if (Array.isArray(products)) {
                productList.innerHTML = ''; // Limpa a lista de produtos
                products.forEach(product => {
                    const productDiv = document.createElement('div');
                    productDiv.setAttribute('data-product-id', product.id); // Adiciona ID do produto como atributo
                    productDiv.innerHTML = `
                        <div contenteditable="true" data-field="productName">${product.productName}</div>
                        <div contenteditable="true" data-field="category">${product.category}</div>
                        <div contenteditable="true" data-field="price">${product.price}</div>
                        <div contenteditable="true" data-field="phoneNumber">${product.phoneNumber}</div>
                        <div contenteditable="true" data-field="location">${product.location}</div>
                        <img src="${product.imageUrl}" alt="${product.productName}" width="100">
                        <button onclick="saveProduct(${product.id})">Salvar</button>
                        <button onclick="deleteProduct(${product.id})">Excluir</button>
                    `;
                    productList.appendChild(productDiv);
                });
            } else {
                console.error('A resposta não é um array:', products);
            }
        } catch (error) {
            console.error('Erro ao carregar os produtos:', error);
        }
    };

    // Carregar produtos ao iniciar
    loadProducts();

    // Evento de envio do formulário para adicionar um novo produto
    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(addProductForm);
        formData.append('vendedorId', userId); // Adiciona o ID do vendedor

        try {
            const response = await fetch('/add-product', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (result.success) {
                alert('Produto adicionado com sucesso!');
                loadProducts(); // Recarrega a lista de produtos
            } else {
                alert('Erro ao adicionar produto: ' + result.message);
            }
        } catch (error) {
            alert('Erro ao adicionar produto: ' + error.message);
        }
    });
});

// Função para salvar as edições do produto
const saveProduct = async (productId) => {
    const productDiv = document.querySelector(`div[data-product-id='${productId}']`);
    const productName = productDiv.querySelector('div[data-field="productName"]').innerText;
    const category = productDiv.querySelector('div[data-field="category"]').innerText;
    const price = productDiv.querySelector('div[data-field="price"]').innerText;
    const phoneNumber = productDiv.querySelector('div[data-field="phoneNumber"]').innerText;
    const location = productDiv.querySelector('div[data-field="location"]').innerText;

    try {
        const response = await fetch(`/update-product/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productName,
                category,
                price,
                phoneNumber,
                location
            }),
        });

        const result = await response.json();
        if (result.success) {
            alert('Produto atualizado com sucesso!');
        } else {
            alert('Erro ao atualizar produto: ' + result.message);
        }
    } catch (error) {
        alert('Erro ao atualizar produto: ' + error.message);
    }
};

// Função para excluir produto
const deleteProduct = async (productId) => {
    try {
        const response = await fetch(`/delete-product/${productId}`, {
            method: 'DELETE',
        });

        const result = await response.json();
        if (result.success) {
            alert('Produto excluído com sucesso!');
            location.reload(); // Recarrega a página
        } else {
            alert('Erro ao excluir produto: ' + result.message);
        }
    } catch (error) {
        alert('Erro ao excluir produto: ' + error.message);
    }
};
