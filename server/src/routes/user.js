import { Router } from 'express';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';
import { Favorite } from '../models/Favorite.js';
import { WatchHistory } from '../models/WatchHistory.js';
import { Movie } from '../models/Movie.js';
import { requireAuth } from '../middleware/auth.js';
import { canAccessMovie } from '../config/planPolicy.js';

const router = Router();

router.use(requireAuth);

router.get('/profile', (req, res) => {
  const u = req.user.toObject();
  delete u.passwordHash;
  res.json(u);
});

router.get('/devices', async (req, res, next) => {
  try {
    const sessions = await Session.find({ userId: req.user._id })
      .select('deviceId deviceName lastSeen createdAt')
      .lean();
    res.json(sessions.map(s => ({
      deviceId: s.deviceId,
      deviceName: s.deviceName,
      lastSeen: s.lastSeen,
      createdAt: s.createdAt,
    })));
  } catch (e) {
    next(e);
  }
});

router.delete('/devices/:deviceId', async (req, res, next) => {
  try {
    await Session.deleteOne({ userId: req.user._id, deviceId: req.params.deviceId });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

router.get('/my-list', async (req, res, next) => {
  try {
    const favs = await Favorite.find({ userId: req.user._id }).populate('movieId').lean();
    const movies = favs
      .map(f => f.movieId)
      .filter(m => m && canAccessMovie(m.availabilityPlans, req.user.plan));
    res.json(movies);
  } catch (e) {
    next(e);
  }
});

router.get('/continue-watching', async (req, res, next) => {
  try {
    const history = await WatchHistory.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate('movieId')
      .lean();
    const items = history
      .filter(h => h.movieId && canAccessMovie(h.movieId.availabilityPlans, req.user.plan))
      .map(h => ({ movie: h.movieId, progressSeconds: h.progressSeconds }));
    res.json(items);
  } catch (e) {
    next(e);
  }
});

export { router as userRouter };
