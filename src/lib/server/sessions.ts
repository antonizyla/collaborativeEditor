import { db } from './database';
import { generateSecureRandomString, hashSecret } from './utils';

export type UUID = string;

export interface Session {
    sessionId: UUID;
    userId: UUID;
    secretHash: Uint8Array;
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
    secretHash BYTEA NOT NULL,
    lastVerifiedAt INTEGER NOT NULL,
    createdAt INTEGER NOT NULL 
  );
`;
export async function createSession(userId: UUID): Promise<SessionWithToken> {
    const now = new Date();

    const sessionId = crypto.randomUUID();
    const secret = generateSecureRandomString();
    const secretHash = await hashSecret(secret);

    const token = sessionId + '.' + secret;

    const session: SessionWithToken = {
        sessionId,
        userId,
        secretHash,
        createdAt: now,
        lastVerifiedAt: now,
        token
    };

    await db.query(
        'INSERT INTO session (sessionId, userID, secretHash, lastVerifiedAt, createdAt) VALUES ($1, $2, $3, $4, $5)',
        [
            session.sessionId,
            userId,
            session.secretHash,
            Math.floor(session.createdAt.getTime() / 1000),
            Math.floor(session.createdAt.getTime() / 1000)
        ]
    );

    return session;
}

export async function validateSessionToken(token: string): Promise<Session | null> {
    const parts = token.split('.');
    if (parts.length != 2) {
        return null;
    }
    const providedSessionId = parts[0];
    const providedSecret = parts[1];

    const session = await getSession(providedSessionId);
    if (!session) {
        return null;
    }

    // compare the two element by element 
    const stored = session.secretHash;
    const provided = await hashSecret(providedSecret);
    if (stored.length !== provided.length) {
        return null;
    }
    for (let i = 0; i < stored.length; i++) {
        if (stored.at(i) !== provided.at(i)) {
            return null;
        }
    }

    // update the last verified if less than 120 mins ago
    const currentTime = new Date();
    if (session.lastVerifiedAt.getTime() <= currentTime.getTime() + 120 * 60 * 1000) {
        session.lastVerifiedAt = currentTime;
        await db.query('update session set lastVerifiedAt = $1 where sessionId = $2', [
            Math.floor(currentTime.getTime() / 1000),
            session.sessionId
        ]);
    }

    return session;
}

export async function getSession(id: string): Promise<Session | null> {
    const res = await db.query(
        'select sessionId, userId, secretHash, lastVerifiedAt, createdAt from session where sessionId=$1',
        [id]
    );
    if (res.rowCount != 1) {
        return null;
    }

    let sessionRow = res.rows[0];

    const session: Session = {
        sessionId: sessionRow['sessionid'],
        userId: sessionRow['userid'],
        secretHash: new Uint8Array(sessionRow['secrethash']),
        lastVerifiedAt: new Date(sessionRow['lastverifiedat'] * 1000),
        createdAt: new Date(sessionRow['createdat'] * 1000)
    }

    //check that session is not expired, 10 days time
    const currentTime = new Date();
    if (currentTime.getTime() - session.createdAt.getTime() >= 10 * 60 * 60 * 24 * 1000) {
        await deleteSession(id);
        return null;
    }

    return session;
}

async function deleteSession(sessionId: string): Promise<void> {
    await db.query('delete from session where id =$1', [sessionId]);
}
