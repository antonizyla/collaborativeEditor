import { Server } from 'socket.io';
import type { ViteDevServer } from 'vite';
import { getAllDocuments, updateDocuments } from './document';
import { validateSessionToken, type UUID } from './sessions';
import type { file } from '$lib/storage.svelte';
import { mergeFiles } from './automerging';

// use this to be the "source of truth" for each document edited by any user
let serverState: ServerStore = {
  userStores: {},
  rawFiles: {}
};

export const webSocketServer = {
  name: 'websocket',
  configureServer(server: ViteDevServer) {
    if (!server.httpServer) return;

    const origin = "http://localhost:5173";
    const io = new Server(server.httpServer, {
      cors: {
        origin: origin,
        methods: ['GET', 'POST', 'PUT'],
        credentials: true
      }
    });

    io.on('connection', (socket) => {

      socket.on('disconnect', async (reason) => {
        console.log("[WS Server] Client Disconnected: ", reason);
        // save all of the files to the database
        const files = Object.values(serverState.rawFiles);
        await updateDocuments(files);
        console.log("[WS Server] Updated Database State");
      })

      // eventName is the userId
      socket.onAny(async (eventName, payload) => {
        const edited = JSON.parse(payload)
        if (edited.identifier) {
          if (typeof serverState.userStores[eventName] === 'undefined') {
            console.log('[Server] Loading in User data from database into memory')
            serverState = await loadInUserData(eventName, serverState);
          }
          console.log("EDITED: " + Object.values(edited));
          console.log("STORED: " + Object.values(serverState.rawFiles[edited.identifier]));
          if (typeof serverState.rawFiles[edited.identifier] === 'undefined'){
            // create a new file
            serverState.rawFiles[edited.identifier] = edited;
          }else{
            serverState.rawFiles[edited.identifier] = mergeFiles(edited, serverState.rawFiles[edited.identifier])
          }
          console.log("MERGED: " + Object.values(serverState.rawFiles[edited.identifier]));
          socket.emit(eventName, JSON.stringify(getAllDocumentsLocally(eventName, serverState)));
        }
      });
    });
  }
};

function parseCookies(cookieHeader: string) {
  const cookies = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.split('=');
    if (!name) return;
    const value = rest.join('=');
    cookies[name.trim()] = decodeURIComponent(value.trim());
  });

  return cookies;
}

async function saveStateApiCall(stringPayload: string, socket, origin: string) {
  const payload = JSON.stringify(Object.values(JSON.parse(stringPayload ?? "{}")));
  const cookies = parseCookies(socket.request.headers.cookie ?? "")
  const data = await fetch(`${origin}/api/documents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'applications/json',
      'Cookie': `session=${cookies.session}`
    },
    credentials: 'include',
    body: payload
  });
}

type ServerStore = {
  userStores: Record<string, string[]>;
  rawFiles: Record<string, file>;
};

// take in user ID and object representing our current server state
// append the user with data from the database
async function loadInUserData(userId: UUID, store: ServerStore) {
  const stored = await getAllDocuments(userId);
  if (!stored) {
    return store;
  }
  // modify to {fileId: file, ... } rather than [file, file,...]
  const formatted: Record<string, file> = Object.fromEntries(stored.map((f) => [f.identifier, f]));
  const fileNames: string[] = Object.keys(formatted);
  const updated: ServerStore = {
    rawFiles: {
      ...store.rawFiles,
      ...formatted
    },
    userStores: {
      ...store.userStores,
      [userId]: fileNames
    }
  }
  return updated;
}

function getAllDocumentsLocally(userId: UUID, store: ServerStore) {
  const fileIds = store.userStores[userId] ?? [];
  return fileIds.map(id => store.rawFiles[id]).filter(Boolean);
}
