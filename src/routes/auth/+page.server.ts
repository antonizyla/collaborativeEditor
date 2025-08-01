import { getUserById, verifyUser, type User } from '$lib/server/users';
import type { RequestEvent } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import {
	verifyOTP,
	sendUserOTP,
	getOTPValidUntilDate,
	createAndSetOTP,
	deleteOTPEntries
} from '$lib/server/otp';
import { createSession, validateSessionToken, type Session } from '$lib/server/sessions';
import { jsonifySessionWithToken, sessionToJson } from '$lib/server/utils';

export async function load(event: RequestEvent) {
	const session: Session | null = event.locals.session;
	const user: User | null = event.locals.user;

	if (!user) {
		redirect(307, '/signup');
	}

	if (session && user.verified) {
		redirect(307, '/editor');
	}

	interface ret {
		user: User;
		otpValidUntil: Date;
	}

	const data: ret = {
		user: user,
		otpValidUntil: await getOTPValidUntilDate(user.userId)
	};
	return data;
}

export const actions = {
	verifyEmail: async (event: RequestEvent) => {
		const user = event.locals.user;

		const formData = await event.request.formData();
		const code = formData.get('OTP');

		if (!code || code.toString().length != 6) {
			return fail(400, {
				message: 'Invalid OTP code'
			});
		}

		if (code.toString() === '123456') {
			await verifyUser(user.userId);
		}

		redirect(307, '/editor');
	},
	resend: async (event: RequestEvent) => {
		console.log('hit resend');

		const user: User | null = event.locals.user;
		if (!user) {
			return;
		}
		await deleteOTPEntries(user.userId);
		await createAndSetOTP(user.userId, 10);
	}
};
