import { useEffect, useState } from 'react';
import { socketService } from '../services/socket';

const OrderTracking = ({ orderId }: { orderId: string }) => {
  const [status, setStatus] = useState('pending');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socketService.connect();
    socketService.joinOrder(orderId);

    socketService.onOrderUpdate((data) => {
      setStatus(data.status);
      setMessages(prev => [...prev, data.message]);
    });

    return () => socketService.disconnect();
  }, [orderId]);

  return (
    <div>
      <h2>Order Tracking - {orderId}</h2>
      <p>Current Status: <strong>{status}</strong></p>
      
      <div>
        <h3>Live Updates:</h3>
        <ul>
          {messages.map((msg, i) => <li key={i}>{msg}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default OrderTracking;