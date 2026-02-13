import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User.js';
import { Movie } from '../models/Movie.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole('admin', 'content_admin'));

router.get('/users', requireRole('admin'), async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash').lean();
    res.json(users);
  } catch (e) {
    next(e);
  }
});

router.patch('/users/:id', requireRole('admin'),
  body('role').optional().isIn(['user', 'admin', 'content_admin']),
  body('plan').optional().isIn(['basic', 'platinum', 'diamond']),
  body('status').optional().isIn(['active', 'blocked']),
  async (req, res, next) => {
    try {
      const updates = {};
      if (req.body.role) updates.role = req.body.role;
      if (req.body.plan) updates.plan = req.body.plan;
      if (req.body.status) updates.status = req.body.status;
      const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-passwordHash');
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (e) {
      next(e);
    }
  }
);

router.get('/movies', async (req, res, next) => {
  try {
    const movies = await Movie.find().lean();
    res.json(movies);
  } catch (e) {
    next(e);
  }
});

router.post('/movies',
  body('title').trim().notEmpty(),
  body('availabilityPlans').optional().isArray(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const movie = await Movie.create(req.body);
      res.status(201).json(movie);
    } catch (e) {
      next(e);
    }
  }
);

router.put('/movies/:id',
  body('title').optional().trim().notEmpty(),
  async (req, res, next) => {
    try {
      const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!movie) return res.status(404).json({ error: 'Movie not found' });
      res.json(movie);
    } catch (e) {
      next(e);
    }
  }
);

router.delete('/movies/:id', async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export { router as adminRouter };
