import type { UUID } from "./server/sessions";
import { emitState } from "./socketClient";

export interface file {
	identifier: string;
	filename: string;
	author: string;
	content: string;
	created: number;
	edited: number;
	deleted: boolean;
}

class Storage {
	displayed: file[];
	files: Record<string, file>;
	next_number: number;
	currentUser: UUID;

	constructor() {
		this.files = $state({});
		this.next_number = $state(1);
		this.displayed = $derived(
			Object.entries(this.files)
				.map((e) => e[1])
				.filter((e) => e.deleted == false)
		);
		this.currentUser = "";
	}

	async createFile(filename: string) {
		let id = crypto.randomUUID();
		let file = null;
		if (filename === '') {
			file = {
				identifier: id,
				filename: `Untitled-${this.next_number}`,
				author: this.currentUser,
				content: '',
				created: Date.now(),
				edited: Date.now(),
				deleted: false
			};
			this.next_number += 1;
		} else {
			file = {
				identifier: id,
				filename: filename,
				author: this.currentUser,
				content: '',
				created: Date.now(),
				edited: Date.now(),
				deleted: false
			};
		}
		this.files[file.identifier] = file;
		this.emitFile(this.files[file.identifier]);
		//this.saveLocal();

		// save it to the database
		const data = await fetch(`/api/document`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify(file)
		});
		if (data.status != 200) {
			alert('Error communicating with server');
		}
	}

	listFiles(): file[] {
		return this.displayed;
	}

	deleteFile(identifier: string) {
		this.files[identifier].deleted = true;
		this.emitFile(this.files[identifier]);
		//this.saveLocal();
	}

	changeFileName(file: file, newName: string) {
		this.files[file.identifier].filename = newName;
		this.emitFile(this.files[file.identifier]);
		//this.saveLocal();
	}

	updateContents(file: file, newContent: string) {
		this.files[file.identifier].content = newContent;
		this.emitFile(this.files[file.identifier]);
		//this.saveLocal();
	}

	updateFileName(file: file, newName: string) {
		this.files[file.identifier].filename = newName;
		this.emitFile(this.files[file.identifier]);
		//this.saveLocal();
	}

	getFile(fileId: string): file {
		return this.files[fileId];
	}

	async saveLocal() {
		const Json_state = JSON.stringify({
			displayed: this.displayed,
			files: this.files,
			next_number: this.next_number
		});
		// do this if there has been a change
		localStorage.setItem('files', Json_state);
	}

	retrieveLocal() {
		if (!localStorage.getItem('files')) {
			console.log('No Files in LocalStorage');
			return;
		}
		// @ts-ignore - already check if it's null and exit early
		const stored = JSON.parse(localStorage.getItem('files'));
		this.displayed = stored.displayed;
		this.files = stored.files;
		this.next_number = stored.next_number;
	}

	emit(){
		emitState(this.files, this.currentUser);
	}

	emitFile(file: file){
		emitState(this.files[file.identifier], this.currentUser);
	}
}

export const storageEngine = new Storage();
