import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  category: String,
  isAvailable: { type: Boolean, default: true }
});

productSchema.index({ restaurant: 1, category: 1 });

export default mongoose.model('Product', productSchema);