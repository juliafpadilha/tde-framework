-- =============================================
-- init.sql — Criação das tabelas e dados iniciais
-- Execute com: psql -U postgres -f init.sql
-- =============================================

-- Cria o banco de dados (ignorar se já existir)
-- CREATE DATABASE tde_etl;
-- \c tde_etl;

-- -----------------------------------------------
-- Tabela: users
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  username      VARCHAR(50)   NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  role          VARCHAR(50)   DEFAULT 'Data Engineer',
  created_at    TIMESTAMP     DEFAULT NOW()
);

-- -----------------------------------------------
-- Tabela: jobs
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS jobs (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  status      VARCHAR(20)   NOT NULL DEFAULT 'pendente',
  file_url    VARCHAR(500),
  user_id     INTEGER       REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMP     DEFAULT NOW()
);

-- -----------------------------------------------
-- Dados iniciais: Jobs de exemplo
-- (user_id NULL pois ainda não há usuários cadastrados)
-- -----------------------------------------------
INSERT INTO jobs (name, status, file_url) VALUES
  ('Extracao_API_Vendas',         'sucesso',   NULL),
  ('Carga_DWH_Fato_Vendas',      'sucesso',   NULL),
  ('Normalizacao_Dados_Clientes', 'erro',      NULL),
  ('Ingestao_Logs_Servidor',      'pendente',  NULL),
  ('Calculo_Metricas_Mensais',    'sucesso',   NULL);
