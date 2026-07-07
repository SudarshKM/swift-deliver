import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5005';

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false, // Let the app connect explicitly when the user logs in
  transports: ['websocket'],
});

// Connect helper
export const connectSocket = (token: string) => {
  if (!socket.connected) {
    socket.auth = { token };
    socket.connect();
  }
};

// Disconnect helper
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
