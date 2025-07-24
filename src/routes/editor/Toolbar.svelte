<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';

	import Close from '@lucide/svelte/icons/x';

	import { tabs } from '$lib/editors.svelte';
	import { storageEngine } from '$lib/storage.svelte';
</script>

<div class="flex min-h-10 flex-row justify-between">
	<div class="flex flex-row items-end">
		{#each tabs.getEditors() as tab, _ (tab.identifier)}
			<div class="">
				<Button
					class="flex flex-row gap-5 pr-4"
					variant={tabs.getCurrentlyOpenFile() === tab ? 'default' : 'outline'}
					size={tabs.getCurrentlyOpenFile() === tab ? 'default' : 'sm'}
					onclick={() => {
						if (tabs.open) {
							tabs.saveEditorContents(tabs.open);
						}
						tabs.openEditor(tab.identifier);
						if (tabs.editorElement) {
							tabs.editorElement.focus();
						}
					}}
				>
					{tab.filename}
				</Button>
			</div>
			<Button
				onclick={() => {
					tabs.closeEditor(tab);
				}}
				size="sm"
				variant="secondary"
				class="flex flex-row rounded-full hover:bg-red-100"
			>
				<Close></Close>
			</Button>
		{/each}
	</div>
	<div class="mr-2">
		<Button
			onclick={() => {
				if (tabs.open) {
					tabs.open.content = tabs.currentTextBuffer;
					tabs.saveEditorContents(tabs.open);
				}
			}}
			disabled={!tabs.open}>Save</Button
		>
		<Button
			onclick={() => {
				if (tabs.open) {
					storageEngine.deleteFile(tabs.open.identifier);
					tabs.closeEditor(tabs.open);
					tabs.currentTextBuffer = '';
				}
			}}
			disabled={!tabs.open}
			variant="outline">Delete</Button
		>
	</div>
</div>

<style>
</style>
