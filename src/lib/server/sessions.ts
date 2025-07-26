import { db } from "./database";
import { generateSecureRandomString, hashSecret } from "./utils";

export type UUID = string;

export interface Session {
  sessionId: UUID;
  userId: UUID;
  secretHash: Uint8Array;
  lastVerifiedAt: Date;
  createdAt: Date;
}

export interface SessionWithToken extends Session {
  token: string
}

const create = `
  CREATE TABLE IF NOT EXISTS SESSION (
    sessionId UUID NOT NULL PRIMARY KEY,
    userId UUID NOT NULL REFERENCES USERS(userId),
    secretHash BYTEA NOT NULL,
    lastVerifiedAt INTEGER NOT NULL,
    createdAt INTEGER NOT NULL 
  );
`
export async function createSession(userId: UUID): Promise<SessionWithToken> {
  const now = new Date();

  const sessionId = crypto.randomUUID();
  const secret = generateSecureRandomString();
  const secretHash = await hashSecret(secret);

  const token = sessionId + "." + secret;

  const session: SessionWithToken = {
    sessionId,
    userId,
    secretHash,
    createdAt: now,
    lastVerifiedAt: now,
    token
  };

  await db.query("INSERT INTO session (sessionId, userID, secretHash, lastVerifiedAt, createdAt) VALUES ($1, $2, $3, $4, $5)", [
    session.sessionId,
    userId,
    session.secretHash,
    Math.floor(session.createdAt.getTime() / 1000),
    Math.floor(session.createdAt.getTime() / 1000)
  ]);

  return session;
}

export async function validateSessionToken(token: string): Promise<Session | null> {
  const parts = token.split(".");
  if (parts.length != 2) {
    return null;
  }
  const id = parts[0];
  const secret = parts[1];

  const session = await getSession(id);
  if (!session) {
    return null;
  }

  const secretHash = await hashSecret(secret);
  let same = true;
  for (let i = 0; i < secretHash.length; i++) {
    if (secretHash[i] != session.secretHash[i]) {
      same = false;
    }
  }
  if (!same) {
    return null;
  }

  // update the last verified, 120 mins
  const currentTime = new Date();
  if (currentTime.getTime() - session.lastVerifiedAt.getTime() >= 120 * 60 * 1000) {
    session.lastVerifiedAt = currentTime;
    await db.query("update session set lastVerifiedAt = $1 where sessionId = $2",
      [Math.floor(session.lastVerifiedAt.getTime() / 1000), id]
    )
  }

  return session;
}

export async function getSession(sessionId: string) {
  const res = await db.query("select sessionId, userId, secretHash, createdAt from session where sessionId=$1", [sessionId]);
  if (res.rowCount != 1) {
    return null;
  }
  const row = res.rows[0];
  const session: Session = {
    sessionId: row[0],
    userId: row[1],
    secretHash: row[2],
    lastVerifiedAt: new Date(row[3] * 1000),
    createdAt: new Date(row[4] * 1000)
  };
  //check that session is not expired, 10 days time
  const currentTime = new Date();
  if (currentTime.getTime() - session.createdAt.getTime() >= 10 * 60 * 60 * 24 * 1000) {
    await deleteSession(sessionId);
    return null
  }

  return session;
}

async function deleteSession(sessionId: string): Promise<void> {
  await db.query("delete from session where id =$1", [sessionId]);
}
