<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
</script>

<form method="POST" use:enhance action="?/signup" class="flex flex-col">
	<div class="">Input Your Email</div>
    {form?.message ?? ""}
	<input
		class="border-2 border-amber-500"
		type="text"
		id="email-input"
		name="Email"
		value={form?.email ?? ''}
		autocomplete="off"
		required
	/>
	<button>Submit</button>
</form>
