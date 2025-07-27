<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';

	import Close from '@lucide/svelte/icons/x';

	import { tabs } from '$lib/editors.svelte';
	import { storageEngine } from '$lib/storage.svelte';
	import BindableButton from '$lib/components/ui/button/bindableButton.svelte';
</script>

<div class="flex min-h-10 flex-row justify-between">
	<div class="flex flex-row items-end">
		{#each tabs.getEditors() as tab, _ (tab.identifier)}
			<div class="">
				<BindableButton
					class="flex flex-row gap-5 pr-4"
					spellcheck={false}
					variant={tabs.getCurrentlyOpenFile() === tab ? 'default' : 'outline'}
					size={tabs.getCurrentlyOpenFile() === tab ? 'default' : 'sm'}
					bind:innerHTML={tabs.editableTabNames[tab.identifier]}
					contenteditable={true}
					onclick={() => {
						console.log('single click');
						clearTimeout(tabs.tabClickTimer);
						tabs.tabClickTimer = setTimeout(() => {
							if (tabs.open) {
								tabs.saveEditorContents(tabs.open);
							}
							tabs.openEditor(tab.identifier);
							if (tabs.editorElement) {
								tabs.editorElement.focus();
							}
						}, 100);
					}}
					ondblclick={() => {
						clearTimeout(tabs.tabClickTimer);
						console.log('double click');
					}}
				></BindableButton>
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
					tabs.getEditors().forEach((editor) => {
						tabs.saveTabNameEdit(editor.identifier);
					});
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
					tabs.currentFileName = '';
				}
			}}
			disabled={!tabs.open}
			variant="outline">Delete</Button
		>
	</div>
</div>

<style>
</style>
