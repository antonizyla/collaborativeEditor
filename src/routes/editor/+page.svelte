<script lang="ts">
	import EditorSidebar from './EditorSidebar.svelte';
	import Editor from './Editor.svelte';

	import { storageEngine } from '$lib/storage.svelte';
	import { browser } from '$app/environment';

	let store = storageEngine;

	let loading = $state(!browser);

</script>

<div class="flex h-screen flex-row">
	<EditorSidebar {store} {loading}></EditorSidebar>
	<Editor {store} {loading}></Editor>
</div>
