<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<div class="">
	<form method="POST" use:enhance action="?/verifyEmail">
        <input class="bg-red-200" type="text" name="OTP">
        <button>Submit OTP</button>
    </form>
</div>
