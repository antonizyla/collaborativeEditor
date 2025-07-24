<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Label } from '$lib/components/ui/label/index';
</script>

<div class="flex h-[100vh] flex-col justify-center">
	<form
		class="mx-auto flex w-full max-w-md flex-col items-start gap-2 rounded-[var(--radius)] border-2 p-8"
		method="POST"
		action="?/register"
	>
		<div class="text-2xl font-bold">
			<h1>Get Started</h1>
		</div>
		<div class="pb-2">Enter an Email Address to send a OTP and get started using the app.</div>
		<Label for="email">Email Address *</Label>
		<div class=" flex flex-row gap-4">
			<Input
				class="w-max grow"
				type="email"
				id="email"
				name="email"
				placeholder="john.doe@example.com"
			/>
			<Button type="submit">Authenticate</Button>
		</div>
	</form>
</div>
