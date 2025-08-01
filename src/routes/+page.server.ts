import { getUserById } from '$lib/server/users';
import type { RequestEvent } from '@sveltejs/kit';

export async function load(event: RequestEvent) {
	const user = event.locals.user;
	const session = event.locals.session;
}
