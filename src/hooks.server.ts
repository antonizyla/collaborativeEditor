import { validateSessionToken } from '$lib/server/sessions';
import type { Handle } from '@sveltejs/kit';
import { setSessionTokenCookie, deleteSessionTokenCookie } from '$lib/server/sessions';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session') ?? null;
	if (!token) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}
	const { session, user } = await validateSessionToken(token);
	if (session !== null) {
		const time = new Date(session.lastVerifiedAt.getTime() + 24 * 60 * 1000);
		// don't allow a session over 120 mins to be live
		setSessionTokenCookie(event, token, time);
	} else {
		deleteSessionTokenCookie(event);
	}

	event.locals.session = session;
	event.locals.user = user;

	return resolve(event);
};
