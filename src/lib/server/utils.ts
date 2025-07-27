import type { Session, SessionWithToken } from './sessions';

export async function hashSecret(secret: string, toHash: string): Promise<Uint8Array> {
	const secretBytes = new TextEncoder().encode(secret + toHash);
	const secretHashBuffer = await crypto.subtle.digest('SHA-256', secretBytes);
	return new Uint8Array(secretHashBuffer);
}

export function sessionToJson(session: Session) {
	const json = JSON.stringify({
		sessionId: session.sessionId,
		sessionSecret: session.secret,
		createdAt: Math.floor(session.createdAt.getTime() / 1000)
	});
	return json;
}

export function jsonifySessionWithToken(session: SessionWithToken) {
	const json = JSON.stringify({
		sessionId: session.sessionId,
		sessionToken: session.token
	});
	return json;
}
