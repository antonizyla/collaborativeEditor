import type { file } from './storage.svelte';
import { storageEngine } from './storage.svelte';

class editors {
	editors: file[];
	open: file | null;
	currentTextBuffer: string;
	editorElement: HTMLElement;

	constructor() {
		this.editors = $state([]);
		this.open = $state(null);
		this.currentTextBuffer = $state('');
		this.editorElement = null;
	}

	closeEditor(f: file) {
		if (this.editors.length == 1) {
			this.editors = [];
			this.open = null;
			this.currentTextBuffer = '';
			return;
		}
		this.editors = this.editors.filter((e) => e.identifier != f.identifier);
		this.open = null;
		this.currentTextBuffer = '';
	}

	setForefrontEditor(f: file) {
		this.open = f;
		this.currentTextBuffer = this.open.content;
	}

	getCurrentlyOpenFile() {
		return this.open;
	}

	openEditor(fileIdentifier: string) {
		const f: file = storageEngine.getFile(fileIdentifier);
		let already_open = false;
		this.editors.forEach((element) => {
			if (element.identifier === fileIdentifier) {
				already_open = true;
			}
		});
		if (!already_open) {
			this.editors.push(f);
		}
		this.open = f;
		this.currentTextBuffer = this.open.content;
	}

	saveEditorContents(f: file) {
		storageEngine.updateContents(f, this.currentTextBuffer);
	}

	getEditors() {
		return this.editors;
	}

	findFileById(id: string) {
		this.getEditors().filter((e) => e.identifier === id);
	}
}

export const tabs = new editors();
