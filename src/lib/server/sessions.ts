import { db } from './database';
import { getUserById, type User } from './users';
import { hashSecret } from './utils';
import type { RequestEvent } from '@sveltejs/kit';

export type UUID = string;

export interface Session {
	sessionId: UUID;
	userId: UUID;
	secret: UUID;
	lastVerifiedAt: Date;
	createdAt: Date;
}

export interface SessionWithToken extends Session {
	token: string;
}

const create = `
  CREATE TABLE IF NOT EXISTS SESSION (
    sessionId UUID NOT NULL PRIMARY KEY,
    userId UUID NOT NULL REFERENCES USERS(userId),
    secret UUID NOT NULL,
    lastVerifiedAt INTEGER NOT NULL,
    createdAt INTEGER NOT NULL 
  );
`;

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set('session', token, {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		expires: expiresAt
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set('session', '', {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		maxAge: 0
	});
}

export async function createSession(userId: UUID): Promise<SessionWithToken | null> {
	let time = new Date().getTime();
	let res = null;
	try {
		time = Math.round(time / 1000);
		const query = await db.query(
			'Insert into session (sessionId, userId, secret, lastVerifiedAt, createdAt ) values (gen_random_uuid(), $1, gen_random_uuid(), $2, $3) returning *',
			[userId, time, time]
		);
		res = query.rows[0];
	} finally {
		if (res === null || res === undefined) {
			return null;
		}
	}

	const session: SessionWithToken = {
		sessionId: res['sessionid'],
		userId,
		secret: res['secret'],
		lastVerifiedAt: new Date(res['lastverifiedat'] * 1000),
		createdAt: new Date(res['createdat'] * 1000),
		token: `${res['sessionid']}.${Buffer.from(await hashSecret(res['sessionid'], res['secret'])).toString('base64')}`
	};

	console.log('token: ' + session.token);

	return session;
}

export async function validateSessionToken(
	token: string
): Promise<{ session: Session | null; user: User | null }> {
	// token=sessionId.signature
	const split = token.split('.');
	const sessionId = split.at(0);
	const signature = split.at(1);
	if (!signature || !sessionId) {
		return { session: null, user: null };
	}

	const session = await getSession(sessionId);
	if (!session) {
		return { session: null, user: null };
	}

	const expected = Buffer.from(await hashSecret(sessionId, session.secret)).toString('base64');
	// compare the hash and expected
	if (expected.length != signature.length) {
		return { session: null, user: null };
	}
	let same = true;
	for (let i = 0; i < expected.length; i++) {
		if (expected[i] !== signature[i]) {
			same = false;
		}
	}
	if (!same) {
		return { session: null, user: null };
	}


	// update the session in with current time
	const time = new Date();
	if (session.lastVerifiedAt.getTime() + 120 * 1000 * 60 >= time.getTime()) {
		await db.query('update session set lastVerifiedAt = $1 where sessionId = $2', [
			Math.round(time.getTime() / 1000),
			session.sessionId
		]);
	}

	const user = await getUserById(session.userId);
	if (!user) {
		return { session: null, user: null };
	}

	return { session: session, user: user };
}

export async function getSession(id: UUID): Promise<Session | null> {
	const query = await db.query('select * from session where sessionId = $1', [id]);
	if (query.rowCount !== 1) {
		return null;
	}

	const returned = query.rows[0];
	const session: Session = {
		sessionId: returned['sessionid'],
		userId: returned['userid'],
		secret: returned['secret'],
		lastVerifiedAt: new Date(returned['lastverifiedat'] * 1000),
		createdAt: new Date(returned['createdat'] * 1000)
	};

	return session;
}

async function deleteSession(sessionId: UUID): Promise<void> {
	await db.query('delete from session where sessionid =$1', [sessionId]);
}

async function invalidateSession(sessionId: UUID) {
	await deleteSession(sessionId);
}

async function invalidateUserSessions(sessionId: UUID, userId: UUID) {
	await db.query('delete from session where userid=$1 and sessionId=$2', [userId, sessionId]);
}

async function userIdFromSessionId(sessionId: UUID): Promise<User | null> {
	const res = await db.query('select userId from sessions where sessionId=$1', [sessionId]);
	if (res.rowCount !== 1) {
		return null;
	}
	return await getUserById(res.rows[0]['userid']);
}
