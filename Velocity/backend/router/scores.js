const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ msg: 'No token' });
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token invalid' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { score } = req.body;
    if (typeof score !== 'number') return res.status(400).json({ msg: 'Score must be a number' });
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    if (score > user.bestScore) {
      user.bestScore = score;
      await user.save();
    }
    res.json({ currentScore: score, bestScore: user.bestScore });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/best', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ bestScore: user.bestScore });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
