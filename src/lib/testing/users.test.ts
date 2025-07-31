import { createUser, deleteUser, getUserByEmail, getUserById, verifyUser } from '$lib/server/users';
import { assert, expect, test } from 'vitest';

test('createUser', async () => {
	const newUser = await createUser('randomemail@example.com');
	if (!newUser) {
		assert(false);
	}
	const returned = await getUserById(newUser?.userId);
	expect(returned).toEqual(newUser);
});

test('deleteUser', async () => {
	const newUser = await createUser('example@gmail.com');
	if (!newUser) {
		assert(false);
	}
	const fetched = await getUserById(newUser?.userId);
	if (!fetched) {
		assert(false);
	}
	await deleteUser(fetched?.userId);
	const fetchedAgain = await getUserById(fetched?.userId);
	assert(fetchedAgain === null);
});

test('verifyUser', async () => {
	const newUser = await createUser('randomemail@google.com');
	if (!newUser) {
		assert(false);
	}
	const verify = await verifyUser(newUser?.userId);
	assert(verify?.verified);
});

test('getUserById', async () => {
	const newUser = await createUser('newEmail@mail.com');
	if (!newUser) {
		assert(false);
	}
	const retrieved = await getUserById(newUser?.userId);
	expect(newUser).toEqual(retrieved);
});

test('getUserByEmail', async () => {
	const newUser = await createUser('newEmail@mail123.com');
	if (!newUser) {
		assert(false);
	}
	const retrieved = await getUserByEmail(newUser.email);
	expect(newUser).toEqual(retrieved);
});
