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
      'SELECT id, name, status, file_url, user_id, created_at FROM jobs ORDER BY created_at DESC'
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar jobs:', err.message);
    return res.status(500).json({ error: 'Erro ao buscar jobs.' });
  }
});

// -----------------------------------------------
// POST /jobs — Cria um job com upload (protegida)
// -----------------------------------------------
router.post('/jobs', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { name, status } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'O nome do job é obrigatório.' });
    }

    // Caminho relativo do arquivo (se enviado)
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const jobStatus = status || 'pendente';
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
