const db = require('../config/bd');

const addProduct = (product, callback) => {
    const { name, description, price, image, sellerId } = product;
    const sql = `
        INSERT INTO products (name, description, price, image, sellerId)
        VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [name, description, price, image, sellerId], callback);
};

const getSellerProducts = (sellerId, callback) => {
    const sql = 'SELECT * FROM products WHERE sellerId = ?';
    db.query(sql, [sellerId], callback);
};

module.exports = {
    addProduct,
    getSellerProducts
};
