import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'restaurant', 'delivery', 'admin'], default: 'customer' }
}, { strict: process.env.STRICT_POLICY === 'throw' ? 'throw' : (process.env.STRICT_POLICY === 'false' ? false : true) });

userSchema.index({ email: 1, role: 1 });

export default mongoose.model('User', userSchema);