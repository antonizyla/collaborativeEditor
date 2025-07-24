import type { Actions } from './$types';

export const actions = {
	register: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		console.log('Creating user with email: ' + email);
		if (cookies.getAll().length === 0) {
			//TODO CREATE A USER COOKIE IN THE BROWSER
		}

		// we have the user email
		// send the user an email with a 6 digit code
	}
} satisfies Actions;
