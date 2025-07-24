export type file = {
	identifier: string;
	filename: string;
	author: string;
	content: string;
	created: number;
	edited: number;
	deleted: boolean;
	saved: boolean;
};

class storage {
	displayed: file[];
	files: Record<string, file>;
	next_number: number;

	constructor() {
		this.files = $state({});
		this.next_number = $state(1);
		this.displayed = $derived(
			Object.entries(this.files)
				.map((e) => e[1])
				.filter((e) => e.deleted == false)
		);
	}

	createFile(filename: string, author: string) {
		let id = crypto.randomUUID();
		let file: file = {
			identifier: id,
			filename: filename,
			author: author,
			content: '',
			created: Date.now(),
			edited: Date.now(),
			deleted: false,
			saved: true
		};
		this.files[file.identifier] = file;
	}

	listFiles(): file[] {
		return this.displayed;
	}

	deleteFile(identifier: string) {
		this.files[identifier].deleted = true;
	}

	changeFileName(file: file, newName: string) {
		this.files[file.identifier].filename = newName;
	}

	updateContents(file: file, newContent: string) {
		this.files[file.identifier].content = newContent;
		this.saveLocal();
	}

	getFile(fileId: string): file {
		return this.files[fileId];
	}

	saveLocal() {
		const Json_state = JSON.stringify({
			displayed: this.displayed,
			files: this.files,
			next_number: this.next_number
		});
		localStorage.setItem('files', Json_state);
	}

	retrieveLocal() {
		if (!localStorage.getItem('files')) {
			console.log('No Files in LocalStorage');
			return;
		}
		const stored = JSON.parse(localStorage.getItem('files'));
		this.displayed = stored.displayed;
		this.files = stored.files;
		this.next_number = stored.next_number;
	}
}

export const storageEngine = new storage();
