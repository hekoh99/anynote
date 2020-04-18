var express = require('express');
var router = express.Router();
var auth = require('../lib/auth');
var passport = require('passport')
var session = require('express-session');
var template = require('../lib/template');
const app = express();

module.exports = function(passport){
    router.get('/login', function(request, response){
      var login = '<span style="font-size:20px; color:red;">로그인<span>'
      var title = 'login';
      var  description = `
        <form action="/sign/login_process" method="post">
          <p><input type="text" name="email" placeholder="email"></p>
          <p><input type="password" name="password" placeholder="pw"></p>
          <p><input class="simple" type="submit" value="login"></p>
        </form>
        `;
      var temp = template.loginHome(title, login, description);
      response.send(temp);
  })

  router.post('/login_process', passport.authenticate('local',
  { successRedirect: '/', failureRedirect: '/sign/login' }));

  router.get('/logout_process', function(request, response){
    request.logout();
    response.redirect('/');
  })
  return router;
}
