var http = require('http');
var url = require('url');
var contents = require('./lib/contents.js');
var express = require('express');

//서버 생성
var app = http.createServer(function(request, response){
  var _url = request.url; //url 추출
  var pathname = url.parse(_url, true).pathname; //url 안의 pathname 추출
  var root_path = pathname.split("/")[1];

  if(root_path === ''){ //main page로 접속 했을 때
    contents.home(request, response);
  }
  else if(root_path === 'nav'){
    contents.page(request, response);
  }
  else if(root_path === 'create'){ //글 생성 path
    contents.create(request, response);
  }
  else if(root_path === 'create_process'){  //글 생성 후 post한 데이터 읽어오기
    contents.create_process(request, response);
  }
  else if(root_path === 'update'){ //글 업데이트
    contents.update(request, response);
  }
  else if(root_path === 'update_process'){ //업데이트한 post 처리
    contents.update_process(request, response);
  }
  else if(root_path === 'delete_process'){ //삭제 처리
    contents.delete_process(request, response);
  }
  else{
    response.writeHead(404);
    response.end('Not found');
  }

});
app.listen(3000);
