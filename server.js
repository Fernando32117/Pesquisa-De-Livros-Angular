require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');

const app = express();
app.use(express.json());
app.use(cors());

// Conexão com PostgreSQL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'postgres'
});

// Teste de conexão
sequelize.authenticate()
    .then(() => console.log('Conectado ao PostgreSQL com sucesso!'))
    .catch(err => console.error('Erro ao conectar:', err));

// Rota de teste
app.get('/', (req, res) => {
    res.send('API está rodando...');
});

// Servidor rodando na porta 3000
app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
