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

	const data = await event.fetch(`/api/documents`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include'
	});
	if (data.status != 200) {
		alert('Error communicating with server');
	}
	const files = await data.json();
	return Object.fromEntries(files.map((file) => [file.identifier, file]));
}
