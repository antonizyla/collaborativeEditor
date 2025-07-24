<script lang="ts">
	import EditorSidebar from './EditorSidebar.svelte';
	import Editor from './Editor.svelte';

	import { storageEngine } from '$lib/storage.svelte';
	import { browser } from '$app/environment';

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
