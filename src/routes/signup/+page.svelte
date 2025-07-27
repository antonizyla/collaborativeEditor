<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';

	let { data, form } = $props();

	import { onMount } from 'svelte';

	// when the page loads focus on the input element to not require a click
	let inputElement: HTMLElement | null = null;
	onMount(() => {
		inputElement?.focus();
	});
</script>

<div class="flex h-screen w-screen flex-col justify-around">
	<div class="mx-auto flex max-w-md flex-col gap-2 rounded-md border-2 p-8">
		<div class="text-2xl font-extrabold">Input Your Email</div>
		<div class="max-w-prose">
			This will be used to send a one time passcode to authenticate your session
		</div>
		<div class:hidden={!form} class="text-destructive">{form?.message ?? ''}</div>
		<form method="POST" use:enhance action="?/signup" class="flex flex-row gap-2 pt-4">
			<input
				class="grow rounded-md border-2 p-1.5 outline-none"
				bind:this={inputElement}
				type="text"
				id="email-input"
				name="Email"
				value={form?.email ?? ''}
				autocomplete="off"
				required
			/>
			<Button class="p-5">Submit</Button>
		</form>
	</div>
</div>
