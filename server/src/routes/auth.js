import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';
import { requireAuth } from '../middleware/auth.js';
import { getPlanPolicy } from '../config/planPolicy.js';
import { TERMS_VERSION } from '../config/planPolicy.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts' },
});

router.post('/register',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty(),
  body('termsAcceptedAt').notEmpty(),
  body('termsVersion').notEmpty(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { email, password, name, termsAcceptedAt, termsVersion } = req.body;
      if (await User.findOne({ email })) return res.status(400).json({ error: 'Email exists' });

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await User.create({
        email,
        passwordHash,
        name,
        termsAcceptedAt: new Date(termsAcceptedAt),
        termsVersion,
      });

      const tokens = await createTokens(user);
      res.json({ user: toUserDto(user), ...tokens });
    } catch (e) {
      next(e);
    }
  }
);

router.post('/login', loginLimiter,
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { email, password, deviceId, deviceName } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.passwordHash)))
        return res.status(401).json({ error: 'Invalid credentials' });
      if (user.status !== 'active') return res.status(403).json({ error: 'Account blocked' });

      const policy = getPlanPolicy(user.plan);
      const sessions = await Session.find({ userId: user._id });
      const activeSessions = sessions.filter(s => s.expiresAt > new Date());
      if (activeSessions.length >= policy.maxDevices) {
        return res.status(403).json({
          error: 'Device limit reached',
          maxDevices: policy.maxDevices,
          message: 'Disconnect a device or upgrade your plan',
        });
      }

      const tokens = await createTokens(user, deviceId || uuidv4(), deviceName);
      res.json({ user: toUserDto(user), ...tokens });
    } catch (e) {
      next(e);
    }
  }
);

router.post('/refresh',
  body('refreshToken').notEmpty(),
  async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'secret');
      const session = await Session.findById(decoded.sessionId).populate('userId');
      if (!session || !session.userId || session.expiresAt < new Date())
        return res.status(401).json({ error: 'Invalid refresh token' });

      const user = session.userId;
      if (user.status !== 'active') return res.status(403).json({ error: 'Account blocked' });

      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
      );

      session.lastSeen = new Date();
      await session.save();

      res.json({ accessToken, user: toUserDto(user) });
    } catch (e) {
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  }
);

router.post('/logout', requireAuth, async (req, res, next) => {
  try {
    const { deviceId } = req.body;
    const q = { userId: req.user._id };
    if (deviceId) q.deviceId = deviceId;
    await Session.deleteMany(q);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json(toUserDto(req.user));
});

async function createTokens(user, deviceId, deviceName) {
  const did = deviceId || uuidv4();
  const exp = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await Session.create({
    userId: user._id,
    deviceId: did,
    deviceName: deviceName || 'Unknown device',
    refreshTokenHash: did,
    expiresAt: exp,
  });

  const refreshToken = jwt.sign(
    { sessionId: session._id },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  );

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
  );

  return { accessToken, refreshToken, expiresIn: 900 };
}

function toUserDto(user) {
  const u = user.toObject ? user.toObject() : user;
  delete u.passwordHash;
  return u;
}

export { router as authRouter };
