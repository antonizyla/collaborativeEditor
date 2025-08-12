import type { file } from '$lib/storage.svelte';
import * as Automerge from 'automerge';

export function fileToAutomerge(f: file) {
  let document = Automerge.change(Automerge.init<file>(), (doc) => {
    doc.identifier = f.identifier;
    doc.author = f.author;
    doc.content = f.content;
    doc.deleted = f.deleted;
    doc.edited = f.edited;
    doc.filename = f.filename;
    doc.created = f.created;
  });
  return document;
}

export function autoMergeToFile(f: Automerge.Doc<file>) {
  return {
    identifier: f.identifier,
    author: f.author,
    content: f.content,
    deleted: f.deleted,
    edited: f.edited,
    filename: f.filename,
    created: f.created
  };
}

export function mergeFiles(file1: file, file2: file): file {
    const doc1 = fileToAutomerge(file1);
    const doc2 = fileToAutomerge(file2);
    
    const mergedDoc = Automerge.merge(doc1, doc2);
    
    return autoMergeToFile(mergedDoc);
}
