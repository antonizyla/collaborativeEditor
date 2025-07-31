import { createSession, getSession } from '$lib/server/sessions';
import { createUser } from '$lib/server/users';
import { assert, expect, test } from 'vitest';

test('createSession', async () => {});

test('getSession', async () => {
	const user = await createUser('hello@randomdomain.com');
	if (!user) {
		assert(false);
	}
	let s = await createSession(user.userId);
	if (!s) {
		assert(false);
	}
	const re = await getSession(s.sessionId);
	if (!re) {
		assert(false);
	}
	// @ts-ignore
	delete s.token;
	expect(re).toEqual(s);
});

test('validateSession', async () => {});
