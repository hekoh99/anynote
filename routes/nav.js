var express = require('express');
var router = express.Router();
var auth = require('../lib/auth');
var db = require('../lib/db');
var template = require('../lib/template');
var url = require('url');
var sanitizeHTML = require('sanitize-html');

router.get('/:topicID', function(request, response){
  var _url = request.url;
  var pathname = request.params.topicID;
  var queryData = url.parse(_url, true).query;
  var loginUI = auth.loginUI(request, response, request.Auth);

  db.query(`select * from contents`, function(err, result){ //nav 리스트에 필요한 데이터
    db.query(`select * from contents, article where contents.id = article.content_id and content_id = ?`, [pathname],function(err2, result2){ // 글 리스트에 필요한 데이터
      db.query(`select * from article where id = ?`,[queryData.id], function(err3, result3){ //현재 열람 중인 글의 데이터
        var list = template.pathFiles(result, pathname);
        var artiList = template.files(result2);
        if(queryData.id === undefined){
          var changes = `<input class="simple" type="button" value="글생성" onclick="${request.Auth} === true ? location.href='/modify/create/${pathname}' : alert('login required')">`;
          var title = result2[0].name;
          var description = result2[0].details;
        }
        else{
          var title = result3[0].title;
          var changes = `
                 <form action="/modify/delete_process" method="post" onsubmit="if(${request.Auth} === false){
                   alert('login required');
                   return false;
                 } else if(${request.Auth} === true){
                   return confirm('삭제하시겠습니까?');
                 }">
                 <input type="hidden" name="id" value="${result3[0].id}"><input type="hidden" name="topic" value="${result2[0].content_id}"><input class="simple" type="submit" value="삭제">
                 </form>
                 <input class="simple" type="button" value="수정" onclick="${request.Auth} === true ? location.href='/modify/update/${pathname}?id=${result3[0].id}' : alert('login required')">
                 `;
          var description = result3[0].description;
        }
        var temp = template.html(title, list, artiList, `<div><h2>${sanitizeHTML(title)}</h2><p>${description}</p></div>`, changes, loginUI);
        response.send(temp);
      });
    });
  });
})

module.exports = router;
