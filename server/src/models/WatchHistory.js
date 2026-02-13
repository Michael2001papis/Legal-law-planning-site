import mongoose from 'mongoose';

const watchHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  progressSeconds: { type: Number, default: 0 },
}, { timestamps: true });

watchHistorySchema.index({ userId: 1, movieId: 1 }, { unique: true });

export const WatchHistory = mongoose.model('WatchHistory', watchHistorySchema);
