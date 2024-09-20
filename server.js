const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const adminRoutes = require('./routes/adminRoutes');
const db = require('./config/bd'); // Importando o banco de dados

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Serve arquivos estáticos da pasta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage });

// Rota para adicionar um novo produto
app.post('/add-product', upload.single('productImage'), (req, res) => {
    console.log('Dados recebidos:', req.body);
    console.log('Arquivo recebido:', req.file);

    const { productName, category, price, phoneNumber, location, vendedorId } = req.body;
    const productImage = req.file ? `/uploads/${req.file.filename}` : null;

    const query = `
        INSERT INTO products (productName, category, price, phoneNumber, location, imageUrl, vendedorId)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [productName, category, price, phoneNumber, location, productImage, vendedorId], (err, result) => {
        if (err) {
            console.error('Erro ao adicionar produto:', err);
            return res.status(500).json({ success: false, message: 'Erro ao adicionar produto' });
        }
        console.log('Produto adicionado com sucesso:', result);
        res.json({ success: true });
    });
});

// Rota para registro de usuários
app.post('/signup', (req, res) => {
    const { email, password, phone, storeOrSale } = req.body;

    const query = 'INSERT INTO pending_registrations (email, password, phone, storeOrSale) VALUES (?, ?, ?, ?)';
    db.query(query, [email, password, phone, storeOrSale], (err, results) => {
        if (err) {
            console.error('Erro ao registrar usuário:', err);
            return res.status(500).json({ success: false, message: 'Erro ao registrar usuário' });
        }
        console.log('Registro pendente inserido com sucesso:', results);
        return res.json({ success: true });
    });
});

// Endpoint para aprovação de um registro
app.post('/admin/approve-registration', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email é obrigatório' });
    }

    const insertQuery = `
        INSERT INTO users (email, password, phone, store_or_sale, is_approved) 
        SELECT email, password, phone, storeOrSale, TRUE 
        FROM pending_registrations 
        WHERE email = ?`;

    const deleteQuery = 'DELETE FROM pending_registrations WHERE email = ?';

    db.query(insertQuery, [email], (err, insertResults) => {
        if (err) {
            console.error('Erro ao aprovar registro:', err);
            return res.status(500).json({ success: false, message: 'Erro ao aprovar registro' });
        }

        if (insertResults.affectedRows === 0) {
            return res.status(400).json({ success: false, message: 'Nenhum registro encontrado para aprovar' });
        }

        db.query(deleteQuery, [email], (err, deleteResults) => {
            if (err) {
                console.error('Erro ao remover registro pendente:', err);
                return res.status(500).json({ success: false, message: 'Erro ao remover registro pendente' });
            }

            console.log('Registro aprovado e movido com sucesso:', insertResults);
            return res.json({ success: true });
        });
    });
});

// Rota para login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ? AND password = ? AND is_approved = TRUE';
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Erro ao fazer login:', err);
            return res.status(500).json({ success: false, message: 'Erro ao fazer login' });
        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Email ou senha inválidos, ou usuário não aprovado' });
        }

        const user = results[0]; // Pegando o usuário autenticado

        return res.json({
            success: true,
            message: 'Login bem-sucedido',
            userId: user.id, // Retorna o ID do usuário
        });
    });
});

// Rota para listar produtos de um vendedor específico
app.get('/products', (req, res) => {
    const { vendedorId } = req.query;

    const query = 'SELECT * FROM products WHERE vendedorId = ?';
    db.query(query, [vendedorId], (err, results) => {
        if (err) {
            console.error('Erro ao listar produtos:', err);
            return res.status(500).json({ success: false, message: 'Erro ao listar produtos' });
        }
        res.json(results);
    });
});

// Rota para excluir produto
app.delete('/delete-product/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM products WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Erro ao excluir produto:', err);
            return res.status(500).json({ success: false, message: 'Erro ao excluir produto' });
        }
        res.json({ success: true });
    });
});

// Endpoint para produtos mais recentes
app.get('/user/recent-products', (req, res) => {
    const query = 'SELECT * FROM products ORDER BY created_at DESC LIMIT 15'; // Ajuste conforme o esquema do seu banco de dados
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao carregar produtos recentes:', err);
            return res.status(500).json({ success: false, message: 'Erro ao carregar produtos recentes' });
        }
        res.json(results);
    });
});

// Endpoint para pesquisa de produtos
app.get('/user/search-products', (req, res) => {
    const query = req.query.query;
    const sql = `
        SELECT * FROM products
        WHERE productName LIKE ? OR category LIKE ?`;
    db.query(sql, [`%${query}%`, `%${query}%`], (err, results) => {
        if (err) {
            console.error('Erro ao pesquisar produtos:', err);
            return res.status(500).json({ success: false, message: 'Erro ao pesquisar produtos' });
        }
        res.json(results);
    });
});





// Endpoint para listar todos os produtos
app.get('/user/all-products', (req, res) => {
    const query = `
        SELECT productName, category, price, location, phoneNumber, imageUrl
        FROM products`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao carregar todos os produtos:', err);
            return res.status(500).json({ success: false, message: 'Erro ao carregar todos os produtos' });
        }
        res.json(results);
    });
});


















// Use as rotas de administração
app.use('/admin', adminRoutes);

// Configurar a porta do servidor
const PORT = process.env.PORT || 5009;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
