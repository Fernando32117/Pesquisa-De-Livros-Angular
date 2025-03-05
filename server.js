import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';
import { hash, compare } from 'bcryptjs';
import User from './backend/models/User.mjs';

const app = express();
app.use(json());
app.use(cors());

// Configuração do CORS
app.use(cors({
  origin: 'http://localhost:4200',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

// 📌 Rota de teste
app.get('/', (_req, res) => {
  res.send('API está rodando...');
});

// 📌 Rota de registro de usuário
app.post('/register', async (req, res) => {
  console.log('Recebendo dados para registro:', req.body);
  const { username, email, password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'A senha é obrigatória!' });
  }

  try {
    const hashedPassword = await hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    console.log('Usuário criado:', user);
    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(400).json({ error: 'Erro ao registrar usuário' });
  }
});

// 📌 Rota para listar usuários
app.get('/listar-usuarios', async (_req, res) => {
  try {
    const usuarios = await User.findAll();
    console.log('Usuários cadastrados no banco:', usuarios);
    res.json(usuarios);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ erro: 'Erro ao buscar usuários' });
  }
});

// 📌 Rota de login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    res.json({ message: 'Login bem-sucedido', username: user.username });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao processar login' });
  }
});

// OUVIR A PORTA NO FINAL DO ARQUIVO
app.listen(3000, () => console.log('🚀 Servidor rodando na porta 3000'));
