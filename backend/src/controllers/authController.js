const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Joi = require('joi');
const User = require('../models/User');
const Activity = require('../models/Activity');

function makeAccessToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' }
  );
}

function makeRefreshToken(user) {
  return jwt.sign(
    { id: user._id, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d' }
  );
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function setRefreshCookie(res, token) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

function sendLoginResponse(res, user, refreshToken) {
  setRefreshCookie(res, refreshToken);
  res.json({
    accessToken: makeAccessToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
}

exports.register = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().min(2).max(80).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const email = value.email.toLowerCase();
    if (await User.findOne({ email })) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = await User.create({
      name: value.name,
      email,
      password: await bcrypt.hash(value.password, 12)
    });

    const refreshToken = makeRefreshToken(user);
    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    await Activity.create({
      actor: user._id,
      action: 'REGISTER',
      targetType: 'User',
      targetId: String(user._id)
    });

    sendLoginResponse(res, user, refreshToken);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = String(req.body.email || '').toLowerCase();
    const password = req.body.password || '';

    const user = await User.findOne({ email }).select('+password +refreshTokenHash');

    if (!user || !user.password || !user.isActive ||
        !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const refreshToken = makeRefreshToken(user);
    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    await Activity.create({
      actor: user._id,
      action: 'LOGIN',
      targetType: 'User',
      targetId: String(user._id)
    });

    sendLoginResponse(res, user, refreshToken);
  } catch (error) {
    next(error);
  }
};

exports.refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'Refresh token missing' });

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id).select('+refreshTokenHash');

    if (!user || !user.isActive || user.refreshTokenHash !== hashToken(token)) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const newRefreshToken = makeRefreshToken(user);
    user.refreshTokenHash = hashToken(newRefreshToken);
    await user.save();

    setRefreshCookie(res, newRefreshToken);
    res.json({
      accessToken: makeAccessToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.clearCookie('refreshToken');
    res.status(401).json({ message: 'Refresh session expired' });
  }
};

exports.logout = async (req, res, next) => {
  try {
    req.user.refreshTokenHash = undefined;
    await req.user.save();
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    res.json({ message: 'Logged out' });
  } catch (error) {
    next(error);
  }
};

exports.me = (req, res) => {
  res.json({
    user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role }
  });
};

exports.oauthSuccess = async (req, res, next) => {
  try {
    const refreshToken = makeRefreshToken(req.user);
    req.user.refreshTokenHash = hashToken(refreshToken);
    await req.user.save();

    setRefreshCookie(res, refreshToken);
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/oauth-success?token=${makeAccessToken(req.user)}`);
  } catch (error) {
    next(error);
  }
};
