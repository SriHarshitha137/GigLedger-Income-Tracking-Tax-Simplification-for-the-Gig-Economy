const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const signToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
const publicUser = (user) => ({ _id: user._id, name: user.name, phone: user.phone, onboardingDone: user.onboardingDone });

router.post(
  '/register',
  [
    body('name').notEmpty().trim(),
    body('phone').notEmpty().isLength({ min: 10, max: 15 }).trim(),
    body('password').isLength({ min: 6 })
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

      const { name, phone, email, password } = req.body;
      const existing = await User.findByPhone(phone);
      if (existing) return res.status(400).json({ success: false, message: 'Phone already registered' });

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await User.create({ name, phone, email, passwordHash });
      const token = signToken(user._id);

      return res.status(201).json({ success: true, token, user: publicUser(user) });
    } catch (err) {
      return next(err);
    }
  }
);

router.post(
  '/login',
  [body('phone').notEmpty().trim(), body('password').notEmpty()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

      const { phone, password } = req.body;
      const user = await User.findByPhone(phone);
      if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' });

      const matches = await user.comparePassword(password);
      if (!matches) return res.status(400).json({ success: false, message: 'Invalid credentials' });

      return res.status(200).json({ success: true, token: signToken(user._id), user: publicUser(user) });
    } catch (err) {
      return next(err);
    }
  }
);

router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash');
    return res.status(200).json({ success: true, user });
  } catch (err) {
    return next(err);
  }
});

router.patch('/onboarding', protect, async (req, res, next) => {
  try {
    const { platforms, vehicleType, city, workingSince } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { platforms, vehicleType, city, workingSince, onboardingDone: true },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    return res.status(200).json({ success: true, user });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
