<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';

	import Close from '@lucide/svelte/icons/x';

	import { tabs } from '$lib/editors.svelte';
</script>

<div class="mt-2 min-h-10">
	<div class="flex flex-row items-end">
		{#each tabs.getEditors() as tab}
			<div class="">
				<Button
					class="flex flex-row gap-5 pr-2"
					variant={tabs.getCurrentlyOpenFile() === tab ? 'default' : 'secondary'}
					size={tabs.getCurrentlyOpenFile() === tab ? 'default' : 'sm'}
					onclick={() => {
						if (tabs.open) {
							tabs.saveEditorContents(tabs.open);
						}
						tabs.openEditor(tab.identifier);
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
				class="flex flex-row rounded-full p-0.5 hover:bg-red-100"
			>
				<Close></Close>
			</Button>
		{/each}
	</div>
</div>

<style>
</style>
