<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	// when the page loads focus on the input element to not require a click
	let inputElement: HTMLElement | null = null;
	onMount(() => {
		inputElement?.focus();
	});

	let { data } = $props();
</script>

<div class="flex h-[100vh] flex-col justify-around">
	<div class="mx-auto w-fit flex-col justify-center rounded-md border-2 p-8">
		<div class="flex flex-col gap-2">
			<div class="text-xl font-bold">Enter OTP from your email</div>
			<div class="text-md text-gray-500">Email Sent to: {data.user.email}</div>
			<div class="flex max-w-prose flex-row items-center justify-between">
				<Button
					size="sm"
					variant="outline"
					onclick={async () => {
						console.log('hello');
					}}>Resend Code</Button
				>
				<div class="">
					Valid until: {data.otpValidUntil?.getHours() ?? 'XX'}:{data.otpValidUntil?.getMinutes() ??
						'XX'}
				</div>
			</div>
			<form class="flex flex-row gap-2 pt-2" method="POST" use:enhance action="?/verifyEmail">
				<input
					bind:this={inputElement}
					class="rounded-md border-2 p-1.5 outline-none"
					type="text"
					name="OTP"
				/>
				<Button class="p-5">Submit</Button>
			</form>
		</div>
	</div>
</div>
