import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5005';

class SocketService {
  private socket: Socket | null = null;

  connect(token?: string) {
    if (this.socket?.connected) return this.socket;

    this.socket = io(SOCKET_URL, {
      reconnection: true,
      transports: ['websocket'],
      ...(token && { auth: { token } }),
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    return this.socket;
  }

  joinOrder(orderId: string) {
    if (!this.socket?.connected) {
      this.connect();
    }
    this.socket?.emit('join-order', orderId);
  }

  onOrderUpdate(callback: (data: { status: string; message: string }) => void) {
    this.socket?.on('order-status-updated', (data: { orderId: string; status: string }) => {
      callback({
        status: data.status,
        message: `Order status changed to: ${data.status}`
      });
    });
  }

  disconnect() {
    if (this.socket?.connected) {
      this.socket.disconnect();
    }
  }
}

export const socketService = new SocketService();