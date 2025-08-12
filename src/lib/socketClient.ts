import { io } from "socket.io-client";
import type { UUID } from "./server/sessions";
import { storageEngine } from "./storage.svelte";
const endpoint = "localhost:5173";

const socket = io(endpoint, {
  withCredentials: true
});

export function sendMessage(message: string, identifier: string) {
  socket.on("connection_error", (err) => {
    console.log("[WS Client] Error Connecting", err)
  });

  socket.emit("message", message);
}

// emit on the username
export function emitState(state, userId: UUID) {
  socket.on("connection_error", (err) => {
    console.log("[WS Client] Error Connecting", err)
  });
  socket.emit(userId, JSON.stringify(state));
}

// listen on the socket that is the user's uuid
export async function listen(userId: UUID) {
  socket.on(userId, async (payload) => {
    console.log(
      "[WS Client] Listened to " + payload
    );
    storageEngine.files = Object.fromEntries(JSON.parse(payload).map((file) => [file.identifier, file]))
  })
}