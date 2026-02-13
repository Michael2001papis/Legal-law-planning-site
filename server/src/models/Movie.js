import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  year: { type: Number },
  genres: [{ type: String }],
  rating: { type: Number, default: 0 },
  posterUrl: { type: String },
  trailerUrl: { type: String },
  availabilityPlans: [{ type: String, enum: ['basic', 'platinum', 'diamond'] }],
}, { timestamps: true });

movieSchema.index({ title: 1 });
movieSchema.index({ genres: 1 });
movieSchema.index({ title: 'text', description: 'text' }, { weights: { title: 2, description: 1 } });

export const Movie = mongoose.model('Movie', movieSchema);
