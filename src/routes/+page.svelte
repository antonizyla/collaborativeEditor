<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';

	let { data } = $props();
</script>

<div class="flex h-[100vh] flex-col justify-center">
	<div class="mx-auto h-fit w-max min-w-md flex-col rounded-[var(--radius)] border-2 p-8">
		<div class="flex flex-col justify-center gap-2">
			<h1 class="py-1 text-2xl font-bold">Welcome to app</h1>
			<div class="text-wrap">
				{#if data.email === ''}
					(You are not logged in, to create an account press start using the app)
				{:else}
					<div class="flex flex-row gap-2">
						You are logged in with <div class="text-gray-500 italic">{data.email}</div>
					</div>
				{/if}
			</div>
			<div class="flex flex-row justify-start gap-2">
				<Button href="/editor">Start Using The App</Button>
				{#if data.email != ''}
					<Button variant="outline">Logout</Button>
				{/if}
			</div>
		</div>
	</div>
</div>
