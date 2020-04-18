var express = require('express');
var stylenote = require('./css/stylenote.js');
var app = express();
var css = stylenote.css;

module.exports = {
  html : function(title, list, artiList, body, changes, loginUI = '<div id="login"><a href="/sign/login">로그인</a></div>'){
      return `<!DOCTYPE html>
    <html lang="en" dir="ltr">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <link rel="stylesheet" href="/style/stylenote.css" type="text/css">
      </head>
      <body>
      ${loginUI}
        <h1><a href="/">Anynote</a></h1>
        <nav>
          ${list}
        </nav>
        <div id="layer">
        <ul>
          ${artiList}
        </ul>
        ${body}
        </div>
        <div id = "create">${changes}</div>
      </body>
    </html>`;
  },

  loginHome : function(title, login, form){
      return `<!DOCTYPE html>
    <html lang="en" dir="ltr">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <link rel="stylesheet" href="/style/stylenote.css" type="text/css">
      </head>
      <body>
        <h1><a href="/">Anynote</a></h1>
        <nav>
          ${login}
        </nav>
        ${form}
      </body>
    </html>`;
  },
  //글 목록 파일 리스트 템플릿
  files : function(filelist){
    var i=0;
    var list = '<글목록>';
    var name = filelist[i].title;
    while(i<filelist.length){
      name = filelist[i].title;
      list = list+`<li><a href="/nav/${filelist[i].content_id}?id=${filelist[i].id}">${name}</a></li>
          `;
      i = i+1;
    }
    return list;
  },

  filename : {
    free:'자유게시판',
    littledb : '잔망토론',
    storytelling:'스토리텔링',
    webing : '거미줄'
  },
  //nav 리스트 만드는 함수
  pathFiles : function(filelist, path){
    var i=0;
    var list = '<div id=grid>';
    var name;
    while(i<filelist.length){
        var style = '';
      name = this.filename[filelist[i]];
      if(filelist[i].id == path){
        style = `style = "color:red;"`;
      }
      list = list+`<li><a ${style} href="/nav/${filelist[i].id}">${filelist[i].name}</a></li>
          `;
      i = i+1;
    }
    list = list + '</div>'
    return list;
  },
  //글 카테고리 항목 옵션 박스
  tag:function(content, contentID){
    var tags = `<option value="0">글 카테고리</option>`;
    var i=0;
    while(i<content.length){
      var selected = '';
      if(content[i].id == contentID){
        selected = ' selected';
      }
      tags = tags + `<option value="${content[i].id}"${selected}>${content[i].name}</option>`;
      i++;
    }

    return `<select name = "topic">${tags}</select>`
  }
}
