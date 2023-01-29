import { writable } from 'svelte/store';

export interface Note {
	id: string;
	title: string;
	content: string;
	tags: string[];
	summary: string;
}

export const notes = writable<Note[]>([]);

export function addNote(note: Note): void {
	notes.update((notes) => [...notes, note]);
}

export function editNote(note: Note): void {
	notes.update((notes) => {
		const index = notes.findIndex((n) => n.id === note.id);
		notes[index] = note;

		return notes;
	});
}

export function deleteNote(note: Note): void {
	notes.update((notes) => notes.filter((n) => n.id !== note.id));
}
