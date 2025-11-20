const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback"
};

passport.use(new GoogleStrategy(
  googleConfig,
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error("Không thể lấy email từ Google."), null);
      }
      let user = await User.findOne({ googleId: profile.id });
      if (user) {
        return done(null, user);
      }
      user = await User.findOne({ email: email });

      if (user) {
        user.googleId = profile.id;
        user.avatar = user.avatar || profile.photos?.[0]?.value;
        await user.save();
        return done(null, user);
      }
      const newUser = await User.create({
        googleId: profile.id,
        email: email,
        name: profile.displayName,
        avatar: profile.photos?.[0]?.value,
        isVerified: true 
      });
      
      return done(null, newUser);

    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
