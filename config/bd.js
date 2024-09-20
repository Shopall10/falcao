const mysql = require('mysql2');

// Configuração da conexão com o banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'carlos10',
    database: 'shopall'
});

// Conectar ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        process.exit(1); // Encerra o processo em caso de erro de conexão
    }
    console.log('Conectado ao banco de dados MySQL');
});

process.on('SIGINT', () => {
    db.end((err) => {
        if (err) {
            console.error('Erro ao encerrar a conexão com o banco de dados:', err);
        }
        console.log('Conexão com o banco de dados encerrada');
        process.exit(0);
    });
});

module.exports = db;
