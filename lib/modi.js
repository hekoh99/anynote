var db = require('./db');
var template = require('./template');
var url = require('url');
var qs = require('querystring');
var sanitizeHTML = require('sanitize-html');
var auth = require('./auth');

exports.create = function(request, response){
  var _url = request.url;
  var pathname = request.params.cTopicID;
  var loginUI = auth.loginUI(request, response, request.Auth);

  db.query(`select * from contents`, function(err, result){
    if(err) throw err;
    var category = pathname;
    db.query(`select * from contents, article where contents.id = article.content_id and content_id = ?`, [category], function(err2, result2){
      if(err2) throw err2;
      var title = '글 생성';
      var list = template.pathFiles(result, category);
      if(result2 == `` || pathname == 'home'){
        var artiList = '';
      }
      else{
        var artiList = template.files(result2);
      }
      var  description = `
        <form name = "create" action="/modify/create_process" method="post" onsubmit="
        if(document.create.topic.value == 0){
          alert('글 카테고리를 선택하세요');
          return false;
        }
        else{
          return true;
        }
        ">
        <p>${template.tag(result, category)}</p>
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input class="simple" type="submit" value="등록">
          </p>
        </form>
        `;
      var changes = '';
      var temp = template.html(title, list, artiList, description, changes, loginUI);
      response.send(temp);
    });
  });
}

exports.create_process = function(request, response){
  var post = request.body;
  var title = sanitizeHTML(post.title);
  var description = sanitizeHTML(post.description);
  db.query(`insert into article(title, description, content_id, author_id, time) value(?, ?, ?, 1, default)`, [title, description, post.topic], function(err, result){
    if(err) throw err;
    response.writeHead(302, {Location : `/nav/${post.topic}?id=${result.insertId}`});
    response.end();
  });
}

exports.update = function(request, response){
  var _url = request.url;
  var pathname = request.params.utargetID;
  var queryData = url.parse(_url, true).query;
  var loginUI = auth.loginUI(request, response, request.Auth);
  db.query(`select * from contents`, function(err, result){
    if(err) throw err;
    db.query(`select * from contents, article where contents.id = article.content_id and content_id = ?`, [pathname], function(err2, result2){
      if(err2) throw err2;
      db.query(`select * from article where id=?`, [queryData.id], function(err3, result3){
        var title = '글 수정';
        var list = template.pathFiles(result, pathname);
        var artiList = template.files(result2);
        var  description = `
          <form action="/modify/update_process" method="post">
          <p>${template.tag(result, pathname)}</p>
          <input type="hidden" name ="id" value="${result3[0].id}">
            <p><input type="text" name="title" value="${result3[0].title}"></p>
            <p>
              <textarea name="description" placeholder="description">${result3[0].description}</textarea>
            </p>
            <p>
              <input class="simple" type="submit" value="수정완료">
            </p>
          </form>
          `;
        var changes = '';
        var temp = template.html(title, list, artiList, description, changes, loginUI);

        response.send(temp);
      });
    });
  });
}

exports.update_process = function(request, response){
  var post = request.body;
  var title = sanitizeHTML(post.title);
  var id = sanitizeHTML(post.id);
  var description = sanitizeHTML(post.description);

  db.query(`update article set title=?, description=?, content_id=? where id=?`, [title, description, post.topic, id], function(err, result){
    if(err) throw err;
    response.writeHead(302, {Location : `/nav/${post.topic}?id=${id}`});
    response.end();
  });
}

exports.delete_process = function(request, response){
  var post = request.body;
  var id = post.id;
  var path = post.topic;
  db.query(`delete from article where id=?`, [id], function(err, result){
    if(err) throw err;
    response.writeHead(302, {Location: `/nav/${path}`});
    response.end();
  });
}
