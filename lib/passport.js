var auth = require('./auth');

module.exports = function(app){
  var passport = require('passport')
  var LocalStrategy = require('passport-local').Strategy;
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    done(null, user.email);
  });

  passport.deserializeUser(function(id, done) {
    done(null, auth.AuthData)
    // User.findById(id, function(err, user) {
    //   done(err, user);
    // });
  });

  passport.use(new LocalStrategy(
    {
    usernameField: 'email',
    passwordField: 'password'
    },
    function(username, password, done) {
      if(username === auth.AuthData.email){
        if(password === auth.AuthData.pw){
          return done(null, auth.AuthData);
        }
        else{
          return done(null, false, { message: 'Incorrect password.' });
        }
      }
      else{
        return done(null, false, { message: 'Incorrect username.' });
      }
    /*User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });*/
      }
  ));
  return passport;
}
