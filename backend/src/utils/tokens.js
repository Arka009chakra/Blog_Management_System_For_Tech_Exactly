const jwt = require('jsonwebtoken');
const crypto = require('crypto');
exports.createAccessToken = (user) => jwt.sign(
  { id: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET,
  { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '1m' }
);
exports.createRefreshToken = (user) => jwt.sign(
  { id: user._id, type: 'refresh' }, process.env.JWT_REFRESH_SECRET,
  { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d' }
);
exports.hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');
exports.sendTokens = (res, user, accessToken, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000
  });
  res.json({ accessToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};
