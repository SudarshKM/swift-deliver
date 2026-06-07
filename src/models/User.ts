import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'restaurant', 'delivery', 'admin'], default: 'customer' }
});

export default mongoose.model('User', userSchema);