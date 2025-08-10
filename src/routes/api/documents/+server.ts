import { getAllDocuments, updateDocuments } from '$lib/server/document';
import { validateSessionToken } from '$lib/server/sessions';
import { error } from '@sveltejs/kit';

export async function GET(event) {
	const token = event.cookies.get('session');
	if (!token) {
		throw error(401, {
			message: 'Unauthorized'
		});
	}
	const { session, user } = await validateSessionToken(token);

	if (!user?.userId) {
		throw error(400, { message: 'Need userId in query params to get documents owned by the user' });
	}

	console.log(`[/api/documents ] (GET) from: ${user?.userId} on ${event.getClientAddress()}`);
	return new Response(JSON.stringify(await getAllDocuments(user.userId)), {
		status: 200,
		headers: {
			'Access-Control-Allow-Credentials': 'true',
			'Access-Control-Allow-Headers': 'Content-Type',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
		}
	});
}

export async function POST(event) {
	const token = event.cookies.get('session');
	console.log(token);
	if (!token) {
		throw error(401, {
			message: 'Unathorized'
		});
	}

	const { session, user } = await validateSessionToken(token);
	if (!user?.userId) {
		throw error(401, {
			message: 'Unathorized'
		});
	}

	let documents = (await event.request.json()) ?? {};

	if (Object.entries(documents) == Object.entries({}) || !documents) {
		throw error(400, { message: 'Invalid JSON provided to create a document with' });
	}

	const updated = await updateDocuments(documents);

	console.log(`[/api/documents ] (POST) from: ${user?.userId} on ${event.getClientAddress()}`);

	//create the doc and save to
	return new Response(JSON.stringify(updated), {
		status: 200,
		headers: {
			'Access-Control-Allow-Credentials': 'true',
			'Access-Control-Allow-Headers': 'Content-Type',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
		}
	});
}
