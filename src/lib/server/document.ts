import type { file } from '$lib/storage.svelte';
import { db } from './database';
import { type UUID } from './sessions';

export interface Access {
	documentId: UUID;
	userId: UUID;
	editPermission: boolean;
}

const create = `
    CREATE TABLE DOCUMENTS (
        documentId UUID PRIMARY KEY NOT NULL,
        documentName TEXT NOT NULL,
				author UUID REFERENCES USERS(userId),
				content TEXT,
				createdAt INTEGER,
				editedAt INTEGER,
				deleted BOOLEAN
    );
`;

export async function createDocument(doc: file, userId: UUID): Promise<file | null> {
	const query = await db.query(
		`Insert into documents 
		 (documentid, documentname, author, content, createdat, editedat, deleted) 
		 values 
		 ($1, $2, $3, $4, $5, $6, $7) 
		 returning documentid`,
		[
			doc.identifier,
			doc.filename,
			userId,
			doc.content,
			Math.round(doc.created / 1000),
			Math.round(doc.edited / 1000),
			false
		]
	);
	if (query.rowCount !== 1) {
		return null;
	}
	return getDocument(query.rows[0]['documentid']);
}

export async function updateDocument(doc: file): Promise<file | null> {
	const update = await db.query(
		`update documents 
		 set content=$1, editedAt=$2, deleted=$3, documentname=$4 
		 where documentid = $5 returning documentid
			`,
		[doc.content, Math.round(doc.edited / 1000), doc.deleted, doc.filename, doc.identifier]
	);
	if (update.rowCount !== 0) {
		return null;
	}
	return await getDocument(doc.identifier);
}

export async function getDocument(documentId: UUID): Promise<file | null> {
	const query = await db.query(
		`select documentname, author, content, createdat, editedat, deleted from documents where documentid=$1`,
		[documentId]
	);
	if (query.rowCount !== 1) {
		return null;
	}
	const row = query.rows[0];
	const f: file = {
		identifier: documentId,
		filename: row['documentname'],
		author: row['author'],
		created: Number(row['createdat']) * 1000,
		content: row['content'],
		edited: Number(row['editedat']) * 1000,
		deleted: row['deleted']
	};
	return f ?? null;
}

export async function getAllDocuments(userID: UUID): Promise<file[] | null> {
	const query = await db.query(
		`
			select documentid, documentname, author, createdat, content, editedat, deleted from documents where author = $1 and deleted=false
		`,
		[userID]
	);
	return query.rows.map((row) => {
		const f: file = {
			identifier: row['documentid'],
			filename: row['documentname'],
			author: row['author'],
			created: Number(row['createdat']) * 1000,
			content: row['content'],
			edited: Number(row['editedat']) * 1000,
			deleted: row['deleted']
		};
		return f;
	});
}

// this should be batched however the project
// is too small to worry about
export async function updateDocuments(files: file[]): Promise<file[] | null> {
	let updated: file[] = [];
	for (let i = 0; i < files.length; i++) {
		const update = await updateDocument(files[i]);
		if (update) {
			updated.push(update);
		}
	}
	return updated;
}
