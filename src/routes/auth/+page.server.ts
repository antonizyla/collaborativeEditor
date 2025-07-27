import { getUserById, verifyUser } from '$lib/server/users';
import type { RequestEvent } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { verifyOTP, sendUserOTP } from '$lib/server/otp';
import { createSession, validateSessionToken } from '$lib/server/sessions';
import { jsonifySessionWithToken, sessionToJson } from '$lib/server/utils';

export async function load(event: RequestEvent) {
	const userId = event.cookies.get('userId');
	if (!userId) {
		redirect(307, '/signup');
	}

	const currentUser = await getUserById(userId);
	if (!currentUser) {
		redirect(307, '/signup');
	}

	const token = event.cookies.get('token');
	if (token) {
		const revalidate = await validateSessionToken(JSON.parse(token['token']));
		redirect(307, '/editor');
	}
}

export const actions = {
	verifyEmail: async (event: RequestEvent) => {
		const userId = event.cookies.get('userId');
		if (!userId) {
			redirect(400, '/');
		}
		const user = await getUserById(userId);
		if (!user) {
			return;
		}

		const formData = await event.request.formData();
		const code = formData.get('OTP');

		if (!code || code.toString().length != 6) {
			return;
		}

		console.log('User Submitted Verification Request for Email: `' + user.email + '`');

		const verRes = verifyOTP(user.userId, code.toString());
		if (!verRes) {
			// resend a validation code;
			sendUserOTP(user.email, '123456');
			throw redirect(307, '/auth');
		}

		// now the otp code is correct we can issue a session token
		const token = await createSession(user.userId);

		// update the user verified status
		await verifyUser(user.userId);

		// saving what is the sessionId and token
		event.cookies.set('token', jsonifySessionWithToken(token), {
			path: '/'
		});
		event.cookies.set('userId', user.userId, {
			path: '/'
		});

		throw redirect(307, '/editor');
	}
};
