import { db } from './database';
import type { UUID } from './sessions';

export interface User {
	userId: UUID;
	email: string;
	verified: boolean;
}

const create = `
  CREATE TABLE USERS (
    userId UUID NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    verified BOOLEAN NOT NULL
  );
`;

export async function createUser(email: string): Promise<User | null> {
	if (await getUserByEmail(email)) {
		return null;
	}

	const res = await db.query(
		'Insert into USERS values (gen_random_uuid(), $1, False) returning *',
		[email]
	);

	if (res.rowCount != 1) {
		return null;
	}

	const user: User = {
		userId: res.rows[0]['userid'],
		email: res.rows[0]['email'],
		verified: res.rows[0]['verified']
	};
	return user;
}

export async function deleteUser(userId: UUID) {
	if (!(await getUserById(userId))) {
		return;
	}
	await db.query('delete from USERS where userId = $1', [userId]);
}

export async function verifyUser(userId: UUID): Promise<User | null> {
	if (!(await getUserById(userId))) {
		return null;
	}
	await db.query('update USERS set verified = True where userId = $1', [userId]);
	return await getUserById(userId);
}

export async function getUserById(userId: UUID): Promise<User | null> {
	const res = await db.query('select userId, email, verified from USERS where userId=$1', [userId]);
	if (res.rowCount != 1) {
		return null;
	}

	const user: User = {
		userId: res.rows[0]['userid'],
		email: res.rows[0]['email'],
		verified: res.rows[0]['verified']
	};
	return user;
}

export async function getUserByEmail(email: string): Promise<User | null> {
	const res = await db.query('select userId, email, verified from USERS where email=$1', [email]);
	if (res.rowCount != 1) {
		return null;
	}
	const user: User = {
		userId: res.rows[0][0],
		email: res.rows[0][1],
		verified: res.rows[0][2]
	};
	return user;
}
