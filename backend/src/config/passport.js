const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

async function findOrCreateUser(profile, provider) {
  const email = profile.emails && profile.emails[0] && profile.emails[0].value;
  if (!email) throw new Error('The social account did not provide an email address');

  let user = await User.findOne({
    $or: [
      { provider: provider, providerId: profile.id },
      { email: email.toLowerCase() }
    ]
  });

  if (!user) {
    user = await User.create({
      name: profile.displayName || email.split('@')[0],
      email: email.toLowerCase(),
      provider: provider,
      providerId: profile.id
    });
  } else if (!user.providerId) {
    user.provider = provider;
    user.providerId = profile.id;
    await user.save();
  }

  if (!user.isActive) throw new Error('This account is disabled');
  return user;
}

const apiUrl = process.env.API_URL || 'http://localhost:5001';

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${apiUrl}/api/v1/auth/google/callback`
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      done(null, await findOrCreateUser(profile, 'google'));
    } catch (error) {
      done(error);
    }
  }));
}

if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${apiUrl}/api/v1/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'emails']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      done(null, await findOrCreateUser(profile, 'facebook'));
    } catch (error) {
      done(error);
    }
  }));
}
