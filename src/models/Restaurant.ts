import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  address: String,
  cuisine: [String],
  rating: { type: Number, default: 0 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true }
}, { strict: process.env.STRICT_POLICY === 'throw' ? 'throw' : (process.env.STRICT_POLICY === 'false' ? false : true) });

// Compound index for frequent queries
restaurantSchema.index({ name: 1, cuisine: 1 });
restaurantSchema.index({ owner: 1 });

export default mongoose.model('Restaurant', restaurantSchema);