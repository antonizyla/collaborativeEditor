<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Skeleton } from '$lib/components/ui/skeleton';

	import FileButton from '$lib/components/editor/fileButton.svelte';

	let { store, loading } = $props();

	import { tabs } from '$lib/editors.svelte';
	import DarkModeToggle from '../DarkModeToggle.svelte';
</script>

<!--Sidebar-->
<div class="mr-2 flex min-w-3xs flex-col border-r-2">
	<!--Desc and New File-->
	{#if loading}
		<div class="flex flex-row justify-between">
			<Skeleton class="m-4 h-8 w-30"></Skeleton>
			<Skeleton class="m-4 h-8 w-15"></Skeleton>
		</div>
	{:else}
		<div class="m-2 flex flex-row items-center justify-between gap-2">
			<div class=""><DarkModeToggle /></div>
			<div class="font-bold">Filesystem</div>
			<Button
				onclick={async () => {
					await store.createFile('Random');
				}}
				size="sm"
			>
				+
			</Button>
		</div>
	{/if}
	<!--List of files-->
	{#if loading}
		<div class="m-4 flex flex-col gap-2">
			{#each Array(5) as _}
				<div class="flex flex-row gap-2">
					<Skeleton class="h-8 w-30 grow"></Skeleton>
				</div>
			{/each}
		</div>
	{:else}
		<div class=" flex flex-col gap-0.5 border-t-2 pt-2">
			{#each store.listFiles() as file, index (file.identifier)}
				<div
					class="text-3xs flex min-w-[100%] flex-row items-center justify-between"
					class:bg-accent={tabs.getCurrentlyOpenFile()?.identifier === file.identifier}
				>
					<FileButton {file} {loading} />
				</div>
			{/each}
		</div>
	{/if}
</div>
