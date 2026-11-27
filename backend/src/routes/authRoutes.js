const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const passport = require('passport');
const auth = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts. Try again later.' }
});

router.use(authLimit);

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/refresh', auth.refresh);
router.post('/logout', protect, auth.logout);
router.get('/me', protect, auth.me);

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  }));
  router.get('/google/callback',
    passport.authenticate('google', {
      session: false,
      failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:3000'}/login`
    }),
    auth.oauthSuccess
  );
}

if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  router.get('/facebook', passport.authenticate('facebook', {
    scope: ['email'],
    session: false
  }));
  router.get('/facebook/callback',
    passport.authenticate('facebook', {
      session: false,
      failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:3000'}/login`
    }),
    auth.oauthSuccess
  );
}

module.exports = router;
