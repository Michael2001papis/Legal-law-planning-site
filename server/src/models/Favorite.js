import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
}, { timestamps: true });

favoriteSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export const Favorite = mongoose.model('Favorite', favoriteSchema);
