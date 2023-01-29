<script lang="ts">
	import type { Note } from 'stores';
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';

	export let disabled = false;
	export let note: Partial<Note> = {};
	export let deleteEnabled = true;

	const dispatch = createEventDispatcher();

	function submit() {
		dispatch('submit', note);
	}

	function onDelete() {
		dispatch('delete', note);
	}
</script>

<div in:fly={{ y: 50, duration: 420 }} class="bg-slate-800 p-4 rounded-sm">
	<label for="title">
		<input
			class="w-full py-4 px-2 bg-slate-700 text-gray-200 rounded-sm"
			id="title"
			type="text"
			placeholder="title"
			bind:value={note.title}
			{disabled}
		/>
	</label>

	<label for="content">
		<textarea
			class="w-full py-4 px-2 min-h-[200px] mt-2 bg-slate-700 text-gray-200 rounded-sm"
			id="content"
			placeholder="content"
			bind:value={note.content}
			{disabled}
		/>
	</label>

	{#if note.summary}
		<p class="text-gray-200 bg-slate-900 text-sm p-4 roundend-sm">{note.summary}</p>
	{/if}

	{#if note.tags}
		<div class="mt-2 flex flex-wrap">
			{#each note.tags as tag}
				<span class="mr-2 mt-2 px-4 py-2 text-xs text-gray-200 rounded-full bg-slate-700"
					>{tag}</span
				>
			{/each}
		</div>
	{/if}

	<div class="mt-4 flex items-center justify-between">
		{#if deleteEnabled}
			<button class="px-4 py-2 bg-red-600 text-gray-200 rounded-full" on:click={onDelete} {disabled}
				>Delete</button
			>
		{/if}

		<button
			class="ml-auto px-4 py-2 bg-green-600 text-gray-200 rounded-full"
			on:click={submit}
			{disabled}>Save</button
		>
	</div>
</div>
