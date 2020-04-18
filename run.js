var url = require('url');
var contents = require('./lib/contents.js');
const express = require('express');
var auth = require('./lib/auth');
var helmet = require('helmet')
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
const app = express();
const port = 3000;
var bodyParser = require('body-parser');
app.use(helmet())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'));
var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'rhgkdms99**',
    database: 'anynote'
};

var sessionStore = new MySQLStore(options);

app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

var passport = require('./lib/passport')(app)

var indexRouter = require('./routes/index');
var navRouter = require('./routes/nav');
var modifyRouter = require('./routes/modify');
var signRouter = require('./routes/sign')(passport);

app.get('*', function(request, response, next){
  request.Auth = auth.check(request, response);
  next();
})
app.use('/', indexRouter);
app.use('/nav', navRouter);
app.use('/modify', modifyRouter);
app.use('/sign', signRouter);

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});
app.listen(port);
