const express = require('express');
const router = express.Router();
const db = require('../config/bd');
const bcrypt = require('bcrypt');

// Dados estáticos para exemplo (substituir por uma base de dados no futuro)
const adminUsername = '231141582';
const adminPassword = 'carlos@123'; // Use hashing para a senha do admin também

// Rota para login do administrador
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === adminUsername && password === adminPassword) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Rota para listar registros pendentes
router.get('/pending-registrations', (req, res) => {
    const query = 'SELECT * FROM pending_registrations';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar registros pendentes:', err);
            return res.status(500).json({ error: 'Erro ao buscar registros pendentes' });
        }
        res.json(results);
    });
});

// Rota para aprovar usuários
router.post('/approve-registration', (req, res) => {
    const { email, password, phone, storeOrSale } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email é obrigatório' });
    }

    // Criptografar a senha antes de armazenar
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Erro ao criptografar a senha:', err);
            return res.status(500).json({ success: false, message: 'Erro ao criptografar a senha' });
        }

        const approveUserQuery = `
            INSERT INTO users (email, password, phone, store_or_sale, is_approved)
            SELECT ?, ?, ?, ?, TRUE
            FROM pending_registrations
            WHERE email = ?`;

        const deletePendingQuery = 'DELETE FROM pending_registrations WHERE email = ?';

        db.beginTransaction((err) => {
            if (err) {
                console.error('Erro ao iniciar transação:', err);
                return res.status(500).json({ success: false, message: 'Erro ao iniciar transação' });
            }

            db.query(approveUserQuery, [email, hashedPassword, phone, storeOrSale, email], (err, results) => {
                if (err) {
                    return db.rollback(() => {
                        console.error('Erro ao aprovar usuário:', err);
                        res.status(500).json({ success: false, message: 'Erro ao aprovar usuário' });
                    });
                }

                db.query(deletePendingQuery, [email], (err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Erro ao remover registro pendente:', err);
                            res.status(500).json({ success: false, message: 'Erro ao remover registro pendente' });
                        });
                    }

                    db.commit((err) => {
                        if (err) {
                            return db.rollback(() => {
                                console.error('Erro ao confirmar transação:', err);
                                res.status(500).json({ success: false, message: 'Erro ao confirmar transação' });
                            });
                        }
                        res.status(200).json({ success: true });
                    });
                });
            });
        });
    });
});

// Rota para rejeitar usuários
router.delete('/delete-registration', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email é obrigatório' });
    }

    const query = 'DELETE FROM pending_registrations WHERE email = ?';
    db.query(query, [email], (err) => {
        if (err) {
            console.error('Erro ao rejeitar usuário:', err);
            return res.status(500).json({ success: false, message: 'Erro ao rejeitar usuário' });
        }
        res.status(200).json({ success: true });
    });
});

// Rota para listar todos os usuários aprovados
router.get('/approved-users', (req, res) => {
    const query = 'SELECT * FROM users WHERE is_approved = TRUE';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuários aprovados:', err);
            return res.status(500).json({ error: 'Erro ao buscar usuários aprovados' });
        }
        res.json(results);
    });
});

// Rota para excluir um usuário aprovado
router.delete('/delete-user', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email é obrigatório' });
    }

    const query = 'DELETE FROM users WHERE email = ?';
    db.query(query, [email], (err) => {
        if (err) {
            console.error('Erro ao excluir usuário:', err);
            return res.status(500).json({ success: false, message: 'Erro ao excluir usuário' });
        }
        res.status(200).json({ success: true });
    });
});

module.exports = router;
