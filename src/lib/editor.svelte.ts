import type { file } from "./storage.svelte";

let currentFile: file | null = $state(null);

let editingText: string = $state("")

export function getF() {
  function get() {
    return currentFile;
  };
  function nullify() {
    currentFile = null;
    editingText = "";
  }
  function set(f: file) {
    currentFile = f;
    editingText = currentFile.content;
  }

  return {
    get, nullify, set
  }
}
