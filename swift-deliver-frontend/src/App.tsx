import { useState } from 'react';
import OrderTracking from './pages/OrderTracking';

function App() {
  const [orderId, setOrderId] = useState('');   // Get from your order creation flow

  return (
    <div>
      <h1>SwiftDeliver</h1>
      <input 
        placeholder="Enter Order ID" 
        onChange={(e) => setOrderId(e.target.value)} 
      />
      <button onClick={() => {/* place order logic */}}>Track Order</button>
      
      {orderId && <OrderTracking orderId={orderId} />}
    </div>
  );
}

export default App;