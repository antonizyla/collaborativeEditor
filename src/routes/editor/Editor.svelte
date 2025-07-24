<script lang="ts">
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

	let { loading } = $props();
	import Toolbar from './Toolbar.svelte';

	import { tabs } from '$lib/editors.svelte';
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
		<Toolbar></Toolbar>
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
			{#if tabs.getCurrentlyOpenFile()}
				<div
					class="font-lg mr-2 min-h-full border-1 bg-gray-100 p-18 px-18 caret-foreground focus:outline-none"
					bind:this={tabs.editorElement}
					bind:innerHTML={tabs.currentTextBuffer}
					contenteditable
				>
					{tabs.currentTextBuffer}
				</div>
			{:else}
				<div class="pt-60 text-center select-none">
					Create a or select a file to start writing :)
				</div>
			{/if}
		</div>
	{/if}
</div>
