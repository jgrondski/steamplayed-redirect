/**
 * Basic example demonstrating passport-steam usage within Express framework
 * This example uses Express's router to separate the steam authentication routes
 */
const express = require('express');
const passport = require('passport');
const SteamStrategy = require('passport-steam');
const router = express.Router();
const app = express();

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Steam profile is serialized.
passport.serializeUser((user, done) => {
  console.log('serializeUser...');
  done(null, user);
});

// Use the SteamStrategy within Passport.
//   Strategies in passport require a `validate` function, which accept
//   credentials (in this case, an OpenID identifier and profile), and invoke a
//   callback with a user object.
passport.use(new SteamStrategy({
    providerUrl: 'https://cors-anywhere.herokuapp.com/https://steamcommunity.com/openid',
    returnURL: 'http://localhost:3001/auth/steam/return',
    realm: 'http://localhost:3001/',
    apiKey: '7813876CA4146DF8758A701FAF9C9A99'
  },
  (identifier, profile, done) => {
    console.log('passport.use...')
    // asynchronous verification, for effect...
    process.nextTick(() => {

      // To keep the example simple, the user's Steam profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Steam account with a user record in your database,
      // and return that user instead.
      profile.identifier = identifier;
      return done(null, profile);
    });
  }
));

// GET /auth/steam
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Steam authentication will involve redirecting
//   the user to steamcommunity.com.  After authenticating, Steam will redirect the
//   user back to this application at /auth/steam/return
router.get('/steam',
  passport.authenticate('steam', { failureRedirect: '/' }),
  (res) => {
    console.log('auth/steam...')
    res.redirect('/');
  });

// GET /auth/steam/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/steam/return',
  // Issue #37 - Workaround for Express router module stripping the full url, causing assertion to fail 
  (req, res, next) => {
      console.log('auth/steam/return...')
      req.url = req.originalUrl;
      next();
  }, 
  passport.authenticate('steam', { failureRedirect: '/' }),
    (req, res) => {
        console.log('auth/steam/return authenticate callback...');
        console.log(req.user.id);
        res.redirect('http://localhost:3000/userid/' + req.user.id);
    }
);

// Initialize Passport
app.use(passport.initialize());

// Tell the app to use router for anything that uses /auth
app.use('/auth', router);

app.listen(3001);