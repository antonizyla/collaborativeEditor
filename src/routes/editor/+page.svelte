<script lang="ts">
	import Editor from '$lib/components/editor/Editor.svelte';
	import EditorSidebar from '$lib/components/editor/EditorSidebar.svelte';
	import { storageEngine } from '$lib/storage.svelte';
	import { onMount } from 'svelte';
	import type { PageProps } from '../$types';
	import { emitState, listen as wsListenFromServer } from '$lib/socketClient';
	import {Button} from '$lib/components/ui/button/index';

	// this is to send the data to the client in lieu of crdt
	// allow for both local and server state to sync automatically
	// Server is our single source of truth but if refresh or lose connection
	// without refresh then they can save to local and salvage it
	let { data }: PageProps = $props();

	storageEngine.files = data.files;
	storageEngine.currentUser = data.currentUser;

	onMount(() => {
		//storageEngine.saveLocal();
		
		// this is responsible for setting the browser's state
		// to that broadcast from the server
		emitState(storageEngine.files, storageEngine.currentUser);
		// parse back in the emmitted state - will show errors
		wsListenFromServer(storageEngine.currentUser);
	});

	let store = storageEngine;

	let local = true;
	if (typeof localStorage !== 'undefined') {
		//store.retrieveLocal();
		local = false;
	}

	let loading = $state(local);
</script>

<div class="flex h-screen flex-row">
	<EditorSidebar {store} {loading}></EditorSidebar>
	<Editor {loading}></Editor>
</div>

<Button onclick={()=>{emitState(storageEngine.files, storageEngine.currentUser)}}>Send thsi</Button>