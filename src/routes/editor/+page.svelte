<script lang="ts">
	import Editor from '$lib/components/editor/Editor.svelte';
	import EditorSidebar from '$lib/components/editor/EditorSidebar.svelte';
	import { storageEngine } from '$lib/storage.svelte';
	import { onMount } from 'svelte';
	import type { PageProps } from '../$types';

	// this is to send the data to the client in lieu of crdt
	// allow for both local and server state to sync automatically
	// Server is our single source of truth but if refresh or lose connection
	// without refresh then they can save to local and salvage it
	let { data }: PageProps = $props();
	storageEngine.files = data;
	onMount(() => {
		storageEngine.saveLocal();
	});

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
