import { Client, Pool } from 'pg';

const pool = new Pool({
  user: process.env.POSTGRES_USER || "your_username",
  password: process.env.POSTGRES_PASSWORD || "your_secure_password",
  database: process.env.POSTGRES_DB || "your_database",
  host: 'localhost',
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = pool;

export async function getConnection() {
  return db;
}

export async function closeDatabaseConnection() {
  await pool.end();
  console.log('Database connection pool closed');
}
