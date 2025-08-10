<script lang="ts">
	import { io } from 'socket.io-client';

	const websocket = io();

	websocket.on('eventFromServer', (message) => {
		console.log(message); // will log '✅ Connected';
	});

	let currentMessage: string = '';
	$: (currentMessage, websocket.emit('eventFromClient', currentMessage));
</script>

<input bind:value={currentMessage} />
