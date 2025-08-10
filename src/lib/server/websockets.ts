import { Server } from 'socket.io';
import type { ViteDevServer } from 'vite';
import type { UUID } from './sessions';

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

    let connectedUsers: UUID[] = [];

    io.on('connection', (socket) => {
      console.log("[WS Server] Connected ")

      socket.onAny(async (eventName, payload) => {
        console.log("[WS Server] Received Data from " + eventName)
        // synchronise the data with the database
        const cookies = parseCookies(socket.request.headers.cookie ?? "")
        const data = await fetch(`${origin}/api/documents`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'applications/json', 
            'Cookie': `session=${cookies.session}`
          },
          credentials: 'include',
          body: JSON.stringify(Object.values(JSON.parse(payload)))
        });
        // send the merged payload back to the browser
        console.log("[WS Server] Emitting data back to client")
        socket.emit(eventName, payload);
      });

    });

    console.log("[SOCKETS] SocketIO Server Injected");
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
