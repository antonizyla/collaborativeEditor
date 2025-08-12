import { io } from "socket.io-client";
import type { UUID } from "./server/sessions";
import { storageEngine } from "./storage.svelte";
import { tabs } from "./editors.svelte";
const endpoint = "localhost:5173";

const socket = io(endpoint, {
  withCredentials: true
});

export function emitState(state, userId: UUID) {
  socket.on("connection_error", (err) => {
    console.log("[WS Client] Error Connecting", err)
  });
  socket.emit('document-update', JSON.stringify({ userId, state }));
}

// listen on the socket that is the user's uuid
export async function listen(userId: UUID) {
  socket.on('document-update', async (payload) => {
    storageEngine.files = Object.fromEntries(JSON.parse(payload).map((file) => [file.identifier, file]))
    if (tabs.open){
      const id = tabs.open.identifier;
      tabs.currentTextBuffer = storageEngine.files[id].content;
    }
  })
}

export function wsJoinUserRoom(userId: UUID) {
  socket.emit('join', userId);
}

