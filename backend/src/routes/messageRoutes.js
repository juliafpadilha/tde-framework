const { Router } = require('express');
const pool = require('../db');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

// -----------------------------------------------
// GET /messages — Lista mensagens para consulta do time dev
// -----------------------------------------------
router.get('/messages', authMiddleware, async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        messages.id,
        messages.name,
        messages.email,
        messages.subject,
        messages.message,
        messages.user_id,
        messages.created_at,
        users.username AS created_by_username
       FROM messages
       LEFT JOIN users ON users.id = messages.user_id
       ORDER BY messages.created_at DESC`
    );

    return res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar mensagens:', err.message);
    return res.status(500).json({ error: 'Erro ao buscar mensagens.' });
  }
});

// -----------------------------------------------
// POST /messages — Salva mensagens enviadas ao time dev
// -----------------------------------------------
router.post('/messages', authMiddleware, async (req, res) => {
  try {
    const { nome, email, assunto, mensagem } = req.body;

    if (!nome || !email || !assunto || !mensagem) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const result = await pool.query(
      `INSERT INTO messages (name, email, subject, message, user_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, subject, message, user_id, created_at`,
      [
        nome.trim(),
        email.trim().toLowerCase(),
        assunto.trim(),
        mensagem.trim(),
        req.userId,
      ]
    );

    return res.status(201).json({
      message: 'Mensagem enviada com sucesso.',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Erro ao salvar mensagem:', err.message);
    return res.status(500).json({ error: 'Erro ao salvar mensagem.' });
  }
});

module.exports = router;
