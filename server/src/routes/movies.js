import { Router } from 'express';
import { Movie } from '../models/Movie.js';
import { Favorite } from '../models/Favorite.js';
import { WatchHistory } from '../models/WatchHistory.js';
import { requireAuth } from '../middleware/auth.js';
import { canAccessMovie } from '../config/planPolicy.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { query, genre, page = 1, limit = 20, plan = 'basic' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = {
      $and: [
        {
          $or: [
            { availabilityPlans: { $exists: false } },
            { availabilityPlans: { $size: 0 } },
            { availabilityPlans: plan },
            { availabilityPlans: 'basic' },
          ],
        },
      ],
    };
    if (query) filter.$and.push({ $or: [{ title: new RegExp(query, 'i') }, { description: new RegExp(query, 'i') }] });
    if (genre) filter.$and.push({ genres: genre });

    const [movies, total] = await Promise.all([
      Movie.find(filter).skip(skip).limit(Number(limit)).lean(),
      Movie.countDocuments(filter),
    ]);

    res.json({ movies, total, page: Number(page), limit: Number(limit) });
  } catch (e) {
    next(e);
  }
});

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id).lean();
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    if (!canAccessMovie(movie.availabilityPlans, req.user.plan))
      return res.status(403).json({ error: 'Not available in your plan' });

    const [favorite, history] = await Promise.all([
      Favorite.findOne({ userId: req.user._id, movieId: movie._id }),
      WatchHistory.findOne({ userId: req.user._id, movieId: movie._id }),
    ]);

    res.json({
      ...movie,
      isFavorite: !!favorite,
      progressSeconds: history?.progressSeconds ?? 0,
    });
  } catch (e) {
    next(e);
  }
});

router.post('/:id/progress', requireAuth, async (req, res, next) => {
  try {
    const { progressSeconds } = req.body;
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    if (!canAccessMovie(movie.availabilityPlans, req.user.plan))
      return res.status(403).json({ error: 'Not available in your plan' });

    await WatchHistory.findOneAndUpdate(
      { userId: req.user._id, movieId: req.params.id },
      { progressSeconds: Number(progressSeconds) || 0 },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

router.post('/:id/favorite', requireAuth, async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    if (!canAccessMovie(movie.availabilityPlans, req.user.plan))
      return res.status(403).json({ error: 'Not available in your plan' });

    await Favorite.findOneAndUpdate(
      { userId: req.user._id, movieId: req.params.id },
      {},
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

router.delete('/:id/favorite', requireAuth, async (req, res, next) => {
  try {
    await Favorite.deleteOne({ userId: req.user._id, movieId: req.params.id });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export { router as moviesRouter };
