<script lang="ts">
	import Editor from '$lib/components/editor/Editor.svelte';
	import EditorSidebar from '$lib/components/editor/EditorSidebar.svelte';
	import { storageEngine } from '$lib/storage.svelte';

	let store = storageEngine;

	let local = true;
	if (typeof localStorage !== 'undefined') {
		store.retrieveLocal();
		local = false;
	}

	let loading = $state(local);
</script>

<div class="flex h-screen flex-row">
	<EditorSidebar {store} {loading}></EditorSidebar>
	<Editor {loading}></Editor>
</div>
