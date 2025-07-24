<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	import BinIcon from '@lucide/svelte/icons/trash';
	import SaveIcon from '@lucide/svelte/icons/save';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

	let { store, loading } = $props();
	import { getF } from '$lib/editor.svelte';
	import { onMount } from 'svelte';

	const currentF = getF();

	let editingName = $derived(currentF.get()?.author ? currentF.get()?.filename : '');
	let editingText = $derived(currentF.get()?.author ? currentF.get()?.content : '');
	let unsaved: boolean = $derived(editingText != currentF.get()?.content);


	// for autosaving every 5s, following svelte playground example
	let elapsed = $state(0);
	let duration = $state(5000);

	onMount(() => {
		let last_time = performance.now();

		let frame = requestAnimationFrame(function update(time) {
			frame = requestAnimationFrame(update);

			elapsed += Math.min(time - last_time, duration - elapsed);
			last_time = time;
		});

		return () => {
			cancelAnimationFrame(frame);
		};
	});

	$effect(() => {
		let f = currentF.get();
		if (f != undefined && elapsed >= 5000) {
			f.content = editingText;
			currentF.set(f);
			elapsed = 0;
		}
	});
</script>

<div class="my-2 flex w-screen flex-col">
	<!--Top Panel-->
	{#if loading}
		<div class="flex flex-row justify-between">
			<Skeleton class="m-2 h-8 w-30"></Skeleton>
			<div class="m-2 flex flex-row gap-2">
				<Skeleton class="h-8 w-10"></Skeleton>
				<Skeleton class="h-8 w-10"></Skeleton>
			</div>
		</div>
	{:else}
		<div class="m-2 flex flex-row items-center justify-between">
			{#if currentF.get()}
				<div class="flex flex-row">
					<div class="italic" spellcheck={false} bind:innerHTML={editingName} contenteditable>
						{editingName}
					</div>
					<div class:hidden={!unsaved}>*</div>
				</div>
			{:else}
				<div class=""></div>
			{/if}
			<div class="">
				<Button
					onclick={() => {
						if (!currentF.get()) {
							return;
						}
						if (editingName != currentF.get()?.filename) {
							// update the name of the file
							store.changeFileName(currentF.get(), editingName);
						}
						store.updateContents(currentF.get(), editingText);
					}}
					disabled={!currentF.get()}
					size="sm"><SaveIcon /></Button
				>
				<Button disabled={!currentF.get()} size="sm"><BinIcon /></Button>
			</div>
		</div>
	{/if}
	<!--Text Editing-->
	{#if loading}
		<div class="h-screen py-40">
			<Skeleton class="m-2 h-6 w-40"></Skeleton>
			<Skeleton class="m-2 h-6 w-80"></Skeleton>
			<Skeleton class="m-2 h-6 w-12"></Skeleton>
			<Skeleton class="m-2 h-6 w-30"></Skeleton>
			<Skeleton class="m-2 h-6 w-5"></Skeleton>
		</div>
	{:else}
		<div class="h-screen">
			{#if currentF.get()}
				<div class="mr-2 min-h-full bg-gray-50" bind:innerHTML={editingText} contenteditable>
					{editingText}
				</div>
			{:else}
				<div class="pt-60 text-center select-none">
					Create a or select a file to start writing :)
				</div>
			{/if}
		</div>
	{/if}
</div>
