const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// -----------------------------------------------
// Garante que a pasta uploads existe
// -----------------------------------------------
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// -----------------------------------------------
// Middlewares globais
// -----------------------------------------------
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(uploadsDir));

// -----------------------------------------------
// Rotas
// -----------------------------------------------
app.use(authRoutes);   // POST /register, POST /login
app.use(jobRoutes);    // GET /jobs, POST /jobs

// Rota raiz (health check)
app.get('/', (_req, res) => {
  res.json({ message: 'API ETL Dashboard — online ✅' });
});

// -----------------------------------------------
// Iniciar servidor
// -----------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
