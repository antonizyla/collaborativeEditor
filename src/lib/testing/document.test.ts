import { createDocument } from '$lib/server/document';
import type { file } from '$lib/storage.svelte';
import { assert, expect, test } from 'vitest';

test('createDocument', async () => {
	const now = new Date();
	const f: file = {
		identifier: crypto.randomUUID(),
		filename: 'new-doc-name',
		author: 'john smith',
		created: now.getTime(),
		content: 'hello there this is content',
		edited: now.getTime(),
		deleted: false
	};
	const created = await createDocument(f);
	if (!created) {
		assert(false);
	}

	expect(f).toEqual(created);
});
