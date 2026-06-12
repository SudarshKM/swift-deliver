import mongoose from 'mongoose';
import { OrderStatus } from '../types/types';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  price: Number
});

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [orderItemSchema],
  totalAmount: Number,
  status: {
    type: String,
    enum: OrderStatus,
    default: OrderStatus.pending
  },
  deliveryAddress: String,
  createdAt: { type: Date, default: Date.now }
}, { strict: process.env.STRICT_POLICY === 'throw' ? 'throw' : (process.env.STRICT_POLICY === 'false' ? false : true) });

export default mongoose.model('Order', orderSchema);