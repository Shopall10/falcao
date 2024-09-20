const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const getPendingRegistrations = (req, res) => {
    userModel.getPendingRegistrations((err, data) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro ao obter registros pendentes' });
        res.json(data);
    });
};

const approveRegistration = (req, res) => {
    const { email, password, phone, storeOrSale } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios' });
    }

    // Criptografar a senha antes de armazenar
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Erro ao criptografar a senha:', err);
            return res.status(500).json({ success: false, message: 'Erro ao criptografar a senha' });
        }

        userModel.approveRegistration(email, hashedPassword, phone, storeOrSale, (err) => {
            if (err) return res.status(500).json({ success: false, message: 'Erro ao aprovar o registro' });
            res.json({ success: true });
        });
    });
};

const rejectRegistration = (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email é obrigatório' });
    }

    userModel.rejectRegistration(email, (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro ao rejeitar o registro' });
        res.json({ success: true });
    });
};

module.exports = {
    getPendingRegistrations,
    approveRegistration,
    rejectRegistration
};
