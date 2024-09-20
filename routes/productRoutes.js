const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { upload } = require('..config/upload');  // Middleware para upload de imagens
const { protect } = require('../middleware/authMiddleware');  // Middleware de autenticação

// Adicionar produto
router.post('/add', protect, upload.single('image'), productController.addProduct);

// Listar produtos do vendedor
router.get('/my-products', protect, productController.getSellerProducts);

module.exports = router;
