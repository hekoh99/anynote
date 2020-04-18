var express = require('express');
var router = express.Router();
var auth = require('../lib/auth');
var db = require('../lib/db');
var template = require('../lib/template');

router.get('/', function(request, response, next) {
  db.query(`select * from contents`, function(err, result){
    if(err) throw err;
    var loginUI = auth.loginUI(request, response, request.Auth);
    var changes = `<input class="simple" type="button" value="글생성" onclick="${request.Auth} === true ? location.href='/modify/create/home' : alert('login required')">`;
    var list = template.pathFiles(result);
    var title = 'ANYNOTE';
    var description = 'my게시판 webapp anynote';
    var artiList = '';
    var temp = template.html(title, list, artiList, `<p>${description}</p>
    `, changes, loginUI);
    response.send(temp);
  });
});

module.exports = router;
