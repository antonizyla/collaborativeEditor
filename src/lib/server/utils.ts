import type {Session} from "./sessions"

export function generateSecureRandomString(): string {
	// Human readable alphabet (a-z, 0-9 without l, o, 0, 1 to avoid confusion)
	const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";

	// Generate 24 bytes = 192 bits of entropy.
	// We're only going to use 5 bits per byte so the total entropy will be 192 * 5 / 8 = 120 bits
	const bytes = new Uint8Array(24);
	crypto.getRandomValues(bytes);

	let id = "";
	for (let i = 0; i < bytes.length; i++) {
		// >> 3 "removes" the right-most 3 bits of the byte
		id += alphabet[bytes[i] >> 3];
	}
	return id;
}

export async function hashSecret(secret: string): Promise<Uint8Array> {
	const secretBytes = new TextEncoder().encode(secret);
	const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
	return new Uint8Array(secretHashBuffer);
}

export function sessionToJson(session: Session){
  const json = JSON.stringify({
    sessionId: session.sessionId,
    createdAt: Math.floor(session.createdAt.getTime() / 1000)
  })
  return json;
}