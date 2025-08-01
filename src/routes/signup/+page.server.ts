import { createAndSetOTP } from '$lib/server/otp';
import { createSession, setSessionTokenCookie, validateSessionToken } from '$lib/server/sessions';
import { createUser, getUserByEmail, getUserById, type User } from '$lib/server/users';
import { fail, redirect, type RequestEvent } from '@sveltejs/kit';

export function load(event: RequestEvent) {
	const user = event.locals.user;
	const session = event.locals.session;

	if (!user) {
		return;
	}

	if (!user.verified) {
		throw redirect(307, '/auth');
	}
}

export const actions = {
	signup: async (event: RequestEvent) => {
		// extract the user's email that was submitted
		const formData = await event.request.formData();
		const email = formData.get('Email')?.toString();

		if (typeof email !== 'string' || email === '') {
			return fail(400, {
				message: 'Invalid email address provided',
				email: ''
			});
		}

		const user = await createUser(email);
		if (!user?.userId) {
			return fail(400, {
				message: 'Error Creating User Account',
				email: email
			});
		}

		const session = await createSession(user.userId);
		if (!session) {
			return fail(400, {
				message: 'Failed to create user session',
				email: email
			});
		}

		const time = new Date();
		const expires = new Date(time.getTime() + 1000 * 24 * 60);

		setSessionTokenCookie(event, session.token, expires);

		await createAndSetOTP(user.userId, 10);

		redirect(307, '/auth');
	}
};
