<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import Ellipses from '@lucide/svelte/icons/ellipsis';

	import { tabs } from '$lib/editors.svelte';
	import { storageEngine } from '$lib/storage.svelte';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import { Skeleton } from '$lib/components/ui/skeleton/index';

	let { file, loading } = $props();

	let selected: boolean = $derived(tabs.getCurrentlyOpenFile()?.identifier === file.identifier);

	function selectFile() {
		if (tabs.open) {
			tabs.saveEditorContents(tabs.open);
		}
		tabs.openEditor(file.identifier);
		if (tabs.editorElement) {
			tabs.editorElement.focus();
		}
	}

	function deleteFile() {
		const toBeDeleted = tabs.open;
		if (!toBeDeleted) {
			return;
		}
		tabs.closeEditor(toBeDeleted);
		storageEngine.deleteFile(toBeDeleted.identifier);
	}

	let editableName = $state(file.filename);
	function saveFileNameChange() {
		tabs.editableTabNames[file.identifier] = editableName;
		file.filename = editableName;
		tabs.saveTabNameEdit(file.identifier);
	}
</script>

<div class="flex w-[100%] flex-row items-center">
	<button
		class="grow p-1.5 text-left"
		onclick={() => {
			selectFile();
		}}
	>
		{file.filename}
	</button>
	{#if selected}
		<div class="pr-1">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button size={''} variant="outline" class="rounded-md p-1.5"><Ellipses /></Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Label>Rename</DropdownMenu.Label>
						<DropdownMenu.Item>
							<div class="flex flex-row gap-1">
								<input
									onclick={(event) => {
										event?.stopPropagation();
										event.preventDefault();
									}}
									oninput={(event) => {
										event?.stopPropagation();
									}}
									onkeydown={(e) => {
										if (e.key == 'Enter') {
											saveFileNameChange();
										} else if (e.key == ' ') {
											e.stopPropagation();
											e.preventDefault();
										}
									}}
									class="outline-none"
									bind:value={editableName}
								/>
								<Button
									size="sm"
									class="outline-0"
									onclick={() => {
										saveFileNameChange();
									}}>Save</Button
								>
							</div>
						</DropdownMenu.Item>
						<DropdownMenu.Separator></DropdownMenu.Separator>
						<DropdownMenu.Item
							onclick={() => {
								deleteFile();
							}}>Delete</DropdownMenu.Item
						>
						<DropdownMenu.Separator></DropdownMenu.Separator>
						<DropdownMenu.Item
							onclick={() => {
								console.log('Sharing');
							}}>Share (TODO)</DropdownMenu.Item
						>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	{/if}
</div>
