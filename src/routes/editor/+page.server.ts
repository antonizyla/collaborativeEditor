import { json, type RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { getUserById } from '$lib/server/users';
import { createAndSetOTP, sendUserOTP } from '$lib/server/otp';
import { validateSessionToken } from '$lib/server/sessions';

export async function load(event: RequestEvent) {
	const user: User | null = event.locals.user;
	const session: Session | null = event.locals.session;

	if (!user || !session) {
		throw redirect(307, '/signup');
	}
}
