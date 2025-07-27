import { Client, Pool } from 'pg';
import "dotenv/config"

const pool = new Pool({
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	host: process.env.POSTGRES_HOST,
	port: process.env.POSTGRES_PORT,
});

export const db = pool;

export async function closeDatabaseConnection() {
	await pool.end();
	console.log('Database connection pool closed');
}
