import type { file } from '$lib/storage.svelte';
import { assert, expect, test } from 'vitest';
import { fileToAutomerge, mergeFiles } from '$lib/server/automerging';


test('testCreation', async () => {
  const now = new Date();
  const f:file = {
    identifier: crypto.randomUUID(),
    author: crypto.randomUUID(),
    content: "",
    deleted: false,
    edited: Math.round(now.getTime() /1000),
    created: Math.round(now.getTime() / 1000),
    filename: "Filename"
  };

  const doc = fileToAutomerge(f);
  assert(doc.created == Math.round(now.getTime()/1000))
});

test('testBasicMerge', () => {
    const now = new Date();
    const file1: file = {
        identifier: crypto.randomUUID(),
        author: crypto.randomUUID(),
        content: "Content from file 1",
        deleted: false,
        edited: Math.round(now.getTime() /1000),
        created: Math.round(now.getTime() / 1000),
        filename: "File1"
    };

    const file2: file = {
        identifier: file1.identifier,
        author: file1.author,
        content: "Content from file 2",
        deleted: false,
        edited: Math.round(now.getTime() /1000) + 100,  // Later edit
        created: Math.round(now.getTime() / 1000),
        filename: "File2"
    };

    const merged = mergeFiles(file1, file2);
    
    // Assert the merge took the most recent changes
    expect(merged.content).toBe("Content from file 2");
    expect(merged.edited).toBe(file2.edited);
    expect(merged.filename).toBe("File2");
});

test('testMergeWithDeletion', () => {
    const now = new Date();
    const file1: file = {
        identifier: crypto.randomUUID(),
        author: crypto.randomUUID(),
        content: "Original content",
        deleted: false,
        edited: Math.round(now.getTime() /1000),
        created: Math.round(now.getTime() / 1000),
        filename: "File1"
    };

    const file2: file = {
        ...file1,
        deleted: true,
        edited: Math.round(now.getTime() /1000) + 100
    };

    const merged = mergeFiles(file1, file2);
    
    // Assert the deletion was preserved
    expect(merged.deleted).toBe(true);
    expect(merged.edited).toBe(file2.edited);
});

test('testMergeSameTimestamp', () => {
    const now = new Date();
    const timestamp = Math.round(now.getTime() /1000);
    
    const file1: file = {
        identifier: crypto.randomUUID(),
        author: crypto.randomUUID(),
        content: "Content A",
        deleted: false,
        edited: timestamp,
        created: timestamp,
        filename: "File1"
    };

    const file2: file = {
        ...file1,
        content: "Content B",
        edited: timestamp
    };

    const merged = mergeFiles(file1, file2);
    
    // Automerge should deterministically handle concurrent edits
    expect(merged.edited).toBe(timestamp);
    expect(typeof merged.content).toBe('string');
});