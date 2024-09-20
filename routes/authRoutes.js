const express = require('express');
const router = express.Router();
const db = require('../config/bd');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Rota para registrar um novo usuário
router.post('/register', (req, res) => {
    const { email, password, phone, storeOrSale } = req.body;

    // Criptografar a senha antes de armazenar
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao criptografar a senha' });
        }

        const query = 'INSERT INTO pending_registrations (email, password, phone, storeOrSale) VALUES (?, ?, ?, ?)';
        db.query(query, [email, hashedPassword, phone, storeOrSale], (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Erro ao registrar o pedido' });
            }
            res.status(200).json({ success: true, message: 'Pedido de cadastro enviado com sucesso. Aguarde a aprovação do administrador.' });
        });
    });
});

// Rota para login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro ao autenticar' });

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Email ou senha incorretos' });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, match) => {
            if (err || !match) return res.status(401).json({ success: false, message: 'Email ou senha incorretos' });

            const token = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });

            res.json({
                success: true,
                token: token,
                role: user.role
            });
        });
    });
});

module.exports = router;
