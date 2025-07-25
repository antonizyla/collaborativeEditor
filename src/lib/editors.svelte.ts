import type { file } from './storage.svelte';
import { storageEngine } from './storage.svelte';

class Editors {
	editors: file[];
	open: file | null;
	currentTextBuffer: string;
	currentFileName: string;
	editorElement: HTMLElement | null;
	tabClickTimer: number;
	editableTabNames: Record<string, string>;

	constructor() {
		this.editors = $state([]);
		this.open = $state(null);
		this.currentTextBuffer = $state('');
		this.editorElement = null;
		this.tabClickTimer = $state(0);
		this.editableTabNames = $state({});
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

		if (!(f.identifier in this.editableTabNames)) {
			this.editableTabNames[f.identifier] = f.filename;
		}
	}

	saveEditorContents(f: file) {
		storageEngine.updateContents(f, this.currentTextBuffer);
		storageEngine.updateFileName(f, this.editableTabNames[f.identifier]);
	}

	getEditors() {
		return this.editors;
	}

	findFileById(id: string) {
		this.getEditors().filter((e) => e.identifier === id);
	}

	getEditableTabName(fileIdentifier: string): string {
		if (!(fileIdentifier in this.editableTabNames)) {
			const file = this.editors.find(e => e.identifier === fileIdentifier);
			this.editableTabNames[fileIdentifier] = file ? file.filename : '';
		}
		return this.editableTabNames[fileIdentifier];
	}

	updateEditableTabName(fileIdentifier: string, newName: string) {
		this.editableTabNames[fileIdentifier] = newName;
	}

	saveTabNameEdit(fileIdentifier: string) {
		const file = this.editors.find(e => e.identifier === fileIdentifier);
		if (file && this.editableTabNames[fileIdentifier]) {
			const newName = this.editableTabNames[fileIdentifier];
			file.filename = newName;
			storageEngine.updateFileName(file, newName);

			// Update currentFileName if this is the active tab
			if (this.open && this.open.identifier === fileIdentifier) {
				this.currentFileName = newName;
			}
		}
	}
}

export const tabs = new Editors();
