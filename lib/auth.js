var cookie = require('cookie');

exports.AuthData = {
  email : "hekoh99@naver.com",
  pw : "rhgkdms99**",
  nickname : "haeun"
}

exports.check = function(request, response){
  var isAuth = false;
  if(request.user){
    isAuth = true;
  }
  return isAuth;
}

exports.nickname = function(request, response){
  var nick = request.user.nickname;
  return nick;
}

exports.loginUI = function(request, response, isAuth){
  var loginUI = '<div id="login"><a href="/sign/login">로그인</a></div>';
  if(isAuth === true){
    loginUI = `<div id="login">${this.nickname(request, response)}<a href="/sign/logout_process">로그아웃</a></div>`;
  }

  return loginUI;
}
