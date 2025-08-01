import { createDocument, getDocument } from '$lib/server/document';
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

	const documentId = event.url.searchParams.get('documentId');
	if (!documentId) {
		throw error(400, { message: 'Need documentId in query params' });
	}

	console.log(`[/api/document ] (GET) from: ${user?.userId} on ${event.getClientAddress()}`);
	return new Response(JSON.stringify(await getDocument(documentId)), {
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

	const document = (await event.request.json()) ?? {};

	if (Object.entries(document) == Object.entries({}) || !document) {
		throw error(400, { message: 'Invalid JSON provided to create a document with' });
	}

	const created = await createDocument(document, user.userId);
	if (!created) {
		throw error(503, { message: 'Error on backend' });
	}

	console.log(`[/api/document ] (POST) from: ${user?.userId} on ${event.getClientAddress()}`);
	//create the doc and save to
	return new Response(JSON.stringify(created), {
		status: 200,
		headers: {
			'Access-Control-Allow-Credentials': 'true',
			'Access-Control-Allow-Headers': 'Content-Type',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
		}
	});
}
