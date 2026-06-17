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
-- Tabela: messages
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(150)  NOT NULL,
  subject     VARCHAR(100)  NOT NULL,
  message     TEXT          NOT NULL,
  user_id     INTEGER       REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMP     DEFAULT NOW()
);

