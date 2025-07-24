
export type file = {
  identifier: string,
  filename: string,
  author: string,
  content: string,
  created: number,
  edited: number,
  deleted: boolean,
  saved: boolean,
}

class storage {

  displayed: file[];
  files: Record<string, file>;
  next_number: number;

  constructor() {
    this.files = $state({});
    this.next_number = $state(1);
    this.displayed = $derived(Object.entries(this.files).map((e) => e[1]).filter((e) => e.deleted == false))
  }

  createFile(filename: string, author: string) {
    let id = crypto.randomUUID();
    let file: file = { identifier: id, filename: filename, author: author, content: "", created: Date.now(), edited: Date.now(), deleted: false, saved: true };
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
  }

  getFile(fileId: string): file {
    return this.files[fileId];
  }

}

export const storageEngine = new storage();