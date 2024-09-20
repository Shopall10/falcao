const Product = require('../models/productModel');

exports.addProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const sellerId = req.user.id;  // Presumindo que o middleware de autenticação atribui o usuário logado

        // Se houver upload de imagem
        const image = req.file ? req.file.filename : null;

        const newProduct = {
            name,
            description,
            price,
            image,
            sellerId
        };

        await Product.addProduct(newProduct);
        res.status(201).json({ message: 'Produto adicionado com sucesso', product: newProduct });
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        res.status(500).json({ error: 'Erro ao adicionar produto' });
    }
};

exports.getSellerProducts = async (req, res) => {
    try {
        const sellerId = req.user.id;  // Pega o ID do vendedor logado
        const products = await Product.getSellerProducts(sellerId);

        res.status(200).json(products);
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        res.status(500).json({ error: 'Erro ao listar produtos' });
    }
};
