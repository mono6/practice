import passport from "passport";
import Strategy from "passport-local";
const LocalStrategy = Strategy.Strategy;
import User from "../models/User.js";

// serialize , deserialzie USer//2
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findOne({ _id: id }, (err, user) => {
    done(err, user);
  });
});

// localstrategy
passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      User.findOne({ username: username })
        .select({ password: 1 })
        .exec((err, user) => {
          if (err) return done(err);
          if (user && user.authenticate(password)) {
            return done(null, user);
          } else {
            req.flash("username", username);
            req.flash("errors", {
              login: "The username or password is incorerecttt",
            });
            return done(null, false);
          }
        });
    }
  )
);

export default passport;
