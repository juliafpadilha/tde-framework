const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
});

// Teste de conexão ao iniciar
pool.query('SELECT NOW()')
  .then(() => console.log('✅ Conectado ao PostgreSQL'))
  .catch((err) => console.error('❌ Erro ao conectar ao PostgreSQL:', err.message));

module.exports = pool;
