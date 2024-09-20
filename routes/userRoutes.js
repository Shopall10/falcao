const express = require('express');
const router = express.Router();
const productModel = require('../models/productModel');
const multer = require('multer');

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Adicionar um novo produto
router.post('/product', upload.single('productImage'), (req, res) => {
    const { productName, category, price, phoneNumber, location } = req.body;
    const productImage = req.file ? `/uploads/${req.file.filename}` : null;

    const query = `
        INSERT INTO products (productName, category, price, phoneNumber, location, imageUrl)
        VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(query, [productName, category, price, phoneNumber, location, productImage], (err, result) => {
        if (err) {
            console.error('Erro ao adicionar produto:', err);
            return res.status(500).json({ success: false, message: 'Erro ao adicionar produto' });
        }
        res.status(200).json({ success: true });
    });
});

// Obter todos os produtos de um vendedor
router.get('/products', (req, res) => {
    const sellerNumber = req.query.sellerNumber;

    const query = 'SELECT * FROM products WHERE sellerNumber = ?';
    db.query(query, [sellerNumber], (err, products) => {
        if (err) {
            console.error('Erro ao obter produtos:', err);
            return res.status(500).json({ success: false, message: 'Erro ao obter produtos' });
        }
        res.json(products);
    });
});

// Atualizar um produto
router.put('/product/:id', (req, res) => {
    const productId = req.params.id;
    const product = req.body;
    productModel.updateProduct(productId, product, (err, result) => {
        if (err) {
            console.error('Erro ao atualizar produto:', err);
            return res.status(500).json({ success: false, message: 'Erro ao atualizar produto' });
        }
        res.status(200).json({ success: true });
    });
});

// Excluir um produto
router.delete('/product/:id', (req, res) => {
    const productId = req.params.id;
    productModel.deleteProduct(productId, (err, result) => {
        if (err) {
            console.error('Erro ao excluir produto:', err);
            return res.status(500).json({ success: false, message: 'Erro ao excluir produto' });
        }
        res.status(200).json({ success: true });
    });
});

module.exports = router;
