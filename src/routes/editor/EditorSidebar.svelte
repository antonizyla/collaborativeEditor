<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Skeleton } from '$lib/components/ui/skeleton';

	import FileIcon from '@lucide/svelte/icons/file';
	import BinIcon from '@lucide/svelte/icons/trash';

	let { store, loading } = $props();

	import { getF } from '$lib/editor.svelte';
	const currentFile = getF();
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
			<div class="font-bold">Filesystem</div>
			<Button
				onclick={() => {
					store.createFile('Random', 'auto');
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
			{#each Array(3) as _}
				<div class="flex flex-row gap-2">
					<Skeleton class="h-8 w-30 grow"></Skeleton>
					<Skeleton class="h-8 w-10"></Skeleton>
				</div>
			{/each}
		</div>
	{:else}
		<div class=" flex flex-col gap-1 border-t-2 pt-2">
			{#each store.listFiles() as file}
				<div
					class="text-3xs flex min-w-[100%] flex-row items-center justify-between"
					class:bg-accent={currentFile.get()?.identifier === file.identifier}
				>
					<Button
						variant="ghost"
						class="flex grow flex-row justify-start"
						onclick={() => {
							currentFile.set(file);
						}}
					>
						<div class="flex flex-row items-center gap-2">
							<FileIcon size="20"></FileIcon>
							{file.filename}
						</div>
					</Button>
					<Button
						onclick={() => {
							store.deleteFile(file.identifier);
							if (currentFile.get()?.identifier == file.identifier) {
								currentFile.nullify();
							}
						}}
						variant="outline"
						size="sm"
						class="mx-2"
					>
						<BinIcon />
					</Button>
				</div>
			{/each}
		</div>
	{/if}
</div>
