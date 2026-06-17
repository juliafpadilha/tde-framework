const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('../db');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

// -----------------------------------------------
// Configuração do Multer
// -----------------------------------------------
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: (_req, file, cb) => {
    // Prefixo timestamp para evitar colisão de nomes
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// -----------------------------------------------
// GET /jobs — Lista todos os jobs (protegida)
// -----------------------------------------------
router.get('/jobs', authMiddleware, async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        jobs.id,
        jobs.name,
        jobs.status,
        jobs.file_url,
        jobs.user_id,
        jobs.created_at,
        users.name AS created_by_name,
        users.username AS created_by_username
       FROM jobs
       LEFT JOIN users ON users.id = jobs.user_id
       ORDER BY jobs.created_at DESC`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar jobs:', err.message);
    return res.status(500).json({ error: 'Erro ao buscar jobs.' });
  }
});

// -----------------------------------------------
// PUT /jobs/:id — Edita nome e arquivo do job
// -----------------------------------------------
router.put('/jobs/:id', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'O nome do job é obrigatório.' });
    }

    const current = await pool.query('SELECT file_url FROM jobs WHERE id = $1', [id]);
    if (current.rows.length === 0) {
      return res.status(404).json({ error: 'Job não encontrado.' });
    }

    const fileUrl = req.file ? `/uploads/${req.file.filename}` : current.rows[0].file_url;

    const result = await pool.query(
      `UPDATE jobs
       SET name = $1, file_url = $2
       WHERE id = $3
       RETURNING id, name, status, file_url, user_id, created_at`,
      [name.trim(), fileUrl, id]
    );

    return res.json({
      message: 'Job atualizado com sucesso.',
      job: result.rows[0],
    });
  } catch (err) {
    console.error('Erro ao atualizar job:', err.message);
    return res.status(500).json({ error: 'Erro ao atualizar job.' });
  }
});

// -----------------------------------------------
// POST /jobs/:id/run — Ativa o job e sorteia sucesso/erro
// -----------------------------------------------
router.post('/jobs/:id/run', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const nextStatus = Math.random() >= 0.35 ? 'sucesso' : 'erro';

    const result = await pool.query(
      `UPDATE jobs
       SET status = $1
       WHERE id = $2
       RETURNING id, name, status, file_url, user_id, created_at`,
      [nextStatus, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job não encontrado.' });
    }

    return res.json({
      message: nextStatus === 'sucesso'
        ? 'Job executado com sucesso.'
        : 'Job executado, mas falhou.',
      job: result.rows[0],
    });
  } catch (err) {
    console.error('Erro ao executar job:', err.message);
    return res.status(500).json({ error: 'Erro ao executar job.' });
  }
});

// -----------------------------------------------
// POST /jobs — Cria um job com upload (protegida)
// -----------------------------------------------
router.post('/jobs', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'O nome do job é obrigatório.' });
    }

    // Caminho relativo do arquivo (se enviado)
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const jobStatus = 'pendente';
    const userId = req.userId; // Vem do middleware JWT

    const result = await pool.query(
      `INSERT INTO jobs (name, status, file_url, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, status, file_url, user_id, created_at`,
      [name.trim(), jobStatus, fileUrl, userId]
    );

    const job = result.rows[0];
    return res.status(201).json({
      message: 'Job criado com sucesso.',
      job,
    });
  } catch (err) {
    console.error('Erro ao criar job:', err.message);
    return res.status(500).json({ error: 'Erro ao criar job.' });
  }
});

module.exports = router;
