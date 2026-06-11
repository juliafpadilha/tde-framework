const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

const router = Router();
const SALT_ROUNDS = 10;

// -----------------------------------------------
// POST /register
// -----------------------------------------------
router.post('/register', async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    // Validações básicas
    if (!name || !email || !username || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    // Verifica se já existe
    const existing = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username.trim().toLowerCase(), email.trim().toLowerCase()]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Usuário ou e-mail já cadastrado.' });
    }

    // Hash da senha com bcrypt
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insere no banco
    const result = await pool.query(
      `INSERT INTO users (name, email, username, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, username, role, created_at`,
      [name.trim(), email.trim().toLowerCase(), username.trim().toLowerCase(), passwordHash]
    );

    const user = result.rows[0];
    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Erro no registro:', err.message);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// -----------------------------------------------
// POST /login
// -----------------------------------------------
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
    }

    // Busca o usuário pelo username
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    const user = result.rows[0];

    // Compara a senha com o hash armazenado
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Erro no login:', err.message);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

module.exports = router;
