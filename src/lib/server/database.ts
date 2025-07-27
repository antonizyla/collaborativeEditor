import { Client, Pool } from 'pg';

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

export const db = pool;

export async function getConnection() {
    return db;
}

export async function closeDatabaseConnection() {
    await pool.end();
    console.log('Database connection pool closed');
}
