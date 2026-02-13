import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'content_admin'], default: 'user' },
  plan: { type: String, enum: ['basic', 'platinum', 'diamond'], default: 'basic' },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  termsAcceptedAt: Date,
  termsVersion: String,
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
