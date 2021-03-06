var db = require('./db');
var template = require('./template');
var url = require('url');
var qs = require('querystring');
var sanitizeHTML = require('sanitize-html');
var auth = require('./auth');
var express = require('express');

exports.home = function(request, response, isAuth){
  db.query(`select * from contents`, function(err, result){
    if(err) throw err;
    var loginUI = auth.loginUI(request, response, isAuth);
    var changes = `<input class="simple" type="button" value="글생성" onclick="${isAuth} === true ? location.href='/modify/create/home' : alert('login required')">`;
    var list = template.pathFiles(result);
    var title = 'ANYNOTE';
    var description = '모두의 문학 아고라 anynote';
    var artiList = '';
    var temp = template.html(title, list, artiList, `<p>${description}</p>
    `, changes, loginUI);
    response.send(temp);
  });
}

exports.page = function(request, response, isAuth){
  var _url = request.url;
  var pathname = request.params.topicID;
  var queryData = url.parse(_url, true).query;
  var loginUI = auth.loginUI(request, response, isAuth);

  db.query(`select * from contents`, function(err, result){ //nav 리스트에 필요한 데이터
    db.query(`select * from contents, article where contents.id = article.content_id and content_id = ?`, [pathname],function(err2, result2){ // 글 리스트에 필요한 데이터
      db.query(`select * from article where id = ?`,[queryData.id], function(err3, result3){ //현재 열람 중인 글의 데이터
        var list = template.pathFiles(result, pathname);
        var artiList = template.files(result2);
        if(queryData.id === undefined){
          var changes = `<input class="simple" type="button" value="글생성" onclick="${isAuth} === true ? location.href='/modify/create/${pathname}' : alert('login required')">`;
          var title = result2[0].name;
          var description = result2[0].details;
        }
        else{
          var title = result3[0].title;
          var changes = `
                 <form action="/modify/delete_process" method="post" onsubmit="if(${isAuth} === false){
                   alert('login required');
                   return false;
                 } else if(${isAuth} === true){
                   return confirm('삭제하시겠습니까?');
                 }">
                 <input type="hidden" name="id" value="${result3[0].id}"><input type="hidden" name="topic" value="${result2[0].content_id}"><input class="simple" type="submit" value="삭제">
                 </form>
                 <input class="simple" type="button" value="수정" onclick="${isAuth} === true ? location.href='/modify/update/${pathname}?id=${result3[0].id}' : alert('login required')">
                 `;
          var description = result3[0].description;
        }
        var temp = template.html(title, list, artiList, `<div><h2>${sanitizeHTML(title)}</h2><p>${sanitizeHTML(description)}</p></div>`, changes, loginUI);
        response.send(temp);
      });
    });
  });
}

exports.create = function(request, response, isAuth){
  var _url = request.url;
  var pathname = request.params.cTopicID;
  var loginUI = auth.loginUI(request, response, isAuth);

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

exports.update = function(request, response, isAuth){
  var _url = request.url;
  var pathname = request.params.utargetID;
  var queryData = url.parse(_url, true).query;
  var loginUI = auth.loginUI(request, response, isAuth);
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

exports.login = function(request, response){
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
}

exports.login_process = function(request, response){
  var post = request.body;
  if(post.email === auth.AuthData.email && post.password === auth.AuthData.pw){
    request.session.isLogined = true;
    request.session.nickname = auth.AuthData.nickname;
    request.session.save(function(){
      response.redirect(`/`);
    })
  }
  else{
    response.send('fail');
  }
}

exports.logout_process = function(request, response){
  request.session.destroy(function(){
    response.redirect('/');
  })
}
