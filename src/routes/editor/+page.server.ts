import { json, type RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { getUserById } from '$lib/server/users';
import { createAndSetOTP, sendUserOTP } from '$lib/server/otp';
import { validateSessionToken } from '$lib/server/sessions';

export async function load(event: RequestEvent) {
	const userId = event.cookies.get('userId');
	if (!userId) {
		console.log('redirecting to Signup');
		throw redirect(307, '/signup');
	}

	const user = await getUserById(userId);
	if (!user) {
		throw redirect(307, '/signup');
	}

	if (!user.verified) {
		await createAndSetOTP(user.userId, 10);
		throw redirect(307, '/auth');
	}

	// check the token that the user has
	const sessionToken = event.cookies.get('token');
	if (!sessionToken) {
		throw redirect(307, '/auth');
	}
    const parsed = JSON.parse(sessionToken);

    if (!validateSessionToken(parsed['sessionToken'])){
        console.log("could not validate session token")
    }

    console.log("valid session token updated")

}
