<script lang="ts">
	import { deserialize } from '$app/forms';
	import { Note } from 'components';
	import { addNote, deleteNote, editNote, notes } from 'stores';
	import { onMount } from 'svelte';
	import { generateUUID } from 'utils';

	let tags = $notes.map((note) => note.tags).flat();

	let disabled = false;
	let uuidForNewNote = generateUUID();
	let selectedTag = '';
	let selectedNotes = $notes;

	async function onEdit(e: CustomEvent) {
		disabled = true;
		const note = e.detail;

		const data = new FormData();
		data.set('title', note.title);
		data.set('content', note.content);

		const response = await fetch('?/addNote', {
			method: 'POST',
			body: data
		});

		const result = deserialize(await response.text());

		if (result.type === 'success') {
			const newNote = {
				...note,
				...result.data
			};

			selectedTag = '';

			editNote(newNote);
		} else {
			// TODO: ERROR HANDLING
		}

		disabled = false;
	}

	async function onAdd(e: CustomEvent) {
		disabled = true;

		const note = e.detail;

		const data = new FormData();
		data.set('title', note.title);
		data.set('content', note.content);

		const response = await fetch('?/addNote', {
			method: 'POST',
			body: data
		});

		const result = deserialize(await response.text());

		if (result.type === 'success') {
			const newNote = {
				...note,
				...result.data
			};

			selectedTag = '';

			addNote(newNote);
		} else {
			// TODO: ERROR HANDLING
		}

		disabled = false;
	}

	function onDelete(e: CustomEvent) {
		deleteNote(e.detail);
	}

	onMount(() => {
		const localNotes = localStorage.getItem('notes');

		if (localNotes !== null) notes.set(JSON.parse(localNotes));

		notes.subscribe((notes) => localStorage.setItem('notes', JSON.stringify(notes)));
	});

	$: $notes, (uuidForNewNote = generateUUID());
	$: $notes, (tags = $notes.map((note) => note.tags).flat());
	$: $notes,
		(selectedNotes =
			selectedTag !== ''
				? $notes.filter((note) => note.tags.includes(selectedTag))
				: (selectedNotes = $notes));
</script>

<div class="max-w-[800px] px-4 py-28 md:py-14 sm:py-8 mx-auto">
	<header>
		<h1 class="text-4xl font-bold text-gray-50">My notes</h1>
	</header>

	<!--  flex overflow-y-auto -->
	<nav class="w-full mt-2">
		<button
			on:click={() => (selectedTag = '')}
			class="shrink-0 py-2 px-6 mr-2 mt-4 text-sm font-light text-gray-50 rounded-full border-[1px] border-gray-50"
		>
			All
		</button>
		{#each tags as tag}
			<button
				on:click={() => (selectedTag = tag)}
				class="shrink-0 py-2 px-6 mr-2 mt-4 text-sm font-light text-gray-50 rounded-full border-[1px] border-gray-50"
			>
				{tag}
			</button>
		{/each}
	</nav>

	<h2 class="mt-4 text-2xl text-gray-100">Add note</h2>

	<div class="mt-4">
		<Note note={{ id: uuidForNewNote }} {disabled} on:submit={onAdd} deleteEnabled={false} />
	</div>

	{#if selectedTag !== ''}
		<h2 class="mt-8 text-2xl text-gray-100">Notes with tag "{selectedTag}"</h2>
	{:else}
		<h2 class="mt-8 text-2xl text-gray-100">All notes</h2>
	{/if}

	{#key selectedNotes}
		{#each selectedNotes.reverse() as note}
			<div class="mt-4">
				<Note {note} {disabled} on:submit={onEdit} on:delete={onDelete} />
			</div>
		{/each}
	{/key}
</div>
